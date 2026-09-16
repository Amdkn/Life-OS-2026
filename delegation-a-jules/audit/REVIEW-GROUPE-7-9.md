# REVIEW-GROUPE-7-9 — Audit PRD catégories 7, 8, 9 (2026-09-12)

Périmètre : uniquement `delegation-a-jules/categorie-7-b1-summer-verse-ceo/`, `categorie-8-b2-council-vp-managers/`, `categorie-9-b3-polymorphic-matrix/`. Contrat commun : `../CONTRAT-COMMUN.md` (à créer par le parent — absent à l'audit). Dimension fonctionnelle : C7-9 = 7D. `npm run lint` = `tsc --noEmit` (pas des tests) ; `npm run build` requis à 0 erreur ; **aucun script `test` n'existe** dans package.json (mesuré) — aucun PRD ne doit prétendre en exécuter un.

## Findings transversaux (mesurés)

| # | Finding | Correction appliquée |
|---|---|---|
| T1 | PRD-075/085 cible `src/apps/portal/` — inexistant ; l'app réelle est `src/apps/agent-portal/` | Chemins corrigés dans les 2 PRD + interdiction de créer `src/apps/portal/` |
| T2 | PRD-072 cite `04_B2_HANDOFF_QUEUE.md` / `03_DECISION_CHARTER.md` — absents du repo (corpus privé hors repo) | Règles canoniques embarquées dans le PRD ; dépendance hors repo déclarée explicite |
| T3 | PRD-073 : express en dependencies mais aucun fichier serveur dans le repo | Moteur relocalisé `src/server/treasury/` (backend) ; `HoldingTreasuryEngine.tsx` conservé en vue lecture seule |
| T4 | PRD-091 corrompu : «esolveIncarnation», «pm run build», «px tsc --noEmit» | Reparés : `resolveIncarnation`, `npm run build`, `npx tsc --noEmit` |
| T5 | PRD-094 corrompu : «ssembleSwarm» | Réparé : `assembleSwarm` |
| T6 | PRD-092 «rot rate» : corruption de sens | Reformulé «dégradation silencieuse / sortie corrompue» — **sens supposé, à valider par le parent** |
| T7 | Pas de runner de tests (vitest/jest absents) ; PRD-091 réclame `__tests__/b3-matrix-engine.test.ts` | Reformulé : spec uniquement ; vitest à ajouter explicitement si tests réels exigés ; `npm test` déclaré inexistant |
| T8 | Récupération/relargage de systèmes : risque de recréer PRD-041 (roster), PRD-061 (compilation compétences), PRD-091 (matrice rôles), schéma blackboard (PRD-011 propriétaire, PRD-052 consommateur) | Clauses anti-recréation dans PRD-081, 082, 083, 085, 093, 095 ; propriétaires nommés partout |
| T9 | Quota Jules non prouvable par API | PRD-075/093 : docs officiels cités (100 tâches/24 h glissantes Pro, 15 concurrentes) ; pas de « quota restant » affiché ; aiguillage via client PRD-051, pas de second client |
| T10 | Money & secrets : PRD-073 risque le calcul comptable côté React et les clés Stripe dans le bundle | Moteur backend obligatoire, secrets service uniquement, écritures idempotentes + contre-passation, aucune exécution réelle de virement |
| T11 | Crons/SQLite natif côté React (PRD-083, 092) | Cron côté service Node (PRD-092 propriétaire du scheduler), persistance blackboard SQLite service ; IndexedDB navigateur jamais substitué au service par décret |
| T12 | Données fictives / télémetrie simulée (tous cockpits et moteurs) | Critères négatifs explicites : état vide/erreur explicite quand la source est vide, métriques absentes plutôt que fausses |
| T13 | CONTRAT-COMMUN.md absent à l'audit | Chaque PRD pointe `../CONTRAT-COMMUN.md` avec mention « créé par le parent » |

## Prd 1/15 — categorie-7-b1-summer-verse-ceo/PRD-071-FRANCHISE-CORE-DYNAMIC-INSTANCE-MODEL.md

- **Findings** : chemin de la factory non fixé dans le PRD initial ; socle de 4 PRD dépendants + PRD-084.
- **Corrections** : correctif ajouté ; write_scope fixé (`src/types/franchise.ts`, `src/services/franchise/franchise-factory.ts`) ; commandes re-rondes.
- **Dépendances PRD réelles** : aucune amont ; dépendants 072/073/074/075/084.
- **Write_scope** : concret — les 2 fichiers ci-dessus (dossiers à créer) ; proposé — aucun.
- **Tests fonctionnels** (après implémentation) : `npm run lint` + `npm run build` ; factory déterministe sur les 4 IDs.
- **Statut** : corrigé (correctif de délégation ajouté, texte initial conservé).

## Prd 2/15 — categorie-7-b1-summer-verse-ceo/PRD-072-B1-HANDOFF-QUEUE-DECISION-CHARTER.md

- **Findings** : T2 (docs hors repo) ; persistance de gouvernance non spécifiée.
- **Corrections** : règles canoniques embarquées ; persistance = blackboard SQLite service (PRD-011/PRD-052), idempotence par clé de déduplication.
- **Dépendances PRD réelles** : PRD-071 (types), consommateur PRD-082.
- **Write_scope** : concret — `src/services/governance/b1-handoff-queue.ts`, `src/types/governance.ts` (dossiers à créer) ; proposé — service Node éventuel (`src/server/`) si la file est servie.
- **Tests fonctionnels** : cycle ticket créé→honoré/refusé avec historique ; lint+build 0 erreur.
- **Statut** : corrigé.

## Prd 3/15 — categorie-7-b1-summer-verse-ceo/PRD-073-HOLDING-TREASURY-MULTI-TENANT-BILLING.md

- **Findings** : T3 (backend inexistant) ; risque comptabilité en React ; secrets Stripe ; pas d'idempotence d'écriture.
- **Corrections** : moteur `src/server/treasury/`, UI lecture seule ; clés d'idempotence ; journal append-only + contre-passation ; interdiction virement réel automatisé ; UI vide/erreur sans données réelles.
- **Dépendances PRD réelles** : PRD-071, PRD-072, PRD-011 ; consommés par PRD-074/075.
- **Write_scope** : concret — `src/server/treasury/holding-treasury-engine.ts`, `src/server/treasury/ledger.ts` (dossiers à créer), `src/apps/franchise/billing/HoldingTreasuryEngine.tsx` (conservé du PRD initial, réduit à la vue).
- **Tests fonctionnels** : ventilation déterministe ; solde recalculable du journal ; npx tsc sur src/server (Vite n'entre pas dans src/server).
- **Statut** : corrigé (risque financier signalé — revue humaine recommandée avant toute connexion Stripe réelle).

## Prd 4/15 — categorie-7-b1-summer-verse-ceo/PRD-074-UNIVERSAL-MEMBER-PORTAL-CLIENT-GATEWAY.md

- **Findings** : isolation multi-profils non spécifiée ; risque de données fictives ; dépendances non déclarées.
- **Corrections** : dépendances PRD-071/073 déclarées ; isolation par franchise+profil ; branding déclaratif ; état vide sans données réelles.
- **Dépendances PRD réelles** : PRD-071, PRD-073 ; consommé par PRD-075.
- **Write_scope** : concret — `src/apps/franchise/portal/UniversalMemberPortal.tsx` + `themes/` (dossiers à créer) ; consomme `src/types/profile.ts`/`src/stores/auth.store.ts` sans les modifier.
- **Tests fonctionnels** : 3 profils rendent leurs fonctionnalités depuis les types PRD-071 ; bascule thème déterministe ; lint+build 0 erreur.
- **Statut** : corrigé.

## Prd 5/15 — categorie-7-b1-summer-verse-ceo/PRD-075-B1-SUMMER-VERSE-CEO-COMMAND-COCKPIT.md

- **Findings** : T1 (chemin) ; « délégations Jules en 1 clic » sans client Jules ni quota prouvé ; métriques agrégées sans sources.
- **Corrections** : chemin `src/apps/agent-portal/components/` ; délégations via PRD-051, compteur de tâches actives seulement (docs officiels cités) ; agrégat branché sur PRD-071/072/073/081/085.
- **Dépendances PRD réelles** : PRD-071/072/073/081/085/051.
- **Write_scope** : concret — `src/apps/agent-portal/components/B1SummerVerseCockpit.tsx` (corrigé de `src/apps/portal/`).
- **Tests fonctionnels** : jauges vides quand sources non connectées ; déclenchement Jules via PRD-051 ; lint+build 0 erreur.
- **Statut** : corrigé.

## Prd 6/15 — categorie-8-b2-council-vp-managers/PRD-081-B2-COUNCIL-ENGINE-8-VP-MANAGERS.md

- **Findings** : `src/config/` inexistant (dossier à créer) ; risque de recréer le roster de PRD-041 ; relation avec la matrice B3 de PRD-091 à délimiter.
- **Corrections** : clauses propriétaire/consommateur écrites ; write_scope fixé (`src/types/b2-council.ts`, `src/config/b2-council.config.ts`) ; config exactement 8 VP.
- **Dépendances PRD réelles** : PRD-041 (identités, alignement), PRD-091 (matrice B3, pas de chevauchement) ; dépendants 082/085/075.
- **Write_scope** : concret — 2 fichiers ci-dessus (dossiers à créer) ; interdit : stores ld01-ld08, agents.store.
- **Tests fonctionnels** : unions strictes ; 8 VP exactement ; lint+build 0 erreur.
- **Statut** : corrigé.

## Prd 7/15 — categorie-8-b2-council-vp-managers/PRD-082-B2-DOD-JTBD-TRANSLATION-PIPELINE.md

- **Findings** : source des mandats non déclarée (PRD-072) ; risque de recréer PRD-061 ; « action receipt » doit être une preuve d'environnement.
- **Corrections** : consomme PRD-072/081 ; anti-recréation PRD-061 ; receipt = chemin/exit code/HTTP, jamais une affirmation ; idempotence Rock→DoD.
- **Dépendances PRD réelles** : PRD-072 (source), PRD-081 (attribution), PRD-061 (aval, non recréé).
- **Write_scope** : concret — `src/services/governance/b2-dod-pipeline.ts` + types partagés `src/types/governance.ts` (coordonnés avec PRD-072).
- **Tests fonctionnels** : même Rock → même DoD ; aucune tâche A3 sans DoD validée ; lint+build 0 erreur.
- **Statut** : corrigé.

## Prd 8/15 — categorie-8-b2-council-vp-managers/PRD-083-WEEKLY-UPLINK-PICARD-TO-SPOCK-12WY.md

- **Findings** : sources de données non nommées dans le PRD initial ; cadence hebdomadaire impossible en React ; risque de second moteur 12WY.
- **Corrections** : sources nommées (`fw-para.store.ts`, `fw-12wy.store.ts`, `src/types/twelve-week.ts`) ; cadence déléguée à B3CronScheduler (PRD-092), jamais setInterval React ; idempotence semaine+tâche ; score vide si données vides.
- **Dépendances PRD réelles** : stores existants (mesurés), PRD-092 (cadence), PRD-011 (archive).
- **Write_scope** : concret — `src/services/temporal/weekly-uplink-engine.ts`, `src/services/temporal/uplink-types.ts` (dossiers à créer) ; interdit : modification des stores existants.
- **Tests fonctionnels** : clôture Wx idempotente ; promotion uniquement de tâches réellement achevées ; lint+build 0 erreur.
- **Statut** : corrigé.

## Prd 9/15 — categorie-8-b2-council-vp-managers/PRD-084-CROSS-FRANCHISE-HARMONIZATION-BUS.md

- **Findings** : « rétrocéder automatiquement » ambigu — risque d'auto-mutation des franchises ; pas d'anti-boucle.
- **Corrections** : proposition d'adoption (statuts proposé/adopté/refusé), adoption par VP B2 ; empreinte hash anti-re-proposition ; transport de templates, jamais de données nominatives.
- **Dépendances PRD réelles** : PRD-071 (instances/modules), PRD-081 (attribution VP), consommateur PRD-075.
- **Write_scope** : concret — `src/services/franchise/cross-franchise-bus.ts`, `src/services/franchise/bus-types.ts` (dossiers à créer).
- **Tests fonctionnels** : 3 règles de données déclarées ; une innovation → une seule proposition ; lint+build 0 erreur.
- **Statut** : corrigé.

## Prd 10/15 — categorie-8-b2-council-vp-managers/PRD-085-DEAL-LIBERATION-ENGINE-B2-COCKPIT.md

- **Findings** : T1 (chemin) ; risque de second modèle DEAL alors que `ld01.store.ts`/`fw-deal.store.ts` existent.
- **Corrections** : chemin `src/apps/agent-portal/components/B2CouncilCommandCenter.tsx` ; DEAL aligné sur les stores existants ; jauges vides sans source ; arbitrage via PRD-072/082.
- **Dépendances PRD réelles** : PRD-081, PRD-082, stores ld01/fw-deal (mesurés).
- **Write_scope** : concret — composant cockpit + navigation (édition minimale d'enregistrement) ; interdit : ld01.store/fw-deal.store.
- **Tests fonctionnels** : radar 8 domaines branché PRD-081 ; jauge E/A/L depuis ld01 ; lint+build 0 erreur.
- **Statut** : corrigé.

## Prd 11/15 — categorie-9-b3-polymorphic-matrix/PRD-091-B3-POLYMORPHIC-MATRIX-ENGINE.md

- **Findings** : T4 (3 typos corrompues) ; T7 (test demandé sans runner) ; PRD propriétaire de la matrice rôles à protéger de la recréation.
- **Corrections** : typos réparées ; `resolveIncarnation` pure et déterministe (profil identique → incarnation identique, interdiction LLM sur tâche déterministe) ; test reclassé en spec (vitest à ajouter explicitement si exigé) ; clause propriétaire matrice.
- **Dépendances PRD réelles** : aucune amont ; dépendants 092/093/094/095 ; PRD-061 (skills, non recréées).
- **Write_scope** : concret — `src/types/b3-polymorphic.ts`, `src/services/b3-matrix-engine.ts`, spec `src/services/__tests__/b3-matrix-engine.test.ts`.
- **Tests fonctionnels** : lint+build 0 erreur ; tests réels seulement si vitest ajouté (dette explicite).
- **Statut** : corrigé.

## Prd 12/15 — categorie-9-b3-polymorphic-matrix/PRD-092-B3-DETERMINISTIC-SUBSTRATE-HOOKS-CRONS.md

- **Findings** : T6 («rot rate» corrompu) ; crons impossibles en navigateur ; absence de budget de boucle.
- **Corrections** : «rot rate» reformulé (sens supposé, signalé) ; runtime = service Node ; budget d'itérations par hook ; crons idempotents avec rattrapage unique ; pipeline de validation obligatoire avant écriture disque/API.
- **Dépendances PRD réelles** : PRD-091 (incarnations), consommateurs PRD-083/093/094.
- **Write_scope** : concret — `src/services/b3-deterministic-runtime.ts` (+ `src/services/b3-runtime/` proposé si découpage).
- **Tests fonctionnels** : hook peut bloquer une exécution ; cadences 15m/60s/quotidienne/weekly avec tolérance de dérive ; lint+build 0 erreur.
- **Statut** : corrigé (reformulation T6 à valider par le parent).

## Prd 13/15 — categorie-9-b3-polymorphic-matrix/PRD-093-B3-COGNITIVE-ARMS-SKILLS-MCP-PLUGINS.md

- **Findings** : risque de recréer les skills de PRD-061 et un second client Jules ; secrets MCP côté navigateur ; quota inventé.
- **Corrections** : interface d'aiguillage seulement (skills PRD-061 non recréés) ; client unique PRD-051 ; bridge MCP côté service Node, credentials hors bundle ; budget tokens fourni en config, jamais deviné ; quota officiel cité sans compteur non prouvé.
- **Dépendances PRD réelles** : PRD-091, PRD-092, PRD-061 (non recréé), PRD-051 (client Jules).
- **Write_scope** : concret — `src/types/b3-cognitive.ts`, `src/services/b3-cognitive-dispatcher.ts`.
- **Tests fonctionnels** : enregistrement idempotent par id de module ; troncature de contexte deterministe ; lint+build 0 erreur.
- **Statut** : corrigé.

## Prd 14/15 — categorie-9-b3-polymorphic-matrix/PRD-094-B3-DYNAMIC-ORCHESTRATOR-SWARM-COMPOSER.md

- **Findings** : T5 («ssembleSwarm» corrompu) ; risque de double exécution et de deadlock ; métriques potentiellement fictives.
- **Corrections** : `assembleSwarm` réparé ; composeur = montage de topologie, pas d'exécution ; verrous ordonnés + timeouts ; métriques réelles (absentes plutôt que fausses) ; ordre inverse du montage à l'arrêt.
- **Dépendances PRD réelles** : PRD-091 (resolveIncarnation), PRD-092 (substrat), PRD-093 (bras cognitifs), PRD-082/072 (émetteurs).
- **Write_scope** : concret — `src/services/b3-swarm-composer.ts` ; types référencés dans PRD-091 (coordonnés, pas réécrits).
- **Tests fonctionnels** : même directive → même topologie ; rejet explicite d'incompatibilité d'interfaces ; lint+build 0 erreur.
- **Statut** : corrigé.

## Prd 15/15 — categorie-9-b3-polymorphic-matrix/PRD-095-B3-MATRIX-COCKPIT-VISUAL-INSPECTOR.md

- **Findings** : mécanisme d'intégration shell non nommé ; risque de contournement du verrou déterministe ; risque d'incarnations fictives affichées.
- **Corrections** : forçage arbitrage passe par PRD-091 (profil surchargé) ; shell = mécanisme existant `Desktop.tsx`/`AppDrawer.tsx` ; grille vide quand inoccupée ; logs tronqués côté service.
- **Dépendances PRD réelles** : PRD-091/092/093/094 ; shell existant (mesuré).
- **Write_scope** : concret — `src/components/b3-matrix/B3MatrixCockpit.tsx` + composants du dossier ; édition minimale de navigation.
- **Tests fonctionnels** : badges Idle/Running/Gated/Complete depuis les états réels ; forçage journalisé ; lint+build 0 erreur.
- **Statut** : corrigé.

## Limites de l'audit

- Aucune application lancée, aucun `npm run lint/build` déclenché par cet audit : aucun code des PRD n'existe encore ; la validation exigée s'appliquera aux implémentations.
- `CONTRAT-COMMUN.md` : absent, pointé `../CONTRAT-COMMUN.md` depuis chaque catégorie — création attendue du parent.
- «rot rate» (PRD-092) : reformulation à sens supposé, marquée A SOURCER.
- Les README des 3 catégories ont été patchés (contrat, dimension 7D, ordres d'exécution) — aucun autre fichier modifié, aucune catégorie hors 7-9 touchée, aucun commit/push.