# DDD-V0.8.2 — Le Sas de Décompression (Absorption PARA)

> **ADR** : ADR-V0.8.2 · **Cibles** : `fw-deal.store.ts` et `Archives.tsx` (PARA)

---

## Phase A : L'Action d'Absorption dans DEAL

### Étape A.1 : Déclaration dans `fw-deal.store`
Ajouter la signature dans typage `DealState` puis l'implémenter :
```typescript
interface DealState {
   // ...
   absorbProjectAsFriction: (projectId: string, projectTitle: string) => Promise<void>;
}

export const useDealStore = create<DealState>((set) => ({
  // ...
  absorbProjectAsFriction: async (projectId: string, projectTitle: string) => {
    const newFriction: DealItem = {
      id: crypto.randomUUID(),
      type: 'v1.deal',
      title: `[ARCHIVE] Deconstruct: ${projectTitle}`,
      projectId: projectId, // Le lien structurel
      step: 'define',
      frictionScore: 80, // High friction par défaut pour forcer le tri
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      domain: 'career'
    };

    set(s => ({ items: [...s.items, newFriction] }));
    await ldRouter.saveItem('deal_items', newFriction, 'ld06');
    console.log(`[DEAL] Project ${projectId} absorbed into Spacedock.`);
  }
}));
```

---

## Phase B : L'Intake côté PARA

### Étape B.1 : Le Bouton "Transfer to DEAL"
Dans la vue des Projets ou des Archives PARA (ex: `<ParaProjectCard>` ou composant archive), ajouter ce bouton si le projet est `archived` :

```tsx
import { useDealStore } from '../../stores/fw-deal.store';
import { Wrench } from 'lucide-react';

// Dans le composant affichant l'archive :
export function TransferToSpacedockButton({ project }: { project: ParaProject }) {
  const absorbProjectAsFriction = useDealStore(s => s.absorbProjectAsFriction);

  const handleTransfer = () => {
    absorbProjectAsFriction(project.id, project.title);
    alert('Project transferred to DEAL Spacedock for deconstruction.'); // Ou utiliser un Toast
  };

  return (
    <button 
      onClick={handleTransfer}
      className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-all text-sm font-bold"
    >
      <Wrench className="w-4 h-4" />
      Reverse Engineer (To DEAL)
    </button>
  );
}
```
*(Gate: npx tsc --noEmit)*
