/** ld08 Store (Impact) — Zustand + IDB Persistence */
import { create } from 'zustand';
import { ld08DB } from '../lib/idb';

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

export const useLD08Store = create<State>((set) => ({
  projects: [], areas: [], resources: [], archives: [], isLoading: false,
  fetchItems: async () => {
    set({ isLoading: true });
    try {
      const [p, a, r, arc] = await Promise.all([
        ld08DB.getAll<ParaItem>('projects'),
        ld08DB.getAll<ParaItem>('areas'),
        ld08DB.getAll<ParaItem>('resources'),
        ld08DB.getAll<ParaItem>('archives'),
      ]);
      set({ projects: p, areas: a, resources: r, archives: arc });
    } finally { set({ isLoading: false }); }
  },
  addItem: async (col, item) => { await ld08DB.put(col, item); set(state => ({ [col]: [...state[col], item] })); },
  updateItem: async (col, item) => { await ld08DB.put(col, item); set(state => ({ [col]: state[col].map(i => i.id === item.id ? item : i) })); },
  removeItem: async (col, id) => { await ld08DB.delete(col, id); set(state => ({ [col]: state[col].filter(i => i.id !== id) })); }
}));
