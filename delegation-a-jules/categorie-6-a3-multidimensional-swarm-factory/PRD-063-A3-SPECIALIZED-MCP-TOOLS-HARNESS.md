# PRD-063: A3 Specialized MCP Tools Harness

## Objectif
Relier les agents A3 à leur boîte à outils technique via le protocole MCP (Model Context Protocol).

## Spécifications
- Créer src/services/mcp/a3-mcp-client.ts.
- Connecter les outils :
  - HoldingStripeTool (pour Bucky/Finance Thunderbolts).
  - WebAuditPlaywrightTool (pour Rocket/Automation Guardians).
  - DocumentParserTool (pour Mariner/Inbox Cerritos).
  - LinearSyncTool (pour l\'équipe Swarm globale).
- Valider avec 
pm run build et 	sc --noEmit.
