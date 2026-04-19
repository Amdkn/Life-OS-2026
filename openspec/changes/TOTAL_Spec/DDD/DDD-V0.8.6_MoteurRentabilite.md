# DDD-V0.8.6 — Le Moteur de Rentabilité (Janeway's Calculus)

> **ADR** : ADR-V0.8.6 · **Cibles** : `fw-deal.store.ts` et `Muses.tsx` UI

---

## Phase A : Type Extension et Calculs

### Étape A.1 : Modifier l'interface `Muse`
Dans `src/stores/fw-deal.store.ts` :
```typescript
export interface Muse extends LdEntity {
    // ...
    buildCost: number; // Heures investies en Dev
    status: 'candidate' | 'testing' | 'operational' | 'failing' | 'deprecated';
    webhookUrl?: string; // (Préparation pour V0.8.7)
}
```

Mettre à jour `promoteToMuse` en conséquence :
```typescript
    promoteToMuse: async (itemId, revenueEstimate, buildCost = 1) => {
      // ...
      newMuse = {
        // ...
        revenueEstimate: revenueEstimate,
        buildCost: buildCost, 
        timeCost: 1, 
        status: 'candidate',
        // ...
      };
      // ...
```

---

## Phase B : UI Break-Even Visualisation

### Étape B.1 : Le Composant de Rentabilité (Dans `Muses.tsx` ou carte équivalente)
Sur le Dashboard des Muses (`apps/deal/pages/Muses.tsx`), pour chaque objet `muse` :
```tsx
import { AlertTriangle, Activity } from 'lucide-react';

// Lors du .map() sur les Muses :
export function MuseROIWidget({ muse }: { muse: Muse }) {
  // Calcul mathématique : Combien de temps pour rembourser l'effort ?
  // Hypothèse : muse.revenueEstimate peut aussi repésenter un "Temps Sauvé par mois". (A clarifier selon l'usage d'Amadeus)
  // Pour la démonstration, on va calculer le ratio temps_invesi / temps_cout. 
  
  const isFailing = muse.status === 'failing';

  return (
    <div className="flex flex-col gap-2 p-3 bg-white/5 border border-white/10 rounded-xl mt-4">
       <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
         <span className="text-white/40">Build Cost</span>
         <span className="text-white"> {muse.buildCost} hrs </span>
       </div>
       
       <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
         <span className="text-white/40">Status</span>
         {isFailing ? (
           <span className="text-red-400 flex items-center gap-1 animate-pulse"><AlertTriangle className="w-3 h-3"/> FAILING - MRR LOST</span>
         ) : muse.status === 'operational' ? (
           <span className="text-emerald-400 flex items-center gap-1"><Activity className="w-3 h-3"/> OPERATIONAL</span>
         ) : (
           <span className="text-blue-400 uppercase">{muse.status}</span>
         )}
       </div>
    </div>
  );
}
```

---

## Phase C : Verrouillage des exports (Nexus v0.8.4 fix)
Dans `LifeWheel.tsx` et `TimeUseMatrix.tsx`, remplacer the filtre `status === 'achieved'` ou `status !== 'candidate'` par :
```typescript
.filter(m => m.status === 'operational') // Seules les Muses opérationnelles remontent à l'OS global
```
*(Gate: npx tsc --noEmit)*
