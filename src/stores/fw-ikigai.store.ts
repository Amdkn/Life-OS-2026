import { create } from 'zustand';
import type { ParaItem } from './ld01.store';
import { writeToLD, readFromLD } from '../lib/ld-router';

/** 
 * Ikigai Framework Store — V0.5.1 Sovereign Constitution
 * Matrix: 4 Pillars x 5 Horizons
 * Migrated from localStorage to IndexedDB (LD01/resources)
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
      // Lit les visions depuis LD01 (stockées en tant que ressources de type 'vision')
      const data = await readFromLD<ParaItem>('ld01', 'resources'); 
      const ikigaiNodes = data.filter(d => (d as any).type === 'vision') as IkigaiVision[];
      set({ visions: ikigaiNodes, isHydrated: true });
    } catch (e) { 
      console.error('Ikigai DB hydration failed', e); 
      set({ isHydrated: true });
    }
  },

  setActivePillar: (activePillar) => set({ activePillar }),
  setActiveHorizon: (activeHorizon) => set({ activeHorizon }),
  addVision: async (v) => {
    set(s => ({ visions: [...s.visions, v] }));
    // Synchronisation IDB via ld-router
    await writeToLD('ld01', 'resources', 'add', v, 'ikigai');
  }
}));
