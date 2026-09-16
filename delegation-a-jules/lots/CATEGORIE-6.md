# Mandat complet catégorie 6

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
## SOURCE : delegation-a-jules/categorie-6-a3-multidimensional-swarm-factory/PRD-061-A3-SKILLS-MATRIX-COMPILER-ENGINE.md

# PRD-061: A3 Skills Matrix & Compiler Engine

## Objectif
Standardiser et compiler les compétences des agents A3 des six Frameworks définis par PRD-041 (dont PARA/Enterprise, sans confondre Beth/Morty avec des frameworks) et des huit escouades Business OS documentées. PRD-041 porte les identités ; ne pas les recréer ici.

## Spécifications
- Créer src/types/a3-skills.ts définissant A3SkillManifest, ToolRequirement, ExecutionCapability.
- Créer le registre central src/config/a3-skills-registry.ts référençant les capacités réelles de chaque agent.
- Générateur d'arbre de compétences (SkillTree.tsx) visualisant les dépendances et niveaux de maîtrise.
- Validation obligatoire : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build`.

## Correctif de délégation (audit 2026-09-12)

> Contrat commun : [`../CONTRAT-COMMUN.md`](../CONTRAT-COMMUN.md) (cree par le parent — lecture obligatoire avant toute execution).
### Dependances PRD
- **Consomme le contrat roster PRD-041** (identites vaisseaux/agents) — ne le redefine pas.
- **PRD-091 (cat. 9, matrice polymorphe B3)** est proprietaire de la matrice de roles : PRD-061 compile les **competences A3**, pas la matrice de roles ; tout chevauchement s'arbitre au contrat commun.

### Correction de portee
- `SkillTree.tsx` : s'interfacer avec l'arbre existant (PRD-015, cat. 1, relation diagram/skill tree) plutot que creer un doublon ; en tout etat de cause, pas de second format de manifeste.

### Capacites reelles (D2)
- Le registre ne declare que des **capacites verifiees** (outils reellement accessibles a l'agent a l'execution). Une competence non verifiee est marquee `unverified` — jamais « maitrise » par defaut.

### Criteres d'acceptation
- Positifs : lint+build ; registre type strict ; l'arbre visualise les dependances reelles entre manifestes ; `.agents/skills/` vit a la racine du repo (hors `src/`).
- Negatifs : pas de recreation du roster PRD-041 ni de la matrice PRD-091 ; pas de `any` ; pas de competence fantome affichee comme disponible.

### Reprise
- Ajoutitif (`src/types/a3-skills.ts`, `src/config/a3-skills-registry.ts`, `SkillTree.tsx`) ; rollback = suppression des fichiers crees, non destructif.


---
## SOURCE : delegation-a-jules/categorie-6-a3-multidimensional-swarm-factory/PRD-062-A3-5D-HOOKS-VETO-CIRCUIT-BREAKERS.md

# PRD-062: A3 5D Hooks & Veto Circuit Breakers

## Objectif
Empêcher les agents A3 d'introduire des régressions, des mocks vides ou des fuites de données grâce à des validation gates déterministes.

## Spécifications
- Créer src/services/hooks/a3-validation-gate.ts.
- Valider les 4 critères obligatoires d'un livrable A3 :
  1. Zéro placeholder (TODO, FIXME, mock non résolu).
  2. Typage strict sans type any permissif.
  3. Preuve d'exécution enregistrée (action_receipts).
  4. Horodatage strict Kentucky/Ohio (EDT/EST).
- Validation obligatoire : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build`.

## Correctif de délégation (audit 2026-09-12)

> Contrat commun : [`../CONTRAT-COMMUN.md`](../CONTRAT-COMMUN.md) (cree par le parent — lecture obligatoire avant toute execution).
### Dependances PRD
- Enregistre ses preuves dans `action_receipts` du Blackboard (PRD-052 moteur, PRD-011 schema).
- Execution **cote service Node** (hook/gate) : un gate dans le navigateur ne protege rien (contournable) et le build Vite n'est pas un garde-fou runtime.

### Specification des 4 criteres (rendue executable)
1. Zero placeholder : detection automatisee (recherche `TODO|FIXME|mock` sur le diff livre) — resultat mesure, pas declare.
2. Zero `any` : `tsc --noEmit` strict (+ regle de lint dediee si disponible).
3. Preuve d'execution : un `action_receipts` correspondant doit exister, sinon rejet.
4. Horodatage : fuseau IANA `America/New_York` (EDT/EST) — « Kentucky/Ohio » designe la zone geographique, le code utilise l'identifiant IANA.

### Criteres d'acceptation
- Positifs : un livrable conforme passe ; chacun des 4 criteres produit un verdict explicite ; gate distinct de `npm run build` (le build ne remplace pas le gate).
- Negatifs : pas de contournement silencieux (echec de gate = statut bloque persiste, pas un warning) ; pas de PII dans les receipts.

### Idempotence / reprise
- Reevaluer un meme livrable donne le meme verdict (deterministe) ; un rejet laisse le livrable intact sur disque (rien d'ecrase) ; rollback code = `git checkout` du gate.


---
## SOURCE : delegation-a-jules/categorie-6-a3-multidimensional-swarm-factory/PRD-063-A3-SPECIALIZED-MCP-TOOLS-HARNESS.md

# PRD-063: A3 Specialized MCP Tools Harness

## Objectif
Relier les agents A3 à leur boîte à outils technique via le protocole MCP (Model Context Protocol).

## Spécifications
- Créer src/services/mcp/a3-mcp-client.ts.
- Connecter les outils :
  - HoldingStripeTool (pour Bucky/Finance Thunderbolts).
  - WebAuditPlaywrightTool (pour Rocket/Automation Guardians).
  - DocumentParserTool (pour Mariner/Inbox Cerritos).
  - LinearSyncTool (pour l'équipe Swarm globale).
- Validation obligatoire : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build`.

## Correctif de délégation (audit 2026-09-12)

> Contrat commun : [`../CONTRAT-COMMUN.md`](../CONTRAT-COMMUN.md) (cree par le parent — lecture obligatoire avant toute execution).
### Dependances PRD
- Client MCP **cote service Node** : les serveurs MCP sont des processus ; le navigateur ne peut ni les lancer ni leur parler directement. L'UI (PRD-065) affiche, n'execute pas.
- LinearSyncTool : coordonne avec PRD-012 (cat. 1, Linear HQ) — un seul espace d'identifiants/equipe ; ce PRD expose l'outil, pas un second workspace.

### Securite (bloquant)
- HoldingStripeTool : cles Stripe **uniquement cote service Node**, jamais `VITE_*` ni bundle navigateur ; operations de paiement = portes irreversibles -> approbation humaine obligatoire.
- WebAuditPlaywrightTool : navigateur headless isole (profil jetable, pas d'acces au profil utilisateur, aucun secret du repo expose a la page auditee).

### Criteres d'acceptation
- Positifs : lint+build ; les 4 outils (`HoldingStripeTool`, `WebAuditPlaywrightTool`, `DocumentParserTool`, `LinearSyncTool`) typés avec entrees/sorties strictes ; echec d'outil = erreur propagee, jamais un succes simule.
- Negatifs : pas de secret dans le bundle ; pas d'appel MCP depuis React ; pas d'outil expose sans validation de ses arguments.

### Isolation / reprise
- Chaque outil = module isole (l'echec de l'un n'abat pas les autres) ; rollback = `git checkout`, sans etat global corrompu.


---
## SOURCE : delegation-a-jules/categorie-6-a3-multidimensional-swarm-factory/PRD-064-A3-REAL-CRONS-HEARTBEATS-TELEMETRY.md

# PRD-064: A3 Real Crons & Heartbeats Telemetry

## Objectif
Remplacer les 32 crons fictifs de l'ancien mock (MOCK_CRONS) par les véritables cadences d'exécution des agents A3.

## Spécifications
- Créer src/services/telemetry/a3-cron-dispatcher.ts.
- Enregistrer les crons vivants :
  - Télémétrie 60s (Yas / Kernel Core).
  - Revue hebdomadaire Wx (Tendi & River Song).
  - Audit d'homéostasie cognitive (Hugh Culber & Rory).
  - Distillation incrémentale 50_ (Graham & Rick).
- Stocker les exécutions dans le store SQLite/IndexedDB.
- Validation obligatoire : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build`.

## Correctif de délégation (audit 2026-09-12)

> Contrat commun : [`../CONTRAT-COMMUN.md`](../CONTRAT-COMMUN.md) (cree par le parent — lecture obligatoire avant toute execution).
### Dependances PRD
- Crons **cote service Node persistant** : `setInterval` dans React n'est pas un cron (mort a la fermeture de l'onglet). Le dispatcher vit dans le service ; l'UI n'en est que la vue (PRD-065).
- Persistance des executions dans le Blackboard SQLite (PRD-052 / PRD-011) — IndexedDB eventuel = cache de lecture seulement.

### Remplacement du mock (mesure)
- Si `MOCK_CRONS` existe encore dans `src/` au moment de l'execution, son retrait fait partie du perimetre ; sinon, a ne pas recreeer.

### Cadences (specifiees)
- Telemetrie 60 s (Yas / Kernel Core) ; revue hebdomadaire Wx (Tendi & River Song) ; audit d'homeostasie cognitive (Hugh Culber & Rory) ; distillation incrementale 50_ (Graham & Rick). Chaque cron : verrou (PRD-052) contre le chevauchement, jitter leger, preuve horodatee `America/New_York`.

### Criteres d'acceptation
- Positifs : lint+build ; chaque execution laisse un enregistrement date dans le Blackboard ; un cron rate est rattrape ou marque `missed` — jamais pretendu execute.
- Negatifs : pas de cron fictif residuel ; pas de telemetrie fabriquee ; pas de double execution au rejeu.

### Reprise / rollback
- Apres coupure du service : reprise depuis le dernier etat persiste (pas de rejeu complet) ; rollback code = `git checkout`, donnees conservees.


---
## SOURCE : delegation-a-jules/categorie-6-a3-multidimensional-swarm-factory/PRD-065-A3-SWARM-VISUALIZER-ROSTER-PLUGIN-UI.md

# PRD-065: A3 Swarm Visualizer & Roster Plugin UI

## Objectif
Créer le composant visuel de supervision des agents A3 dans Agent Portal.

## Spécifications
- Créer src/apps/portal/components/A3SwarmRosterView.tsx.
- Afficher les cartes d'agents A3 avec indicateurs visuels :
  - Rôle et Vaisseau/Escouade d'appartenance.
  - Statut live (Idle, Active, Executing MCP, Blocked).
  - Jauge de budget tokens et temps de calcul consommés.
  - Bouton de consultation des reçus d'exécution (ProofReceiptModal.tsx).
- Validation obligatoire : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build`.

## Correctif de délégation (audit 2026-09-12)

> Contrat commun : [`../CONTRAT-COMMUN.md`](../CONTRAT-COMMUN.md) (cree par le parent — lecture obligatoire avant toute execution).
### Dependances PRD
- Lit : PRD-061 (registre competences), PRD-064 (telemetrie crons), PRD-052 (recus `action_receipts`). Consomme PRD-041 pour vaisseaux/escouades.

### Donnees reelles (bloquant)
- Statuts (Idle / Active / Executing MCP / Blocked) proviennent de l'etat reel du service (PRD-063/064). Service injoignable = banniere d'erreur explicite et statut `Unknown` — **jamais de statut simule ni de demo**. Jauge de budget tokens : valeurs mesurees ou « non mesure ».

### Criteres d'acceptation
- Positifs : lint+build ; chaque carte agent rend role + vaisseau/escouade depuis le registre ; `ProofReceiptModal.tsx` affiche un recu reel du Blackboard ; etats vide / erreur / chargement tous rendus.
- Negatifs : pas de statut invente ; pas de secret ; pas d'ecriture directe SQLite depuis React (lecture via service).

### Reprise
- Ajoutitif (`src/apps/portal/components/A3SwarmRosterView.tsx`, `ProofReceiptModal.tsx`) ; suppression = retour arriere propre, non destructif.
