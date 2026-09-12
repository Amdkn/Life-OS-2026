# Catégorie 6 : A3 Multi-Dimensional Swarm Factory (Skills, Hooks, MCP, Crons & Plugins)

Ce dossier d'architecture formalise l'**usine logicielle des Agents A3 (Spécialistes & Escouades de Terrain)**.
Contrairement à des prompts textuels passifs, chaque agent A3 est instancié sous forme d'un **système multi-dimensionnel exécutable** :
1. **Compétence compilée (Skill)** sous .agents/skills/
2. **Coupe-circuit déterministe (Hook 5D)** pour empêcher le code mort et les fuites PII
3. **Serveur MCP dédié** exposant ses outils métier
4. **Cadence temporelle (Cron/Heartbeat)** pour sa veille opérationnelle
5. **Composant UI (Plugin)** intégré dans le Roster d'Agent Portal

---

## 1. Cartographie des 5 PRDs de la Catégorie 6

| PRD | Titre & Jalon | Description & Livrables |
| :--- | :--- | :--- |
| **PRD-061** | **A3 Skills Matrix & Compiler Engine** | Registre TypeScript et manifestes .agents/skills/ pour chaque agent A3 des 6 Frameworks et 8 Escouades. |
| **PRD-062** | **A3 5D Hooks & Veto Circuit Breakers** | Garde-fous runtime Python/TS pour la validation déterministe des livrables de terrain avant commit. |
| **PRD-063** | **A3 Specialized MCP Tools Harness** | Exposer les outils métier (Stripe, Playwright, PDF/OCR, SQLite, Linear) aux agents A3 via MCP. |
| **PRD-064** | **A3 Real Crons & Heartbeats Telemetry** | Remplacement des mocks par des crons de fond actifs (veille 60s, revue hebdo Tendi, audit baux). |
| **PRD-065** | **A3 Swarm Visualizer & Roster Plugin UI** | Vue synoptique dans Agent Portal affichant les agents A3, leur état live, budget tokens et preuves. |
