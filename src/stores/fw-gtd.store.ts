import { create } from 'zustand';
import { LDId, writeToLD, readFromLD } from '../lib/ld-router';

/** 
 * GTD Framework Store — V0.7.1 Rutherford
 * Features: Clarify Wizard, ActionLogs, Reasoning
 * Persistence: ld05/items (IndexedDB)
 */

export type GTDStep = 'capture' | 'clarify' | 'organize' | 'reflect' | 'engage';

export interface ActionLog {
  id: string;
  itemId: string;
  action: string;
  reasoning: string;
  timestamp: number;
}

export interface GTDItem {
  id: string;
  type: string; // added for LdEntity compliance
  content: string;
  status: 'inbox' | 'actionable' | 'incubating' | 'reference' | 'trash' | 'completed';
  context?: string;
  energy?: 'low' | 'medium' | 'high';
  timeEstimate?: number;
  linkedLd?: LDId;
  reasoning?: string;
  createdAt: number;
  updatedAt: number;
  projectId?: string; // V0.4.4 — Pont PARA-GTD
  goalId?: string;    // V0.7.2 Nexus
  tacticId?: string;  // V0.7.2 Nexus
}

interface GtdState {
  activeTab: 'overview' | GTDStep;
  activeContext: string | 'all';
  items: GTDItem[];
  logs: ActionLog[];
  isLoaded: boolean;
  
  // Actions
  setActiveTab: (tab: GtdState['activeTab']) => void;
  setActiveContext: (c: string | 'all') => void;
  loadFromDB: () => Promise<void>;
  addItem: (content: string, opts?: { projectId?: string, goalId?: string, tacticId?: string }) => Promise<void>;
  processItem: (id: string, patch: Partial<GTDItem>, reasoning: string) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
}

export const useGtdStore = create<GtdState>((set, get) => ({
  activeTab: 'overview',
  activeContext: 'all',
  items: [],
  logs: [],
  isLoaded: false,

  setActiveTab: (activeTab) => set({ activeTab }),
  setActiveContext: (activeContext) => set({ activeContext }),

  loadFromDB: async () => {
    try {
      const items = await readFromLD<GTDItem>('ld05', 'items');
      set({ items, isLoaded: true });
    } catch (e) {
      console.error("[GTD] Failed to load from LD05", e);
      set({ items: [], isLoaded: true });
    }
  },

  addItem: async (content, opts) => {
    const newItem: GTDItem = {
      id: crypto.randomUUID(),
      type: 'v1.action',
      content,
      status: 'inbox',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      projectId: opts?.projectId,
      goalId: opts?.goalId,
      tacticId: opts?.tacticId
    };

    set(s => ({ items: [newItem, ...s.items] }));
    await writeToLD('ld05', 'items', 'add', newItem, 'gtd');
  },

  processItem: async (id, patch, reasoning) => {
    let updatedItem: GTDItem | undefined;
    
    set(s => {
      const newItems = s.items.map(i => {
        if (i.id === id) {
          updatedItem = { ...i, ...patch, updatedAt: Date.now() };
          return updatedItem;
        }
        return i;
      });
      return { 
        items: newItems,
        logs: [{ id: crypto.randomUUID(), itemId: id, action: 'clarified', reasoning, timestamp: Date.now() }, ...s.logs]
      };
    });

    if (updatedItem) {
      await writeToLD('ld05', 'items', 'update', updatedItem, 'gtd');
    }
  },

  removeItem: async (id) => {
    set(s => ({ items: s.items.filter(i => i.id !== id) }));
    await writeToLD('ld05', 'items', 'delete', id, 'gtd');
  }
}));
