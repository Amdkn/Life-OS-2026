# DDD-V0.8.4 — Le Nexus Économique Ascendant

> **ADR** : ADR-V0.8.4 · **Cibles** : `LifeWheel.tsx` et `TimeUseMatrix.tsx`

---

## Phase A : L'Essence Financière (Life Wheel)

### Étape A.1 : Import du Store DEAL dans Life Wheel
Dans le composant responsable de l'affichage global ou financier de l'app Ikigai (ex: `src/apps/ikigai/pages/LifeWheel.tsx` ou sous-composant affichant les détails du nœud FINANCE) :

```tsx
import { useDealStore } from '../../../stores/fw-deal.store';
import { useMemo } from 'react';

// Dans le composant React (Overlay de domaine Focus ou Header) :
export function FinancePassiveRevenueWidget() {
   const muses = useDealStore(s => s.muses);
   
   // Somme pure des muses réussies (Achieved)
   const passiveMRR = useMemo(() => {
      return muses
         .filter(m => m.status === 'achieved')
         .reduce((acc, muse) => acc + (muse.revenueEstimate || 0), 0);
   }, [muses]);

   if (passiveMRR === 0) return null;

   return (
      <div className="mt-4 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between">
         <span className="text-[10px] uppercase font-bold text-emerald-500/60 tracking-widest">Spacedock Muses MRR</span>
         <span className="text-xl font-black text-emerald-400">
             ${passiveMRR.toLocaleString()} <span className="text-xs font-bold text-emerald-500/50">/ mo</span>
         </span>
      </div>
   );
}
```

---

## Phase B : La Taxe de Temps (12WY)

### Étape B.1 : Import dans TimeUseMatrix
Le moteur temporel (12WY) calcule où passe le temps. Les Muses ont un `timeCost`.
Dans `src/apps/twelve-week/components/TimeUseMatrix.tsx` :

```tsx
import { useDealStore } from '../../../stores/fw-deal.store';
import { useMemo } from 'react';

// Dans TimeUseMatrix() :
export function TimeUseMatrix() {
   const muses = useDealStore(s => s.muses);
   // ... code 12WY existant ...

   // Cumul du Time Cost de TOUTES les muses actives (Candidate, Testing, Achieved)
   const totalMuseTax = useMemo(() => {
      return muses
         .filter(m => m.status !== 'candidate') // Ne filtrer que Testing & Achieved
         .reduce((acc, m) => acc + (m.timeCost || 0), 0);
   }, [muses]);

   // JSX (À côté des Strategic / Buffer / Breakout blocks) :
   // {totalMuseTax > 0 && (
   //   <div className="flex justify-between items-center px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl mt-4">
   //     <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Muses Maintenance Tax</span>
   //     <span className="text-sm font-black text-red-500">{totalMuseTax} h / week</span>
   //   </div>
   // )}
}
```
*(Gate: npx tsc --noEmit)*
