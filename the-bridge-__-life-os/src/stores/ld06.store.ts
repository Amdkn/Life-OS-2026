/** ld06 Store (Habitat) — Zustand + IDB Persistence */
import { create } from 'zustand';
import { ld06DB } from '../lib/idb';

export interface ParaItem {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  updatedAt: number;
}

interface State {
  projects: ParaItem[];
  areas: ParaItem[];
  resources: ParaItem[];
  archives: ParaItem[];
  isLoading: boolean;
  fetchItems: () => Promise<void>;
  addItem: (collection: 'projects' | 'areas' | 'resources' | 'archives', item: ParaItem) => Promise<void>;
  updateItem: (collection: 'projects' | 'areas' | 'resources' | 'archives', item: ParaItem) => Promise<void>;
  removeItem: (collection: 'projects' | 'areas' | 'resources' | 'archives', id: string) => Promise<void>;
}

export const useLD06Store = create<State>((set) => ({
  projects: [], areas: [], resources: [], archives: [], isLoading: false,
  fetchItems: async () => {
    set({ isLoading: true });
    try {
      const [p, a, r, arc] = await Promise.all([
        ld06DB.getAll<ParaItem>('projects'),
        ld06DB.getAll<ParaItem>('areas'),
        ld06DB.getAll<ParaItem>('resources'),
        ld06DB.getAll<ParaItem>('archives'),
      ]);
      set({ projects: p, areas: a, resources: r, archives: arc });
    } finally { set({ isLoading: false }); }
  },
  addItem: async (col, item) => { await ld06DB.put(col, item); set(state => ({ [col]: [...state[col], item] })); },
  updateItem: async (col, item) => { await ld06DB.put(col, item); set(state => ({ [col]: state[col].map(i => i.id === item.id ? item : i) })); },
  removeItem: async (col, id) => { await ld06DB.delete(col, id); set(state => ({ [col]: state[col].filter(i => i.id !== id) })); }
}));
