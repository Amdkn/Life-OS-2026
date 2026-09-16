# PRD-021 — Socle Tooling & Adaptateur CLI unifié `life-os`


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-005 (le score de `life-os 12wy status` est celui de useWeeklyScore — une seule définition) ; PRD-011 (`life-os blackboard events` lit le service blackboard, pas un store React) ; PRD-022 (le serveur MCP expose le même catalogue d'outils, pas un second registre).

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : `tsx` présent dans devDependencies (donc `npx tsx cli/life-os.ts` est exécutable sans nouvelle dépendance) ; stores `src/stores/` comme sources de données.
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** `npx tsx cli/life-os.ts tools list` liste les outils ; `12wy status --brief` retourne le score sur 1 ligne ; formats `--json`/`--brief`/`--names` fonctionnels.

**Critères d'acceptation négatifs (doivent rester vrais) :** aucune commande qui écrit dans les stores sans transaction explicite ; aucun stdout pollué par des logs de debug ; aucune lecture de `C:/Users` ; pas de duplication du calcul de score.

**Sécurité / isolation / idempotence / persistance :** le CLI tourne avec les permissions de l'utilisateur local et ne doit jamais exposer de secret (`VITE_*` ou clés) dans ses sorties ; validation d'arguments via le registre avant exécution ; ToolContext explicite.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** dossier `cli/` et `src/lib/tooling/` additifs : rollback = suppression, l'app web reste inchangée.

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
