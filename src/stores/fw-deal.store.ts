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
  tacticId?: string;
  timeSavedEstimate?: number;
  projectId?: string; // Reference to PARA project
  title: string;
  step: DealStep;
  frictionScore: number; // 0-100
  potentialRevenue?: number;
  status: 'active' | 'completed';
  createdAt: number;
  updatedAt: number;
  source?: string;
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
  frictionThreshold: number;
  automationRate: number;
  hoursLiberated: number;

  // Actions
  setActiveTab: (tab: DealState['activeTab']) => void;
  setFrictionThreshold: (threshold: number) => void;
  loadFromDB: () => Promise<void>;
  addItem: (item: DealItem) => Promise<void>;
  createDefinitionFromText: (text: string, source?: string) => Promise<void>;
  absorbProjectAsFriction: (projectId: string, projectTitle: string, source?: string) => Promise<void>;
  absorbGtdTaskAsFriction: (content: string, context?: string, source?: string) => Promise<void>;
  updateDealItem: (id: string, patch: Partial<DealItem>) => Promise<void>;
  promoteToMuse: (itemId: string, revenueEstimate?: number, buildCost?: number) => Promise<void>;
  updateMuse: (id: string, patch: Partial<Muse>) => Promise<void>;
  decommissionMuse: (id: string) => Promise<void>;
  calculateMetrics: () => void;
  absorb12wyTacticAsFriction: (tacticId: string, tacticTitle: string, source?: string) => Promise<void>;
  deleteItem: (id: string, confirmed: boolean) => Promise<void>;
}

const CANONICAL_DEAL_ITEMS: DealItem[] = [
  {
    id: 'deal-can-01',
    title: 'Élimination des réunions de coordination non asynchrones',
    step: 'eliminate',
    frictionScore: 85,
    timeSavedEstimate: 4,
    status: 'active',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 2,
    source: 'A\'Space OS Canon'
  },
  {
    id: 'deal-can-02',
    title: 'Suppression des saisies manuelles de timesheet',
    step: 'eliminate',
    frictionScore: 70,
    timeSavedEstimate: 2,
    status: 'active',
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 1,
    source: 'A\'Space OS Canon'
  },
  {
    id: 'deal-can-03',
    title: 'Dispatch automatisé des PRDs vers l\'essaim Jules & GitHub',
    step: 'automate',
    frictionScore: 35,
    timeSavedEstimate: 12,
    status: 'active',
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now(),
    source: 'A\'Space OS Canon'
  },
  {
    id: 'deal-can-04',
    title: 'Télémétrie 60s & Monitoring Blackboard IPC SQLite',
    step: 'automate',
    frictionScore: 25,
    timeSavedEstimate: 5,
    status: 'active',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now(),
    source: 'A\'Space OS Canon'
  },
  {
    id: 'deal-can-05',
    title: 'Synthèse vocale Edge-TTS automatique sur réponses de session',
    step: 'automate',
    frictionScore: 20,
    timeSavedEstimate: 3,
    status: 'active',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now(),
    source: 'A\'Space OS Canon'
  },
  {
    id: 'deal-can-06',
    title: 'Restitution de 24h d\'attention hebdomadaire pour l\'Architecture 7D',
    step: 'liberate',
    frictionScore: 10,
    timeSavedEstimate: 24,
    status: 'active',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now(),
    source: 'A\'Space OS Canon'
  },
  {
    id: 'deal-can-07',
    title: 'Cartographie du modèle de franchise OMK JaaS (Job-as-a-Service)',
    step: 'define',
    frictionScore: 50,
    timeSavedEstimate: 0,
    status: 'active',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    source: 'A\'Space OS Canon'
  }
];

const CANONICAL_MUSES: Muse[] = [
  {
    id: 'muse-can-01',
    title: 'OMK JaaS Back-Office & Landing Site Web',
    revenueEstimate: 15000,
    buildCost: 40,
    timeCost: 4,
    status: 'operational',
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now()
  },
  {
    id: 'muse-can-02',
    title: 'Child Care BOS (ABC Childcare Franchise)',
    revenueEstimate: 8000,
    buildCost: 25,
    timeCost: 2,
    status: 'testing',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now()
  },
  {
    id: 'muse-can-03',
    title: 'Marina Cleaning Autonomous System',
    revenueEstimate: 5000,
    buildCost: 15,
    timeCost: 2,
    status: 'candidate',
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now()
  }
];

export const useDealStore = create<DealState>((set: any, get: any) => ({
  activeTab: 'overview',
  items: [...CANONICAL_DEAL_ITEMS],
  muses: [...CANONICAL_MUSES],
  isLoaded: false,
  frictionThreshold: 50,
  automationRate: 75,
  hoursLiberated: 32,

  setActiveTab: (activeTab: any) => set({ activeTab }),
  setFrictionThreshold: (frictionThreshold: any) => set({ frictionThreshold }),

  loadFromDB: async () => {
    try {
      const dealItems = await readFromLD<DealItem>('ld06', 'items');
      const muses = await readFromLD<Muse>('ld06', 'resources');

      const loadedItems = dealItems.filter((i: any) => (i as any).type === 'v1.deal' || !(i as any).type);
      const loadedMuses = muses.filter((m: any) => (m as any).type === 'v1.muse' || !(m as any).type);

      if (loadedItems.length > 0 || loadedMuses.length > 0) {
        set({
          items: loadedItems,
          muses: loadedMuses,
          isLoaded: true
        });
      } else {
        set({
          items: [...CANONICAL_DEAL_ITEMS],
          muses: [...CANONICAL_MUSES],
          isLoaded: true
        });
      }
      get().calculateMetrics();
    } catch (e) {
      console.error("[DEAL] Failed to load from LD06", e);
      set({ items: [...CANONICAL_DEAL_ITEMS], muses: [...CANONICAL_MUSES], isLoaded: true });
      get().calculateMetrics();
    }
  },

  addItem: async (item: any) => {
    const newItem = { ...item, type: 'v1.deal', createdAt: item.createdAt || Date.now(), updatedAt: Date.now() };
    set((s: any) => ({ items: [...s.items, newItem] }));
    await writeToLD('ld06', 'items', 'add', newItem, 'deal');
    get().calculateMetrics();
  },

  createDefinitionFromText: async (text: string, source?: string) => {
    const newItem: DealItem = {
      id: crypto.randomUUID(),
      title: text,
      step: 'define',
      frictionScore: 50,
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      source
    };
    await get().addItem(newItem);
  },


  calculateMetrics: () => {
    const s = get();
    const activeItems = s.items.filter((i: any) => i.status === 'active');
    const automatedItems = activeItems.filter((i: any) => i.step === 'automate');

    const automationRate = activeItems.length > 0 ? Math.round((automatedItems.length / activeItems.length) * 100) : 0;

    let hours = 0;
    s.items.forEach((i: any) => {
      if (i.step === 'liberate') {
        hours += (i.timeSavedEstimate || 0);
      }
    });
    s.muses.forEach((m: any) => {
      if (m.status === 'operational' || m.status === 'testing' || m.status === 'candidate') {
        hours += m.timeCost;
      }
    });

    set({ automationRate, hoursLiberated: hours });
  },

  absorb12wyTacticAsFriction: async (tacticId: string, tacticTitle: string, source?: string) => {
    // Check if it already exists to not overwrite
    const exists = get().items.find((i: any) => i.tacticId === tacticId);
    if (exists) {
      console.info(`[DEAL] Tactic ${tacticId} already absorbed.`);
      return;
    }

    const newFriction: DealItem = {
      id: crypto.randomUUID(),
      title: `[12WY] ${tacticTitle}`,
      tacticId: tacticId,
      step: 'define',
      frictionScore: 60,
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      source
    };
    await get().addItem(newFriction);
    get().calculateMetrics();
    console.info(`[DEAL] Tactic ${tacticId} absorbed into DEAL Pipeline.`);
  },

  deleteItem: async (id: string, confirmed: boolean) => {
    if (!confirmed) {
      console.warn('[DEAL] User data deletion blocked: Explicit confirmation required.');
      return;
    }

    set((s: any) => ({
      items: s.items.filter((i: any) => i.id !== id)
    }));
    await writeToLD('ld06', 'items', 'delete', { id } as any, 'deal');
    get().calculateMetrics();
  },

  absorbProjectAsFriction: async (projectId: string, projectTitle: string, source?: string) => {
    const newFriction: DealItem = {
      id: crypto.randomUUID(),
      title: `[ARCHIVE] Deconstruct: ${projectTitle}`,
      projectId: projectId,
      step: 'define',
      frictionScore: 80,
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      source
    };
    await get().addItem(newFriction);
    console.info(`[DEAL] Project ${projectId} absorbed into Spacedock.`);
  },

  absorbGtdTaskAsFriction: async (content: string, context?: string, source?: string) => {
    const contextPrefix = context ? `[${context}] ` : '';
    const newFriction: DealItem = {
      id: crypto.randomUUID(),
      title: `${contextPrefix}${content}`,
      step: 'define',
      frictionScore: 100, // Déclaré haut par défaut car c'est une alarme
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      source
    };
    await get().addItem(newFriction);
    console.info(`[DEAL] GTD Task absorbed as Repetitive Friction.`);
  },

  updateDealItem: async (id: string, patch: any) => {
    let updatedItem: DealItem | undefined;
    set((s: any) => {
      const newItems = s.items.map((i: any) => {
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
      get().calculateMetrics();
    }
  },

  promoteToMuse: async (itemId: string, revenueEstimate?: number, buildCost = 1) => {
    let newMuse: Muse | undefined;
    let archivedItem: DealItem | undefined;

    set((s: any) => {
      const item = s.items.find((i: any) => i.id === itemId);
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
        items: s.items.map((i: any) => i.id === itemId ? archivedItem! : i)
      };
    });

    if (newMuse && archivedItem) {
      await writeToLD('ld06', 'items', 'update', archivedItem, 'deal');
      await writeToLD('ld06', 'resources', 'add', { ...newMuse, type: 'v1.muse' }, 'deal');
      get().calculateMetrics();
    }
  },

  updateMuse: async (id: string, patch: any) => {
    let updatedMuse: Muse | undefined;
    set((s: any) => {
      const newMuses = s.muses.map((m: any) => {
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
      get().calculateMetrics();
    }
  },

  decommissionMuse: async (id: string) => {
    let targetMuse: Muse | undefined;
    set((s: any) => {
      const newMuses = s.muses.map((m: any) => {
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
      get().calculateMetrics();
    }
  }
}));
