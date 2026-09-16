# PRD-064: A3 Real Crons & Heartbeats Telemetry

## Objectif
Remplacer les 32 crons fictifs de l'ancien mock (MOCK_CRONS) par les véritables cadences d'exécution des agents A3.

## Spécifications
- Créer src/services/telemetry/a3-cron-dispatcher.ts.
- Enregistrer les crons vivants :
  - Télémétrie 60s (Yas / Kernel Core).
  - Revue hebdomadaire Wx (Tendi & River Song).
  - Audit d'homéostasie cognitive (Hugh Culber & Rory).
  - Distillation incrémentale 50_ (Graham & Rick).
- Stocker les exécutions dans le store SQLite/IndexedDB.
- Validation obligatoire : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build`.

## Correctif de délégation (audit 2026-09-12)

> Contrat commun : [`../CONTRAT-COMMUN.md`](../CONTRAT-COMMUN.md) (cree par le parent — lecture obligatoire avant toute execution).
### Dependances PRD
- Crons **cote service Node persistant** : `setInterval` dans React n'est pas un cron (mort a la fermeture de l'onglet). Le dispatcher vit dans le service ; l'UI n'en est que la vue (PRD-065).
- Persistance des executions dans le Blackboard SQLite (PRD-052 / PRD-011) — IndexedDB eventuel = cache de lecture seulement.

### Remplacement du mock (mesure)
- Si `MOCK_CRONS` existe encore dans `src/` au moment de l'execution, son retrait fait partie du perimetre ; sinon, a ne pas recreeer.

### Cadences (specifiees)
- Telemetrie 60 s (Yas / Kernel Core) ; revue hebdomadaire Wx (Tendi & River Song) ; audit d'homeostasie cognitive (Hugh Culber & Rory) ; distillation incrementale 50_ (Graham & Rick). Chaque cron : verrou (PRD-052) contre le chevauchement, jitter leger, preuve horodatee `America/New_York`.

### Criteres d'acceptation
- Positifs : lint+build ; chaque execution laisse un enregistrement date dans le Blackboard ; un cron rate est rattrape ou marque `missed` — jamais pretendu execute.
- Negatifs : pas de cron fictif residuel ; pas de telemetrie fabriquee ; pas de double execution au rejeu.

### Reprise / rollback
- Apres coupure du service : reprise depuis le dernier etat persiste (pas de rejeu complet) ; rollback code = `git checkout`, donnees conservees.
