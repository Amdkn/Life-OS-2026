# Mandat complet catégorie 8

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
## SOURCE : delegation-a-jules/categorie-8-b2-council-vp-managers/PRD-081-B2-COUNCIL-ENGINE-8-VP-MANAGERS.md

# PRD-081: B2 Council Engine & 8 VP Managers Roster

## Correctif de délégation (audit 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (C7-9). Socle B2 — dépendants : PRD-082, PRD-085, PRD-075 (baromètre santé B2).

- **Dépendances PRD réelles** : PRD-041 (cat 4) est propriétaire du contrat roster des identités — ce PRD définit le roster des 8 VP Managers B2 mais ne doit pas recréer le mécanisme d'identités de PRD-041 ; il s'aligne dessus. PRD-091 (cat 9) est propriétaire de la matrice rôles B3 : pas de chevauchement. Aucune dépendance amont interne à la catégorie.
- **Risque mesuré** : `src/config/` n'existe pas (dossier à créer). `src/types/` existe et ne contient aucun type de gouvernance : aucune collision attendue.
- **Write_scope (chemins concrets)** : `src/types/b2-council.ts` (création), `src/config/b2-council.config.ts` (création du dossier config). Interdiction de modifier `ld01.store.ts` à `ld08.store.ts` et `agents.store.ts` existants.
- **Critères positifs** : `VpRole` union stricte des 8 rôles déclarés (growth_superman, sales_martian, product_flash, ops_batman, it_cyborg, finance_wonderwoman, people_greenlantern, legal_aquaman) ; `DomainHealthStatus` (score 0-100, blocages, lead/lag indicators) ; `VpCouncilDecision` typé ; la config expose exactement 8 VP et échoue au typage si un 9e apparaît ; `npm run lint` + `npm run build` à 0 erreur.
- **Critères négatifs** : aucun score de santé inventé à l'affichage (les données viennent des services aval) ; pas de télémétrie fictive ; pas de deuxième définition d'identité en concurrence avec PRD-041 ; pas de secret dans la config.
- **Sécurité & isolation** : les types sont purs (aucun I/O) ; les autorisations de chaque VP restent déclaratives, l'exécution réelle est réglée par PRD-072 (mandat B1) et PRD-091 (vecteurs B3).
- **Idempotence & persistance** : types + config statiques, pas d'état ; la santé de domaine persistée relève du blackboard SQLite service (schéma PRD-011, consommation PRD-052) — pas de second schéma, pas de substitution par IndexedDB navigateur par décret.
- **Reprise / rollback non destructif** : 2 fichiers exclusivement nouveaux ; rollback = suppression sans impact sur le shell ni les stores.

## Objectif
Creer l infrastructure TypeScript et le moteur de gouvernance meso representant le Conseil des 8 VP Managers B2.

## Specifications
- Definir src/types/b2-council.ts :
  - `VpRole`: 'growth_superman' | 'sales_martian' | 'product_flash' | 'ops_batman' | 'it_cyborg' | 'finance_wonderwoman' | 'people_greenlantern' | 'legal_aquaman'.
  - `DomainHealthStatus`: Score 0-100, blocages actifs, lead indicators, lag indicators.
  - `VpCouncilDecision`: Arbitrage collegial sur les priorites de la semaine.
- Exposer la configuration des 8 VP dans src/config/b2-council.config.ts.
- Valider avec npm run lint (tsc --noEmit) et npm run build.

---
## SOURCE : delegation-a-jules/categorie-8-b2-council-vp-managers/PRD-082-B2-DOD-JTBD-TRANSLATION-PIPELINE.md

# PRD-082: B2 DoD & JTBD Translation Pipeline (B1->B2->B3)

## Correctif de délégation (audit 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (C7-9).

- **Dépendances PRD réelles** : PRD-072 (file B1→B2 — le pipeline consomme les tickets de handoff, il ne crée pas de source alternative de mandats) ; PRD-081 (roster VP, attribution des DoD) ; consommateur aval : PRD-061 (cat 6) exécute les compétences, PRD-062/063 les orquestrent — ce pipeline **ne recrée pas** la compilation des compétences de PRD-061 et ne lance pas les A3 avant intégration de PRD-072.
- **Write_scope (chemins concrets)** : `src/services/governance/b2-dod-pipeline.ts` (dossier à créer), types partagés dans `src/types/governance.ts` (même dossier que PRD-072 — coordonner avec la catégorie 7, ne pas dupliquer le type ticket).
- **Critères positifs** : un Rock B1 entre, un ticket DoD sort avec les 4 champs déclarés (critère de complétude fonctionnelle, tests automatisés requis, absence de code mort/placeholder, action receipt attendue) ; la traduction est déterministe (même entrée → même sortie) ; `npm run lint` + `npm run build` à 0 erreur.
- **Critères négatifs** : aucune tâche A3 sans DoD validée (règle d'arrêt PRD-072 respectée) ; pas de mock de preuve d'exécution — l'action receipt est une preuve d'environnement (chemin, exit code, HTTP), jamais une affirmation ; pas de contournement du verrou B1 ; pas de données fictives dans la pipeline.
- **Sécurité & isolation** : le ticket ne transporte pas de secret ; la vérification « absence de code mort/placeholder » est déclarée comme règle du DoD, pas comme un scanner exécutable inventé.
- **Idempotence & persistance** : la traduction B1→DoD est idempotente (même Rock → même ticket, clé de déduplication) ; les tickets DoD persistés côté blackboard SQLite service (schéma PRD-011, consommation PRD-052) — pas localStorage navigateur.
- **Reprise / rollback non destructif** : service additif, rollback = retrait du fichier ; les DoD déjà émis restent lisibles (pas de migration destructive).

## Objectif
Implementer le pipeline formel de traduction des demandes strategiques B1 en contrats d acceptation rigoureux (Definition of Done) et en taches executees par les A3 (Jobs to be Done).

## Specifications
- Creer src/services/governance/b2-dod-pipeline.ts.
- Structure d un ticket DoD :
  - Critere de completude fonctionnelle.
  - Tests automatises requis.
  - Verification d absence de code mort et absence de placeholder.
  - Preuve formelle d execution attendue (action receipt).
- Valider avec npm run lint (tsc --noEmit) et npm run build.

---
## SOURCE : delegation-a-jules/categorie-8-b2-council-vp-managers/PRD-083-WEEKLY-UPLINK-PICARD-TO-SPOCK-12WY.md

# PRD-083: Weekly Uplink Engine (Picard to Spock Areas & 12WY)

## Correctif de délégation (audit 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (C7-9).

- **Dépendances PRD réelles** : données existantes mesurées — `fw-para.store.ts` (Picard/Areas), `fw-12wy.store.ts` et `src/types/twelve-week.ts` (moteur 12WY). Ce PRD **réutilise** ces sources : pas de second moteur 12WY, pas de re-définition de PARA. Cadence : PRD-092 (cat 9) est le propriétaire du `B3CronScheduler` — la cloture hebdomadaire s'y enregistre au lieu de créer un setInterval React.
- **Risque mesuré** : « scanner les taches achevees » n'a de sens que sur les stores existants ; le PRD initial ne les nomme pas — désormais nommés ci-dessus.
- **Write_scope (chemins concrets)** : `src/services/temporal/weekly-uplink-engine.ts` (dossier à créer), `src/services/temporal/uplink-types.ts`. Interdiction de modifier `fw-para.store.ts`, `fw-12wy.store.ts`, `src/types/twelve-week.ts`.
- **Critères positifs** : à la cloture de semaine, l'engine lit les stores PARA/12WY, produit une promotion d'assets durables vers les Areas correspondantes avec journal de promotion, calcule le score 12WY depuis les données réelles du store (objectif > 85%), archive Wx et initialise Wx+1 ; `npm run lint` + `npm run build` à 0 erreur.
- **Critères négatifs** : aucun setInterval/chrono dans React (cadence = cron côté service, PRD-092) ; pas de promotion si la tâche source n'est pas réellement achevée ; pas de score affiché si les données sources sont vides — état « semaine vide » explicite, pas de 85% fictif ; pas de modification silencieuse des stores existants (écriture via leurs API publiques uniquement).
- **Sécurité & isolation** : le scan lit des données locales de productivité, aucune donnée ne sort du poste ; pas de secret.
- **Idempotence & persistance** : relancer une cloture Wx ne double-promote pas (clé idempotence semaine + tâche) ; l'archive hebdo persiste côté blackboard SQLite service (schéma PRD-011, consommation PRD-052) — le store fw-12wy reste la vue UI, pas la source d'archive.
- **Reprise / rollback non destructif** : l'archivage est additif (snapshot Wx, jamais écrasement du live) ; rollback = désenregistrement du cron + retrait du service, snapshots conservés.

## Objectif
Assurer la consolidation hebdomadaire automatique reliant les projets actifs de Picard (01_Projects_Picard) aux domaines de continuite de Spock (02_Areas_Spock) conformement au cycle 12WY.

## Specifications
- Creer src/services/temporal/weekly-uplink-engine.ts.
- A chaque cloture de semaine :
  - Scanner les taches et projets acheves dans Picard (via fw-para.store.ts).
  - Promouvoir les assets durables dans les Areas correspondantes de Spock.
  - Calculer le score d execution 12WY (objectif > 85%) depuis fw-12wy.store.ts.
  - Archiver la semaine Wx et initialiser la semaine Wx+1.
- Valider avec npm run lint (tsc --noEmit) et npm run build.

---
## SOURCE : delegation-a-jules/categorie-8-b2-council-vp-managers/PRD-084-CROSS-FRANCHISE-HARMONIZATION-BUS.md

# PRD-084: Cross-Franchise Harmonization Bus

## Correctif de délégation (audit 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (C7-9).

- **Dépendances PRD réelles** : PRD-071 (IDs et modules des 4 franchises — le bus s'adresse à ces instances) ; PRD-081 (attribution des innovations au VP propriétaire) ; consommateur : PRD-075 (notification cockpit). À lancer après intégration de PRD-071, pas avant.
- **Write_scope (chemins concrets)** : `src/services/franchise/cross-franchise-bus.ts` (dossier à créer), types du bus dans `src/services/franchise/bus-types.ts`. Interdiction de modifier les modules des 4 franchises.
- **Critères positifs** : une innovation validée sur une franchise génère une **proposition d'adoption** pour les autres (statut proposé/adopté/refusé) ; les 3 règles déclarées (facture ABC→Marina/RILCOT, checklists Marina→ABC/RILCOT, baux Alikaly→toutes entités) sont des règles de données, pas du code copié-collé ; `npm run lint` + `npm run build` à 0 erreur.
- **Critères négatifs** : le bus ne **copie jamais** un module d'une franchise à une autre en auto-mutation — il propose, un VP B2 adopte ; pas de boucle de re-proposition (déduplication par empreinte de contenu) ; pas de synchronisation de secrets ou de clés entre franchises ; pas de données client réelles transportées entre franchises.
- **Sécurité & isolation** : cloisonnement strict — une proposition transporte la description technique, pas les données de la franchise source ; conformité : les checklists/factures transportées sont des templates, jamais des documents nominatifs.
- **Idempotence & persistance** : empreinte (hash) du module innovant comme clé d'idempotence — la même innovation validée deux fois produit une seule proposition ; propositions persistées côté blackboard SQLite service (schéma PRD-011, consommation PRD-052).
- **Reprise / rollback non destructif** : bus additif sans écriture dans les franchises ; rollback = retrait du service, propositions conservées ou supprimées sans effet de bord ailleurs.

## Objectif
Mettre en place le bus d harmonisation inter-projets permettant de retroceder automatiquement les briques innovantes developpees pour un projet vers les 3 autres.

## Specifications
- Creer src/services/franchise/cross-franchise-bus.ts.
- Regles de synchronisation :
  - Module facture valide sur ABC Child Care -> Notification et proposition d adoption sur Marina Cleaning et RILCOT.
  - Checklists terrain validees sur Marina Cleaning -> Export des templates vers ABC et RILCOT.
  - Baux et fiscalite d Alikaly Bana -> Standardisation des contrats pour l ensemble des entites.
- Valider avec npm run lint (tsc --noEmit) et npm run build.

---
## SOURCE : delegation-a-jules/categorie-8-b2-council-vp-managers/PRD-085-DEAL-LIBERATION-ENGINE-B2-COCKPIT.md

# PRD-085: DEAL Liberation Engine & B2 Command Cockpit

## Correctif de délégation (audit 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (C7-9).

- **Dépendances PRD réelles** : PRD-081 (roster et santé des 8 domaines) ; PRD-082 (file des DoD en attente de validation) ; données DEAL existantes mesurées : `ld01.store.ts` (LD01 Business et Carrière) et `fw-deal.store.ts` — le moteur DEAL s'aligne sur ces stores, pas de second modèle DEAL ; consommateur : PRD-075 (baromètre B1).
- **Write_scope (chemins concrets)** : `src/apps/agent-portal/components/B2CouncilCommandCenter.tsx` (chemin corrigé : `src/apps/portal/` n'existe pas — l'app réelle est `src/apps/agent-portal/`) ; composants du cockpit dans le même dossier. Interdiction de modifier `ld01.store.ts`/`fw-deal.store.ts`.
- **Critères positifs** : radar des 8 domaines alimenté par PRD-081 ; jauge de libération DEAL calculée depuis `ld01.store.ts` (E = tâches éliminées, A = automatisées via A3, L = heures d'attention libérées) ; file des DoD en attente branchée sur PRD-082 ; `npm run lint` + `npm run build` à 0 erreur.
- **Critères négatifs** : aucune jauge à valeur par défaut décorative — jauge vide + « source non connectée » quand ld01/PRD-081 sont vides ; pas de télémétrie fictive ; pas de recréation du roster (PRD-041) ni de la matrice B3 (PRD-091) ; pas de second schéma DEAL.
- **Sécurité & isolation** : cockpit lecture seule sur les domaines ; toute action d'arbitrage VP passe par la file PRD-072/082, jamais en écriture directe ; aucun secret dans le composant.
- **Idempotence & persistance** : la jauge DEAL est une projection déterministe du store ; l'historique de libération persisté côté blackboard SQLite service (schéma PRD-011, consommation PRD-052) si l'utilisateur veut l'historique inter-session — pas de décret IndexedDB=blackboard.
- **Reprise / rollback non destructif** : composant ajouté à la navigation existante sans toucher les autres pages ; rollback = retrait du composant et de sa route.

## Objectif
Construire le cockpit de pilotage des 8 VP Managers dans Agent Portal et instrumenter la matrice de liberation DEAL pour le domaine LD01 (Business et Carriere).

## Specifications
- Creer src/apps/agent-portal/components/B2CouncilCommandCenter.tsx.
- Composants visuels :
  - Radar des 8 Domaines B2 (jauges de sante en temps reel).
  - Jauge de liberation DEAL : volume de taches eliminees (E), automatisees via A3 (A), et heures d attention liberees pour le CEO (L).
  - File d attente des validations DoD en attente.
- Valider avec npm run lint (tsc --noEmit) et npm run build.