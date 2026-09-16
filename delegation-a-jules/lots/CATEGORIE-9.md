# Mandat complet catégorie 9

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
## SOURCE : delegation-a-jules/categorie-9-b3-polymorphic-matrix/PRD-091-B3-POLYMORPHIC-MATRIX-ENGINE.md

# PRD-091: B3 Polymorphic Matrix Engine & Dual-Axis Topology

## Correctif de délégation (audit 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (C7-9). **PRD propriétaire de la matrice des rôles B3** — tous les autres PRD de la catégorie (et cat 6 pour les A3) importent ses types, ils ne les recréent pas.

- **Dépendances PRD réelles** : socle de la catégorie — aucune dépendance amont interne. Dépendants : PRD-092, PRD-093, PRD-094, PRD-095 (cat 9). Relation cat 6 : PRD-061 est propriétaire de la compilation des compétences ; PRD-091 définit le type `B3IncarnationType` qui les référence, sans redéfinir leur contenu. Ne pas lancer les dépendants avant l'intégration de PRD-091.
- **Typos corrompues réparées (mesuré dans le texte initial)** : «Fonction 
esolveIncarnation» → `resolveIncarnation` ; «pm run build» → `npm run build` ; «px tsc --noEmit» → `npx tsc --noEmit`.
- **Write_scope (chemins concrets)** : `src/types/b3-polymorphic.ts` (création), `src/services/b3-matrix-engine.ts` (création). Fichier de spec `src/services/__tests__/b3-matrix-engine.test.ts` (création) — **constat mesuré** : package.json ne contient aucun script `test` ni runner (vitest/jest absents des deps). Ne jamais écrire que `npm test` existe ; soit ajouter vitest comme dépendance explicite (dette à assumer), soit la validation tient à `npm run lint` + `npm run build`.
- **Critères positifs** : les 4 types déclarés (B3IncarnationType, IntelligenceLevel, DeterminismLevel, B3WorkerDescriptor + B3CompositeAssembly) exactement comme spécifiés ; `resolveIncarnation(taskProfile: B3TaskProfile): B3WorkerDescriptor` est une fonction **pure et déterministe** : profil identique → incarnation identique ; tache 100% déterministe → jamais d'incarnation LLM (Hook ou CLI) ; `npm run lint` + `npm run build` à 0 erreur.
- **Critères négatifs** : aucun appel LLM réel dans la fonction de résolution (elle choisit, elle n'exécute pas) ; pas de coût token inventé sans source (les chiffres de coût restent des champs remplis par l'opérateur) ; pas de recréation des skills de PRD-061 ni des identités de PRD-041 ; pas de secret dans les descripteurs.
- **Sécurité & isolation** : B3WorkerDescriptor porte les autorisations I/O déclaratives ; l'application effective des autorisations relève du substrat PRD-092 (hooks) ; pas d'exécution réseau dans la résolution.
- **Idempotence & persistance** : la résolution est sans effet de bord ; le registre des descripteurs est déclaratif ; persistance des décisions d'incarnation (audit) côté blackboard SQLite service (schéma PRD-011, consommation PRD-052) — pas de substitution par IndexedDB navigateur par décret.
- **Reprise / rollback non destructif** : 2-3 fichiers exclusivement nouveaux ; rollback = retrait sans impact sur les apps existantes.

## Objectif
Concevoir et implementer le moteur central polymorphe B3, capable d instancier ou d adapter dynamiquement un agent B3 selon deux axes fondamentaux : le Degre d Intelligence Requis (Non-LLM -> Heuristique -> LLM Local -> Frontier Reasoning) et le Degre de Determinisme Requis (0% deterministe -> 100% atomique/verifie).

## Specifications
- Creer src/types/b3-polymorphic.ts :
  - B3IncarnationType: 'skill' | 'agent' | 'hook' | 'cron' | 'mcp' | 'plugin' | 'cli' | 'api' | 'composite'.
  - IntelligenceLevel: 'deterministic_code' | 'rule_based' | 'light_llm' | 'deep_reasoning'.
  - DeterminismLevel: 'strict_atomic' | 'gated_validation' | 'probabilistic_creative'.
  - B3WorkerDescriptor: Matrice decrivant les capacites, cout token, latence, autorisations I/O et vecteurs d execution.
  - B3CompositeAssembly: Combinaison fluide de plusieurs incarnations pour une meme mission (ex: CLI + Hook 5D + Skill + LLM Agent).
- Implementer src/services/b3-matrix-engine.ts :
  - Fonction resolveIncarnation(taskProfile: B3TaskProfile): B3WorkerDescriptor.
  - Resolution deterministe : si la tache est 100% deterministe (ex: calcul TVA, parsing JSON, verif de hashes), interdiction formelle d appeler un LLM ; resolution en Hook ou CLI script local.
  - Resolution hybride : si la tache necessite synthese + validation, instanciation d un couple Composite (Agent LLM supervise par Gate Hook de validation).
- Spec de test :
  - Créer ET exécuter les tests de résolution avec un runner explicitement ajouté/configuré dans le scope réservé. La présence du fichier test et lint/build seuls ne suffisent pas. Cas obligatoire : tâche déterministe jamais routée vers LLM ; profil invalide rejeté ; même profil = même résultat.
  - Valider npm run lint (tsc --noEmit) et npm run build.

---
## SOURCE : delegation-a-jules/categorie-9-b3-polymorphic-matrix/PRD-092-B3-DETERMINISTIC-SUBSTRATE-HOOKS-CRONS.md

# PRD-092: B3 Deterministic Substrate (Hooks 5D, Crons 4D & CLI Runners)

## Correctif de délégation (audit 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (C7-9). Substrat déterministe — consommé par PRD-093/094 et par les cadences de PRD-083.

- **Dépendances PRD réelles** : PRD-091 (matrice et descripteurs — les hooks/crons/CLI s'enregistrent comme incarnations, ils n'ont pas leur propre définition de rôle). Consommateurs : PRD-093 (pipeline de validation des outputs cognitifs), PRD-094 (composition d'essaims), PRD-083 (cadence hebdo via B3CronScheduler).
- **Typos réparées** : «rot rate» (corruption du texte initial) reformulé en «dégradation silencieuse / sortie corrompue» — sens supposé, à valider par le parent.
- **Write_scope (chemins concrets)** : `src/services/b3-deterministic-runtime.ts` (création), registres et schedulers dans `src/services/b3-runtime/` si besoin de découpage. Le runtime est un composant **service Node** (crons natifs, CLI, I/O disque) — pas un module React.
- **Critères positifs** : B3HookRegistry enregistre des intercepteurs synchrones pré/post-exécution et peut bloquer une exécution (retour refusé) ; B3CronScheduler gère les cadences déclarées (15m, 60s, quotidienne, weekly) avec horloge monotone et tolérance de dérive ; B3CliRunner exécute des scripts locaux sans appel réseau ; tout output d'un worker B3 cognitif passe par un hook de validation avant écriture disque ou publication API ; `npm run lint` + `npm run build` à 0 erreur.
- **Critères négatifs** : aucun cron en setInterval React (côté navigateur = mort à la fermeture d'onglet) ; pas de boucle infinie possible (budget d'itérations par hook) ; aucun hook ne contourne la règle d'arrêt B1/B2 (PRD-072/082) ; pas de fuite de données — un hook ne logue jamais le contenu des secrets.
- **Sécurité & isolation** : pipeline de sécurité : les hooks sont de niveau propriétaire (l'ordre d'enregistrement est déterministe) ; le CLI runner opère dans un répertoire de travail borné du repo, sans accès réseau ; pas d'élévation de privilège.
- **Idempotence & persistance** : crons idempotents (un déclenchement manqué est rattrapé une fois, pas N fois) ; l'état des crons/hooks persiste côté blackboard SQLite service (schéma PRD-011, consommation PRD-052).
- **Reprise / rollback non destructif** : désenregistrement d'un hook/cron = retrait de son fichier d'enregistrement, jamais d'édition du runtime en place ; rollback sans perte des traces d'exécution.

## Objectif
Standardiser l incarnation des agents B3 en composants deterministes a 100% sans cout de token (Niveau Substrat / 4D / 5D) : Hooks pre/post-execution, crons d ordonnancement et utilitaires CLI locaux.

## Specifications
- Definir l architecture dans src/services/b3-deterministic-runtime.ts :
  - B3HookRegistry : Enregistrement des intercepteurs synchrones pour empecher la degradation silencieuse, les fuites de donnees, les boucles infinies ou les depassements de budget.
  - B3CronScheduler : Gestionnaire d impulsions temporelles deterministes (cadence 15m, 60s, quotidienne, weekly) — composant service Node, jamais React.
  - B3CliRunner : Executeur natif de scripts locaux et d outils OS sans latence reseau ni appel cloud.
- Interface d integration :
  - Pipeline de securite : tout output d un worker B3 cognitif passe imperativement par un B3Hook de validation avant ecriture sur disque ou publication API.
- Typage strict sans warning, validation npm run lint (tsc --noEmit) + npm run build.

---
## SOURCE : delegation-a-jules/categorie-9-b3-polymorphic-matrix/PRD-093-B3-COGNITIVE-ARMS-SKILLS-MCP-PLUGINS.md

# PRD-093: B3 Cognitive Arms (Skills, MCP Servers & Antigravity Plugins)

## Correctif de délégation (audit 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (C7-9). Bras cognitifs B3.

- **Dépendances PRD réelles** : PRD-091 (types B3 — B3SkillModule etc. se déclarent comme incarnations du socle) ; PRD-092 (le pipeline de validation Hook s'applique aux outputs de ce dispatcher) ; **PRD-061 (cat 6) est propriétaire de la compilation des compétences** : ce PRD définit l'interface d'aiguillage, pas une deuxième bibliothèque de skills. PRD-051 (cat 5) est propriétaire du client serveur Jules — l'aiguillage flash/pro du PRD initial doit passer par ce client et ne pas créer un second client d'inférence.
- **Write_scope (chemins concrets)** : `src/types/b3-cognitive.ts` (création), `src/services/b3-cognitive-dispatcher.ts` (création). Le bridge MCP vit côté service Node (I/O disque/réseau) ; seul l'aiguillage est importable côté UI.
- **Critères positifs** : B3SkillModule représente une fiche SKILL.md avec frontmatter YAML et protocoles d'activation (format déclaré, pas un parser exécutant des compétences recréées) ; B3McpBridge typé pour exposer/consommer des outils via le protocole MCP ; B3PluginAdapter enregistre les extensions Agent OS/Antigravity ; l'aiguillage de quota prend en compte un budget de tokens fourni en configuration, jamais deviné ; `npm run lint` + `npm run build` à 0 erreur.
- **Critères négatifs** : aucune clé API ni endpoint authentifié dans le code navigateur ou `VITE_*` — les credentials MCP vivent côté service ; pas de compteur de quota Jules inventé (quota officiel : 100 tâches/24 h glissantes Pro, 15 concurrentes — pas de compte par utilisateur prouvé) ; pas de recréation des skills de PRD-061 ; pas de télémétrie fictive dans le dispatcher.
- **Sécurité & isolation** : la fenêtre de contexte passée à un worker est tronquée par le dispatcher, jamais débordée ; escalade light_llm → deep_reasoning décide localement et deterministiquement (seuil déclaratif).
- **Idempotence & persistance** : l'enregistrement de plugins/skills est idempotent (clé = id de module) ; l'usage des bras cognitifs est journalisé côté service (schéma PRD-011, consommation PRD-052) pour l'observabilité, sans contenu sensible.
- **Reprise / rollback non destructif** : retrait des fichiers créés ; les plugins tiers non branchés restent inertes, pas de migration destructive.

## Objectif
Implementer la couche cognitive extensible des agents B3 pour les taches a fort besoin de raisonnement et de navigation semantique via les interfaces MCP, les skills specialises et les plugins Antigravity.

## Specifications
- Creer src/types/b3-cognitive.ts et src/services/b3-cognitive-dispatcher.ts :
  - B3SkillModule : Fiche d instructions operationnelles executables (SKILL.md) avec YAML frontmatter et protocoles d activation.
  - B3McpBridge : Connecteur standardise pour exposer et consommer des outils via le protocole MCP (Model Context Protocol) : exploration, bases de donnees, filesystem, API partenaires — côté service Node, credentials hors du bundle navigateur.
  - B3PluginAdapter : Enregistrement modulaire des extensions pour l ecosysteme Agent OS et Antigravity.
- Gestionnaire de quotas et de contexte :
  - Prise en compte dynamique du budget de tokens et de la fenetre de contexte (budget fourni en configuration, jamais inventé).
  - Aiguillage intelligent : delegation de premier niveau a flash/flash_lite pour la collecte, escalade vers pro pour l arbitrage de haut niveau — via le client PRD-051, pas de second client.

---
## SOURCE : delegation-a-jules/categorie-9-b3-polymorphic-matrix/PRD-094-B3-DYNAMIC-ORCHESTRATOR-SWARM-COMPOSER.md

# PRD-094: B3 Swarm Composer & Dynamic Topology Adaptor

## Correctif de délégation (audit 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (C7-9). Composeur d'essaims — dépend de tout le socle cat 9.

- **Dépendances PRD réelles** : PRD-091 (`resolveIncarnation` — la composition appelle le moteur de résolution, elle ne recrée pas la matrice des rôles) ; PRD-092 (CLI d'ingestion et Hook de certification sont des incarnations du substrat) ; PRD-093 (les agents d'analyse et MCP d'accès sont des bras cognitifs) ; émetteur : PRD-082 (directive de mission transmise par B2) ou B1 via PRD-072/075.
- **Typos réparées** : «
ssembleSwarm» → `assembleSwarm` (corruption mesurée du texte initial).
- **Write_scope (chemins concrets)** : `src/services/b3-swarm-composer.ts` (création), types de topologie dans `src/types/b3-polymorphic.ts` (référencés, pas réécrits — coordonner avec PRD-091).
- **Critères positifs** : `assembleSwarm(missionDirective: MissionDirective): B3SwarmTopology` produit l'escouade déclarée (1 CLI d'ingestion, 1 MCP d'accès, 2 agents d'analyse parallèles, 1 hook de certification) ; vérification de compatibilité d'interfaces avant le montage (rejet explicite si incompatibles) ; métriques réelles (empreinte mémoire mesurée via performance.node, temps de traitement, ratio erreurs/validations) ; `npm run lint` + `npm run build` à 0 erreur.
- **Critères négatifs** : pas de deadlock par conception (verrous ordonnés, timeouts déclarés) ; pas d'essaim lancé sans directive de mission venant de B1/B2 (règle d'arrêt PRD-072) ; pas de métriques simulées — si une métrique n'est pas mesurable, elle est absente, jamais fausse ; pas de double exécution d'un même worker dans l'essaim.
- **Sécurité & isolation** : chaque worker de l'escouade hérite des autorisations I/O de son B3WorkerDescriptor (PRD-091), appliquées par les hooks PRD-092 ; l'escouade ne peut pas accéder aux secrets.
- **Idempotence & persistance** : `assembleSwarm` est déterministe (même directive → même topologie) et ne démarre rien : montage de la topologie seulement ; le cycle de vie d'un essaim persisté côté blackboard SQLite service (schéma PRD-011, consommation PRD-052).
- **Reprise / rollback non destructif** : l'arrêt d'un essaim libère ses ressources dans l'ordre inverse du montage ; traces conservées ; rollback = désenregistrement du composeur, sans effet sur les services PRD-092/093.

## Objectif
Fournir le composeur dynamique capable d assembler des essaims heterogenes de B3 a la volee en reponse a un profil de mission complexe transmis par les VP B2 ou le Summer-Verse CEO B1.

## Specifications
- Implementer src/services/b3-swarm-composer.ts :
  - assembleSwarm(missionDirective: MissionDirective): B3SwarmTopology.
  - Capable de monter une escouade sur mesure combinant :
    - 1 CLI deterministe d ingestion (B3 Substrat).
    - 1 MCP d acces ontologique / bases (B3 Plomberie).
    - 2 Agents d analyse paralleles (B3 Cognitifs).
    - 1 Hook de cloture et certification (B3 Gate).
  - Verification de compatibilite des interfaces et absence de deadlock mutex.
- Metriques et observabilite :
  - Suivi en temps reel de l empreinte memoire, du temps de traitement et de la fiabilite (ratio erreurs / validations) — mesures réelles, pas de télémétrie fictive.

---
## SOURCE : delegation-a-jules/categorie-9-b3-polymorphic-matrix/PRD-095-B3-MATRIX-COCKPIT-VISUAL-INSPECTOR.md

# PRD-095: B3 Polymorphic Matrix Cockpit & Visual Inspector UI

## Correctif de délégation (audit 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (C7-9). Terminal UI de la catégorie — visualise, n'invente pas.

- **Dépendances PRD réelles** : PRD-091 (matrice, IntelligenceLevel × DeterminismLevel — le cockpit rend ces types, il ne les redéfinit pas) ; PRD-092 (états Idle/Running/Gated des hooks et crons) ; PRD-093 (consommation token et déclencheurs des bras cognitifs) ; PRD-094 (essaims actifs à visualiser) ; intégration shell Life OS : `src/components/Desktop.tsx` et `AppDrawer.tsx` existants — consommer le mécanisme d'enregistrement existant, pas en créer un second.
- **Write_scope (chemins concrets)** : `src/components/b3-matrix/B3MatrixCockpit.tsx` et composants du dossier `src/components/b3-matrix/` (création — le dossier src/components existe) ; point d'enregistrement dans la navigation existante (édition minimale de `register.ts`/`AppDrawer.tsx`).
- **Critères positifs** : grille 2D interactive (X = degré d'intelligence, Y = degré de déterminisme) rendant les workers B3 actifs avec badges d'état ; drawer d'inspection par incarnation (source, logs, consommation token mesurée, déclencheurs) ; curseur d'arbitrage forçant une tâche vers le mode déterministe (CLI/Hook) pour économiser les tokens — ce forçage passe par PRD-091 (profil surchargé), pas une bifurcation privée du cockpit ; `npm run lint` + `npm run build` à 0 erreur.
- **Critères négatifs** : aucune incarnation fictive affichée quand aucune n'est active — grille vide + « matrice inoccupée » ; pas de télémétrie simulée ; pas de secret dans les logs rendus ; le curseur n'autorise jamais à contourner le verrou déterministe de PRD-091 (une tâche 100% déterministe reste interdite au LLM) ; pas de recréation des identités (PRD-041) ou des compétences (PRD-061).
- **Sécurité & isolation** : le drawer affiche les logs tronqués côté service (pas le contenu des I/O sensibles) ; le forçage d'arbitrage est journalisé (audit décision humaine).
- **Idempotence & persistance** : le cockpit est une projection lecture seule des états PRD-092/094 ; les décisions d'arbitrage persistées côté blackboard SQLite service (schéma PRD-011, consommation PRD-052).
- **Reprise / rollback non destructif** : retrait du composant et de son entrée de navigation ; aucune modification des stores existants.

## Objectif
Developper la vue visuelle interactive dans Life OS permettant a l operateur (Amadou Kone) et aux coordinateurs B2 de visualiser la matrice polymorphe B3, l etat de chaque incarnation (Skill, Agent, Hook, Cron, MCP, Plugin, CLI, API) et d arbitrer le curseur Intelligence vs Determinisme.

## Specifications
- Creer src/components/b3-matrix/B3MatrixCockpit.tsx :
  - Grille bidimensionnelle interactive (Axe X : Degre d Intelligence, Axe Y : Degre de Determinisme).
  - Visualisation des workers B3 actifs repartis sur la matrice avec badges d etat (Idle, Running, Gated, Complete).
  - Drawer d inspection detaille pour chaque incarnation (code source, logs, consommation token, declencheurs).
  - Curseur d arbitrage : permet de forcer une tâche vers un mode 100% deterministe (CLI/Hook) pour economiser le quota de tokens.
- Integration dans le shell et la navigation de Life OS (src/components/Desktop.tsx / AppDrawer.tsx existants).
- Valider la compilation Vite + TypeScript sans aucune erreur : npm run lint (tsc --noEmit) et npm run build.