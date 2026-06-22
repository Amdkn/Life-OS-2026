import { create } from 'zustand';
import type { ParaItem } from './ld01.store';
import { writeToLD, readFromLD } from '../lib/ld-router';
import { pullIkigaiVisions, pushVision, type SyncedVision } from '../lib/sync.service';

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
      //    Pulls remote visions not yet in IDB, merges by last-write-wins.
      try {
        const syncResult = await pullIkigaiVisions();
        if (syncResult.pulled > 0) {
          // Re-hydrate after sync pulls new visions.
          const updated = await readFromLD<ParaItem>('ld01', 'resources');
          const updatedVisions = updated.filter(d => (d as any).type === 'vision') as IkigaiVision[];
          set({ visions: updatedVisions });
          console.info(`[Ikigai sync] pulled ${syncResult.pulled} visions in ${syncResult.duration_ms.toFixed(0)}ms`);
        }
        if (syncResult.errors.length > 0) {
          console.warn('[Ikigai sync] non-fatal errors:', syncResult.errors);
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
