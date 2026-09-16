# RESULT — gouvernance pôle 0 (2026-09-12)

Analyse **documentaire** : aucune exécution métier n'est affirmée. Les
commandes ci-dessous prouvent la cohérence du registre, pas l'implémentation
des PRD.

## Livrables (tous dans `delegation-a-jules/orchestration/governance/`)

| Fichier | Contenu |
|---|---|
| `work-items.json` | 55 items exactement (catégories 0-9), managers modulo 3, depends_on vérifiés (prérequis code dur ; liaisons UI documentées dans BLOCKERS.md), scopes exclusifs, sessions connues à réconcilier |
| `verify_registry.py` | vérificateur documentaire du registre (inventaire, uniques, chemins, cycles, scopes/owners, evidences) |
| `prompts/MANAGER.md` | manager GLM : briefs de tranche, états machine, reçus |
| `prompts/CONTINUE_SAME_SESSION.md` | reprise bornée via sendMessage : job différent ou correction idempotente, jamais de CONTINUE vide |
| `prompts/ANSWER_FEEDBACK.md` | réponse structurée à un feedback, sans élargir le mandat |
| `prompts/VERIFY_DELIVERY.md` | reviewer indépendant : maker ≠ reviewer, rc rejoués, critères négatifs |
| `prompts/GATEKEEPER.md` | validation de chaque prompt AVANT envoi et contrôle après livraison (mandat complémentaire appliqué) |
| `prompts/ASTRA_SUPERVISOR.md` | DG par exception, horloges distinctes, budget OpenRouter local, arrêt à l'horizon |
| `E-MYTH-CHARTER.md` | vision=valeur produite, deux pôles, rôles, 5 horloges distinctes, budget, interdits |
| `CORPUS-PACK.md` | paquet documentaire sourcé chemin:ligne, sans données privées ni secrets, pour sessions Jules |
| `POLE1-HANDOVER.md` | statut `WAITING_USER_INPUT` : résumés Gemini non fournis ; critères de valeur mesurable ; pas de codage Pôle 1 avant fondations |
| `BLOCKERS.md` | coordinations résolues par tranches, scopes proposés, ancres A SOURCER, sessions à réconcilier |

## Commandes exécutées et rc

| Commande | rc | Résultat |
|---|---|---|
| `python delegation-a-jules/orchestration/governance/verify_registry.py` (1re passe) | 1 | 16 PASS / 2 FAIL → bug de l'instrument corrigé (`MANAGER_RULE[category % 3]`) + 2 ancres d'évidence inexistantes remplacées (PRD-041 `src/config/`, PRD-064 `src/services/telemetry/a3-cron-dispatcher.ts` — ni l'un ni l'autre n'existe sur disque) |
| `python delegation-a-jules/orchestration/governance/verify_registry.py` (2e passe) | **0** | **18 PASS / 0 FAIL** — 55 items, ids uniques, paths existants, graphe acyclique, scopes exclusifs, package.json/lockfile sur PRD-011 seul, evidences existantes |

## Counts

- 55 items exactement ; catégories 0-9 complètes (cat 0 : 7 PRD dont l'alias
  PRD-001 = `PRD-12WY-SQLITE-GLASSMORPHISM.md` ; cats 1-2 : 6 ; cats 3-4 et
  6-9 : 5 ; cat 5 : 6). Les catégories 10-12 (18 PRD, déployées après l'audit)
  sont hors lot 55.
- Managers : manager-a = 22 (cats 0,3,6,9) · manager-b = 16 (cats 1,4,7) ·
  manager-c = 17 (cats 2,5,8).
- Dépendances : 0 cycle, 0 id manquant, 0 auto-dépendance.

## Blocages (détail : BLOCKERS.md)

1. Réconciliation obligatoire avant tout nouveau mandat : PRD-003 (session
   `1391687838750096362`) et PRD-011 (session `7587937436525114170`,
   `UNCERTAIN`).
2. Scopes « proposés » à confirmer par les makers contre le corps des PRD
   (10 items listés dans BLOCKERS.md) — jamais annoncés comme existants.
3. Ancres A SOURCER héritées de l'audit (Observatoire Amy, LAYOUT_KEY, journal
   DOX, archiveProject).
4. Pôle 1 : `WAITING_USER_INPUT` (résumés Gemini non fournis).
5. Fichier `EM YTH-MANDAT-COMPLEMENT.md` portant un espace dans son nom — lu
   et appliqué ; renommage recommandé (hors scope d'écriture de ce worker).

## Limites

- `npm run lint` / `npm run build` NON exécutés ici (mandat : analyse
  documentaire, aucune application) ; leur passage reste exigé de chaque
  tranche avant livraison.
- Le quota exact du compte Jules n'est pas observable ; les objectifs
  « 55/24h » et « <25% quota Astra » sont non garantis (E-MYTH-CHARTER.md).
- Ce dossier n'écrit rien hors `orchestration/governance/` ; `runtime.py` et
  le reste de `orchestration/` appartiennent à l'autre worker.