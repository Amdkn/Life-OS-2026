# HANDOVER — Orchestration Jules Life OS → Antigravity (16 sept 2026)

## État du dépôt Amdkn/Life-OS-2026 (vérifié via API)

### FUSIONNÉS dans main (base sûre pour tout nouveau travail)
| PRD | PR | Contenu livré |
|---|---|---|
| 001 | #1 | Persistance local-first IndexedDB (`src/lib/idb.ts`) |
| 002 | #2 | Vision 12WY horizons H1-H90 (`fw-12wy.store.ts`, `src/types/twelve-week.ts`) |
| 011 | #3 | Schéma Blackboard SQLite serveur (`server/blackboard/`, `src/lib/blackboard/`) |
| 041 | #4 | Roster canonique 6 frameworks (`src/types/frameworks.ts`, `src/config/vessels.config.ts`) |
| 024 | #5 | Scoped storage + migration défensive (`src/lib/storage-scope.ts`, `src/lib/migrationDefensive.ts`) |
| 025 | #5 (même branche) | API Bridge REST (`api/`, `src/lib/bridge/`) — PR ouverte, pas de PR séparée |

### Sessions Jules existantes (6, toutes COMPLETED, réutilisables jusqu'à leur expiration)
- `sessions/500080852609952254` — C2 (024+025), contexte catégorie 2 complet dans son prompt
- `sessions/7587937436525114170` — C1 (011)
- `sessions/3716194391895641129` — C4 (041)
- `sessions/9986816530458005889` — C0 (001)
- ⚠️ Leçon dure : envoyer un message à une session COMPLETED ne fonctionne PAS — Jules ne le lit pas. Il faut soit une session encore IN_PROGRESS, soit une NOUVELLE session.

## PROCHAINES TRANCHES PRÊTES (aucune dépendance manquante)

1. **PRD-007** — Reprise offline durable. Déps : 001 ✓, 024 ✓. Scope : `src/lib/idb.ts`, `src/lib/db/core-db.ts`, outbox `src/lib/`. ÉTAT : mandat envoyé à Jules mais session morte, À RELANCER en nouvelle session.
2. **PRD-012** — Linear HQ holding. Déps : 011 ✓, 024 ✓. Scope : `src/lib/linear/`.
3. **PRD-013** — Registre crons réel. Déps : 011 ✓. Scope : `src/apps/agent-portal/components/CronsView.tsx`.
4. **PRD-031** — Import projets PARA. Déps : aucune. Scope : `fw-para.store.ts`, `useParaProjects.ts`. Sources Picard à embarquer dans le brief (pas de corpus hors repo).
5. **PRD-042/043/044/053** — Ikigai/GTD/DEAL/Wheel. Déps : 041 ✓. Scopes disjoints (`src/apps/ikigai/`, `src/apps/gtd/`, `src/apps/deal/`, `src/apps/life-wheel/`). Lançables EN PARALLÈLE en sessions séparées.
6. **PRD-051** — Client Jules serveur. Scope : `server/jules-client/`. Clé API Jules JAMAIS côté Vite.
7. **PRD-071** — Franchises. Aucune dep. Scope : `src/types/franchise.ts`, `src/services/franchise/`.
8. **PRD-091** — Matrice B3. Scope : `src/types/b3-polymorphic.ts`, `src/services/b3-matrix-engine.ts`.

## RÈGLES D'ORCHESTRATION (acquises à prix d'or, ne pas réapprendre)

1. **Une session COMPLETED = morte.** Le message envoyé n'est jamais lu. Nouveau job = nouvelle session (ou session IN_PROGRESS du jour).
2. **Un seul writer par fichier partagé** : `fw-12wy.store.ts` (003/004), `fw-para.store.ts` (031/033), `package.json` (personne sauf integration), schéma blackboard (011 seulement).
3. **COMPLETED Jules ≠ intégré.** Vérifier la PR existe ET est mergée avant de débloquer les dépendants.
4. **Jules renvoie `environmentVariablesEnabled: true` même si false demandé** — ne jamais passer de secrets dans les prompts.
5. **Les 15 sessions simultanées comptent TOUT le compte** (3 actives ailleurs). Quota Pro : 100 tâches/24h glissantes.
6. **Pas de merge auto, pas de push main** par les agents — PRs seulement. Transaction financière réelle (073 Stripe) = GO humain.
7. **Un brief Jules doit contenir** : JTBD précis, base (commit main actuel), scope fichiers autorisés, DoD testables (lint+build passent, comportement vérifiable), livraison attendue (PR + tests), interdits (pas de mock production, pas de secrets bundle).

## INFRA LOCALE (état, ne pas casser)

- **Cron actif** : `jules-orchestrator-heartbeat` (id `b61a105ee2d2`), toutes les 2 min, exécute `jules_pole0_tick.py` via le pont `C:/Users/amado/AppData/Local/hermes/scripts/jules_pole0_bridge.py` → `orchestration/runtime.py --live tick`. **Il peut être désactivé** si Antigravity prend le relais : `hermes cron pause b61a105ee2d2`.
- **Runtime orchestration** : `C:/Users/amado/Life-OS-2026/delegation-a-jules/orchestration/` (55 jobs trackés, state SQLite, reçus dans `integrations.json`, gardes anti-collision de scopes).
- **Pont corrigé aujourd'hui** : `--live` doit précéder le sous-commande argparse (bug corrigé 3×, ne pas revenir en arrière).
- **Crédit OpenRouter** : les managers GLM (3 appels par décision) consomment ce crédit. Si Antigravity orchestre, couper le cron ci-dessus = zéro consommation.
- **Registry des 55 PRD + dépendances** : `orchestration/governance/work-items.json` (source de vérité).
- **Plan complet des vagues** : `C:/Users/amado/Life-OS-2026/.hermes/plans/2026-09-16_033950-delegation-jules-prd.md`.

## CE QUI MANQUE À L'ORCHESTRATION (à corriger par Antigravity si repris)

1. **Pas de deliver webhook** : la fin d'un travail Jules n'est connue que par polling. Le cron tourne à vide = gaspillage. Antigravity peut brancher le tick sur un déclencheur événementiel.
2. **Réutilisation de sessions COMPLETED tentée et échouée** — retirer cette logique du runtime (`completed_same_cat` dans `plan_actions`) ou ne l'activer que pour sessions IN_PROGRESS.
3. **`registry_item_from_job` ne fournit pas les DoD** dans le prompt Jules — le brief de continuation est générique. Injecter le texte du PRD correspondant.
