# PRD-021 — Socle Tooling & Adaptateur CLI unifié `life-os`

## 1. Valeur et Remplacement
- **Origine Business OS :** `cli/coach-os.ts`, `src/lib/tooling/adapters/cli.ts`, `src/lib/tooling/defineTool.ts`.
- **Obstacle dans Life OS :** Absence d'interface en ligne de commande pour manipuler l'état des stores, inspecter les tactiques 12WY, ou déclencher des actions sans passer par l'UI web.
- **Remplacement :** Créer le binaire `cli/life-os.ts` et l'adaptateur de tooling dans `src/lib/tooling/adapters/cli.ts` supportant les formats de sortie `--json`, `--brief` (1 ligne par résultat pour préserver les contextes LLM) et `--names`.

## 2. Périmètre et Implémentation
- Définir le registre d'outils (`src/lib/tooling/registry.ts`) avec validation d'arguments.
- Exposer les commandes fondamentales de Life OS :
  - `life-os 12wy status` (Cycle courant, score d'exécution W1-W12, tactiques en cours).
  - `life-os ikigai list` (Les 20 piliers & horizons H1-H90).
  - `life-os blackboard events` (Flux append-only des événements récents).
- Gestion des permissions et contextes d'exécution (`ToolContext`).

## 3. Acceptation Fonctionnelle
- Exécution de `npx tsx cli/life-os.ts tools list` affichant la liste des outils.
- Exécution de `npx tsx cli/life-os.ts 12wy status --brief` retournant le score sans polluer de tokens.
- Validation avec `npm run lint` et `npm run build` (0 erreur).
