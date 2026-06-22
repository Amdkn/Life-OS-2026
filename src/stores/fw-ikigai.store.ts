import { create } from 'zustand';
import type { ParaItem } from './ld01.store';
import { writeToLD, readFromLD } from '../lib/ld-router';
import { pullIkigaiVisions, pushVision, type SyncedVision, type IkigaiPillar, type IkigaiHorizon } from '../lib/sync.service';

/**
 * Ikigai Framework Store — V0.5.1 Sovereign Constitution
 * Matrix: 4 Pillars x 5 Horizons
 * Migrated from localStorage to IndexedDB (LD01/resources)
 * D6 fix (2026-06-22): bidirectional Supabase sync via sync.service.ts.
 */

export type IkigaiPillar = 'craft' | 'mission' | 'passion' | 'vocation';
export type IkigaiHorizon = 'H1' | 'H3' | 'H10' | 'H30' | 'H90';

export interface IkigaiVision extends ParaItem {
  type: 'vision';
  pillar: IkigaiPillar;
  horizon: IkigaiHorizon;
  content: string; // La "Constitution" elle-même
  alignmentLevel: number; // 0-100
}

// Alias for backward compatibility
export type IkigaiItem = IkigaiVision;

interface IkigaiState {
  visions: IkigaiVision[];
  activePillar: IkigaiPillar | 'all';
  activeHorizon: IkigaiHorizon | 'all';
  isHydrated: boolean;
  
  // Actions
  hydrate: () => Promise<void>;
  setActivePillar: (p: IkigaiPillar | 'all') => void;
  setActiveHorizon: (h: IkigaiHorizon | 'all') => void;
  addVision: (v: IkigaiVision) => Promise<void>;
}

export const useIkigaiStore = create<IkigaiState>((set, get) => ({
  visions: [],
  activePillar: 'all',
  activeHorizon: 'all',
  isHydrated: false,

  hydrate: async () => {
    try {
      // 1. Hydrate from IndexedDB first (fast, offline-first).
      const data = await readFromLD<ParaItem>('ld01', 'resources');
      const ikigaiNodes = data.filter(d => (d as any).type === 'vision') as IkigaiVision[];
      set({ visions: ikigaiNodes, isHydrated: true });

      // 2. Background sync with Supabase (D6 fix 2026-06-22).
      //    Pull returns the synced visions DIRECTLY — no need to re-read IDB
      //    (avoids async race where IDB write hasn't committed before read).
      try {
        const syncResult = await pullIkigaiVisions();
        console.warn('[IKIGAI DEBUG] sync.complete', {
          pulled: syncResult.pulled,
          pushed: syncResult.pushed,
          errors: syncResult.errors,
          duration_ms: Math.round(syncResult.duration_ms),
        });
        if (syncResult.pulled > 0) {
          // Merge: existing IDB visions + remote visions (remote wins on conflict)
          const remoteVisions: IkigaiVision[] = (syncResult as any).visions ?? [];
          if (remoteVisions.length > 0) {
            // Concatenate, dedupe by id, keep latest updated_at
            const byId = new Map<string, IkigaiVision>();
            for (const v of ikigaiNodes) byId.set(v.id, v);
            for (const v of remoteVisions) byId.set(v.id, v); // remote wins
            const merged = Array.from(byId.values());
            set({ visions: merged });
            console.warn('[IKIGAI DEBUG] store.updated', {
              count: merged.length,
              pillars: [...new Set(merged.map((v: any) => v.pillar))],
            });
          }
        }
      } catch (syncErr) {
        // Non-fatal: UI works offline-first from IDB. Sync retries on next hydrate.
        console.warn('[Ikigai sync] background pull failed (will retry):', syncErr);
      }
    } catch (e) {
      console.error('Ikigai DB hydration failed', e);
      set({ isHydrated: true });
    }
  },

  setActivePillar: (activePillar) => set({ activePillar }),
  setActiveHorizon: (activeHorizon) => set({ activeHorizon }),
  addVision: async (v) => {
    // Optimistic local update first (UI stays snappy).
    set(s => ({ visions: [...s.visions, v] }));
    // Persist to IndexedDB via ld-router.
    await writeToLD('ld01', 'resources', 'add', v, 'ikigai');
    // Push to Supabase for multi-device sync (D6 fix 2026-06-22).
    try {
      await pushVision(v as SyncedVision);
    } catch (pushErr) {
      // Non-fatal: local-first write succeeded. Sync retries on next hydrate.
      console.warn('[Ikigai] Supabase push failed (will retry on next sync):', pushErr);
    }
  }
}));
