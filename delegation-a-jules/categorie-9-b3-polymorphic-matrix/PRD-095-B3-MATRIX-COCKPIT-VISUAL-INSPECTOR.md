# PRD-095: B3 Polymorphic Matrix Cockpit & Visual Inspector UI

## Objectif
Developper la vue visuelle interactive dans Life OS permettant a l operateur (Amadou Kone) et aux coordinateurs B2 de visualiser la matrice polymorphe B3, l etat de chaque incarnation (Skill, Agent, Hook, Cron, MCP, Plugin, CLI, API) et d arbitrer le curseur Intelligence vs Determinisme.

## Specifications
- Creer src/components/b3-matrix/B3MatrixCockpit.tsx :
  - Grille bidimensionnelle interactive (Axe X : Degre d Intelligence, Axe Y : Degre de Determinisme).
  - Visualisation des workers B3 actifs repartis sur la matrice avec badges d etat (Idle, Running, Gated, Complete).
  - Drawer d inspection detaille pour chaque incarnation (code source, logs, consommation token, declencheurs).
  - Curseur d arbitrage : permet de forcer une tâche vers un mode 100% deterministe (CLI/Hook) pour economiser le quota de tokens.
- Integration dans le shell et la navigation de Life OS.
- Valider la compilation Vite + TypeScript sans aucune erreur.
