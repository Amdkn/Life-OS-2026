# PRD: V0.6.3 Le Nexus Temporel (PARA ↔ 12WY & Time Use)

## 1. En-tête (TVR)
*   **Faisabilité (T)** : Moyenne. Requiert des interactions cross-stores avec PARA et une UI d'agencement temporelle pour le Time Use.
*   **Valeur (V)** : Majeure. Empêche le désalignement total ("Faire des projets qui ne contribuent à aucun Objectif Trimestriel").
*   **Réutilisabilité (R)** : Les connecteurs seront standardisés avec la méthode V0.5.2 (Pont Ikigai).

## 2. User Stories (Phase C - Alignement d'Exécution)

*   **US-80 [Liaison PARA (Projet) vers 12WY (Target)]** : "En tant que Commandant dans ma "Project Command Card" PARA, j'ai une section "12WY Alignment" qui me permet de lier ce Projet à un `WyGoal` spécifique du trimestre actuel. Un projet orphelin doit afficher une petite mention 'Unlinked Context'."
*   **US-81 [La Frontière Tactique/Action]** : "Dans la vue détaillée d'une Tactique (12WY), je peux voir (lecture Bottom-Up) les projets PARA liés au `WyGoal` parent, pour me rappeler *où* je dois aller travailler."
*   **US-82 [Discipline Time Use]** : "En tant que Soldat sur le Dashboard de ma 'Semaine Active' (12WY), l'OS m'alloue visuellement 3 blocs de temps. Un grand formulaire ou zone me permet de planifier intentionnellement mes créneaux pour le *Strategic Block* (3h Ininterrompues sur le futur), le *Buffer Block* (Administration 1-2h/jr), et le *Breakout Block* (Détachement long). Je dois pouvoir cocher que je les ai respectés.

## 3. Garde-Fous (Anti-Patterns)
| Anti-Pattern ❌ | Décision Architectural ✅ |
| :--- | :--- |
| Déléguer les micro-tâches (Todo) au 12WY | C'est le boulot de GTD (V0.7). Le 12WY ne contient QUE la "Tactique" (ex: "Développer V0.6"). |
| Supprimer en Cascade (Hard Delete) | Un `WyGoal` supprimé met simplement le `twelveWeekGoalId` du Projet PARA à `undefined`. Pas de Delete Cascade destructeur. |

## 4. Fichiers Impactés
*   `stores/fw-para.store.ts` (Ajout champ `wyGoalId`)
*   `apps/para/components/GoalAligner.tsx` (Similaire à VisionAligner pour 12WY)
*   `stores/fw-12wy.store.ts` (Ajout type `WyTimeBlock` pour stocker les intentions de blocs hebdomadaires)
*   `apps/twelve-week/components/TimeUseMatrix.tsx` (Nouvelle UI Time Blocking)
