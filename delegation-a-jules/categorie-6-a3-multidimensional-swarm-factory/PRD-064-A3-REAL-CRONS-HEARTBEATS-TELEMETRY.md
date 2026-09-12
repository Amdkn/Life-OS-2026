# PRD-064: A3 Real Crons & Heartbeats Telemetry

## Objectif
Remplacer les 32 crons fictifs de l\'ancien mock (MOCK_CRONS) par les véritables cadences d\'exécution des agents A3.

## Spécifications
- Créer src/services/telemetry/a3-cron-dispatcher.ts.
- Enregistrer les crons vivants :
  - Télémétrie 60s (Yas / Kernel Core).
  - Revue hebdomadaire Wx (Tendi & River Song).
  - Audit d\'homéostasie cognitive (Hugh Culber & Rory).
  - Distillation incrémentale 50_ (Graham & Rick).
- Stocker les exécutions dans le store SQLite/IndexedDB.
- Valider avec 
pm run build et 	sc --noEmit.
