# CORPUS-PACK — paquet documentaire autorisé pour les sessions Jules

> Seul paquet que les tâches de ce dépôt transmettent aux sessions Jules.
> Jules ne voit pas `C:/Users/amado/ASpace_OS_V3` depuis sa VM : toute
> dépendance documentaire absente d'ici = `BLOCKED_SOURCE`, jamais une fiction
> de corpus, jamais une lecture du disque privé. Aucune donnée privée brute,
> aucun secret, aucun `.env`. Rien ne passe machine→humain (promotion : Amadou
> uniquement).

## 1. Produit : The Bridge — Life OS (V0.9)

- Stack mesurée : React 19 + Vite 6, Zustand 5, Tailwind 4, persistance
  IndexedDB (`src/lib/idb.ts`), sync Supabase dual-write.
  Source : `README.md:5-11`.
- Volume : 16 462 lignes `src/`, port 4444, version 0.9.x « The Nexus
  Convergence — Agent Portal Alpha ». Source : `REALITY_MAP.md:15-17`.
- Apps internes : `command-center`, `para`, `ikigai`, `life-wheel`,
  `agent-portal`. Source : `README.md:15-22`.
- Architecture : écritures cross-LD via un routeur unique (`ld-router.ts`),
  pas d'écriture directe IndexedDB hors routeur, pas d'import conditionnel dans
  la boucle `windows.map` de `Desktop.tsx`. Source : `REALITY_MAP.md:267-280`.

## 2. Règles de livraison (extraits contractuels)

- Baseline : `npm run lint` (actuellement `tsc --noEmit`) puis `npm run build`
  (Vite). **Ce ne sont pas des tests fonctionnels.** Aucun script `npm test`
  n'existe dans la baseline inspectée ; un runner manquant se crée
  explicitement ou ne se prétend pas existant. Source :
  `CONTRAT-COMMUN.md:37`.
- Contenu d'une PR : PRD couverts/non couverts, fichiers touchés, base commit,
  commandes/rc, résultats métier, migrations/rollback, dépendances,
  limitations. `COMPLETED`, PR créée, tests locaux et merge sont des états
  distincts ; le reviewer ne copie pas le verdict du maker ; les tests de la
  base se rejouent après intégration sur branche de revue, sans push main.
  Source : `CONTRAT-COMMUN.md:41`.
- Un fichier partagé n'a qu'un writer à la fois ; `package.json`, lockfile,
  routes globales, types partagés et schéma ne se modifient qu'avec ownership
  explicite de la tranche, sinon patch d'intégration séparé. Source :
  `CONTRAT-COMMUN.md:35`.
- Frontières : SQLite natif, filesystem, processus, cron, secrets et Jules REST
  côté service/CLI, jamais dans le bundle Vite ; aucun token dans `VITE_*`,
  localStorage, logs ou prompts ; le tenant se déduit de la session
  authentifiée. Source : `CONTRAT-COMMUN.md:27`.
- Sources absentes : Jules ne voit pas `C:/Users/amado/ASpace_OS_V3` ;
  dépendance documentaire absente du dépôt = `BLOCKED_SOURCE`, jamais de
  fiction de corpus. Source : `CONTRAT-COMMUN.md:45`.
- Timestamps de protocole : UTC ISO-8601. Source : `CONTRAT-COMMUN.md:47`.

## 3. État du programme au 2026-09-12

- Audit des 55 PRD (catégories 0-9) terminé, correctifs insérés dans chaque
  PRD (bloc « Correctif de délégation »). Rapports :
  `delegation-a-jules/audit/REVIEW-GROUPE-0-3.md`, `REVIEW-GROUPE-4-6.md`,
  `REVIEW-GROUPE-7-9.md`. Ce sont des analyses documentaires, pas des preuves
  runtime. Source : `AUDIT-ET-ORCHESTRATION.md:7`.
- Un seul envoi prouvé : job PRD-011, session `sessions/7587937436525114170`,
  statut `UNCERTAIN` (reçu `audit/dispatch-state.json`). À réconcilier, pas
  une preuve d'integration. Session PRD-003 connue : `1391687838750096362`,
  à relire, jamais recréer. Source : `AUDIT-ET-ORCHESTRATION.md:47`.
- Quota : Pro annoncé 100 tâches/24h glissantes, 15 concurrentes
  (https://jules.google/docs/usage-limits, consulté pendant l'audit). Ce n'est
  pas un compteur du compte : quota réel `UNKNOWN`. Source :
  `CONTRAT-COMMUN.md:13`.
- Registre des 55 tranches : `orchestration/governance/work-items.json`
  (managers par catégorie modulo 3, dépendances vérifiées, scopes exclusifs).

## 4. Hors périmètre (à ne jamais transmettre)

Corpus privé `ASpace_OS_V3` (Jules n'y a pas accès), sessions brutes,
`.env`, secrets, clés (`ck_…`, tokens, clés Stripe/Linear/Jules). Les chemins
V3 cités dans certains PRD (ex. `70_Onthologies/sujets/*.ttl`) sont des
origines documentaires, jamais des dépendances runtime.

## 5. Ce paquet ne contient pas

Aucune donnée client, aucun contenu de franchise, aucun chiffre plausiblement
fabriqué. Les quatre franchises (ABC, RILCOT, Alikaly, Marina) sont du
contexte d'orientation Pôle 1, pas des exigences produit suffisantes ni une
autorisation de déployer.