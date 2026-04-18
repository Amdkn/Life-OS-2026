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
