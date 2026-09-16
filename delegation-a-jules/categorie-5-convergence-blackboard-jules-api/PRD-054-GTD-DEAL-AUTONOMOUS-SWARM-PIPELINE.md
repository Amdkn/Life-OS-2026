# PRD-054: Pipeline Autonome Swarm GTD Cerritos & DEAL Protostar

## Objectif
Fusionner la capture GTD (Mariner/Boimler) avec la matrice d'élimination et d'automatisation DEAL (Dal/Rok-Tahk/Zero/Gwyn) pour réduire la friction de charge cognitive de l'opérateur.

## Spécifications
- Créer src/apps/frameworks/pipelines/GtdDealSwarmPipeline.tsx.
- Système de tri automatique : chaque item entrant dans GTD Inbox est qualifié par l'agent A1 Beth, puis routé soit vers l'automatisation DEAL, soit vers une tâche tactique 12WY.
- Télémétrie d'économie de temps et de tokens affichée en direct.
- Validation obligatoire : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build`.

## Correctif de délégation (audit 2026-09-12)

> Contrat commun : [`../CONTRAT-COMMUN.md`](../CONTRAT-COMMUN.md) (cree par le parent — lecture obligatoire avant toute execution).
### Dependances PRD
- Depend de **PRD-052** (verrous Blackboard), **PRD-062** (gates A3) et **PRD-051** (declenchement Jules eventuel). Consomme PRD-041 (rosters Cerritos/Protostar).

### Telemetrie (bloquant)
- « Economie de temps et de tokens affichee en direct » : **valeurs mesurees uniquement**. Tokens = consommations reelles si l'API les expose ; temps = durees reelles horodatees. Toute estimation est libellee « estimation » ; a defaut de donnee, la tuile affiche « non mesure ». Pas de telemetrie fictive.

### Autonomie bornee
- Le tri et les actions réversibles dans le mandat sont automatiques avec reçu et condition d'arrêt. Les délégations autorisées passent par PRD-051/056 ; aucun appel direct depuis la vue. Seules une portée nouvelle ou une opération irréversible nécessitent un arbitrage distinct : pas d'approbation humaine obligatoire par item.

### Criteres d'acceptation
- Positifs : lint+build ; un item qualifie est route vers DEAL/12WY exactement une fois (idempotent au rejeu) ; telemetrie = mesures reelles ou « non mesure ».
- Négatifs : pas de double routage, d'exécution hors mandat ou de statut simulé ; ne pas exiger une nouvelle approbation pour chaque action réversible déjà autorisée.

### Persistance / reprise
- Routages traces dans `action_receipts` (PRD-052) ; une erreur de routage se corrige en reclassant l'item (jamais supprime) ; rollback code = `git checkout`.
