# PRD: V0.8.3 Le Réveil du Pipeline D-E-A-L

## 1. En-tête (TVR)
*   **Faisabilité (T)** : Basique. Remplacement des fausses actions par de véritables actions de mise à jour.
*   **Valeur (V)** : Haute. Permet enfin d'utiliser l'interface Kanban de Deal.
*   **Réutilisabilité (R)** : Méthodologie CRUD standard.

## 2. User Stories (Phase C)

*   **US-119 [Mobilité des États]** : "Dans le store de DEAL, j'ai une action `updateDealItem(id, patch)` me permettant de changer la phase (ex: passer en `automate`)."
*   **US-120 [Boutons de flux]** : "Dans les vues respectives de l'interface (ex: Dashboard ou liste d'items), j'ai accès à des flèches ou menus permettant de faire avancer une friction vers la phase supérieure, ou de valider la promotion finale vers 'Muse'."

## 3. Garde-Fous (Anti-Patterns)
| Anti-Pattern ❌ | Décision Architectural ✅ |
| :--- | :--- |
| Perdre un DealItem au profit d'une Muse | Dans l'implémentation existante, la création d'une Muse EFFACE l'item. Nous devons statuer : soit laisser l'item au statut `completed`, soit l'effacer mais stocker l'historique dans la Muse. On adoptera l'archivage local (status `completed`). |

## 4. Fichiers Impactés
*   `src/stores/fw-deal.store.ts`
*   Les vues listant les DealItems dans `src/apps/deal/pages/`.
