# ADR-V0.6.2 — Discipline Measurement (Moteur d'Exécution)

## 1. Contexte & Problème
Les scores (Weekly Scores) étaient statiques (`[{ week: 1, score: 100 }]`). Le 12WY est la discipline de l'exécution, il nécessite un score réel, froid, calculé par la machine pour confronter le commandant à sa propre réalité.

## 2. Décision (Moteur de Calcul Zustand)

### 2.1 Le Sélecteur Réactif (useWeeklyScore)
Le score d'une semaine $W$ n'a plus d'existence persistée en base. Il est systématiquement dérivé de la complétion des `WyTactic` de cette semaine $W$.

```typescript
// Algo d'Evaluation
const tacticsForWeek = tactics.filter(t => t.week === targetWeek);
const completed = tacticsForWeek.filter(t => t.status === 'completed').length;
const score = tacticsForWeek.length > 0 ? (completed / tacticsForWeek.length) * 100 : 0;
```

### 2.2 La Barrière de Mesure (85%)
Le seuil critique de la méthode de Moran se situe à **85%**. L'UI doit refléter cette bascule.

## 3. Conséquences & Isolation
*   On efface purement et simplement le concept de `WeeklyScore` (Type et Array) du store Zustand persistant. L'état dérivé est plus safe et antifragile (Single Source of Truth = the Tactics).
*   La couleur de l'UI des jauges s'appuiera sur CSS :
    *   `>= 85%` : `--theme-accent-success` (Vert/Emeraude)
    *   `< 85%` : `--theme-accent-alert` (Orange/Rouge) 

## 4. Étapes DDD (A3)
*   **Étape A** : Nettoyer `fw-12wy.store.ts` des state/types `WeeklyScore`.
*   **Étape B** : Créer le hook personnalisé `useWeeklyScore(weekNumber)` qui extrait les tactiques et renvoie un nombre de $0$ à $100$.
*   **Étape C** : Intégrer ce scoring dans le `MeasurementDashboard.tsx` et mettre en place l'UI conditionnelle CSS.
