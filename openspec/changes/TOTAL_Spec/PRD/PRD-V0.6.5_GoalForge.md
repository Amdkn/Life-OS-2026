# PRD: V0.6.5 La Forge d'Objectif (Una's Console)

## 1. En-tête (TVR)
*   **Faisabilité (T)** : Modérée. Nécessite d'appeler `useParaStore` pour extraire les projets et potentiellement gérer l'auto-commission (création croisée si le projet n'existe pas).
*   **Valeur (V)** : Fondamentale. Un but sans projet n'est qu'un souhait. Ce composant oblige le commandant à assumer ses objectifs trimestriels dans le réel (PARA).
*   **Réutilisabilité (R)** : Formulaire complexe servant de modèle pour le Nexus Temporel/Exécutif.

## 2. User Stories (Phase B - Una's Console)

*   **US-86 [Console Objectif]** : "En tant que Planificateur, lorsque je clique sur `+ New Goal` sous une Vision, la 'Goal Forge Modal' s'ouvre. Ce composant est context-aware, il connaît la `Vision` parente sur laquelle j'ai cliqué."
*   **US-87 [Saisie Simple]** : "Je peux d'abord saisir le titre du mib Objectif Trimestriel, et sélectionner le numéro de la semaine cible (Target Week 1-12) via de petits boutons ou un slider."
*   **US-88 [Nexus PARA Strict]** : "La Modale liste les projets PARA actifs dans l'OS. L'interface doit m'inciter fortement à lier un projet existant à cet objectif (`projectId`)."
*   **US-89 [Auto-Commission : Création de Projet à la volée]** : "Si mon objectif est nouveau, un bouton rapide `+ Inject Project in PARA` dans la modale me permet de générer à la volée un projet dans PARA (avec le même titre) et de le lier automatiquement, sans que je n'ai à quitter le 12WY."

## 3. Garde-Fous (Anti-Patterns)
| Anti-Pattern ❌ | Décision Architectural ✅ |
| :--- | :--- |
| Devoir switcher d'App pour lier un projet | Le flux 'Auto-Commission' permet de rester dans la Modale 12WY et d'effectuer la mutation PARA via `useParaStore.getState().addProject`. |
| Perte de Focus | Protéger le champ de texte `autoFocus`. |

## 4. Fichiers Impactés
*   `apps/twelve-week/TwelveWeekApp.tsx` / `GoalTable.tsx` (Remplacement du Prompt)
*   `apps/twelve-week/components/GoalForgeModal.tsx` (NOUVEAU - Component + Logique Croisée)
