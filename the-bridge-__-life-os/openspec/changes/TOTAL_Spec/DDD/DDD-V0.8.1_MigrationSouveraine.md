# DDD-V0.8.1 — La Migration Souveraine

> **ADR** : ADR-V0.8.1 · **Cible** : `stores/fw-deal.store.ts`

---

## Phase A : Refonte du Store (Persistance IDB)

### Étape A.1 : Imports et Types
Supprimer `persist` de Zustand et importer `ldRouter` :
```typescript
import { create } from 'zustand';
// SUPPRIMER : import { persist } from 'zustand/middleware';
import { ldRouter, LdEntity } from '../lib/ld-router';

// Les interfaces doivent implémenter LdEntity
export interface DealItem extends LdEntity {
  // id, type, createdAt... hérités de LdEntity
  projectId?: string; 
  title: string;
  step: DealStep;
  frictionScore: number; 
  potentialRevenue?: number;
  status: 'active' | 'completed';
}

export interface Muse extends LdEntity {
  // id, type, createdAt...
  title: string;
  revenueEstimate: number;
  timeCost: number; 
  status: 'candidate' | 'testing' | 'achieved';
}

// RETIRER LES SEED_MUSES ET DATA EN DUR !
```

### Étape A.2 : Le Cœur Zustand
Réécrire le `create` sans le wrapper `persist` :
```typescript
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
  // ... on verra la suite dans le DDD-0.8.3
}

export const useDealStore = create<DealState>((set, get) => ({
  activeTab: 'overview',
  items: [],
  muses: [],
  isLoaded: false,

  setActiveTab: (activeTab) => set({ activeTab }),

  loadFromDB: async () => {
    try {
      const items = await ldRouter.getAllItems<DealItem>('deal_items', 'ld06');
      const muses = await ldRouter.getAllItems<Muse>('muses', 'ld06');
      set({ items, muses, isLoaded: true });
    } catch (e) {
      console.error("[DEAL] Failed to load from LD06", e);
      set({ items: [], muses: [], isLoaded: true });
    }
  },

  addItem: async (item) => {
    set(s => ({ items: [...s.items, item] }));
    await ldRouter.saveItem('deal_items', item, 'ld06');
  },

  createDefinitionFromText: async (text) => {
    const newItem: DealItem = {
      id: crypto.randomUUID(),
      type: 'v1.deal',
      title: text,
      step: 'define',
      frictionScore: 50,
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      domain: 'career'
    };
    set(s => ({ items: [...s.items, newItem] }));
    await ldRouter.saveItem('deal_items', newItem, 'ld06');
  },
  
  // ... autres méthodes
}));
```

### Étape A.3 : Lancement de l'Hydratation
Dans `src/apps/deal/DealApp.tsx` :
```tsx
import { useEffect } from 'react';
import { useDealStore } from '../../stores/fw-deal.store';

export default function DealApp() {
   const loadFromDB = useDealStore(s => s.loadFromDB);
   
   useEffect(() => {
     loadFromDB();
   }, []);

   // ...
}
```
*(Gate: npx tsc --noEmit)*
