import { create } from 'zustand';
import type { ParaItem } from './ld01.store';
import { readFromLD, writeToLD } from '../lib/ld-router';

/** 
 * 12 Week Year Framework Store — V0.6.1 Destruction du Mirage
 * Migrated from localStorage to IndexedDB (LD01/resources)
 * The Trinity: WyVision, WyGoal, WyTactic
 */

// NOUVEAUX CONTRATS
export interface WyVision extends ParaItem {
  type: 'wy-vision';
  domainId: string; // V0.6.7 REQUIRED
  ikigaiVisionId?: string; 
}

export interface WyGoal extends Omit<ParaItem, 'status'> {
  type: 'wy-goal';
  visionId: string;
  targetWeek: number; // 1-12
  status: 'pending' | 'in-progress' | 'achieved';
  projectId?: string; // V0.4.4 — Pont PARA-12WY
}

export interface WyTactic extends Omit<ParaItem, 'status'> {
  type: 'wy-tactic';
  goalId: string;
  week: number;
  status: 'pending' | 'completed' | 'failed';
}

export type TimeBlockType = 'strategic' | 'buffer' | 'breakout';

export interface WyTimeBlock extends ParaItem {
  type: 'wy-timeblock';
  week: number;
  blockType: TimeBlockType;
  completed: boolean;
}

interface TwelveWeekState {
  visions: WyVision[];
  goals: WyGoal[];
  tactics: WyTactic[];
  timeBlocks: WyTimeBlock[];
  activeTab: 'overview' | 'vision' | 'planning' | 'process' | 'measurement' | 'accountability';
  activeWeek: number | 'all';
  activeVisionId: string | null;
  activeGoalId: string | null;
  isHydrated: boolean;

  // Actions
  hydrate: () => Promise<void>;
  setActiveTab: (tab: TwelveWeekState['activeTab']) => void;
  setActiveWeek: (week: number | 'all') => void;
  setActiveVisionId: (id: string | null) => void;
  setActiveGoalId: (id: string | null) => void;
  addVision: (v: WyVision) => Promise<void>;
  addGoal: (g: WyGoal) => Promise<void>;
  addTactic: (t: WyTactic) => Promise<void>;
  updateTacticStatus: (id: string, status: WyTactic['status']) => Promise<void>;
  toggleTimeBlock: (id: string) => Promise<void>;
  addTimeBlock: (b: WyTimeBlock) => Promise<void>;
}

export const useTwelveWeekStore = create<TwelveWeekState>((set, get) => ({
  visions: [],
  goals: [],
  tactics: [],
  timeBlocks: [],
  activeTab: 'overview',
  activeWeek: 'all',
  activeVisionId: null,
  activeGoalId: null,
  isHydrated: false,

  hydrate: async () => {
    try {
      // Lecture depuis 'ld01' (ressources system)
      const data = await readFromLD<ParaItem>('ld01', 'resources');
      set({
        visions: data.filter(d => (d as any).type === 'wy-vision') as any as WyVision[],
        goals: data.filter(d => (d as any).type === 'wy-goal') as any as WyGoal[],
        tactics: data.filter(d => (d as any).type === 'wy-tactic') as any as WyTactic[],
        timeBlocks: data.filter(d => (d as any).type === 'wy-timeblock') as any as WyTimeBlock[],
        isHydrated: true
      });
    } catch(e) { 
      console.error('[12WY Store] Hydration failed', e);
      set({ isHydrated: true }); 
    }
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setActiveWeek: (week) => set({ activeWeek: week }),
  setActiveVisionId: (id) => set({ activeVisionId: id }),
  setActiveGoalId: (id) => set({ activeGoalId: id }),

  addVision: async (v) => {
    set(s => ({ visions: [...s.visions, v] }));
    await writeToLD('ld01', 'resources', 'add', v, '12wy');
  },
  addGoal: async (g) => {
    set(s => ({ goals: [...s.goals, g] }));
    await writeToLD('ld01', 'resources', 'add', g, '12wy');
  },
  addTactic: async (t) => {
    set(s => ({ tactics: [...s.tactics, t] }));
    await writeToLD('ld01', 'resources', 'add', t, '12wy');
  },
  updateTacticStatus: async (id, status) => {
    const tactic = get().tactics.find(t => t.id === id);
    if (!tactic) return;
    const updated = { ...tactic, status, updatedAt: Date.now() };
    set(s => ({ tactics: s.tactics.map(t => t.id === id ? updated : t) }));
    await writeToLD('ld01', 'resources', 'update', updated, '12wy');
  },
  toggleTimeBlock: async (id) => {
    const block = get().timeBlocks.find(b => b.id === id);
    if (!block) return;
    const updated = { ...block, completed: !block.completed, updatedAt: Date.now() };
    set(s => ({ timeBlocks: s.timeBlocks.map(b => b.id === id ? updated : b) }));
    await writeToLD('ld01', 'resources', 'update', updated, '12wy');
  },
  addTimeBlock: async (b) => {
    set(s => ({ timeBlocks: [...s.timeBlocks, b] }));
    await writeToLD('ld01', 'resources', 'add', b, '12wy');
  }
}));
