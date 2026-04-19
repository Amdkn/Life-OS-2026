# ADR-V0.6.3 — Le Nexus Temporel (PARA ↔ 12WY & Time Use)

## 1. Contexte & Problème
Le vaisseau a un point d'entrée pour la stratégie (PARA) et un pour le temps (12WY). Ils doivent se croiser de force pour éviter de lancer des projets qui ne contribuent pas au Trimestre, et assurer que le temps est alloué via "Time Blocking".

## 2. Décisions (Type Contract)

### 2.1 L'Irrigation PARA
Un Projet Picard pointe la hiérarchie Trimestrielle. (On ne pointe pas la Tactique hebdomadaire, trop éphémère).

**APRÈS (fw-para.store.ts) :**
```typescript
export interface Project extends ParaItem {
  // ... ikigaiVisionId
  twelveWeekGoalId?: string; // V0.6.3 — Pointer vers un WyGoal
}
```

### 2.2 La Discipline "Time Use" (Nouveaux Types)
On intègre la capacité de planifier les 3 Blocs Sacrés par semaine au sein de `fw-12wy`.

```typescript
export type TimeBlockType = 'strategic' | 'buffer' | 'breakout';

export interface WyTimeBlock extends ParaItem {
  type: 'wy-timeblock';
  week: number; // 1-12
  blockType: TimeBlockType;
  dateStr: string; // Ex: '2026-03-22' ou format crontab
  durationHours: number; // 3h Strat, 1-2h Buffer, etc.
  completed: boolean;
}
```

## 3. Conséquences & UI
*   Dans la carte de Projet de PARA, un bouton `Align to 12WY` agira comme `VisionAligner`.
*   Dans l'Overview du 12WY (Semaine Active), une section **Time Use** permettra au de cocher la réalisation de ses blocs (Strategic = focus absolu, Buffer = admi, Breakout = break out).
*   La complétion des Blocs impacte POSITIVEMENT le Score Hebdomadaire (Calcul pondéré avec les tactiques dans le hook `useWeeklyScore`).

## 4. Étapes DDD (A3)
*   **Étape A** : Ajouter `twelveWeekGoalId` à la structure `Project` de PARA.
*   **Étape B** : Créer un `GoalAligner.tsx` (Clone de VisionAligner) dans la carte projet PARA.
*   **Étape C** : Créer l'entité et le store state pour les `WyTimeBlock` dans 12WY.
*   **Étape D** : Rédiger le composant `TimeUseMatrix.tsx` intégrable dans la semaine en cours.
