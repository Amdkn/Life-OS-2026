import { useMemo } from 'react';
import { useTwelveWeekStore, WyTactic, WyGoal } from '../../../stores/fw-12wy.store';

/**
 * Pure logic function for calculating weekly score.
 */
export function calculateWeeklyScore(
  tactics: WyTactic[],
  goals: WyGoal[],
  activeVisionId: string | null,
  targetWeek: number
) {
  // Filter goals belonging to the active cycle/vision
  const cycleGoalIds = new Set(
    goals.filter(g => g.visionId === activeVisionId).map(g => g.id)
  );

  // 1. Uniquement semaine ET cycle ciblés
  // 2. Uniquement les statuts mesurables (pending, completed, failed)
  // 3. Déduplication des tactiques par id
  const uniqueTactics = Array.from(new Map(tactics.map(t => [t.id, t])).values());
  const validTactics = uniqueTactics.filter(
    t => t.week === targetWeek && cycleGoalIds.has(t.goalId) && ['pending', 'completed', 'failed'].includes(t.status)
  );

  const totalCount = validTactics.length;

  if (totalCount === 0) {
    return { score: null, status: 'unmeasured' as const, hasTactics: false };
  }

  const completedCount = validTactics.filter(t => t.status === 'completed').length;
  const exactPercentage = (completedCount / totalCount) * 100;
  const roundedPercentage = Math.round(exactPercentage);

  // Thresholds appliqués STRICTEMENT sur le pourcentage exact, pas sur l'arrondi.
  let status: 'green' | 'yellow' | 'red' = 'red';
  if (exactPercentage >= 85) {
    status = 'green';
  } else if (exactPercentage >= 70) {
    status = 'yellow';
  }

  return {
    score: roundedPercentage,
    status,
    hasTactics: true
  };
}

/**
 * Calcule dynamiquement le score d'exécution d'une semaine donnée
 * basé strictement sur le statut des tactiques.
 */
export function useWeeklyScore(targetWeek: number) {
  const tactics = useTwelveWeekStore(s => s.tactics);
  const goals = useTwelveWeekStore(s => s.goals);
  const activeVisionId = useTwelveWeekStore(s => s.activeVisionId);

  return useMemo(
    () => calculateWeeklyScore(tactics, goals, activeVisionId, targetWeek),
    [tactics, goals, activeVisionId, targetWeek]
  );
}
