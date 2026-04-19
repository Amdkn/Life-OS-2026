# DDD-V0.6.2 — Discipline Measurement (Moteur d'Exécution)

> **ADR** : ADR-V0.6.2 · **Dossier** : `the-bridge-__-life-os/src/apps/twelve-week/`

---

## Phase A : Moteur de Calcul (Hook Zustand Dérivé)

### Étape A.1 : `useWeeklyScore.ts`
**NOUVEAU** `src/apps/twelve-week/hooks/useWeeklyScore.ts`

```typescript
import { useMemo } from 'react';
import { useTwelveWeekStore } from '../../../stores/fw-12wy.store';

/**
 * Calcule dynamiquement le score d'exécution d'une semaine donnée
 * basé strictement sur le statut des tactiques.
 */
export function useWeeklyScore(targetWeek: number) {
  const tactics = useTwelveWeekStore(s => s.tactics);

  const scoreData = useMemo(() => {
    const weekTactics = tactics.filter(t => t.week === targetWeek);
    const totalCount = weekTactics.length;
    
    if (totalCount === 0) return { score: 0, isCrit: true, hasTactics: false };

    const completedCount = weekTactics.filter(t => t.status === 'completed').length;
    const percentage = Math.round((completedCount / totalCount) * 100);

    return {
      score: percentage,
      isCrit: percentage < 85, // La fameuse barrière des 85% de Moran
      hasTactics: true
    };
  }, [tactics, targetWeek]);

  return scoreData;
}
```

## Phase B : UI de Conscience (L'Alerte Visuelle)

### Étape B.1 : `MeasurementBar.tsx`
**NOUVEAU** `src/apps/twelve-week/components/MeasurementBar.tsx`
*(Ce composant remplace les anciennes barres dures du Dashboard Measurement)*

```typescript
import React from 'react';
import { useWeeklyScore } from '../hooks/useWeeklyScore';

export function MeasurementBar({ weekNumber }: { weekNumber: number }) {
  const { score, isCrit, hasTactics } = useWeeklyScore(weekNumber);

  if (!hasTactics) {
     return (
       <div className="w-full h-8 bg-white/5 rounded-xl border border-dashed border-white/10 flex items-center justify-center">
         <span className="text-[9px] uppercase tracking-widest text-white/20">No Execution Plan</span>
       </div>
     );
  }

  // CSS Conditionnel basé sur `isCrit` (< 85%)
  const barColor = isCrit ? 'bg-rose-500' : 'bg-emerald-500';
  const shadowColor = isCrit ? 'rgba(244, 63, 94, 0.4)' : 'rgba(16, 185, 129, 0.4)';
  const textColor = isCrit ? 'text-rose-500' : 'text-emerald-500';

  return (
    <div className="relative w-full">
       <div className="flex justify-between items-end mb-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">W{weekNumber} Execution</span>
          <span className={`text-lg font-black ${textColor}`}>{score}%</span>
       </div>
       
       <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
          <div 
            className={`absolute top-0 left-0 h-full transition-all duration-700 ease-out ${barColor}`}
            style={{ width: `${score}%`, boxShadow: `0 0 10px ${shadowColor}` }}
          />
       </div>

       {isCrit && score > 0 && (
         <p className="mt-2 text-[8px] uppercase tracking-widest text-rose-500/70">
           Warning: Execution below 85% critical threshold.
         </p>
       )}
    </div>
  );
}
```

*(A3: Remplacer tous les anciens affichages de `WeeklyScore` par des itérations de `<MeasurementBar weekNumber={w}/>` pour les 12 semaines.)*
