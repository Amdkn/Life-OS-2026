# PRD-022 — Serveur MCP STDIO natif pour Life OS

## 1. Valeur et Remplacement
- **Origine Business OS :** `mcp/server.mjs`, `src/lib/tooling/adapters/mcp.ts` utilisant `@modelcontextprotocol/sdk`.
- **Obstacle dans Life OS :** Les agents externes (Antigravity, Jules, Hermes) doivent sonder le code ou parser des fichiers au lieu de requêter directement Life OS via le protocole standard MCP.
- **Remplacement :** Mettre en place un serveur MCP stdio (`mcp/server.mjs`) respectant la spécification JSON-RPC 2.0 sur `stdin`/`stdout`, isolant les logs d'erreur sur `stderr`.

## 2. Périmètre et Implémentation
- Brancher le serveur MCP sur le catalogue d'outils Life OS (`src/lib/tooling/catalog/`).
- Outils exposés via MCP :
  - `life_os_get_tactics(week, cycleId)` : Récupérer les tactiques 12WY.
  - `life_os_update_tactic(tacticId, status)` : Valider ou reporter une action.
  - `life_os_get_wheel_domains()` : État des jauges Life Wheel LD01-LD08.
  - `life_os_blackboard_post(workspaceId, eventType, payload)` : Injection directe d'événements.
- Configuration du descripteur `mcp.json` pour intégration immédiate dans Antigravity.

## 3. Acceptation Fonctionnelle
- Lancement de `node mcp/server.mjs` répondant au handshake standard `initialize` JSON-RPC.
- Aucun log applicatif ou console.log ne souille `stdout`.
- Validation avec `npm run lint` et `npm run build` (0 erreur).
