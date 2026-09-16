# Mandat complet catégorie 5

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
## SOURCE : delegation-a-jules/categorie-5-convergence-blackboard-jules-api/PRD-051-JULES-API-AGENT-PORTAL-DISPATCHER.md

# PRD-051: Client Jules API & Dispatcher dans Agent Portal

## Objectif
Permettre à l'interface Agent Portal (Life OS / Agent OS) d'interagir directement avec l'API Jules (Google Labs) pour déléguer des tâches de code aux agents A1/A2 de façon autonome.

## Spécifications
- Créer src/services/jules/jules-api-client.ts avec typage strict des requêtes Jules API (createSession, listSessions, approvePlan, sendMessage).
- Composant JulesDispatcherCard.tsx dans Agent Portal affichant les quotas quotidiens, l'état des sessions et un bouton de déclenchement rapide par PRD.
- Support du mode AUTO_CREATE_PR pour automatiser l'enchaînement sans blocage humain.
- Validation obligatoire : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build`.

## Correctif de délégation (audit 2026-09-12)

> Contrat commun : [`../CONTRAT-COMMUN.md`](../CONTRAT-COMMUN.md) (cree par le parent — lecture obligatoire avant toute execution).
### Dependances PRD
- PRD-051 est le **proprietaire du client Jules** : PRD-044, PRD-054 et PRD-055 consomment le dispatcher, jamais l'API directe.
- Le client requiert un **service local Node** qui detient la cle et proxifie l'API Jules.

### Securite (bloquant)
- **La cle API Jules ne doit JAMAIS figurer dans une variable `VITE_*` ni dans aucun code execute par le navigateur** (le bundle Vite expose tout ce qui est importe cote client). Tout appel passe par le service local ; le bundle ne transporte aucun secret.

### Quotas (mesure / suppose)
- Documentation officielle Jules (Pro) : 100 taches / 24 h glissantes, 15 taches concurrentes. L'API n'expose pas de compteur utilisateur prouve : si aucune reponse n'porte de champ de quota, l'UI affiche « quota inconnu » — **aucun chiffre de quota invente**.

### AUTO_CREATE_PR
- Pour les tâches de code couvertes par le mandat courant : `AUTO_CREATE_PR` et `requirePlanApproval: false` explicites, sans redemande humaine de convenance. Le mode reste désactivable. Nouvelle portée irréversible, merge ou déploiement : autorisation distincte ; la création d'une PR autorisée ne doit pas être reclassée arbitrairement en porte humaine.

### Idempotence
- Identité de job stable = repository/catégorie/tranche ; hash du brief enregistré comme version séparée. Une retouche de brief ne recrée jamais un job actif. Timeout après POST = UNCERTAIN, inventaire paginé et réconciliation avant toute nouvelle tentative ; le seul hash de prompt ne suffit pas.

### Criteres d'acceptation
- Positifs : lint+build ; `createSession`, `listSessions`, `approvePlan`, `sendMessage` typés strictement ; etats de session affiches depuis les reponses reelles de l'API.
- Negatifs : aucun secret cote navigateur ; pas de quota fictif ; pas de session double au rejeu ; API injoignable = UI vide/erreur explicite, jamais de donnees de demonstration.


---
## SOURCE : delegation-a-jules/categorie-5-convergence-blackboard-jules-api/PRD-052-BLACKBOARD-SHARED-SQLITE-ENGINE.md

# PRD-052: Moteur Blackboard SQLite Partagé

## Objectif
Remplacer les états mémoires volatils par une base SQLite locale déterministe (Blackboard) gérant le cycle de vie des intentions, des verrous (locks) et des preuves d'exécution.

## Spécifications
- Schéma SQLite : tables blackboard_items, agent_locks, vessel_states, action_receipts.
- Driver d'accès local-first (IndexedDB sous le capot dans le browser, relayé vers le bridge SQLite local).
- Gestion des verrous de concurrence pour empêcher deux agents de travailler sur le même fichier.
- Validation obligatoire : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build`.

## Correctif de délégation (audit 2026-09-12)

> Contrat commun : [`../CONTRAT-COMMUN.md`](../CONTRAT-COMMUN.md) (cree par le parent — lecture obligatoire avant toute execution).
### Dependances PRD
- **PRD-011 (cat. 1) est le PROPRIETAIRE du schema Blackboard.** PRD-052 est le **moteur/consommateur** : il reference les tables `blackboard_items`, `agent_locks`, `vessel_states`, `action_receipts` telles que definies par PRD-011 et **ne cree pas de second schema**. Toute divergence = arbitrage au contrat commun, jamais une migration locale parallele.

### Frontiere d'execution (bloquant)
- SQLite **cote service Node uniquement**. Aucun driver SQLite natif dans le bundle React. « IndexedDB sous le capot » dans le navigateur = cache/vue de lecture ; la **source de verite est le fichier SQLite du service** — les deux plans ne se remplacent pas par decret.

### Verrous
- `agent_locks` : verrou = (ressource, agent, TTL). TTL obligatoire — un crash ne doit pas verrouiller a jamais ; reprise = reprise du lock expire, non destructive.

### Criteres d'acceptation
- Positifs : lint+build ; deux ecritures concurrentes sur la meme ressource ne corrompent rien (le second agent est bloque par le lock) ; chaque action produite laisse un `action_receipts`.
- Negatifs : pas de second schema ; pas de SQLite dans le navigateur ; pas d'ecriture directe en base depuis un composant React.

### Persistance / reprise
- Fichier SQLite du service : copie de sauvegarde avant toute migration ; migrations additives uniquement ; rollback = restauration de la copie (non destructif).


---
## SOURCE : delegation-a-jules/categorie-5-convergence-blackboard-jules-api/PRD-053-LIFE-WHEEL-DISCOVERY-ENGINE.md

# PRD-053: Moteur Discovery Wheel (LD01 à LD08) & Swarms Métier

## Objectif
Connecter les 8 domaines de la Discovery Wheel (ZORA, Saru, Culber, Tilly, Stamets, Burnham, Reno, Georgiou) aux 8 escouades métier de Business OS (Guardians, Illuminati, Avengers, Fantastic4, Kang, Thunderbolts, X-Men, Eternals).

## Spécifications
- Créer src/apps/frameworks/wheel/DiscoveryWheelEngine.tsx.
- Cartographie dynamique associant chaque domaine de vie à son sous-système de valeur réelle et de protection.
- Synchronisation des jauges avec les livrables concrets (ex: LD01/Business -> JaaS Landing & OMK Mobile).
- Validation obligatoire : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build`.

## Correctif de délégation (audit 2026-09-12)

> Contrat commun : [`../CONTRAT-COMMUN.md`](../CONTRAT-COMMUN.md) (cree par le parent — lecture obligatoire avant toute execution).
### Dependances PRD
- Consomme PRD-041 (roster Zora/Discovery) ; la cartographie LD01-LD08 <-> escouades Business OS est une **donnee de configuration** (`src/config/`), pas de la logique dispersee dans les composants.

### Correction de portee (mesuree)
- `src/apps/life-wheel/` existe deja (contenu substantiel) : implementer `DiscoveryWheelEngine.tsx` dedans, pas sous `src/apps/frameworks/wheel/`. Pas de second moteur de roue.

### Donnees reelles (D2)
- Les jauges reflètent des livrables **mesures** (ex. LD01/Business <-> JaaS Landing & OMK Mobile : liens vers artefacts reels). Une jauge sans donnee source affiche « non mesure » — jamais une valeur plausible.

### Criteres d'acceptation
- Positifs : lint+build ; les 8 domaines LD01-LD08 mappes vers les 8 escouades ; chaque jauge cite sa source de donnee.
- Negatifs : pas de score invente ; pas de synchronisation Linear directe ici (canaux : PRD-012 cat. 1 et PRD-063) ; pas de secret.

### Persistance / reprise
- Cartographie versionnee en config (diffable) ; jauges alimentees par les stores existants ; rollback = `git checkout`.


---
## SOURCE : delegation-a-jules/categorie-5-convergence-blackboard-jules-api/PRD-054-GTD-DEAL-AUTONOMOUS-SWARM-PIPELINE.md

# PRD-054: Pipeline Autonome Swarm GTD Cerritos & DEAL Protostar

## Objectif
Fusionner la capture GTD (Mariner/Boimler) avec la matrice d'élimination et d'automatisation DEAL (Dal/Rok-Tahk/Zero/Gwyn) pour réduire la friction de charge cognitive de l'opérateur.

## Spécifications
- Créer src/apps/frameworks/pipelines/GtdDealSwarmPipeline.tsx.
- Système de tri automatique : chaque item entrant dans GTD Inbox est qualifié par l'agent A1 Beth, puis routé soit vers l'automatisation DEAL, soit vers une tâche tactique 12WY.
- Télémétrie d'économie de temps et de tokens affichée en direct.
- Validation obligatoire : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build`.

## Correctif de délégation (audit 2026-09-12)

> Contrat commun : [`../CONTRAT-COMMUN.md`](../CONTRAT-COMMUN.md) (cree par le parent — lecture obligatoire avant toute execution).
### Dependances PRD
- Depend de **PRD-052** (verrous Blackboard), **PRD-062** (gates A3) et **PRD-051** (declenchement Jules eventuel). Consomme PRD-041 (rosters Cerritos/Protostar).

### Telemetrie (bloquant)
- « Economie de temps et de tokens affichee en direct » : **valeurs mesurees uniquement**. Tokens = consommations reelles si l'API les expose ; temps = durees reelles horodatees. Toute estimation est libellee « estimation » ; a defaut de donnee, la tuile affiche « non mesure ». Pas de telemetrie fictive.

### Autonomie bornee
- Le tri et les actions réversibles dans le mandat sont automatiques avec reçu et condition d'arrêt. Les délégations autorisées passent par PRD-051/056 ; aucun appel direct depuis la vue. Seules une portée nouvelle ou une opération irréversible nécessitent un arbitrage distinct : pas d'approbation humaine obligatoire par item.

### Criteres d'acceptation
- Positifs : lint+build ; un item qualifie est route vers DEAL/12WY exactement une fois (idempotent au rejeu) ; telemetrie = mesures reelles ou « non mesure ».
- Négatifs : pas de double routage, d'exécution hors mandat ou de statut simulé ; ne pas exiger une nouvelle approbation pour chaque action réversible déjà autorisée.

### Persistance / reprise
- Routages traces dans `action_receipts` (PRD-052) ; une erreur de routage se corrige en reclassant l'item (jamais supprime) ; rollback code = `git checkout`.


---
## SOURCE : delegation-a-jules/categorie-5-convergence-blackboard-jules-api/PRD-055-UNIFIED-CONVERGENCE-DASHBOARD.md

# PRD-055: Dashboard Unifié de Convergence & Holding Linear QG

## Objectif
Fournir le poste de pilotage suprême unifiant Life OS et Business OS, affichant l'état de santé des 6 Frameworks, la progression des PRDs Jules et la synchronisation avec le QG Linear.

## Spécifications
- Créer src/apps/convergence/ConvergenceCommandCenter.tsx.
- Vue synoptique : Radar des 6 Vaisseaux, statut des sessions Jules en cours, score 12WY global et télémétrie Blackboard.
- Pont bidirectionnel avec les issues et équipes Linear.
- Validation obligatoire : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build`.

## Correctif de délégation (audit 2026-09-12)

> Contrat commun : [`../CONTRAT-COMMUN.md`](../CONTRAT-COMMUN.md) (cree par le parent — lecture obligatoire avant toute execution).
### Dependances PRD
- Agrege : PRD-041 (frameworks), **PRD-051** (sessions Jules), **PRD-052** (telemetrie Blackboard), PRD-054 (pipeline), PRD-064 (crons).
- Linear : le canal est **PRD-012 (cat. 1, Linear HQ)** et/ou PRD-063 (LinearSyncTool). **Pas de second client Linear** dans ce dashboard.

### Criteres d'acceptation
- Positifs : lint+build ; radar des 6 vaisseaux alimente par l'etat reel (PRD-045/052) ; sessions Jules = reponses API reelles ; score 12WY depuis `fw-12wy.store.ts` existant.
- Negatifs : aucune donnee de demonstration ; UI vide ou en erreur = etat explicite affiche, jamais des valeurs par defaut flatteuses ; pas de secret dans le bundle.

### Isolation / performance
- Composant de presentation : aucune ecriture directe SQLite/IndexedDB — lecture via services, actions dispatchees aux stores existants.

### Reprise
- Fichier unique `src/apps/convergence/ConvergenceCommandCenter.tsx` (+ sous-composants) : suppression = retour a l'etat anterieur, non destructif.


---
## SOURCE : delegation-a-jules/categorie-5-convergence-blackboard-jules-api/PRD-056-THREE-CATEGORY-DISPATCH-AND-RECOVERY.md

# PRD-056 — Admission trois catégories, parallélisme Jules et récupération

## Objectif
Supprimer le verrou sériel « une session active bloque tout », sans fabriquer des tâches pour consommer un abonnement. Tous les PRD des dix catégories entrent dans un backlog vérifiable ; trois catégories maximum sont admises simultanément. Remplace le suivi manuel sériel ; réutilise le scheduler/blackboard existant plutôt qu'ajouter un daemon concurrent. Appliquer [le contrat commun](../CONTRAT-COMMUN.md).

## Dépendances et périmètre
PRD-011/016 pour états/contrats, PRD-026 pour droits, PRD-051 pour adaptateur Jules. Périmètre proposé : module serveur de dispatch et tests ; carte UI dans namespace Jules ; aucune clé côté Vite. Le dispositif opératoire initial peut être un outil CLI borné, séparé du futur runtime applicatif et sans prétendre à une cadence autonome déjà installée.

## Spécification
1. File durable par catégorie puis tranches PRD : requested→ready→reserved→submitted→running→pr_ready→verified→integrated ; blocked/failed/uncertain distincts. `COMPLETED` Jules n'est pas integrated. Dépendances satisfaites par reçu de commit intégré + tests, pas existence de PR.
2. Jusqu'à trois catégories actives, parallélisme configurable par scopes disjoints sous plafond compte. Pro publié : 100 tâches/24h glissantes, 15 concurrentes ; pas garantie du compte. Inclure autres dépôts et sessions en attente dans l'admission prudente. Quota inconnu affiché UNKNOWN ; 429 gèle les créations et respecte Retry-After/backoff.
3. Reprise d'une session existante par ID avant création. Identité logique stable repository/category/tranche ; version de brief dans un hash distinct. Une retouche de texte ne doit pas créer un second job actif. Réservation atomique avec lease/fencing et expiration ; unicité des effets, pas seulement verrou process.
4. POST create : persister intention avant appel. Timeout après envoi = UNCERTAIN ; réconcilier par inventaire paginé avant retry, pas réessayer aveuglément. Lire la session exacte après création ; vérifier source, titre, branche, mode PR et statut. `AUTO_CREATE_PR`, `requirePlanApproval` et accès variables d'environnement sont explicites ; PR automatique n'est pas merge automatique.
5. Réveils pilotés par événements si transport documenté disponible, sinon polling déterministe borné avec backoff/jitter. Ne pas supposer un webhook Jules inexistant. Pas d'appel LLM pour compter des états. États terminal→arrêt du suivi ; pas de tâches de remplissage.
6. Une erreur/réparation dans C0 n'empêche pas un job indépendant C1 ou C4. En revanche un consommateur attend l'intégration de son prérequis. Admission refuse collisions de fichiers/schéma/lockfile. Limiter la file de PR non revues selon capacité de review mesurée.
7. Observabilité : attente ready→submitted, durée job, cause blocage, PR recevables, reprise/échec, compteur sessions observées avec fenêtre UTC. Aucune estimation de quota convertie en compteur officiel.

## Acceptation fonctionnelle
- C0 running, C1/C4 indépendants ready : les deux sont admis sans dupliquer C0. Une quatrième catégorie reste en attente.
- Deux processus admettent le même job : un seul POST. Restart après POST à réponse perdue : réconciliation retrouve l'ID, aucun doublon.
- Dépendance non intégrée ou mêmes write_scopes : refus explicite ; tâches sans conflit restent possibles.
- Pagination sur plusieurs pages et sessions externes : toutes comptées ; pagination interrompue = aucun nouveau POST.
- 401/403/429/5xx, quota inconnu, demande de feedback et statut inconnu : états distincts, aucun faux succès, aucune boucle de retry rapide.
- Stop opérateur et queue vide : zéro création ; restart n'annule pas stop. Revue/merge manuel non contournés.

## Contrat de livraison
Tests unitaires/adversariaux du scheduler sur données SYNTHÉTIQUES explicitement isolées puis un canari réel autorisé et relu. Le canari prouve le transport, pas le débit de 100/jour. Fournir `npm run lint`, `npm run build` et commandes des tests créés. Dossier de retour arrière avec checkpoint et reprise sans doublon, désactivation sans effacement de jobs. Aucun secret, merge, paiement ou déploiement de production automatique.
