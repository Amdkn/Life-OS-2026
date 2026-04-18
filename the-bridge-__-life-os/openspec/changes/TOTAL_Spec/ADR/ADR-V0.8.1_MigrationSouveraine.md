# ADR-V0.8.1 — La Migration Souveraine (Zero's Engineering)

## 1. Contexte & Problème
Le module DEAL fonctionne avec des `SEED_MUSES` statiques et persistés localement (`zustand/middleware persist`). Les Muses ne survivent pas à une purge du navigateur et ne peuvent pas être intégrées aux metrics globales du vaisseau A'Space OS.

## 2. Décisions (LdRouter Migration)

### 2.1 Nouvelle Architecture IDB
Remplacer le layer de persistance par le standard de l'OS : `ld-router.ts`.
Nous allons réserver 2 domaines logiques pour DEAL :
*   `Collection : deal_items`, `Domaine : ld06` (Pour les frictions)
*   `Collection : muses`, `Domaine : ld06` (Pour les drones autonomes)

### 2.2 Stratégie d'Hydratation
Au boot de DealApp, un double appel `ldRouter.getAllItems()` chargera simultanément les items (Frictions) et les muses. Le store Zustand maintiendra ces 2 tableaux réactifs.

## 3. Conséquences & Isolation
*   Isolation totale et pérennité: L'économie de l'OS est sauvegardable (Export Base64 du `ld06`).
*   L'effacement des SEED datas oblige le Commandant à redéfinir ses vraies Muses (Reset Économique).

## 4. Étapes DDD (A3)
*   **Étape A** : Ajouter `loading` states et `loadFromDB` dans `fw-deal.store.ts`.
*   **Étape B** : Mettre à jour `addItem` et `createDefinitionFromText` pour inclure les `saveItem`.
*   **Étape C** : Appeler `loadFromDB` dans l'Entry Point.
