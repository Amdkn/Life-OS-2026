import { create } from 'zustand';
import type { ParaItem } from './ld01.store';
import { writeToLD, readFromLD } from '../lib/ld-router';

/**
 * Ikigai Framework Store — V0.5.1 Sovereign Constitution
 * Matrix: 4 Pillars x 5 Horizons
 * Migrated from localStorage to IndexedDB (LD01/resources)
 */

export type IkigaiPillar = 'craft' | 'mission' | 'passion' | 'vocation';
export type IkigaiHorizon = 'H1' | 'H3' | 'H10' | 'H25' | 'H90';

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
  updateVision: (id: string, updates: Partial<IkigaiVision>) => Promise<void>;
  deleteVision: (id: string) => Promise<void>;
}

export const useIkigaiStore = create<IkigaiState>((set, get) => ({
  visions: [],
  activePillar: 'all',
  activeHorizon: 'all',
  isHydrated: false,

  hydrate: async () => {
    try {
      const data = await readFromLD<ParaItem>('ld01', 'resources');
      const ikigaiNodes = data.filter(d => (d as any).type === 'vision') as IkigaiVision[];
      if (ikigaiNodes.length > 0) {
        set({ visions: ikigaiNodes, isHydrated: true });
      } else {
        set({ visions: [], isHydrated: true });
      }
    } catch (e) {
      console.error('Ikigai DB hydration failed', e);
      set({ visions: [], isHydrated: true });
    }
  },

  setActivePillar: (activePillar) => set({ activePillar }),
  setActiveHorizon: (activeHorizon) => set({ activeHorizon }),
  addVision: async (v) => {
    set(s => ({ visions: [...s.visions, v] }));
    await writeToLD('ld01', 'resources', 'add', v, 'ikigai');
  },
  updateVision: async (id, updates) => {
    const v = get().visions.find(v => v.id === id);
    if (!v) return;
    const updated = { ...v, ...updates, updatedAt: Date.now() } as IkigaiVision;
    set(s => ({ visions: s.visions.map(vi => vi.id === id ? updated : vi) }));
    await writeToLD('ld01', 'resources', 'update', updated, 'ikigai');
  },
  deleteVision: async (id) => {
    set(s => ({ visions: s.visions.filter(v => v.id !== id) }));
    await writeToLD('ld01', 'resources', 'delete', id, 'ikigai');
  }
}));