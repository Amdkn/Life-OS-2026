# Mandat complet catégorie 2

Tous les PRD suivent. Ne relancer aucun travail déjà intégré. Implémenter par tranches testables en respectant les dépendances. Livrer une PR, jamais merge/push main ni déploiement. Les chemins locaux cités dans les anciennes sources sont inaccessibles sur la VM : ne pas inventer leur contenu. Les correctifs joints priment sur la version distante antérieure.

# Contrat commun de délégation — Life OS 2026

Statut : correctif documentaire de la délégation, non preuve d'implémentation. Ce contrat et les sections « Correctif de délégation » priment sur les formulations initiales incompatibles. Les exigences fonctionnelles ne sont pas supprimées. Une dépendance absente bloque la tranche concernée, pas les autres catégories indépendantes.

## Finalité et autorité

Amadou arbitre la vision et les actes irréversibles ; il n'est pas l'opérateur de saisie ni le mainteneur de chaque session. Cartographie fonctionnelle fournie : catégorie 0 = 4D ; 1–3 = 5D ; 4–6 = 6D ; 7–9 = 7D. Ces dimensions ne sont ni des permissions API ni des identités de processus. La création d'une PR n'autorise ni merge automatique, ni déploiement, ni suppression de données, ni virement, ni promotion machine→humain.

## Trois catégories, pas trois tâches arbitraires

L'orchestration admet au maximum trois catégories de ce programme simultanément. Le mandat contient TOUS leurs PRD, sans exiger qu'une catégorie monolithique passe dans une seule session. Une tranche = résultat testable + périmètre d'écriture exclusif + prérequis intégrés. Plusieurs tranches indépendantes peuvent utiliser plusieurs sessions ; un fichier partagé n'a qu'un writer à la fois. Les sessions existantes sont reprises/rattachées avant toute création. PRD-003 a une session connue `1391687838750096362` : relire son état, ne jamais la recréer aveuglément.

Le plafond Pro publié est 100 tâches sur 24h glissantes et 15 concurrentes (https://jules.google/docs/usage-limits, consulté pendant cet audit). Ce n'est pas un compteur de quota du compte. Comptabiliser les tâches des autres dépôts ; afficher UNKNOWN si l'inventaire est incomplet. Pas de plancher de travail artificiel ni de nouvelle tâche uniquement pour remplir 100/100. Le débit utile se mesure en PR acceptables/intégrées, avec temps de cycle et reprises.

## Un propriétaire pour chaque fondation

- PRD-001 (`categorie-0-12wy-snw/PRD-12WY-SQLITE-GLASSMORPHISM.md`) : persistance navigateur existante. Le nom historique SQLite ne prescrit pas un driver natif dans React. PRD-007 complète la preuve offline/reprise, sans prétendre que les IIFE sont une outbox durable.
- PRD-011 : migrations et schéma du blackboard SQLite côté service. PRD-052 implémente/étend son moteur de coordination ; pas de seconde base concurrente sans décision motivée.
- PRD-016 : contrats versionnés et essais d'intégration inter-catégories ; ne redéfinit pas les tables de PRD-011.
- PRD-041 : identités et rôles des six frameworks. PRD-061 compile leurs compétences ; PRD-091 compose les dimensions B3. Aucun nouveau roster parallèle.
- PRD-013 : registre des schedules ; PRD-064 et PRD-092 consomment/étendent le scheduler partagé. Aucun daemon par personnage ou par écran.
- PRD-024 : migration des scopes de stockage ; PRD-026 : enforcement API/auth/tenant. PRD-071 ajoute les instances franchise et PRD-073 la facturation sans inventer un second modèle d'identité.
- PRD-051 : adaptateur Jules serveur ; PRD-056 : admission/reprise des lots. Une machine à états de dispatch, pas deux pollers concurrents.

## Frontières de sécurité et données

SQLite natif, filesystem, processus, cron, secrets et Jules REST vivent côté service/CLI, jamais dans le bundle Vite. Le navigateur utilise un adaptateur HTTP authentifié. Aucun token Jules dans `VITE_*`, localStorage, logs ou prompts. Au serveur : authentification, autorisation par action et scope ; le tenant se déduit de la session authentifiée, pas d'un `tenantId` arbitraire envoyé par le client. Mode local anonyme, s'il existe, isolé et incapable d'atteindre les tenants authentifiés ou opérations externes.

Pas de shell arbitraire transmis via MCP/HTTP. Actions allowlistées, arguments validés, bornes de taille/durée, chemins canonisés avec contrôle des jonctions, origines autorisées et protection des mutations. Aucun corpus local privé transmis à Jules pour compenser une source distante absente : une source absente est un prérequis manquant, non une autorisation d'exfiltration.

Écritures durables : transaction, version de schéma, idempotency key, contrôle de concurrence/version, stratégie de conflit explicite et migrations répétables. Sauvegarde ET test de restauration sur copie avant migration. Pas de suppression destructive silencieuse. Ne pas lire `.env` pour alimenter un rapport.

## Livraison et preuve

Inspecter le code courant avant toute réécriture. Ne jamais annoncer un chemin proposé comme existant. Ne modifier `package.json`, lockfile, routes globales, types partagés ou schéma qu'avec ownership explicite pour la tranche ; sinon proposer un patch d'intégration séparé.

Depuis la racine : `npm run lint` (actuellement `tsc --noEmit`) puis `npm run build` (Vite). Ces commandes ne sont PAS des tests fonctionnels. Aucun script `npm test` n'existe dans la baseline inspectée ; si des tests sont nécessaires, fournir un runner reproductible et sa commande exacte, sans prétendre à une suite inexistante. Tests synthétiques isolés permis ; données et succès simulés interdits dans les écrans de production.

Chaque PRD doit avoir un cas positif et un cas négatif adaptés. Le test HTTP doit viser URL complète, endpoint et port exacts ; HTTP 200 sur le shell ne prouve ni DB, ni synchronisation, ni dispatch. UI : parcours réel, chargement/erreur/vide, navigation clavier, état frais daté et UNKNOWN distinct de zéro. La preuve porte sur le consommateur de l'événement, pas sur le fichier de configuration.

La PR contient : PRD couverts/non couverts ; fichiers touchés ; base commit ; commandes/rc ; résultats métier ; migrations/rollback ; dépendances ; limitations. `COMPLETED`, PR créée, tests locaux et merge sont des états distincts. Le reviewer ne copie pas le verdict du maker. Les tests de toute la base se rejouent après intégration dans une branche de revue, sans pousser main automatiquement.

## Sources absentes et reprise

Jules ne voit pas `C:/Users/amado/ASpace_OS_V3` depuis sa VM. Toute dépendance documentaire doit être dans le dépôt ou dans le prompt autorisé avec provenance ; sinon étiqueter `BLOCKED_SOURCE` et avancer uniquement sur les tranches sans cette dépendance. Ne pas créer de fiction de corpus ou de mandat.

Les timestamps de protocole sont UTC ISO-8601 ; fenêtres, timezone d'affichage et constantes temporelles métier restent explicites et sourcées. H90/horizon stratégique n'est pas une fréquence cron.

Ce fichier remplace les consignes contradictoires et le suivi sériel par défaut de ce programme. Il ne lance aucun service par sa seule présence.


---
## SOURCE : delegation-a-jules/categorie-2-ai-native-business-bridge/PRD-021-CLI-TOOLING-ADAPTER.md

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


---
## SOURCE : delegation-a-jules/categorie-2-ai-native-business-bridge/PRD-022-MCP-SERVER-STDIO.md

# PRD-022 — Serveur MCP STDIO natif pour Life OS


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-021 (le catalogue d'outils est le même registre — PRD-021 le crée, MCP l'expose) ; PRD-011 (`life_os_blackboard_post` écrit dans le service blackboard, schéma propriétaire PRD-011).

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : aucun `mcp/` au 2026-09-12 ; **`@modelcontextprotocol/sdk` ABSENTE de package.json** — la déclarer explicitement comme dépendance à ajouter, ne pas la présenter comme installée.
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** `node mcp/server.mjs` répond au handshake `initialize` JSON-RPC 2.0 ; `life_os_get_tactics`/`update_tactic`/`get_wheel_domains`/`blackboard_post` répondent ; stdout propre.

**Critères d'acceptation négatifs (doivent rester vrais) :** aucun console.log applicatif sur stdout (logs sur stderr uniquement) ; aucun secret dans `mcp.json` (le descripteur est committé) ; pas d'outils d'écriture destructeurs non validés ; le serveur ne lit pas le disque privé hors repo.

**Sécurité / isolation / idempotence / persistance :** stdio local = processus enfant de confiance mais pas une API réseau : ne pas ajouter de port TCP ouvert ; payloads validés côté serveur ; idempotence de `update_tactic` par tacticId.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** suppression de `mcp/` sans impact sur l'app ; `mcp.json` retiré de la config Antigravity si rollback.

## 1. Valeur et Remplacement
- **Origine Business OS :** `mcp/server.mjs`, `src/lib/tooling/adapters/mcp.ts` utilisant `@modelcontextprotocol/sdk`.
- **Obstacle dans Life OS :** Les agents externes (Antigravity, Jules, Hermes) doivent sonder le code ou parser des fichiers au lieu de requêter directement Life OS via le protocole standard MCP.
- **Remplacement :** Mettre en place un serveur MCP stdio (`mcp/server.mjs`) respectant la spécification JSON-RPC 2.0 sur `stdin`/`stdout`, isolant les logs d'erreur sur `stderr`.

## 2. Périmètre et Implémentation
- Brancher le serveur MCP sur le catalogue d'outils Life OS (`src/lib/tooling/catalog/`).
- Outils exposés via MCP :
  - `life_os_get_tactics(week, cycleId)` : Récupérer les tactiques 12WY.
  - `life_os_update_tactic(tacticId, status)` : Valider ou reporter une action.
  - `life_os_get_wheel_domains()` : État des jauges Life Wheel LD01-LD08.
  - `life_os_blackboard_post(workspaceId, eventType, payload)` : Injection directe d'événements.
- Configuration du descripteur `mcp.json` pour intégration immédiate dans Antigravity.

## 3. Acceptation Fonctionnelle
- Lancement de `node mcp/server.mjs` répondant au handshake standard `initialize` JSON-RPC.
- Aucun log applicatif ou console.log ne souille `stdout`.
- Validation avec `npm run lint` et `npm run build` (0 erreur).


---
## SOURCE : delegation-a-jules/categorie-2-ai-native-business-bridge/PRD-023-ASSISTANT-OVERLAY-MULTI-ROSTER.md

# PRD-023 — AssistantOverlay Multi-Agents & Roster Dynamique


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-011 (pont réactif : les tuiles s'abonnent aux événements blackboard, pas à un second store d'agents) ; PRD-024 (scopes si le roster est persisté par profil).

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : `src/hooks/useWindowManager.ts` (vérifié) ; `zustand` v5 en dépendance (useShallow disponible).
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** tuiles simultanées sans boucle infinie React (useShallow) ; bascule des bulles réactive ; positionnement libre avec borne anti-débordement d'écran.

**Critères d'acceptation négatifs (doivent rester vrais) :** pas de boucle de rendu infinie ; aucun roster fantôme au-delà de A0 Amadeus / A1 Beth / A1 Morty sans déclaration de source ; pas de télémétrie d'agent fictive ; pas de position persistée hors scope (PRD-024).

**Sécurité / isolation / idempotence / persistance :** positionnement borné au viewport ; le store persisté (si activé) passe par `createScopedStorage` (PRD-024) ; pas de contenu arbitraire exécuté depuis un payload d'agent (XSS : rendu texte, pas dangerouslySetInnerHTML).

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** composants additifs : revert sans impact sur le bureau existant.

## 1. Valeur et Remplacement
- **Origine Business OS :** `src/agent/AssistantOverlay.tsx`, `src/agent/AgentTile.tsx`, `src/stores/assistant.store.ts`.
- **Obstacle dans Life OS :** Un seul agent ou des assistants figés en texte, sans présence spatiale sur le bureau virtuel.
- **Remplacement :** Rapatrier le système d'assistants multi-personnages côte à côte sur le bureau virtuel, avec des tuiles `AgentTile` indépendantes, gestion des bulles de chat, et streaming de réponses.

## 2. Périmètre et Implémentation
- Créer le composant `src/agent/AssistantOverlay.tsx` s'abonnant à `assistant.store.ts`.
- Intégrer les tuiles d'agents pour l'Armada Life OS :
  - `A0 Amadeus` (Supervision souveraine).
  - `A1 Beth` (Conscience & Arbitrage Ikigai).
  - `A1 Morty` (Exécution tactique & Focus).
- Support de la sélection et du positionnement libre sur le bureau virtuel avec borne de sécurité anti-débordement d'écran (`useWindowManager`).

## 3. Acceptation Fonctionnelle
- Affichage simultané des tuiles d'agents sans boucle infinie React (`useShallow`).
- Bascule ouverture/fermeture des bulles de dialogue réactive.
- Validation avec `npm run lint` et `npm run build` (0 erreur).


---
## SOURCE : delegation-a-jules/categorie-2-ai-native-business-bridge/PRD-024-SCOPED-STORAGE-DEFENSIVE-MIGRATION.md

# PRD-024 — Scoped Storage & Moteur de Persistance Défensive


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-023 (assistant.store persiste sous scope) ; PRD-001 (idb.ts reste la couche IndexedDB ; le scoping s'applique aux clés, pas un second moteur) ; PRD-011 (un scope de blackboard multi-profils s'appuie sur le service, pas sur des clés localStorage).

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : `src/components/ViewportGuard.tsx` (vérifié présent) ; `LAYOUT_KEY = 'life-os-layout-v1'` : A SOURCER dans le code réel avant d'envelopper (clé à localiser).
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** charge corrompue injectée => réinitialisation de la vue par défaut sans écran blanc au reload ; isolation stricte des scopes ; enveloppe versionnée décodée et assainie au boot.

**Critères d'acceptation négatifs (doivent rester vrais) :** **« vérifiée par tests Jest/Vitest » est invalide au 2026-09-12 : aucun runner (jest, vitest) n'est déclaré dans package.json.** Soit ajouter vitest comme travail séparé et le déclarer, soit requalifier en vérification manuelle scriptée + npm run lint/build ; ne jamais présenter ces commandes comme des tests ; pas de réinitialisation silencieuse qui détruit des données utilisateur sans trace.

**Sécurité / isolation / idempotence / persistance :** réinitialisation défensive bornée à la zone corrompue, journalisée, jamais l'ensemble des données ; isolation multi-profils (Life OS perso vs Business OS pro) par préfixe de clé ; aucune migration destructrice sans sauvegarde préalable.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** enveloppement réversible : revert = les clés brutes redeviennent lisibles (conserver la compatibilité de lecture au premier boot post-rollback).

## 1. Valeur et Remplacement
- **Origine Business OS :** `src/lib/auth/storage-scope.ts`, `src/stores/migrationDefensive.ts`.
- **Obstacle dans Life OS :** Risque de collision de données localStorage/IndexedDB lors des montées de version de schémas ou de bascule multi-profils (ex: Life OS perso vs Business OS pro).
- **Remplacement :** Implémenter le stockage compartimenté par tenant/scope (`createScopedStorage(scope)`) et le décodeur d'enveloppe versionnée (`decodeVersionedEnvelope`) pour assainir automatiquement les données locales corrompues sans bloquer le boot.

## 2. Périmètre et Implémentation
- Envelopper les clés de layout (`LAYOUT_KEY = 'life-os-layout-v1'`) avec `SCHEMA_VERSION`.
- En cas de corruption ou de structure invalide, réinitialiser silencieusement la zone concernée sans provoquer d'écran blanc (White Screen of Death).
- Rapatrier `ViewportGuard.tsx` (`src/components/ViewportGuard.tsx`) pour assurer la cohérence du canvas sur toutes les résolutions.

## 3. Acceptation Fonctionnelle
- Test unitaire : injection d'une charge locale corrompue `localStorage.setItem(...)` ; au rechargement, Life OS réinitialise la vue par défaut sans planter.
- Isolation stricte des scopes vérifiée par tests Jest/Vitest.
- Validation avec `npm run lint` et `npm run build` (0 erreur).


---
## SOURCE : delegation-a-jules/categorie-2-ai-native-business-bridge/PRD-025-API-HARNESS-BUSINESS-BRIDGE.md

# PRD-025 — Pont API REST & Harness d'Orchestration Life OS <=> Business OS


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-011 (les événements de pont transitent par le blackboard si partagés) ; PRD-006 (les Strategic Time Blocks proviennent des blocs de temps, pas d'une estimation) ; PRD-005 (le bilan temps/énergie utilise les mesures réelles).

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : `express` déclaré dans dependencies ; **aucun serveur `api/` ni `src/lib/bridge/` présent au 2026-09-12** — l'API est à créer côté backend Node (express), jamais dans le bundle Vite.
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** payloads typés échangés sans régression ; GET retourne des jalons sourcés du repo Business OS, jamais des deadlines inventées ; commutateur trimodal affiché dans le header.

**Critères d'acceptation négatifs (doivent rester vrais) :** pas de secret dans les payloads ou le bundle navigateur ; pas d'appel réseau sortant non configuré ; aucun jalon cash-flow fabrique si la source Business OS n'est pas branchée (retourner vide explicite, pas des chiffres plausibles) ; l'API n'écrit pas dans les stores React directement.

**Sécurité / isolation / idempotence / persistance :** endpoints liés à localhost ; validation d'entrée des payloads (pas d'injection) ; CORS borné à l'origine locale ; pas de télémétrie sortante.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** endpoints additifs : rollback = arrêter le serveur et retirer les routes ; Life OS continue hors ligne.

## 1. Valeur et Remplacement
- **Origine Business OS :** `api/chat.ts`, `scripts/build-harness.mjs`, `_runtime/bridge/`.
- **Obstacle dans Life OS :** Fonctionnement en silo isolé sans communication bidirectionnelle avec les métriques et offres réelles de Business OS (The OMK Office, JaaS).
- **Remplacement :** Déployer les endpoints API et le harnais d'orchestration (`src/lib/bridge/business-bridge.ts`) permettant à Life OS de synchroniser le bilan temps/énergie avec le pipeline de valeur de Business OS.

## 2. Périmètre et Implémentation
- Route API de synchronisation :
  - `POST /api/bridge/life-to-business` : Transmission de la capacité de bande passante (Strategic Time Blocks disponibles).
  - `GET /api/bridge/business-to-life` : Réception des jalons critiques de cash-flow et deadlines clients pour alimenter W1-W12.
- Intégration dans le header de l'OS du commutateur trimodal (Tech OS, Life OS, Business OS).

## 3. Acceptation Fonctionnelle
- Échange de payloads typés entre Life OS et Business OS vérifié sans régression.
- Tests fonctionnels exécutés : `npm run lint` et `npm run build` à 0 erreur.


---
## SOURCE : delegation-a-jules/categorie-2-ai-native-business-bridge/PRD-026-AUTHORIZATION-TENANT-BOUNDARIES.md

# PRD-026 — Autorisations serveur, secrets et frontières des tenants

## Objectif
Rendre les bridges CLI/MCP/HTTP sûrs avant d'exposer orchestration et finance. Remplace la confiance dans un champ de payload par une autorisation effective. Appliquer [le contrat commun](../CONTRAT-COMMUN.md).

## Dépendances et périmètre
PRD-011 pour stockage serveur, PRD-016 pour contrats, PRD-024 pour migration de scopes. Ne dépend pas de l'UI holding PRD-075 ; celle-ci consomme ce socle. Examiner auth/routeurs existants. Périmètre proposé : middleware et tests sous `server/` ou backend existant après découverte ; adaptation de `src/lib/ld-router.ts` seulement en coordination avec son owner. Aucun fournisseur d'identité parallèle, aucun durcissement cassant la session courante sans rollback.

## Spécification
Principal authentifié→scopes accordés→action allowlistée→ressource tenant ; deny by default. Lire/écrire/dispatcher sont des droits distincts. Les clients MCP et CLI passent par les mêmes contrôles que HTTP ; aucun shell générique, chemin arbitraire, accès `.env` ou simple endpoint proxy réseau. Bloquer traversal, jonctions hors racines, SSRF localhost/cloud metadata pour URLs contrôlées par client. Taille/durée/rate limits et journal d'audit sans secrets. Origines CORS allowlistées ; mutations protégées contre requêtes cross-site selon le mécanisme d'auth retenu. Clés Jules exclusivement backend, rotation via configuration hors git. Secrets inaccessibles aux sessions Jules par défaut.

## Acceptation fonctionnelle
1. A autorisé agit sur ressource A ; preuve sur la vraie route/DB de test.
2. Même requête remplaçant tenantId par B : 403/404 et données B inchangées.
3. Token absent/expiré, rôle lecture sur commande d'écriture : refus sans effet.
4. Modes démo/local sans identité ne peuvent pas accéder au cloud ni aux tenants réels.
5. Traversal, chemin via jonction externe, injection shell et URL privée : rejets testés ; aucune fuite de token dans bundle, logs ou erreurs.
6. Redémarrage/rotation clé : anciennes sessions suivent politique explicitée, pas élévation de privilège.

## Contrat de livraison
Tests adversariaux isolés, commandes exactes, `npm run lint`, `npm run build`, scan du bundle contre marqueur-secret de test (jamais clé réelle). Démontrer un refus et une autorisation à travers chaque adaptateur. Rollback de configuration contrôlé, sans désactiver silencieusement les protections ni supprimer données. Aucun paiement ni déploiement réel requis.
