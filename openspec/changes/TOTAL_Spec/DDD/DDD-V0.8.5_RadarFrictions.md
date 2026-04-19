# DDD-V0.8.5 — Le Radar à Frictions (Pont GTD -> DEAL)

> **ADR** : ADR-V0.8.5 · **Cibles** : `fw-deal.store.ts` et `EngageView.tsx` (GTD)

---

## Phase A : Préparation de l'Intake Silencieux

### Étape A.1 : Wrapper Function dans DEAL
Dans `src/stores/fw-deal.store.ts`, ajouter l'action qui permet de recevoir formellement la friction depuis l'extérieur :
```typescript
interface DealState {
  // ... autres actions
  absorbGtdTaskAsFriction: (content: string, context?: string) => Promise<void>;
}

export const useDealStore = create<DealState>((set) => ({
  // ...
  absorbGtdTaskAsFriction: async (content: string, context?: string) => {
    const contextPrefix = context ? `[${context}] ` : '';
    const newFriction: DealItem = {
      id: crypto.randomUUID(),
      type: 'v1.deal',
      title: `${contextPrefix}${content}`, // Le titre vient de GTD
      step: 'define',
      frictionScore: 100, // Déclaré haut par défaut car c'est une alarme
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      domain: 'career'
    };

    set(s => ({ items: [...s.items, newFriction] }));
    await ldRouter.saveItem('deal_items', newFriction, 'ld06');
    console.log(`[DEAL] GTD Task absorbed as Repetitive Friction.`);
  }
}));
```

---

## Phase B : L'Émetteur dans GTD (Engage)

### Étape B.1 : Import du Store DEAL
Dans `src/apps/gtd/pages/EngageView.tsx` :
```tsx
import { Factory } from 'lucide-react';
import { useDealStore } from '../../../stores/fw-deal.store';
import { useGtdStore } from '../../../stores/fw-gtd.store';

export function EngageView() {
  const processItem = useGtdStore(s => s.processItem);
  const absorbGtdTaskAsFriction = useDealStore(s => s.absorbGtdTaskAsFriction);
  // ... reste du code

  const handleSendToSpacedock = (taskId: string, content: string, context?: string) => {
    // 1. Envoi asynchrone à DEAL
    absorbGtdTaskAsFriction(content, context);
    
    // 2. Traitement Local GTD (La tâche n'est plus actionable)
    processItem(taskId, { status: 'incubating' }, 'Sent to DEAL Spacedock for Reverse Engineering');
  };

  // DANS LA CARTE JSX DE LA TÂCHE (À côté du bouton "Incuber" existant) :
  // <button 
  //   title="Flag as Repetitive & Send to DEAL"
  //   onClick={() => handleSendToSpacedock(task.id, task.content, task.context)}
  //   className="w-8 h-8 rounded-full border border-white/20 hover:bg-purple-500/20 hover:border-purple-500 hover:text-purple-400 transition-colors flex items-center justify-center text-white/50"
  // >
  //   <Factory className="w-3 h-3" />
  // </button>
}
```
*(Gate: npx tsc --noEmit)*
