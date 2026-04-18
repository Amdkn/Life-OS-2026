# PRD: V0.7.4 La Machine à États & La Vue Engage

## 1. En-tête (TVR)
*   **Faisabilité (T)** : Haute. Refactoring du `Dashboard.tsx` monolithique en composants spécialisés.
*   **Valeur (V)** : Majeure. Boimler nettoie, Freeman cible. Un tableau de bord propre rassure l'esprit.
*   **Réutilisabilité (R)** : Standardisation de sélecteurs Zustand performants.

## 2. User Stories (Phase D)

*   **US-111 [Vue Clarify]** : "Je dispose d'une vue 'Clarify' où les tâches `inbox` sont présentées une à une. Pour chacune, je peux décider si elle est actionnable, et si oui, lui affecter un temps estimé, un contexte (`@WORK`, etc.) et la basculer en `status: 'actionable'`."
*   **US-112 [Vue Engage - Target Lock]** : "La vue 'Engage' n'affiche stricto-sensu QUE les actions prêtes (`status === 'actionable'`)." 
*   **US-113 [Filtres Rapides Engage]** : "Dans cette vue Engage, j'ai des pilules de filtrage pour restreindre la vue au contexte actif, garantissant que je n'ai sous les yeux que ce que je peux accomplir ici et maintenant."

## 3. Garde-Fous (Anti-Patterns)
| Anti-Pattern ❌ | Décision Architectural ✅ |
| :--- | :--- |
| `items.filter(...)` dans les vues | Déclarer les filtres EN DEHORS des sélecteurs Zustand `useGtdStore()` pour ne pas relancer l'Infinite Loop. |
| Tout afficher partout | La séparation Clarify / Organize / Engage est stricte. Inbox ne se mélange pas avec Actionable. |

## 4. Fichiers Impactés
*   `src/apps/gtd/pages/ClarifyView.tsx` (NOUVEAU)
*   `src/apps/gtd/pages/EngageView.tsx` (NOUVEAU)
*   `src/apps/gtd/pages/Dashboard.tsx` (Épuré en mode Overview strict)
