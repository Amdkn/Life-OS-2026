# Catégorie 2 — Évolution AI-Native de Life OS au service de Business OS


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Ce README est un index des 5 PRD du dossier** : les correctifs détaillés (dépendances, write_scope, critères positifs/négatifs, sécurité, rollback) vivent dans chaque PRD, section « Correctif de délégation ».

**Dépendances PRD :** PRD-021 à PRD-025 de ce dossier ; dépendances croisées listées dans chaque PRD.

**Périmètre d'écriture :** ce README et les PRD du dossier uniquement.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback :** revert du README ; correction purement éditoriale.

## 1. Vision et Objectif Stratégique
Faire évoluer Life OS en un système **AI-Native complet**, connecté organiquement à Business OS (Coach OS) :
- Rapatrier les adaptateurs et innovations éprouvés de Business OS :
  1. **CLI `coach-os` / `life-os` :** Adaptateur de commandes et exécution de tools légers.
  2. **Serveur MCP stdio (`mcp/server.mjs`) :** Exposition des outils Life OS sous forme de serveur MCP natif.
  3. **API & Harness d'Agents (`src/agent/`, `api/chat.ts`) :** Roster dynamique, SpriteAgent, AssistantOverlay multi-personnages.
  4. **Adaptateurs Multi-Tenant & Scoped Storage :** Isolation défensive et persistance robuste.

## 2. Découpage Prévu des 5 PRDs (Catégorie 2)
- **PRD-021 :** Socle Tooling & Adaptateur CLI unifié `life-os` (`src/lib/tooling/adapters/cli.ts`).
- **PRD-022 :** Serveur MCP STDIO natif pour Life OS (`mcp/server.mjs` & JSON-RPC 2.0).
- **PRD-023 :** Rapatriement de l'AssistantOverlay multi-agents & Roster dynamique (`src/agent/`).
- **PRD-024 :** Scoped Storage, Gestion des Rôles et Isolation Défensive issue de Business OS.
- **PRD-025 :** Pont API REST / Harness d'orchestration entre Life OS et Business OS.
