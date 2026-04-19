# DDD-V0.8.3 — Le Pipeline D-E-A-L

> **ADR** : ADR-V0.8.3 · **Cible** : `fw-deal.store.ts`

---

## Phase A : Reactivation de la Machine à États

### Étape A.1 : La Fonction d'Update Standard
Dans `fw-deal.store.ts` :
```typescript
interface DealState {
  // ...
  updateDealItem: (id: string, patch: Partial<DealItem>) => Promise<void>;
  promoteToMuse: (itemId: string, revenueEstimate: number) => Promise<void>; 
}

export const useDealStore = create<DealState>((set) => ({
  // ...
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
      await ldRouter.upsertItem('deal_items', updatedItem, 'ld06');
    }
  },

  promoteToMuse: async (itemId, revenueEstimate) => {
    let newMuse: Muse | undefined;
    let archivedItem: DealItem | undefined;

    set(s => {
      const item = s.items.find(i => i.id === itemId);
      if (!item) return s;

      // 1. Archiver l'item (On ne le supprime plus, il reste comme trace de fabrication)
      archivedItem = { ...item, status: 'completed', updatedAt: Date.now() };

      // 2. Créer la Muse
      newMuse = {
        id: crypto.randomUUID(),
        type: 'v1.muse',
        title: item.title,
        revenueEstimate: revenueEstimate,
        timeCost: 1, // Cout de maintenance par défaut (1h/semaine)
        status: 'candidate',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        domain: 'career'
      };

      return { 
        muses: [...s.muses, newMuse], 
        items: s.items.map(i => i.id === itemId ? archivedItem! : i)
      };
    });

    if (newMuse && archivedItem) {
      // Sauvegarder asynchroniquement les deux changements
      await ldRouter.upsertItem('deal_items', archivedItem, 'ld06');
      await ldRouter.saveItem('muses', newMuse, 'ld06');
    }
  },
  // ...
}));
```

### Étape A.2 : Update Muse existante
```typescript
// Mettre à jour (ex: passer de candidate -> achieved)
updateMuse: async (id: string, patch: Partial<Muse>) => {
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
      await ldRouter.upsertItem('muses', updatedMuse, 'ld06');
    }
}
```
*(Gate: npx tsc --noEmit)*
