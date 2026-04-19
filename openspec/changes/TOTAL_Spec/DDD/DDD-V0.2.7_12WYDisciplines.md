# DDD-V0.2.7 — 12 Week Year Disciplines

> **ADR** : ADR-V0.2.7 · **Dépendance** : DDD-V0.2.4
> **Dossier** : `the-bridge-__-life-os/src/`

---

## Étapes A.1-A.4 : Types & Store

**MODIFY** `src/stores/fw-12wy.store.ts`

```typescript
export type Discipline = 'vision' | 'planning' | 'processControl' | 'measurement' | 'timeUse';
export type LifeOSAgent = 'orville' | 'discovery' | 'snw' | 'enterprise' | 'cerritos' | 'protostar';

export interface TwelveWeekGoal {
  id: string; title: string; discipline: Discipline;
  weeklyScores: WeeklyScore[]; assignedAgent?: LifeOSAgent;
  linkedDomain?: string;
}
export interface WeeklyScore { week: number; score: number; notes: string; }

// State
activeWeek: number | 'all'; activeDiscipline: Discipline | 'all';
setActiveWeek: (w: number | 'all') => void;
goals: TwelveWeekGoal[];
getFilteredGoals: () => TwelveWeekGoal[];
```

**Seed** : 5 goals (Vision: "Build A'Space V1", Planning: "12WY Quarterly Plan", ProcessControl: "Weekly WAM", Measurement: "KPI Dashboard", TimeUse: "Agent Load Balancing"), scores W1-W4.

**Gate** : `tsc --noEmit`

---

## Étapes B.1-B.5 : 5 Vues Disciplines

**NEW** 5 composants dans `src/apps/twelve-week/pages/` :

**VisionView.tsx** — Goals long terme, cards avec alignment badge Life Wheel domain.

**PlanningView.tsx** — Table : Goal | W1 | W2 | ... | W12, avec tactics par cellule.

**ProcessControlView.tsx** — WAM Tracker : checklist items (Did I do my #1? Accountability call? Score update?).

**MeasurementView.tsx** — Scores par goal : mini barres horizontales par semaine, couleur par score (vert >80, jaune >50, rouge <50).

**TimeUseView.tsx** — Répartition par agent : barres horizontales stacked, % temps alloué.

Chaque vue reçoit `goals` filtrés par `activeWeek` et `activeDiscipline`.

**Gate** : 5 onglets navigables dans la sidebar

---

## Étapes C.1-C.3 : Filtres

**MODIFY** `TwelveWeekApp.tsx` : Header = `HeaderFilterBar` avec items `[All, W1..W12]`, accentColor `teal`.

Sidebar : ajouter dropdown ou pills pour l'agent filter (optional).

**Gate Finale** : `npm run gate` + filtres semaines + disciplines + agents fonctionnels
