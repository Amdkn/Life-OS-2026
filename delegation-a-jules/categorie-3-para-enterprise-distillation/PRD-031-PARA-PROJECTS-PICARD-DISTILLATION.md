# PRD-031 — Distillation des Projets Picard V2 vers Life OS


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-032 (areas rattachées aux projets) ; PRD-033 (resources liées aux projets) ; PRD-034 (cycle de vie active/archived) ; PRD-035 (export RDF de ces mêmes projets — un seul store source).

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : `src/stores/fw-para.store.ts`, `src/hooks/useParaProjects.ts`, `src/utils/paraAdapter.ts` (vérifiés).
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** 9 projets visibles dans l'onglet PROJECTS ; KPI Active Projects mis à jour ; IDs PRJ-PICARD-01..09 stables et réimportables sans doublon.

**Critères d'acceptation négatifs (doivent rester vrais) :** aucune donnée du corpus privé copiée (manifests distillés seulement, sans secrets ni contenus clients) ; le chiffre « 9 initiatives » cité dans le texte en liste 7 noms (OMK, ABC OS, RILCOT, Alikaly Bana, Marina Cleaning, ClaudeClaw, OMK Services) pour 9 IDs — la liste des 9 IDs fait foi ; aucun projet fantôme au-delà des 9.

**Sécurité / isolation / idempotence / persistance :** pas de secrets clients dans les métadonnées de seed ; isolation par domaine Life Wheel conservée ; idempotence du seed par ID.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** seed additif : rollback = retirer le module de seed et vider les enregistrements marqués PRJ-PICARD-* ; les projets créés par l'utilisateur ensuite restent.

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
