# PRD-045: Pont Unifié Frameworks vers Blackboard & Linear

## Objectif
Relier l'état des 6 Frameworks au Blackboard local SQLite et aux synchronisations Linear Swarm Teams.

## Spécifications
- Créer src/apps/frameworks/services/frameworks-blackboard-bridge.ts.
- Mettre à jour automatiquement le statut des vaisseaux et des agents dans l'état partagé du Blackboard.
- Générer les métriques de santé des 6 frameworks pour l'assistant overlay.
- Validation obligatoire : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build`.

## Correctif de délégation (audit 2026-09-12)

> Contrat commun : [`../CONTRAT-COMMUN.md`](../CONTRAT-COMMUN.md) (cree par le parent — lecture obligatoire avant toute execution).
### Dependances PRD
- **Depend de PRD-052** (moteur Blackboard) et de **PRD-011 (cat. 1, proprietaire du schema)** — ce PRD ne definit aucune table.
- Consomme PRD-041 pour les types vaisseaux/agents.

### Frontiere structurelle (contrat commun)
- Le Blackboard SQLite est un **service local (processus Node)** ; le navigateur ne parle jamais SQLite natif. Ce pont passe par l'API du service. IndexedDB (PRD-042/043) reste le store navigateur : les deux plans coexistent, aucun ne remplace l'autre par decret.

### Criteres d'acceptation
- Positifs : lint+build ; un statut de vaisseau modifie cote UI apparaît dans le Blackboard via le service ; les metriques de sante sont calculees depuis l'etat reel.
- Negatifs : aucun secret dans le bundle navigateur ; un seul canal d'ecriture (le service, pas d'ecriture directe concurrente) ; pas de boucle de rafraichissement infinie UI <-> service.

### Idempotence / persistance / reprise
- Mises a jour idempotentes clee par (vaisseau, agent, horodatage) ; apres coupure du service, resynchronisation complete depuis l'etat partage, jamais un delta corrompu ; rollback code = `git checkout` du bridge.
