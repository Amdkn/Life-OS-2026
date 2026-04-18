# PRD: V0.8.1 La Migration Souveraine (Zero's Engineering)

## 1. En-tête (TVR)
*   **Faisabilité (T)** : Haute. Mêmes manipulations que pour GTD ou PARA. Un standard.
*   **Valeur (V)** : Critique. Sans cela, un Empire de Flottes n'est qu'un cookie effaçable.
*   **Réutilisabilité (R)** : Routage Base64 standardisé.

## 2. User Stories (Phase A)

*   **US-114 [Refonte Persistance DEAL]** : "En tant que Mainteneur Système, le store DEAL n'utilise plus Zustand `persist`. Il expose une méthodologie `loadFromDB` appelée au démarrage par l'app racine `DealApp.tsx`."
*   **US-115 [Sauvegarde Asynchrone]** : "Les actions de création d'Item DEAL (Frictions) et de Muses sont immédiatement sauvegardées en IndexedDB via `ldRouter.saveItem`."
*   **US-116 [Clean Slate]** : "Je ne veux plus voir de fausses données (Comme la '*Neural API Subscription*'). L'espace est vide, tant que je n'ai rien documenté."

## 3. Garde-Fous (Anti-Patterns)
| Anti-Pattern ❌ | Décision Architectural ✅ |
| :--- | :--- |
| Tout mettre dans la même table | Créer 2 entités distinctes pour `ld-router` (ex: `deal_items` et `muses`) sous le domaine `ld06`. |

## 4. Fichiers Impactés
*   `src/stores/fw-deal.store.ts`
*   `src/apps/deal/DealApp.tsx` (Hydratation)
