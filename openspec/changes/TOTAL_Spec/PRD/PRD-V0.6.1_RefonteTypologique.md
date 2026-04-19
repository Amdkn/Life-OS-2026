# PRD: V0.6.1 Destruction du Mirage (Refonte Typologique & DB)

## 1. En-tête (TVR)
*   **Faisabilité (T)** : Modérée. Nécessite d'effacer les anciens seed data qui servaient à faire tourner l'interface actuelle et de casser potentiellement l'UI le temps de la reconstruction.
*   **Valeur (V)** : Fondamentale. Sans une structure de données correcte, le framework 12WY n'a aucun sens méthodologique.
*   **Réutilisabilité (R)** : La mécanique d'agrégation d'une "Vision" vers des "Objectifs" vers des "Tactiques" est au coeur du système de planification.

## 2. User Stories (Phase A - Écriture Typologique)

*   **US-74 [Trinité Temporelle]** : "En tant que Commandant, l'application 12WY ne me force plus à entrer de vagues "Goals". J'ai des onglets ou zones claires pour l'Aspiration à 3 Ans (`WyVision`), mes 2 à 3 Objectifs du Trimestre (`WyGoal`), et mes Tactiques d'Exécution hebdomadaires (`WyTactic`)."
*   **US-75 [Affectation Hebdomadaire]** : "En tant que Soldat de l'exécution, toute création de `WyTactic` m'oblige à l'assigner manuellement à une ou plusieurs "Weeks" spécifiques (W1 à W12)."
*   **US-76 [Persistance Temporelle]** : "En tant qu'Architecte, les données du 12WY sont désormais inscrites au fer rouge dans une table IndexedDB système via le LD-Router, survivant aux clear de cache."

## 3. Garde-Fous (Anti-Patterns)
| Anti-Pattern ❌ | Décision Architectural ✅ |
| :--- | :--- |
| Garder le type générique "Goal" | Créer stricto-sensu les 3 types TypeScript `WyVision`, `WyGoal`, `WyTactic`. |
| Laisser tourner le vieux localStorage | Supprimer `persist` de zustand pour `fw-12wy`. Câbler sur `ld-router.ts`. |

## 4. Fichiers Impactés
*   `stores/fw-12wy.store.ts` (Nouveaux Types, Refactoring du Create)
*   `apps/twelve-week/pages/VisionTable.tsx` (UI de création WyVision / WyGoal)
*   `apps/twelve-week/pages/TacticsBoard.tsx` (UI de création WyTactic affectée à des semaines)
