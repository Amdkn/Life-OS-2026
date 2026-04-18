# DDD-V0.6.1 — Destruction du Mirage (Refonte Typologique & DB)

> **ADR** : ADR-V0.6.1 · **Dossier** : `the-bridge-__-life-os/src/stores/`

---

## Phase A : Migration Typologique et IndexedDB

### Étape A.1 : La Trinité dans `fw-12wy.store.ts`
*(Suppression du middleware `persist` et du type global `Goal`)*

```typescript
import { create } from 'zustand';
import type { ParaItem } from './fw-para.store';
import { readFromLD, writeToLD } from '../utils/paraAdapter';

// NOUVEAUX CONTRATS
export interface WyVision extends ParaItem {
  type: 'wy-vision';
  ikigaiVisionId?: string; 
}

export interface WyGoal extends ParaItem {
  type: 'wy-goal';
  visionId: string;
  targetWeek: number; // 1-12
}

export interface WyTactic extends ParaItem {
  type: 'wy-tactic';
  goalId: string;
  week: number;
  status: 'pending' | 'completed' | 'failed';
}

interface TwelveWeekState {
  visions: WyVision[];
  goals: WyGoal[];
  tactics: WyTactic[];
  activeTab: 'overview' | 'vision' | 'planning' | 'process' | 'measurement' | 'accountability';
  activeWeek: number | 'all';
  isHydrated: boolean;

  // Actions
  hydrate: () => Promise<void>;
  setActiveTab: (tab: TwelveWeekState['activeTab']) => void;
  setActiveWeek: (week: number | 'all') => void;
  addVision: (v: WyVision) => Promise<void>;
  addGoal: (g: WyGoal) => Promise<void>;
  addTactic: (t: WyTactic) => Promise<void>;
  updateTacticStatus: (id: string, status: WyTactic['status']) => Promise<void>;
}

export const useTwelveWeekStore = create<TwelveWeekState>((set, get) => ({
  visions: [],
  goals: [],
  tactics: [],
  activeTab: 'overview',
  activeWeek: 'all',
  isHydrated: false,

  hydrate: async () => {
    try {
      // Ex: Lecture depuis 'ld01' ou une table system
      const data = await readFromLD('ld01', 'resources');
      set({
        visions: data.filter(d => d.type === 'wy-vision') as WyVision[],
        goals: data.filter(d => d.type === 'wy-goal') as WyGoal[],
        tactics: data.filter(d => d.type === 'wy-tactic') as WyTactic[],
        isHydrated: true
      });
    } catch(e) { set({ isHydrated: true }); }
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setActiveWeek: (week) => set({ activeWeek: week }),

  addVision: async (v) => {
    set(s => ({ visions: [...s.visions, v] }));
    await writeToLD('ld01', 'resources', 'put', v, '12wy');
  },
  addGoal: async (g) => {
    set(s => ({ goals: [...s.goals, g] }));
    await writeToLD('ld01', 'resources', 'put', g, '12wy');
  },
  addTactic: async (t) => {
    set(s => ({ tactics: [...s.tactics, t] }));
    await writeToLD('ld01', 'resources', 'put', t, '12wy');
  },
  updateTacticStatus: async (id, status) => {
    const tactic = get().tactics.find(t => t.id === id);
    if (!tactic) return;
    const updated = { ...tactic, status };
    set(s => ({ tactics: s.tactics.map(t => t.id === id ? updated : t) }));
    await writeToLD('ld01', 'resources', 'put', updated, '12wy');
  }
}));
```

## Phase B : Création de la Trinité (UI)

### Étape B.1 : Hierarchie Créative
*(Dans les différents composants de pages 12WY : `VisionTable.tsx`, `GoalTable.tsx`, `TacticsBoard.tsx`...)*
*   **A3 Dev Note** : Refactorer l'interface de création pour refléter cette stricte liaison. On ne peut créer un `WyGoal` qu'en fournissant un `visionId`. On ne peut créer un `WyTactic` qu'en fournissant un `goalId` et une `week`. Le code UI exact (formulaires) devra remplacer tous les anciens appels à l'ancien type `Goal`.
