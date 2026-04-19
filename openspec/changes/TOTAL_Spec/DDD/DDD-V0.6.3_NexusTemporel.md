# DDD-V0.6.3 — Le Nexus Temporel (PARA ↔ 12WY & Time Use)

> **ADR** : ADR-V0.6.3 · **Dossiers cibles** : `fw-para.store.ts`, `apps/para/`, `fw-12wy.store.ts`, `apps/twelve-week/`

---

## Phase A : L'Alignement Projet (PARA -> 12WY)

### Étape A.1 : Contrat PARA et `GoalAligner.tsx`
**Mise à jour `fw-para.store.ts`** :
```typescript
export interface Project extends ParaItem {
  // ...
  twelveWeekGoalId?: string; // V0.6.3 — Pointer vers un WyGoal Trimestriel
}
```

**NOUVEAU** `src/apps/para/components/GoalAligner.tsx`
*(A3 : Clone la philosophie de `VisionAligner.tsx` en important `useTwelveWeekStore(s => s.goals)` et en permettant à l'utilisateur de cliquer sur un WyGoal valide pour l'attacher à `project.twelveWeekGoalId`. Integérer le bouton dans la Card Project.)*

---

## Phase B : La Discipline Time Use (Time Blocking)

### Étape B.1 : Store Time Use (`fw-12wy.store.ts`)
```typescript
export type TimeBlockType = 'strategic' | 'buffer' | 'breakout';

export interface WyTimeBlock extends ParaItem {
  type: 'wy-timeblock';
  week: number;
  blockType: TimeBlockType;
  completed: boolean;
}

// Dans TwelveWeekState, ajouter:
timeBlocks: WyTimeBlock[];
toggleTimeBlock: (id: string) => Promise<void>;
addTimeBlock: (b: WyTimeBlock) => Promise<void>;

// Dans la lecture hydrate() :
timeBlocks: data.filter(d => d.type === 'wy-timeblock') as WyTimeBlock[],
```

### Étape B.2 : `TimeUseMatrix.tsx`
**NOUVEAU** `src/apps/twelve-week/components/TimeUseMatrix.tsx`
```typescript
import React from 'react';
import { Target, Inbox, Coffee } from 'lucide-react';
import { useTwelveWeekStore, type TimeBlockType } from '../../../stores/fw-12wy.store';

const BLOCKS = [
  { type: 'strategic' as TimeBlockType, label: 'Strategic (3h Focus)', icon: Target, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  { type: 'buffer' as TimeBlockType, label: 'Buffer (Admin/Comm)', icon: Inbox, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { type: 'breakout' as TimeBlockType, label: 'Breakout (Recharge)', icon: Coffee, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
];

export function TimeUseMatrix({ week }: { week: number }) {
  const allTimeBlocks = useTwelveWeekStore(s => s.timeBlocks);
  const timeBlocks = allTimeBlocks.filter(b => b.week === week);
  const toggleTimeBlock = useTwelveWeekStore(s => s.toggleTimeBlock);
  const addTimeBlock = useTwelveWeekStore(s => s.addTimeBlock);

  // Auto-Générateur si un bloc n'existe pas pour la semaine
  const handleBlockEnsure = async (type: TimeBlockType) => {
    const existing = timeBlocks.find(b => b.blockType === type);
    if (existing) {
       await toggleTimeBlock(existing.id);
    } else {
       await addTimeBlock({
         id: crypto.randomUUID(), type: 'wy-timeblock', status: 'active',
         title: `${type} W${week}`, week, blockType: type, completed: true, 
         domain: 'life', pillars: [], createdAt: Date.now()
       });
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-black/40 border border-white/5">
       <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-4">Time Use Matrix</h4>
       <div className="grid grid-cols-3 gap-4">
         {BLOCKS.map(def => {
           const block = timeBlocks.find(b => b.blockType === def.type);
           const isDone = block?.completed;

           return (
             <button 
                key={def.type}
                onClick={() => handleBlockEnsure(def.type)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${isDone ? `${def.bg} ${def.border}` : 'bg-white/[0.02] border-white/5 hover:bg-white/5'}`}
             >
                <def.icon className={`w-5 h-5 mb-2 ${isDone ? def.color : 'text-white/20'}`} />
                <span className={`text-[9px] uppercase tracking-widest font-bold ${isDone ? def.color : 'text-white/40'}`}>{def.label}</span>
                {isDone && <span className="mt-2 text-[8px] bg-white/20 px-2 py-0.5 rounded text-white">LOCKED</span>}
             </button>
           );
         })}
       </div>
    </div>
  );
}
```

*(A3: Le Taux d'Exécution Total pourrait même un jour englober ces TimeBlocks. Intègre ça dans le tableau de bord de la Active Week.)*
