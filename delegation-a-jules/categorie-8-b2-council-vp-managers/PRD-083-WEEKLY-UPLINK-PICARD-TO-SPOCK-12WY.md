# PRD-083: Weekly Uplink Engine (Picard to Spock Areas & 12WY)

## Correctif de délégation (audit 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (C7-9).

- **Dépendances PRD réelles** : données existantes mesurées — `fw-para.store.ts` (Picard/Areas), `fw-12wy.store.ts` et `src/types/twelve-week.ts` (moteur 12WY). Ce PRD **réutilise** ces sources : pas de second moteur 12WY, pas de re-définition de PARA. Cadence : PRD-092 (cat 9) est le propriétaire du `B3CronScheduler` — la cloture hebdomadaire s'y enregistre au lieu de créer un setInterval React.
- **Risque mesuré** : « scanner les taches achevees » n'a de sens que sur les stores existants ; le PRD initial ne les nomme pas — désormais nommés ci-dessus.
- **Write_scope (chemins concrets)** : `src/services/temporal/weekly-uplink-engine.ts` (dossier à créer), `src/services/temporal/uplink-types.ts`. Interdiction de modifier `fw-para.store.ts`, `fw-12wy.store.ts`, `src/types/twelve-week.ts`.
- **Critères positifs** : à la cloture de semaine, l'engine lit les stores PARA/12WY, produit une promotion d'assets durables vers les Areas correspondantes avec journal de promotion, calcule le score 12WY depuis les données réelles du store (objectif > 85%), archive Wx et initialise Wx+1 ; `npm run lint` + `npm run build` à 0 erreur.
- **Critères négatifs** : aucun setInterval/chrono dans React (cadence = cron côté service, PRD-092) ; pas de promotion si la tâche source n'est pas réellement achevée ; pas de score affiché si les données sources sont vides — état « semaine vide » explicite, pas de 85% fictif ; pas de modification silencieuse des stores existants (écriture via leurs API publiques uniquement).
- **Sécurité & isolation** : le scan lit des données locales de productivité, aucune donnée ne sort du poste ; pas de secret.
- **Idempotence & persistance** : relancer une cloture Wx ne double-promote pas (clé idempotence semaine + tâche) ; l'archive hebdo persiste côté blackboard SQLite service (schéma PRD-011, consommation PRD-052) — le store fw-12wy reste la vue UI, pas la source d'archive.
- **Reprise / rollback non destructif** : l'archivage est additif (snapshot Wx, jamais écrasement du live) ; rollback = désenregistrement du cron + retrait du service, snapshots conservés.

## Objectif
Assurer la consolidation hebdomadaire automatique reliant les projets actifs de Picard (01_Projects_Picard) aux domaines de continuite de Spock (02_Areas_Spock) conformement au cycle 12WY.

## Specifications
- Creer src/services/temporal/weekly-uplink-engine.ts.
- A chaque cloture de semaine :
  - Scanner les taches et projets acheves dans Picard (via fw-para.store.ts).
  - Promouvoir les assets durables dans les Areas correspondantes de Spock.
  - Calculer le score d execution 12WY (objectif > 85%) depuis fw-12wy.store.ts.
  - Archiver la semaine Wx et initialiser la semaine Wx+1.
- Valider avec npm run lint (tsc --noEmit) et npm run build.