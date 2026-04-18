import { create } from 'zustand';
import { LDId, writeToLD, readFromLD } from '../lib/ld-router';

/** 
 * DEAL Framework Store — V0.8.3 Pipeline
 * Features: PARA Import, D-E-A-L Pipeline, Muse Tracker
 * Persistence: ld06 (Habitat/Infrastructure)
 */

export type DealStep = 'define' | 'eliminate' | 'automate' | 'liberate';

export interface DealItem {
  id: string;
  projectId?: string; // Reference to PARA project
  title: string;
  step: DealStep;
  frictionScore: number; // 0-100
  potentialRevenue?: number;
  status: 'active' | 'completed';
  createdAt: number;
  updatedAt: number;
}

export interface Muse {
  id: string;
  title: string;
  revenueEstimate: number;
  buildCost: number; // hrs invested in Dev
  timeCost: number; // hrs/week
  status: 'candidate' | 'testing' | 'operational' | 'failing' | 'deprecated';
  webhookUrl?: string; // V0.8.7 prep
  createdAt: number;
  updatedAt: number;
}

interface DealState {
  activeTab: 'overview' | DealStep | 'muses';
  items: DealItem[];
  muses: Muse[];
  isLoaded: boolean;
  
  // Actions
  setActiveTab: (tab: DealState['activeTab']) => void;
  loadFromDB: () => Promise<void>;
  addItem: (item: DealItem) => Promise<void>;
  createDefinitionFromText: (text: string) => Promise<void>;
  absorbProjectAsFriction: (projectId: string, projectTitle: string) => Promise<void>;
  absorbGtdTaskAsFriction: (content: string, context?: string) => Promise<void>;
  updateDealItem: (id: string, patch: Partial<DealItem>) => Promise<void>;
  promoteToMuse: (itemId: string, revenueEstimate?: number, buildCost?: number) => Promise<void>;
  updateMuse: (id: string, patch: Partial<Muse>) => Promise<void>;
  decommissionMuse: (id: string) => Promise<void>;
}

export const useDealStore = create<DealState>((set, get) => ({
  activeTab: 'overview',
  items: [],
  muses: [],
  isLoaded: false,

  setActiveTab: (activeTab) => set({ activeTab }),

  loadFromDB: async () => {
    try {
      const dealItems = await readFromLD<DealItem>('ld06', 'items');
      const muses = await readFromLD<Muse>('ld06', 'resources');
      
      set({ 
        items: dealItems.filter(i => (i as any).type === 'v1.deal' || !(i as any).type), 
        muses: muses.filter(m => (m as any).type === 'v1.muse' || !(m as any).type), 
        isLoaded: true 
      });
    } catch (e) {
      console.error("[DEAL] Failed to load from LD06", e);
      set({ items: [], muses: [], isLoaded: true });
    }
  },

  addItem: async (item) => {
    const newItem = { ...item, type: 'v1.deal', createdAt: item.createdAt || Date.now(), updatedAt: Date.now() };
    set(s => ({ items: [...s.items, newItem] }));
    await writeToLD('ld06', 'items', 'add', newItem, 'deal');
  },

  createDefinitionFromText: async (text) => {
    const newItem: DealItem = {
      id: crypto.randomUUID(),
      title: text,
      step: 'define',
      frictionScore: 50,
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    await get().addItem(newItem);
  },

  absorbProjectAsFriction: async (projectId: string, projectTitle: string) => {
    const newFriction: DealItem = {
      id: crypto.randomUUID(),
      title: `[ARCHIVE] Deconstruct: ${projectTitle}`,
      projectId: projectId,
      step: 'define',
      frictionScore: 80,
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    await get().addItem(newFriction);
    console.info(`[DEAL] Project ${projectId} absorbed into Spacedock.`);
  },

  absorbGtdTaskAsFriction: async (content: string, context?: string) => {
    const contextPrefix = context ? `[${context}] ` : '';
    const newFriction: DealItem = {
      id: crypto.randomUUID(),
      title: `${contextPrefix}${content}`,
      step: 'define',
      frictionScore: 100, // Déclaré haut par défaut car c'est une alarme
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    await get().addItem(newFriction);
    console.info(`[DEAL] GTD Task absorbed as Repetitive Friction.`);
  },

  updateDealItem: async (id, patch) => {
    let updatedItem: DealItem | undefined;
    set(s => {
      const newItems = s.items.map(i => {
        if (i.id === id) {
          updatedItem = { ...i, ...patch, updatedAt: Date.now() };
          return updatedItem;
        }
        return i;
      });
      return { items: newItems };
    });

    if (updatedItem) {
      await writeToLD('ld06', 'items', 'update', updatedItem, 'deal');
    }
  },

  promoteToMuse: async (itemId, revenueEstimate, buildCost = 1) => {
    let newMuse: Muse | undefined;
    let archivedItem: DealItem | undefined;

    set(s => {
      const item = s.items.find(i => i.id === itemId);
      if (!item) return s;

      archivedItem = { ...item, status: 'completed', updatedAt: Date.now() };

      newMuse = {
        id: crypto.randomUUID(),
        title: item.title,
        revenueEstimate: revenueEstimate || item.potentialRevenue || 0,
        buildCost: buildCost,
        timeCost: 1, 
        status: 'candidate',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      return { 
        muses: [...s.muses, { ...newMuse, type: 'v1.muse' } as any], 
        items: s.items.map(i => i.id === itemId ? archivedItem! : i)
      };
    });

    if (newMuse && archivedItem) {
      await writeToLD('ld06', 'items', 'update', archivedItem, 'deal');
      await writeToLD('ld06', 'resources', 'add', { ...newMuse, type: 'v1.muse' }, 'deal');
    }
  },

  updateMuse: async (id, patch) => {
    let updatedMuse: Muse | undefined;
    set(s => {
      const newMuses = s.muses.map(m => {
        if (m.id === id) {
          updatedMuse = { ...m, ...patch, updatedAt: Date.now() };
          return updatedMuse;
        }
        return m;
      });
      return { muses: newMuses };
    });

    if (updatedMuse) {
      await writeToLD('ld06', 'resources', 'update', updatedMuse, 'deal');
    }
  },

  decommissionMuse: async (id) => {
    let targetMuse: Muse | undefined;
    set(s => {
      const newMuses = s.muses.map(m => {
        if (m.id === id) {
          targetMuse = { ...m, status: 'deprecated', updatedAt: Date.now() };
          return targetMuse;
        }
        return m;
      });
      return { muses: newMuses };
    });

    if (targetMuse) {
      await writeToLD('ld06', 'resources', 'update', targetMuse, 'deal');
    }
  }
}));
