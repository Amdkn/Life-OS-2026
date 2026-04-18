/** LD01 Store (Business/PARA) — Zustand + IDB Persistence (P3.1) */
import { create } from 'zustand';
import { ld01DB } from '../lib/idb';

export interface ParaItem {
  id: string;
  title: string;
  description: string;
  content?: string; // V0.6.1 Narrative / Tactic content
  status: 'active' | 'completed' | 'on-hold' | 'paused' | 'archived';
  updatedAt: number;
  createdAt: number; // V0.6.1 Timestamp
  // --- NOUVEAU (V0.4.1) ---
  pillars?: string[];
  resources?: string[];
  progress?: number;
  domain?: string; // Using string to avoid circular dependency, will map to LifeWheelDomain
  archivedAt?: number;
}

interface Ld01State {
  projects: ParaItem[];
  areas: ParaItem[];
  resources: ParaItem[];
  archives: ParaItem[];
  isLoading: boolean;

  // Actions
  fetchItems: () => Promise<void>;
  addItem: (collection: 'projects' | 'areas' | 'resources' | 'archives', item: ParaItem) => Promise<void>;
  updateItem: (collection: 'projects' | 'areas' | 'resources' | 'archives', item: ParaItem) => Promise<void>;
  removeItem: (collection: 'projects' | 'areas' | 'resources' | 'archives', id: string) => Promise<void>;
}

export const useLd01Store = create<Ld01State>((set, get) => ({
  projects: [],
  areas: [],
  resources: [],
  archives: [],
  isLoading: false,

  fetchItems: async () => {
    set({ isLoading: true });
    try {
      const [p, a, r, arc] = await Promise.all([
        ld01DB.getAll<ParaItem>('projects'),
        ld01DB.getAll<ParaItem>('areas'),
        ld01DB.getAll<ParaItem>('resources'),
        ld01DB.getAll<ParaItem>('archives'),
      ]);
      set({ projects: p, areas: a, resources: r, archives: arc });
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (col, item) => {
    await ld01DB.put(col, item);
    set(state => ({ [col]: [...state[col], item] }));
  },

  updateItem: async (col, item) => {
    await ld01DB.put(col, item);
    set(state => ({
      [col]: state[col].map(i => i.id === item.id ? item : i)
    }));
  },

  removeItem: async (col, id) => {
    await ld01DB.delete(col, id);
    set(state => ({
      [col]: state[col].filter(i => i.id !== id)
    }));
  }
}));
