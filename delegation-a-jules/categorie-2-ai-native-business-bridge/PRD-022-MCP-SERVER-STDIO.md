# PRD-022 — Serveur MCP STDIO natif pour Life OS


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-021 (le catalogue d'outils est le même registre — PRD-021 le crée, MCP l'expose) ; PRD-011 (`life_os_blackboard_post` écrit dans le service blackboard, schéma propriétaire PRD-011).

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : aucun `mcp/` au 2026-09-12 ; **`@modelcontextprotocol/sdk` ABSENTE de package.json** — la déclarer explicitement comme dépendance à ajouter, ne pas la présenter comme installée.
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** `node mcp/server.mjs` répond au handshake `initialize` JSON-RPC 2.0 ; `life_os_get_tactics`/`update_tactic`/`get_wheel_domains`/`blackboard_post` répondent ; stdout propre.

**Critères d'acceptation négatifs (doivent rester vrais) :** aucun console.log applicatif sur stdout (logs sur stderr uniquement) ; aucun secret dans `mcp.json` (le descripteur est committé) ; pas d'outils d'écriture destructeurs non validés ; le serveur ne lit pas le disque privé hors repo.

**Sécurité / isolation / idempotence / persistance :** stdio local = processus enfant de confiance mais pas une API réseau : ne pas ajouter de port TCP ouvert ; payloads validés côté serveur ; idempotence de `update_tactic` par tacticId.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** suppression de `mcp/` sans impact sur l'app ; `mcp.json` retiré de la config Antigravity si rollback.

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
