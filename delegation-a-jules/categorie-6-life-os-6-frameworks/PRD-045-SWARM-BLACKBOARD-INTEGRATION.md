# PRD-045: Pont Unifié Frameworks vers Blackboard & Linear

## Objectif
Relier l\'état des 6 Frameworks au Blackboard local SQLite et aux synchronisations Linear Swarm Teams.

## Spécifications
- Créer src/apps/frameworks/services/frameworks-blackboard-bridge.ts.
- Mettre à jour automatiquement le statut des vaisseaux et des agents dans l\'état partagé du Blackboard.
- Générer les métriques de santé des 6 frameworks pour l\'assistant overlay.
- Valider avec 
pm run build et 	sc --noEmit.
