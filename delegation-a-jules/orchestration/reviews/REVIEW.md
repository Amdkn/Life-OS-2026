# REVIEW.md — Revue indépendante runtime orchestration Jules (Hermes natif / GLM OpenRouter)

Reviewer : Hermes natif (modèle z-ai/glm-5.3-flash via OpenRouter), scope écriture EXCLUSIF : orchestration/reviews/.
Aucune modification code builder / config Hermes / cron / app / PRD. Aucun appel réseau réel Jules ni OpenRouter (transports synthétiques étiquetés uniquement).

## Version inspectée (hashes, horodatage)

Horodatage : 2026-09-12T17:47:15Z (première passe)

| Fichier | sha256 |
|---|---|
| orchestration/runtime.py | 97ef4c0fc6cec355a97e002a381cddbf95f1c9cd98cf2e8460777252af21546d |
| orchestration/store.py | 5c4b6fbaf306beebfe5c7a3b1c7759acf70d913efca93a9f444acb05a5592af9 |
| orchestration/registry.py | d04df92d41b122ae1f7fa83d3f177f775e2e7759dff81842ba8221b4d807d08a |
| orchestration/manager_llm.py | 1ba623567ad366230ce0b4ef5d4bcdb20e6bf8146b72ae98fb68a090aa7e2e17 |
| orchestration/jules_client.py | e3bc18bf5a1174c32ec46a005badae59ba252e5587f7f51089649a02ba8612b4 |
| orchestration/config.json | cdaf3b6502eecff92e3efe34124a99c649dd4a1d1cc972c7a70b4bd82ff72c24 |
| CONTRAT-COMMUN.md | 681743c275eaf40c85ad6c178e7a842ea361716ea9f9ac79a3aefe1124df2ea8 |

STATUT à cette passe : **REVIEW_BLOCKED_ON_BUILDER (partiel)** — runtime.py ne compile pas.

## Constat bloquant B1 — SyntaxError runtime.py:760

Commande : `python -c "import ast; ast.parse(open('runtime.py',encoding='utf-8').read())"`
Résultat : `SyntaxError: positional argument follows keyword argument` ligne 760 (`create_event(... , {'job_key':...}, assignee)` dans `expire_stale_submissions` : payload positionnel après `subject=` nommé).
Conséquence : import impossible → défaut d'import = échec selon mandat. Tout test d'exécution tick est bloqué.

## Constats précis (chemins:lignes, version hash 97ef4c0f...)

1. **[bloquant] runtime.py:584** — `in_flight.add(cat)` : `in_flight` jamais défini dans `plan_actions` ; NameError dès qu'une création est planifiée. (Note : le builder corrige simultanément ; la ligne 584 a disparu d'une relecture `sed` postérieure — le fichier est en mouvement, cf. hashes.)
2. **[bloquant] runtime.py:898** — `_bump_attempts(ev)` dans la branche `InvalidDecision` de `call_llm` : la fonction est `_bump_attempts(st, ev)` (2 args, runtime.py:948) → TypeError au premier JSON invalide du LLM. Les autres sites d'appel (:914, :933) passent bien `st`.
3. **[majeur, mort] runtime.py:503-507** — `in_flight_cats = {...}` puis `active_cats = set(active_by_cat) | in_flight_cats_placeholder()` puis réassignation `active_cats = set(active_by_cat)` : le calcul des catégories in-flight est annihilé ; `in_flight_cats_placeholder()` retourne `set()` en dur (runtime.py:601-603). Idem :516 `if cat in in_flight_cats_placeholder()` = jamais vrai. Comportement : deux jobs de même catégorie peuvent être planifiés en création dans un même tick tant que `active_by_cat` est vide — contredit « un fichier partagé n'a qu'un writer » côté admission.
4. **[majeur] runtime.py:388-393** — matching job↔session dans `reconcile` : `j['prd_id'] == prd and (not j.get('session_name') or j['session_name'] == name)` prend le premier job du PRD sans distinction de tranche ni de branche ; avec 2 tranches du même PRD, la session peut être rattachée au mauvais job.
5. **[majeur] runtime.py:444-471** — réconciliation UNCERTAIN : `st.record_submission(sub['job_key'], 'create', sub['attempt'], 'SUBMITTED', ...)` met à jour la soumission mais `st.set_job(... status='SUBMITTED', session_name=...)` n'est appliqué que si `job is not None` avec `sub['job_key']`... en réalité le `job` référencé ici est celui de la boucle précédente (variable réutilisée), pas forcément le job de `sub['job_key']` : `job = st.job(sub['job_key'])` n'est PAS fait dans la branche create (l.447) — la ligne 456 `if job is not None:` porte sur un job résiduel. Risque de mise à jour croisée.
6. **[mineur] store.py:237-242** — `open_submission` ignore `statuses` si vide (f-string ok) mais les appels `st.open_submission(p['job_key'], p['kind'])` utilisent le défaut ('SUBMITTING',) : un UNCERTAIN ne bloque pas la resoumission — cohérent avec la politique (UNCERTAIN job-level bloque), à documenter.
7. **[mineur] manager_llm.py:63-88** — `call_llm` lève `RuntimeError` (redirigé) sur toute exception transport, y compris timeout HTTP ; pas de distinction 402/429 (quota OpenRouter). Le mandat « 402 non contourné » est satisfait par absence de retry (runtime.py:905-908 remet l'événement en pending sans re-appel immédiat) mais le motif n'est pas classifié : un 402/429 produira un signal `LLM_ERROR` générique, pas un gel distinct. Non contourné = OK ; non discriminé = constat.
8. **[conforme] manager_llm.py:117-150** — `validate_decision` exige prompt.goal/tests non vides, `contract_included=true`, scan secrets ; runtime.py:921 refuse un `prompt_sha256` ≠ sha du runtime → le maker ne peut pas autoriser un prompt différent de celui calculé. GATEKEEPER « maker n'approuve pas son propre prompt » : le manager LLM autorise, mais execute_plans (runtime.py:647) consomme `take_authorization` AVANT le POST — gatekeeper AVANT envoi : conforme. Il n'existe pas de garde explicite « event créé par manager X ne peut être traité par le même role » : `cmd_manager` traite `pending_events(roles)` de tous les managers, y compris l'événement assigné au même rôle qui l'a déclenché via LLM. Le LLM ≠ maker humain, mais la séparation maker/approver repose uniquement sur le fait que l'autorisation est décidée par LLM et exécutée par code. Constat non bloquant, à consigner.
9. **[conforme] jules_client.py:54-58** — routes allowlistées (`sessions`, `sessions/<id>`, `sessions/<id>:sendMessage`, `sessions/<id>/activities`), noms validés par SESSION_NAME_RE. POST timeout : pas de retry dans execute_plans — toute exception → UNCERTAIN + blocage (runtime.py:731-739) : conforme « POST timeout ≠ retry aveugle ».
10. **[conforme] runtime.py:568-577** — cap 15 actives toutes sources (`active_all_value(report)+creations >= 15`) et cap 3 catégories avant création. Config limite 15 (config.json limits).
11. **[conforme] runtime.py:806-816** — cadence manager/supervisor ne monte que si `consecutive_useful >= gatekeeper_useful_required` (4) ; `run_gatekeeper_control` remet cons=0 sur `ok_empty`/erreur → confiance ne monte pas à vide. Gatekeeper DRY_RUN : `ok=True` mais `useful=False` → pas de montée.
12. **[conforme] runtime.py:963-976** — `build_monitor` : `quota_display: 'UNKNOWN'` et status.json `quota_note: 'aucun compteur fictif'`. Aucun appel LLM sans événement : `cmd_manager` sort NO_PENDING_EVENT avec 0 appel (runtime.py:851-854) ; budget/jour local 10 (config) et gel sur budget (runtime.py:862-864).
13. **[conforme] model** — config.json `llm.model = "z-ai/glm-5.3-flash"`, base_url openrouter ; aucune trace de `claude-glm` dans orchestration/. Le mandat exige Hermes natif : le runtime passe par OpenRouter direct (manager_llm.py real_llm_transport), pas par un proxy Claude — conforme.
14. **[risque documentaire] jules_pole0_bridge.py:22** — `timeout=130` sur subprocess : un tick LIVE complet (reconcile avec pagination 50 pages × sessions) peut dépasser 130 s → le cron tue le runtime en pleine transaction SQLite (isolation_level=None, pas de BEGIN global : risque faible mais soumission SUBMITTING non release_claim si kill au POST ; la réconciliation par horizon 24h couvre). Non bloquant, à surveiller. (Lecture seule autorisée, pas modifié.)
15. **[conforme] receipts** — store.py:188-203 + runtime.py:286-309 : seuls les recus `approved_by: human:*` sont importés ; COMPLETED n'est jamais `integrated` sans recu → test 2.

## Couverture prévue des 15 tests (suite reviews/tests/test_orchestration.py)

1 sendMessage=prompt field | 2 COMPLETED jamais integrated sans recu | 3 réutilisation (message sur session existante) pas create | 4 job_key stable indépendant du hash | 5 POST timeout → UNCERTAIN pas retry | 6 gatekeeper avant envoi (take_authorization requis) + maker ne peut auto-approuver (sha mismatch rejeté) | 7 hash modifié après approval → refusé | 8 dépendances réelles + scopes concurrents → BLOCKED_DEPENDENCY/BLOCKED_SCOPE | 9 cap 15 compte | 10 aucun appel Astra/GLM sans événement (0 transport call) | 11 cadence confiance ne monte pas à vide | 12 persistance/reprise (store reopen) | 13 pas de découpe manager par cron 130s (manager = one-shot process, pas de découpe) | 14 modèle z-ai/glm-5.3-flash configuré, pas claude-glm | 15 quota 402 : pas de contournement (budget journalier + UNKNOWN affiché).

## Exécution

Voir RESULT.md (rc, tests run/failed). À cette passe : bloqué par B1 (défaut d'import).