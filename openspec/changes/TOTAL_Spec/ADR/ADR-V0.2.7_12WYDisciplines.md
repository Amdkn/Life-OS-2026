# ADR-V0.2.7 — 12 Week Year Disciplines

> **PRD** : PRD-V0.2.7 · **Dépendance** : ADR-V0.2.4 (HeaderFilterBar Semaines)
> **Décideur** : A'"0 · **Exécuteur** : A3

---

## Décision
Implémenter les 5 disciplines 12WY comme 5 vues distinctes dans la sidebar, avec un Header Menu filtrant par semaine [W1..W12]. Les goals sont assignables à des agents Life OS pour la répartition de charges.

## Justification
Le 12 Week Year n'est pas un calendrier — c'est un système de disciplines. Chaque discipline est une perspective différente sur les mêmes goals. Le filtre par semaine est transversal.

---

## Phase A : Data Model (4 étapes)

### Contrats
```typescript
export type Discipline = 'vision' | 'planning' | 'processControl' | 'measurement' | 'timeUse';

export type LifeOSAgent = 'orville' | 'discovery' | 'snw' | 'enterprise' | 'cerritos' | 'protostar';

export interface TwelveWeekGoal {
  id: string; title: string; discipline: Discipline;
  weeklyScores: WeeklyScore[]; assignedAgent?: LifeOSAgent;
  linkedDomain?: LifeWheelDomain; // cross-framework link
}

export interface WeeklyScore {
  week: number; // 1-12
  score: number; // 0-100
  notes: string;
}
```

### Étapes DDD
| Étape | Action | Détail |
|-------|--------|--------|
| A.1 | MODIFY `fw-12wy.store.ts` | Types `Discipline`, `TwelveWeekGoal`, `WeeklyScore`, `LifeOSAgent` |
| A.2 | MODIFY `fw-12wy.store.ts` | State `activeWeek: number | 'all'`, `activeDiscipline` |
| A.3 | MODIFY `fw-12wy.store.ts` | Seed : 5 goals (1/discipline), scores W1-W4, agents assignés |
| A.4 | Gate | `tsc --noEmit` |

---

## Phase B : 5 Vues Disciplines (5 étapes)

### Contrats
```typescript
// Chaque discipline = un composant page
// src/apps/twelve-week/pages/VisionView.tsx [NEW]
// src/apps/twelve-week/pages/PlanningView.tsx [NEW]
// src/apps/twelve-week/pages/ProcessControlView.tsx [NEW]
// src/apps/twelve-week/pages/MeasurementView.tsx [NEW]
// src/apps/twelve-week/pages/TimeUseView.tsx [NEW]
```

### Étapes DDD
| Étape | Action | Détail |
|-------|--------|--------|
| B.1 | NEW `VisionView.tsx` | Goals long terme, alignment badges Life Wheel |
| B.2 | NEW `PlanningView.tsx` | Breakdown : goal → tactics par semaine (table) |
| B.3 | NEW `ProcessControlView.tsx` | WAM tracker : checklist weekly accountability |
| B.4 | NEW `MeasurementView.tsx` | Scores par semaine : mini progress bars par goal |
| B.5 | NEW `TimeUseView.tsx` | Allocation temps par agent : répartition visuelle (barres horizontales) |

---

## Phase C : Filtres (3 étapes)

### Étapes DDD
| Étape | Action | Détail |
|-------|--------|--------|
| C.1 | MODIFY `TwelveWeekApp.tsx` | Header = `HeaderFilterBar` avec `[All, W1..W12]` |
| C.2 | MODIFY `TwelveWeekApp.tsx` | Filtre agent dans sidebar (dropdown ou pills) |
| C.3 | Gate | `npm run gate` + 5 disciplines navigables, filtres semaines + agents |
