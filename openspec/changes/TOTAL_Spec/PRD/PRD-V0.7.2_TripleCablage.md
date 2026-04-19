# PRD: V0.7.2 Le Triple Câblage (Nexus Final)

## 1. En-tête (TVR)
*   **Faisabilité (T)** : Haute. Modification de Type et intégration de selects optionnels.
*   **Valeur (V)** : Majeure. Transforme GTD d'une ToDo list à l'exécuteur absolu de PARA et 12WY. L'alignement est physique.
*   **Réutilisabilité (R)** : Le composant `GTDItem` pourra alimenter les vues de n'importe quel composant de l'OS.

## 2. User Stories (Phase B)

*   **US-105 [Typage Nexus]** : "En tant qu'Architecte, je mets à jour l'interface `GTDItem` dans `fw-gtd.store.ts` en y ajoutant les champs optionnels `projectId`, `goalId`, et `tacticId`."
*   **US-106 [Routage à l'organisation]** : "Dans la vue Organize, lorsque je traite une tâche `actionable`, j'ai la possibilité, via des menus déroulants, de l'attacher à un Projet PARA actif, ou à un Goal/Tactic 12WY."
*   **US-107 [Feedback Visuel]** : "Dans toutes les vues GTD (Inbox, Organize, Engage), si une tâche est rattachée, un petit badge (ex: [PARA] ou [12WY]) indique son appartenance pour contexte visuel immédiat."

## 3. Garde-Fous (Anti-Patterns)
| Anti-Pattern ❌ | Décision Architectural ✅ |
| :--- | :--- |
| Enregistrer le titre du projet dans GTDItem | Enregistrer UNIQUEMENT `projectId`. Utiliser Zustand (Résolution Paresseuse) pour afficher son nom à l'écran. |
| Forcer le rattachement à la capture | L'OmniCapture doit être instantanée. Le rattachement au Nexus se fait plus tard, lors du passage dans "Organize". |

## 4. Fichiers Impactés
*   `src/stores/fw-gtd.store.ts` (Modèle de données)
*   `src/apps/gtd/pages/Dashboard.tsx` (Partie Organize)
