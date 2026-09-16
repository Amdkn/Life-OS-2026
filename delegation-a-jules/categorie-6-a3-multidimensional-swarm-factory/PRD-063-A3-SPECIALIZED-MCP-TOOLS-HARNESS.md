# PRD-063: A3 Specialized MCP Tools Harness

## Objectif
Relier les agents A3 à leur boîte à outils technique via le protocole MCP (Model Context Protocol).

## Spécifications
- Créer src/services/mcp/a3-mcp-client.ts.
- Connecter les outils :
  - HoldingStripeTool (pour Bucky/Finance Thunderbolts).
  - WebAuditPlaywrightTool (pour Rocket/Automation Guardians).
  - DocumentParserTool (pour Mariner/Inbox Cerritos).
  - LinearSyncTool (pour l'équipe Swarm globale).
- Validation obligatoire : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build`.

## Correctif de délégation (audit 2026-09-12)

> Contrat commun : [`../CONTRAT-COMMUN.md`](../CONTRAT-COMMUN.md) (cree par le parent — lecture obligatoire avant toute execution).
### Dependances PRD
- Client MCP **cote service Node** : les serveurs MCP sont des processus ; le navigateur ne peut ni les lancer ni leur parler directement. L'UI (PRD-065) affiche, n'execute pas.
- LinearSyncTool : coordonne avec PRD-012 (cat. 1, Linear HQ) — un seul espace d'identifiants/equipe ; ce PRD expose l'outil, pas un second workspace.

### Securite (bloquant)
- HoldingStripeTool : cles Stripe **uniquement cote service Node**, jamais `VITE_*` ni bundle navigateur ; operations de paiement = portes irreversibles -> approbation humaine obligatoire.
- WebAuditPlaywrightTool : navigateur headless isole (profil jetable, pas d'acces au profil utilisateur, aucun secret du repo expose a la page auditee).

### Criteres d'acceptation
- Positifs : lint+build ; les 4 outils (`HoldingStripeTool`, `WebAuditPlaywrightTool`, `DocumentParserTool`, `LinearSyncTool`) typés avec entrees/sorties strictes ; echec d'outil = erreur propagee, jamais un succes simule.
- Negatifs : pas de secret dans le bundle ; pas d'appel MCP depuis React ; pas d'outil expose sans validation de ses arguments.

### Isolation / reprise
- Chaque outil = module isole (l'echec de l'un n'abat pas les autres) ; rollback = `git checkout`, sans etat global corrompu.
