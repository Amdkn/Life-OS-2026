# Mandat complet catégorie 4

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
## SOURCE : delegation-a-jules/categorie-4-life-os-6-frameworks/PRD-041-FRAMEWORKS-CANON-ROSTER.md

# PRD-041: Modélisation Canonique des 6 Frameworks & Roster des Vaisseaux

## Objectif
Créer les contrats TypeScript et interfaces des six frameworks : Ikigai/Orville, Life Wheel/Discovery (Zora), PARA/Enterprise, 12WY/SNW, GTD/Cerritos, DEAL/Protostar. Beth/Morty sont des rôles de gouvernance, pas un septième framework ni un remplacement de PARA. Vérifier les identifiants des manifests existants avant de figer les IDs ; un équipage non documenté reste A SOURCER.

## Spécifications
- Créer src/types/frameworks.ts définissant FrameworkId, VesselConfig, AgentCrewMember.
- Exposer le roster complet des agents par vaisseau dans src/config/vessels.config.ts.
- Intégrer un sélecteur de Frameworks dans la barre latérale ou le Header de Life OS.
- Validation obligatoire : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build`.

## Correctif de délégation (audit 2026-09-12)

> Contrat commun : [`../CONTRAT-COMMUN.md`](../CONTRAT-COMMUN.md) (cree par le parent — lecture obligatoire avant toute execution).
### Dependances PRD
- **PRD-041 est le PROPRIETAIRE du contrat roster** (`FrameworkId`, `VesselConfig`, `AgentCrewMember`). PRD-042 a 045 (cat. 4), PRD-061 (cat. 6) et PRD-091 (cat. 9, matrice de roles B3) doivent **consommer** ces types, jamais les redeclarer.
- Aucune autre dependance : ce PRD est la racine du groupe.

### Perimetre d'ecriture (write_scope)
- `src/types/frameworks.ts` (creation — n'existe pas au 2026-09-12, mesure).
- `src/config/vessels.config.ts` (creation ; `src/config/` existe et est vide, mesure).
- Selecteur : modification minimale du composant header/sidebar existant ; pas de refonte de navigation.

### Criteres d'acceptation
- Positifs : `npm run lint` et `npm run build` passent ; le roster expose les 6 vaisseaux FW01-FW06 ; types exportes importables sans cycle d'import.
- Negatifs : **pas** de second schema roster ailleurs (aucun doublon de `VesselConfig`) ; pas de donnees d'equipage codees en dur dans les composants ; pas de `any`.

### Securite / isolation
- Configuration statique uniquement : aucun secret, aucun appel reseau, aucune PII.

### Idempotence / persistance / reprise
- Fichiers purs et additifs. Rollback : désactiver leur intégration et conserver le patch sur branche dédiée ; aucun effacement de données. Première tranche : contrats/config/tests seulement ; header/sidebar intégrés ensuite par leur writer unique.


---
## SOURCE : delegation-a-jules/categorie-4-life-os-6-frameworks/PRD-042-IKIGAI-HORIZONS-MATRIX.md

# PRD-042: Ikigai & Horizons Temporels (Vaisseau Orville)

## Objectif
Afficher et manipuler la matrice Ikigai (Passion, Mission, Vocation, Profession) ainsi que les 5 Horizons temporels (H1 à H90) documentés dans la doctrine Orville.

## Spécifications
- Créer src/apps/frameworks/ikigai/IkigaiMatrixView.tsx.
- Connecter les horizons H1 (1 An), H3 (3 Ans), H10 (10 Ans), H25 (25 Ans), H90 (Solarpunk / Kardashev).
- Stocker les fiches d'alignement dans IndexedDB via le store unifié.
- Validation obligatoire : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build`.

## Correctif de délégation (audit 2026-09-12)

> Contrat commun : [`../CONTRAT-COMMUN.md`](../CONTRAT-COMMUN.md) (cree par le parent — lecture obligatoire avant toute execution).
### Dependances PRD
- Consomme le contrat roster PRD-041 (`FrameworkId`, equipage Orville).
- Fiches d'alignement : **IndexedDB navigateur** (store unifie). Aucune dependance au Blackboard SQLite service — les deux plans ne se remplacent pas (voir contrat commun) ; le pont est PRD-045.

### Correction de portee (mesuree)
- `src/apps/ikigai/` existe deja (avec `components/`). Le chemin initialement demande `src/apps/frameworks/ikigai/IkigaiMatrixView.tsx` creerait un arbre parallele : **implementer dans `src/apps/ikigai/` existant** (ex. `src/apps/ikigai/components/IkigaiMatrixView.tsx`). Pas de doublon `src/apps/frameworks/`.

### Criteres d'acceptation
- Positifs : lint+build passent ; les 4 axes Ikigai (Passion, Mission, Vocation, Profession) et les horizons H1/H3/H10/H25/H90 sont editables et persistes ; au rechargement les fiches sont retrouvees.
- Negatifs : aucune donnee de demonstration pre-remplie ; pas de telemetrie fictive ; pas d'ecriture SQLite depuis le navigateur.

### Idempotence / persistance / reprise
- Migrations IndexedDB **additives uniquement** (jamais destructives) ; rollback code = `git checkout` du composant ; les fiches utilisateur ne sont jamais purgees par le code.


---
## SOURCE : delegation-a-jules/categorie-4-life-os-6-frameworks/PRD-043-GTD-CERRITOS-INBOX-GATE.md

# PRD-043: Pipeline GTD Cerritos (Capture, Clarify, Engage)

## Objectif
Remplacer le simple bloc-notes par le flux structuré GTD inspiré de l'équipage Cerritos (Mariner, Boimler, Rutherford, Tendi, Freeman).

## Spécifications
- Créer src/apps/frameworks/gtd/GtdCerritosPipeline.tsx.
- Implémenter les 5 étapes : Capture (Mariner), Clarify (Boimler), Organize (Rutherford), Review (Tendi), Engage (Freeman).
- Permettre la promotion d'un item GTD vers un Projet ou une Tâche 12WY.
- Validation obligatoire : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build`.

## Correctif de délégation (audit 2026-09-12)

> Contrat commun : [`../CONTRAT-COMMUN.md`](../CONTRAT-COMMUN.md) (cree par le parent — lecture obligatoire avant toute execution).
### Dependances PRD
- Consomme PRD-041 (roster Cerritos). Promotion 12WY via le store existant `src/stores/fw-12wy.store.ts` (mesure) — pas de second store 12WY.

### Correction de portee (mesuree)
- `src/apps/gtd/` existe deja : implementer `GtdCerritosPipeline.tsx` **dedans** (ex. `src/apps/gtd/GtdCerritosPipeline.tsx`), pas sous `src/apps/frameworks/gtd/`.

### Criteres d'acceptation
- Positifs : lint+build ; les 5 etapes Capture / Clarify / Organize / Review / Engage sont parcourables ; un item promu vers projet ou tache 12WY quitte l'inbox sans doublon.
- Negatifs : pas d'appel reseau dans ce composant ; pas de secret ; pas d'ecriture directe SQLite (le pont Blackboard est PRD-045) ; pas d'ecrasement d'une tache 12WY existante a la promotion.

### Idempotence / persistance / reprise
- Persistance IndexedDB additive ; la promotion change un statut (reversible par reclassement), elle ne supprime pas l'item ; rollback code = `git checkout`.


---
## SOURCE : delegation-a-jules/categorie-4-life-os-6-frameworks/PRD-044-DEAL-PROTOSTAR-AUTOMATION.md

# PRD-044: Matrice DEAL Protostar (Élimination & Automatisation)

## Objectif
Fournir le tableau de bord d'optimisation opérationnelle selon la méthode DEAL (Definition, Elimination, Automation, Liberation - Holo-Janeway & Protostar).

## Spécifications
- Créer src/apps/frameworks/deal/DealProtostarView.tsx.
- Interface pour classifier les goulots d'étranglement : Éliminer (Rok-Tahk), Automatiser (Zero), Déléguer/Libérer (Gwyn).
- Connecter aux suggestions proactives d'Antigravity et Jules.
- Validation obligatoire : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build`.

## Correctif de délégation (audit 2026-09-12)

> Contrat commun : [`../CONTRAT-COMMUN.md`](../CONTRAT-COMMUN.md) (cree par le parent — lecture obligatoire avant toute execution).
### Dependances PRD
- Consomme PRD-041 (roster Protostar) ; store existant `src/stores/fw-deal.store.ts` (mesure).
- Suggestions proactives : la classification locale n'attend pas PRD-051. Les délégations de code déjà autorisées passent par PRD-051/056 lorsqu'ils sont intégrés, sans nouvelle approbation humaine de convenance. Une suggestion hors mandat ou irréversible exige un arbitrage distinct. La vue n'appelle jamais Jules directement.

### Correction de portee (mesuree)
- `src/apps/deal/` existe deja : implementer `DealProtostarView.tsx` dedans, pas sous `src/apps/frameworks/deal/`.

### Criteres d'acceptation
- Positifs : lint+build ; classification Eliminer / Automatiser / Deleguer persistee et reclassifiable ; chaque suggestion affiche sa source.
- Negatifs : pas de declenchement automatique de session Jules depuis cette vue ; pas de metrique inventee ; pas de secret.

### Idempotence / persistance / reprise
- Classification persistee de facon additive ; une reclassification ecrase deterministiquement l'ancienne valeur ; rollback code = `git checkout`.


---
## SOURCE : delegation-a-jules/categorie-4-life-os-6-frameworks/PRD-045-SWARM-BLACKBOARD-INTEGRATION.md

# PRD-045: Pont Unifié Frameworks vers Blackboard & Linear

## Objectif
Relier l'état des 6 Frameworks au Blackboard local SQLite et aux synchronisations Linear Swarm Teams.

## Spécifications
- Créer src/apps/frameworks/services/frameworks-blackboard-bridge.ts.
- Mettre à jour automatiquement le statut des vaisseaux et des agents dans l'état partagé du Blackboard.
- Générer les métriques de santé des 6 frameworks pour l'assistant overlay.
- Validation obligatoire : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build`.

## Correctif de délégation (audit 2026-09-12)

> Contrat commun : [`../CONTRAT-COMMUN.md`](../CONTRAT-COMMUN.md) (cree par le parent — lecture obligatoire avant toute execution).
### Dependances PRD
- **Depend de PRD-052** (moteur Blackboard) et de **PRD-011 (cat. 1, proprietaire du schema)** — ce PRD ne definit aucune table.
- Consomme PRD-041 pour les types vaisseaux/agents.

### Frontiere structurelle (contrat commun)
- Le Blackboard SQLite est un **service local (processus Node)** ; le navigateur ne parle jamais SQLite natif. Ce pont passe par l'API du service. IndexedDB (PRD-042/043) reste le store navigateur : les deux plans coexistent, aucun ne remplace l'autre par decret.

### Criteres d'acceptation
- Positifs : lint+build ; un statut de vaisseau modifie cote UI apparaît dans le Blackboard via le service ; les metriques de sante sont calculees depuis l'etat reel.
- Negatifs : aucun secret dans le bundle navigateur ; un seul canal d'ecriture (le service, pas d'ecriture directe concurrente) ; pas de boucle de rafraichissement infinie UI <-> service.

### Idempotence / persistance / reprise
- Mises a jour idempotentes clee par (vaisseau, agent, horodatage) ; apres coupure du service, resynchronisation complete depuis l'etat partage, jamais un delta corrompu ; rollback code = `git checkout` du bridge.
