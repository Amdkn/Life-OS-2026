# PRD-031 — Distillation des Projets Picard V2 vers Life OS

## 1. Valeur et Remplacement
- **Origine V2 :** `ASpace_OS_V2/20_Life_OS/24_PARA_Enterprise/01_Projects_Picard` (485 000+ fichiers, 10,7 Go dont 98% de `node_modules`).
- **Obstacle dans Life OS :** Dashboard PARA affichant 0 Projets actifs dans `127.0.0.1:4444` alors que 9 initiatives majeures existent (OMK, ABC OS, RILCOT, Alikaly Bana, Marina Cleaning, ClaudeClaw, OMK Services).
- **Remplacement :** Importer les métadonnées et manifests doctrinaux distillés des 9 projets Picard dans `useParaStore` et IndexedDB sans copier les dépendances lourdes (`node_modules`).

## 2. Périmètre et Implémentation
- Seed structuré des 9 Projets Picard dans `fw-para.store.ts` :
  1. `PRJ-PICARD-01` : OMK Business OS (B2/B3 Core).
  2. `PRJ-PICARD-02` : ABC OS & Child Care BOS (Franchise).
  3. `PRJ-PICARD-03` : RILCOT Members Space OS.
  4. `PRJ-PICARD-04` : Alikaly Bana Holding to LLC.
  5. `PRJ-PICARD-05` : Marina Cleaning BOS & SOP.
  6. `PRJ-PICARD-06` : Cerritos Plane Onboarding.
  7. `PRJ-PICARD-07` : ClaudeClaw Agent & Mission Control.
  8. `PRJ-PICARD-08` : Graphify Out Context Graphs.
  9. `PRJ-PICARD-09` : OMK Services BOS.
- Alignement sur les 8 piliers business (Growth, Ops, Product, Finance, People, IT, Legal, Meta) et les domaines Life Wheel.

## 3. Acceptation Fonctionnelle
- Affichage immédiat des projets dans l'onglet **PROJECTS** et mise à jour du KPI **Active Projects** sur le Dashboard PARA.
- Tests fonctionnels exécutés : `npm run lint` et `npm run build` (0 erreur).
