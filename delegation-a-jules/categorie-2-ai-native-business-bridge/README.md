# Catégorie 4 — Évolution AI-Native de Life OS au service de Business OS

## 1. Vision et Objectif Stratégique
Faire évoluer Life OS en un système **AI-Native complet**, connecté organiquement à Business OS (Coach OS) :
- Rapatrier les adaptateurs et innovations éprouvés de Business OS :
  1. **CLI `coach-os` / `life-os` :** Adaptateur de commandes et exécution de tools légers.
  2. **Serveur MCP stdio (`mcp/server.mjs`) :** Exposition des outils Life OS sous forme de serveur MCP natif.
  3. **API & Harness d'Agents (`src/agent/`, `api/chat.ts`) :** Roster dynamique, SpriteAgent, AssistantOverlay multi-personnages.
  4. **Adaptateurs Multi-Tenant & Scoped Storage :** Isolation défensive et persistance robuste.

## 2. Découpage Prévu des 5 PRDs (Catégorie 4)
- **PRD-021 :** Socle Tooling & Adaptateur CLI unifié `life-os` (`src/lib/tooling/adapters/cli.ts`).
- **PRD-022 :** Serveur MCP STDIO natif pour Life OS (`mcp/server.mjs` & JSON-RPC 2.0).
- **PRD-023 :** Rapatriement de l'AssistantOverlay multi-agents & Roster dynamique (`src/agent/`).
- **PRD-024 :** Scoped Storage, Gestion des Rôles et Isolation Défensive issue de Business OS.
- **PRD-025 :** Pont API REST / Harness d'orchestration entre Life OS et Business OS.
