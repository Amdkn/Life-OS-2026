# DDD-V0.7.1 — La Loi de la Persistance (Rutherford)

> **ADR** : ADR-V0.7.1 · **Dossier Cible** : `stores/fw-gtd.store.ts`

---

## Phase A : Refonte du Store (Persistance IDB)

### Étape A.1 : Imports et Types
Supprimer `persist` de Zustand et importer `ldRouter` :
```typescript
import { create } from 'zustand';
// SUPPRIMER : import { persist } from 'zustand/middleware';
import { ldRouter, LDId, LdEntity } from '../lib/ld-router';

// L'interface GTDItem doit implémenter LdEntity
export interface GTDItem extends LdEntity {
  content: string;
  status: 'inbox' | 'actionable' | 'incubating' | 'reference' | 'trash';
  // ... autres champs
}

// Retirer the SEED_ITEMS const !
```

### Étape A.2 : Ajout de la méthode Hydratation
Dans l'interface `GtdState`, ajouter la méthode de chargement :
```typescript
interface GtdState {
   // ...
   isLoaded: boolean;
   loadFromDB: () => Promise<void>;
}
```

### Étape A.3 : Le Cœur Zustand
Réécrire le `create` sans le wrapper `persist` :
```typescript
export const useGtdStore = create<GtdState>((set, get) => ({
  activeTab: 'overview',
  activeContext: 'all',
  items: [], // Vide au démarrage
  logs: [],
  isLoaded: false,

  loadFromDB: async () => {
    try {
      const items = await ldRouter.getAllItems<GTDItem>('actions', 'ld05');
      set({ items, isLoaded: true });
    } catch (e) {
      console.error("[GTD] Failed to load from LD05", e);
      set({ items: [], isLoaded: true });
    }
  },

  addItem: async (content, opts) => {
    const newItem: GTDItem = {
      id: crypto.randomUUID(),
      type: 'v1.action', // Conformité LdEntity
      content,
      status: 'inbox',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      projectId: opts?.projectId,
      domain: 'life' // Default
    };

    set(s => ({ items: [newItem, ...s.items] }));
    await ldRouter.saveItem('actions', newItem, 'ld05');
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
       await ldRouter.upsertItem('actions', updatedItem, 'ld05');
     }
  }
}));
```

### Étape A.4 : Hydratation dans App
Dans le composant racine de GTD (`GtdApp.tsx`), invoquer `loadFromDB` :
```tsx
import { useEffect } from 'react';
import { useGtdStore } from '../../stores/fw-gtd.store';

export default function GtdApp() {
   const loadFromDB = useGtdStore(s => s.loadFromDB);
   
   useEffect(() => {
     loadFromDB();
   }, []);
   // .. reste du code
}
```
*(Gate: npx tsc --noEmit)*
