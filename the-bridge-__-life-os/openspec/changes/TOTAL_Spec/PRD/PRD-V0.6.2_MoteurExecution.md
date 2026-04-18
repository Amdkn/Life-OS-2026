# PRD: V0.6.2 Discipline Measurement (Moteur d'Exécution)

## 1. En-tête (TVR)
*   **Faisabilité (T)** : Haute. C'est l'essence même de Zustand (selectors dérivés).
*   **Valeur (V)** : La discipline "Measurement" est le cœur battant du 12WY. L'OS devient intraitable.
*   **Réutilisabilité (R)** : Composants visuels de jauge critique exportables.

## 2. User Stories (Phase B - Mathématique de l'Exécution)

*   **US-77 [Calcul de Réalité Hebdomadaire]** : "En tant que Commandant, la page de Measurement de mon dashboard 12WY ne me demande plus quel est mon score. Elle calcule elle-même, pour chaque semaine passée ou en cours, le pourcentage exact de `WyTactics` ayant le statut 'achieved' divisé par le total de `WyTactics` assignées à cette même semaine."
*   **US-78 [Alerte Rouge Critique (< 85%)]** : "Le livre 12WY explique que la réussite d'un but demande une exécution à au moins 85% (et non 100%). L'interface du Measurement Dashboard affiche la jauge globale de ma semaine en Vert si >= 85%, et en Alerte (Rouge/Orange, animations d'alerte, contours hard) si elle tombe en dessous une fois la semaine close ou avancée."
*   **US-79 [Vue Synchrone]** : "Au niveau de mon tableau de bord "Active Week", je vois immédiatement mon score s'ajuster en temps réel au moment où je coche une "Tactic"."

## 3. Garde-Fous (Anti-Patterns)
| Anti-Pattern ❌ | Décision Architectural ✅ |
| :--- | :--- |
| Sauvegarder le "Score" dans la DB | Le Score N'EXISTE PAS. C'est une dérivation (selector local React) basée sur le array de Tactiques existantes. Zéro duplication = Zéro désynchronisation. |
| Utiliser des Graphiques Lourds | Une barre `.bg-emerald-500` pure CSS réagissant à la condition `< 85` qui switcherait sur `.bg-rose-500` avec une ombre CSS `--theme-accent`. |

## 4. Fichiers Impactés
*   `apps/twelve-week/hooks/useWeeklyScore.ts` (Nouveau)
*   `apps/twelve-week/pages/MeasurementBoard.tsx` (Mise à jour UI conditionnelle CSS)
*   `apps/twelve-week/components/ActiveWeekPanel.tsx` (Intégration Jauge Realtime)
