# PRD-042: Ikigai & Horizons Temporels (Vaisseau Orville)

## Objectif
Afficher et manipuler la matrice Ikigai (Passion, Mission, Vocation, Profession) ainsi que les 5 Horizons temporels (H1 à H90) documentés dans la doctrine Orville.

## Spécifications
- Créer src/apps/frameworks/ikigai/IkigaiMatrixView.tsx.
- Connecter les horizons H1 (1 An), H3 (3 Ans), H10 (10 Ans), H25 (25 Ans), H90 (Solarpunk / Kardashev).
- Stocker les fiches d'alignement dans IndexedDB via le store unifié.
- Validation obligatoire : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build`.

## Correctif de délégation (audit 2026-09-12)

> Contrat commun : [`../CONTRAT-COMMUN.md`](../CONTRAT-COMMUN.md) (cree par le parent — lecture obligatoire avant toute execution).
### Dependances PRD
- Consomme le contrat roster PRD-041 (`FrameworkId`, equipage Orville).
- Fiches d'alignement : **IndexedDB navigateur** (store unifie). Aucune dependance au Blackboard SQLite service — les deux plans ne se remplacent pas (voir contrat commun) ; le pont est PRD-045.

### Correction de portee (mesuree)
- `src/apps/ikigai/` existe deja (avec `components/`). Le chemin initialement demande `src/apps/frameworks/ikigai/IkigaiMatrixView.tsx` creerait un arbre parallele : **implementer dans `src/apps/ikigai/` existant** (ex. `src/apps/ikigai/components/IkigaiMatrixView.tsx`). Pas de doublon `src/apps/frameworks/`.

### Criteres d'acceptation
- Positifs : lint+build passent ; les 4 axes Ikigai (Passion, Mission, Vocation, Profession) et les horizons H1/H3/H10/H25/H90 sont editables et persistes ; au rechargement les fiches sont retrouvees.
- Negatifs : aucune donnee de demonstration pre-remplie ; pas de telemetrie fictive ; pas d'ecriture SQLite depuis le navigateur.

### Idempotence / persistance / reprise
- Migrations IndexedDB **additives uniquement** (jamais destructives) ; rollback code = `git checkout` du composant ; les fiches utilisateur ne sont jamais purgees par le code.
