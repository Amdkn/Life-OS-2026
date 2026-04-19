# ADR-V0.7.1 — La Loi de la Persistance (Rutherford)

## 1. Contexte & Problème
Le store GTD actuel (`fw-gtd.store.ts`) utilise le middleware Zustand `persist` pour stocker les actions. Cette méthode contourne le Routeur d'Idempotence (`ld-router.ts`), isole les données, limite l'espace à ~5Mo et n'offre aucune garantie de survie lors d'une réinitialisation du navigateur.

## 2. Décisions (LdRouter Migration)

### 2.1 Suppression de `persist`
L'enveloppe `persist(..., { name: 'aspace-fw-gtd-v2' })` est retirée. Le store devient un store Zustand en mémoire standard (`create<GtdState>((set) => (...))`).

### 2.2 Hydratation via LdRouter
La persistance est délocalisée. Le store expose deux nouvelles méthodes à la manière de PARA :
*   `loadFromDB()`: Appelle `ldRouter.getAllItems('actions', 'ld05')` pour hydrater l'arbre au chargement. (Note: on utilise le domaine `ld05` ou `ld-gtd`).
*   Le setter `processItem` et `addItem` intègrent désormais `ldRouter.saveItem({...})` ou `upsertItem` en parallèle de `set()`.

### 2.3 Purge Absolue
Tout `SEED_ITEMS` (données en dur de test) est définitivement banni.

## 3. Conséquences & Isolation
*   Un "Hard Refresh" (F5) rechargera parfaitement la liste d'actions sans risque de corruption liée au cache du navigateur.
*   Cela permet à n'importe quel autre agent de lire potentiellement la table `'actions'` dans IndexedDB si nécessaire.

## 4. Étapes DDD (A3)
*   **Étape A** : Adapter `ld-router.ts` si la base/type `actions` ou `ld05` n'est pas déclaré.
*   **Étape B** : Refactor `fw-gtd.store.ts` (retirer l'import `persist`).
*   **Étape C** : Câbler `loadFromDB` et ajouter les appels asynchrones `ldRouter` sur chaque variation d'état.
