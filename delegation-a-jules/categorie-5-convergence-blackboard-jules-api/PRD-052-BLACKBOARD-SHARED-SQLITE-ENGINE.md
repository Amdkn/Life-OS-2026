# PRD-052: Moteur Blackboard SQLite Partagé

## Objectif
Remplacer les états mémoires volatils par une base SQLite locale déterministe (Blackboard) gérant le cycle de vie des intentions, des verrous (locks) et des preuves d'exécution.

## Spécifications
- Schéma SQLite : tables blackboard_items, agent_locks, vessel_states, action_receipts.
- Driver d'accès local-first (IndexedDB sous le capot dans le browser, relayé vers le bridge SQLite local).
- Gestion des verrous de concurrence pour empêcher deux agents de travailler sur le même fichier.
- Validation obligatoire : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build`.

## Correctif de délégation (audit 2026-09-12)

> Contrat commun : [`../CONTRAT-COMMUN.md`](../CONTRAT-COMMUN.md) (cree par le parent — lecture obligatoire avant toute execution).
### Dependances PRD
- **PRD-011 (cat. 1) est le PROPRIETAIRE du schema Blackboard.** PRD-052 est le **moteur/consommateur** : il reference les tables `blackboard_items`, `agent_locks`, `vessel_states`, `action_receipts` telles que definies par PRD-011 et **ne cree pas de second schema**. Toute divergence = arbitrage au contrat commun, jamais une migration locale parallele.

### Frontiere d'execution (bloquant)
- SQLite **cote service Node uniquement**. Aucun driver SQLite natif dans le bundle React. « IndexedDB sous le capot » dans le navigateur = cache/vue de lecture ; la **source de verite est le fichier SQLite du service** — les deux plans ne se remplacent pas par decret.

### Verrous
- `agent_locks` : verrou = (ressource, agent, TTL). TTL obligatoire — un crash ne doit pas verrouiller a jamais ; reprise = reprise du lock expire, non destructive.

### Criteres d'acceptation
- Positifs : lint+build ; deux ecritures concurrentes sur la meme ressource ne corrompent rien (le second agent est bloque par le lock) ; chaque action produite laisse un `action_receipts`.
- Negatifs : pas de second schema ; pas de SQLite dans le navigateur ; pas d'ecriture directe en base depuis un composant React.

### Persistance / reprise
- Fichier SQLite du service : copie de sauvegarde avant toute migration ; migrations additives uniquement ; rollback = restauration de la copie (non destructif).
