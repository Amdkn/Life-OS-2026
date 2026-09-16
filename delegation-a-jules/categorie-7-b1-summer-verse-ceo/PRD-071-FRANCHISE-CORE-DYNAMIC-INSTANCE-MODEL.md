# PRD-071: Franchise Core Engine & Dynamic Instance Model

## Correctif de délégation (audit 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (cartographie C7-9) — ce PRD est le socle B1 des catégories 7-9.

- **Dépendances PRD réelles** : aucune en amont (socle). Sont dépendants de PRD-071 : PRD-072, PRD-073, PRD-074, PRD-075 (cat 7) et PRD-084 (bus cat 8). Ne pas lancer les dépendants avant l'intégration de ce socle.
- **Write_scope (chemins concrets)** : `src/types/franchise.ts` (création), `src/services/franchise/franchise-factory.ts` (création — le PRD initial ne fixe pas de chemin ; `src/services/` existe, seul `migration.service.ts` y vit). Interdiction de toucher `src/types/twelve-week.ts`, `src/stores/*` et les apps existantes.
- **Critères positifs** : `npm run lint` (= `tsc --noEmit`, ce n'est pas une suite de tests) et `npm run build` à 0 erreur ; interface `FranchiseInstance` avec exactement les 4 IDs déclarés ; la factory instancie une instance à partir de son id et expose `activeModules` typés (billing, member_portal, field_ops, holding_ledger).
- **Critères négatifs** : aucune donnée réelle des sociétés ABC/RILCOT/Alikaly/Marina dans le repo front — la factory ne charge que des définitions de configuration ; aucune télémétrie fictive ; aucune clé/API dans les constantes ; pas d'écriture dans un store existant.
- **Sécurité & isolation** : `b1Config` ne transporte aucun secret ; les franchises sont isolées par type discriminé, pas par branches de `any` ; rien côté navigateur ne décide de la ventilation financière (voir PRD-073).
- **Idempotence & persistance** : le modèle est pur (types + factory déterministe) ; pas de persistance ici. La persistance de gouvernance relève du blackboard SQLite côté service — propriétaire du schéma : PRD-011 (cat 1) ; consommation : PRD-052 (cat 5). Ne pas créer un second schéma, et ne pas décréter que DomainDB/IndexedDB navigateur remplace le service.
- **Reprise / rollback non destructif** : fichiers exclusivement nouveaux, sans fusion avec des modules existants ; rollback = suppression des 2 fichiers créés, sans impact sur le shell.
- **Correction de typo** : commandes de validation re-rondes (`npm run build`, `tsc --noEmit`) ; le libellé « tsc --noEmit » seul est accepté uniquement via `npm run lint`.

## Objectif
Creer le modele generique de franchise permettant d executer ABC, RILCOT, Alikaly et Marina a partir d une architecture unique, en eliminant les 4 codebases disparates.

## Specifications
- Definir src/types/franchise.ts avec l interface FranchiseInstance :
  - id: 'abc_childcare' | 'rilcot' | 'alikaly_holding' | 'marina_cleaning'.
  - b1Config: North Star (1Y/3Y/10Y), 12WY Cycles de commandement.
  - activeModules: Array de modules actives (billing, member_portal, field_ops, holding_ledger).
  - b2Gates: Matrice des portes de graduation de projets.
- Factory de chargement dynamique src/services/franchise/franchise-factory.ts (FranchiseFactory.ts).
- Valider avec npm run lint (tsc --noEmit) et npm run build.