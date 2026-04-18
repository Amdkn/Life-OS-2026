# PRD: V0.7.1 La Loi de la Persistance (Rutherford)

## 1. En-tête (TVR)
*   **Faisabilité (T)** : Haute. Le pattern d'hydratation / synchronisation IndexedDB via `ld-router.ts` est connu et déjà implémenté dans PARA et 12WY.
*   **Valeur (V)** : Critique. Sans cela, tout ajout de tâche disparaît à l'effacement du LocalStorage ou à la navigation inter-domaines lourde.
*   **Réutilisabilité (R)** : Standardisation du Data Layer.

## 2. User Stories (Phase A)

*   **US-102 [Hydratation GTD]** : "En tant qu'Agent A3, je retire le middleware `persist` du fichier `fw-gtd.store.ts`. J'implémente un cycle de vie d'hydratation (au boot de l'application ou montage du composant) qui va lire la collection `actions` via le `ld-router`."
*   **US-103 [Purge des Hologrammes]** : "En tant qu'Utilisateur, je ne veux plus voir 'Design Neural Bridge' (SEED_ITEMS) quand j'arrive la première fois. L'inbox doit être vide par défaut, à moins qu'elle ne soit remplie depuis IndexedDB."
*   **US-104 [Synchronisation Bidirectionnelle]** : "Toute modification (Ajout de tâche, changement de statut, purge) déclenche la sauvegarde JSON sérialisée vers IndexedDB, garantissant l'état."

## 3. Garde-Fous (Anti-Patterns)
| Anti-Pattern ❌ | Décision Architectural ✅ |
| :--- | :--- |
| Garder `persist` avec IndexedDB | Utilisation stricte de l'architecture d'actions de `ld-router.ts` (comme dans `fw-para.store` avec `loadFromDB` et l'appel de `ldRouter.saveItem()`). |

## 4. Fichiers Impactés
*   `src/stores/fw-gtd.store.ts` (Remplacement LdRouter vs persist)
