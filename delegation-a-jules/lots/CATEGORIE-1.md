# Mandat complet catégorie 1

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
## SOURCE : delegation-a-jules/categorie-1-agent-portal/PRD-011-BLACKBOARD-SQLITE-SCHEMA.md

# PRD-011 — Blackboard Workspace Local SQLite & Event Store


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** consommateurs déclarés : PRD-012 (Outbox Blackboard, `linear_team_id` du schéma), PRD-013 (registry crons), PRD-021 (`life-os blackboard events`), PRD-022 (`life_os_blackboard_post`). PRD-052 (catégorie 5) consomme ce schéma SANS en créer un second. PRD-001 (catégorie 0) reste sur IndexedDB navigateur et ne définit aucun schéma blackboard.

**Périmètre d'écriture (write_scope) :**
- Existant à LIRE : app Agent Portal et stores appelants ; pas de réécriture générale de ces consommateurs dans la première tranche du socle.
- Proposé (à créer) : migrations et repository sous `server/blackboard/`, adaptateur navigateur sous `src/lib/blackboard/`, tests d'intégration sous `tests/blackboard/`. Réutiliser le backend s'il est découvert ; sinon créer une seule entrée serveur dans cette tranche avec ownership de sa configuration. La première tranche PRD-011 ne modifie PAS les vues AgentPortal ni les stores génériques : leur intégration relève des PRD consommateurs.

**Critères d'acceptation positifs :** émission/lecture d'événements sans perte ni altération de JSON ; acquisition/libération de verrous déterministes avec `expires_at` ; append-only sans altération rétroactive ; ids d'événements déterministes pour l'idempotence des reposts.

**Critères d'acceptation négatifs (doivent rester vrais) :** le moteur SQLite ne vit JAMAIS dans le bundle navigateur React (pas de better-sqlite3/sqlite natif côté UI) — c'est un service local backend (Node/Express, express déjà déclaré) ; DomainDB/IndexedDB navigateur n'est pas remplacé par décret ; aucun second schéma blackboard créé ailleurs (PRD-052 consomme) ; aucun secret dans le schéma ou les payloads.

**Sécurité / isolation / idempotence / persistance :** cette PR est propriétaire unique du schéma : la section schéma doit couvrir les 4 tables annoncées — `workspaces`, `events`, `locks` ET `artifacts` (annoncée dans le remplacement mais absente du schéma typé : compléter), plus les index requis ; verrous à TTL explicite ; isolation par `domain_id` et `actor_layer`.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** désactiver le nouvel adaptateur, revenir au code antérieur sur branche de revue et conserver la DB, ses événements et sa sauvegarde. Aucune suppression de dossier de données pour annuler une activation.

## 1. Valeur et Remplacement
- **Obstacle :** Déconnexion entre les interfaces Zustand, IndexedDB et le manque d'état partagé concurrent.
- **Remplacement :** Implémenter le socle Blackboard SQLite local-first dans Life OS (`src/lib/blackboard/`), fournissant une table relationnelle d'événements append-only (`events`), de threads (`workspaces`), de verrous (`locks`) et d'artefacts (`artifacts`).

## 2. Périmètre et Données
- Réutiliser les contrats existants sans confondre les connexions : SQLite côté service, IndexedDB côté navigateur ; pas de driver SQLite natif dans React.
- Schéma typé :
  - `workspaces` (id, name, domain_id, status, linear_team_id, created_at, updated_at)
  - `events` (id, workspace_id, actor_id, actor_layer, event_type, payload_json, timestamp)
  - `locks` (id, resource_key, locked_by, expires_at)
- Pont réactif vers `useAgentsStore` et `shell.store.ts`.

## 3. Acceptation Fonctionnelle
- Émission et lecture d'événements sans perte ni altération de JSON.
- Acquisition et libération de verrous déterministes.
- Exécuter des tests fonctionnels réels et fournir les commandes/rc ; `npm run lint` et `npm run build` à 0 erreur sont des contrôles supplémentaires, pas les tests métier.


---
## SOURCE : delegation-a-jules/categorie-1-agent-portal/PRD-012-LINEAR-HQ-WORKSPACE-HOLDING.md

# PRD-012 — Linear comme Holding de Workspaces & QG de Flotte


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-011 (outbox Blackboard pour la file hors-ligne ; `linear_team_id` câblé dans le schéma blackboard) ; PRD-024 (scopes pour isoler les identifiants de mapping) ; PRD-014 (items ScoreCard : même source que les payloads Linear).

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : aucun code Linear dans `src/lib` au 2026-09-12 (recherche 'linear' vide) ; `src/stores/fw-para.store.ts`, `src/stores/fw-12wy.store.ts` comme sources des données mappées.
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** mapping bidirectionnel sans écrasement ; items ScoreCard transformés en payloads Linear valides ; résolution des statuts Todo/In Progress/Done sans conflit ; mise en file locale hors-ligne puis rejeu à la reconnexion.

**Critères d'acceptation négatifs (doivent rester vrais) :** aucune clé API Linear dans le bundle navigateur ni dans un `VITE_*` (le secret vit dans l'environnement du service local, jamais dans le code client) ; aucun écrasement distant sans conflit visible ; aucune écriture Linear depuis un composant React en direct.

**Sécurité / isolation / idempotence / persistance :** le token Linear appartient au service backend local, jamais au bundle ; retries bornés et idempotents sur la file ; le statut local reste la vérité du store même si Linear est indisponible.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** adaptateur isolé : rollback = désactiver l'appel et vider la file sans toucher les stores ; le mapping est additif (champs de liaison), jamais destructeur sur les tâches locales.

## 1. Valeur et Remplacement
- **Obstacle :** Dispersion des tâches entre les vues locales sans synchronisation avec le QG stratégique Linear.
- **Remplacement :** Établir l'adaptateur de synchronisation Linear (`src/lib/linear/`) reliant les projets PARA et les domaines LD01-LD08 aux équipes et cycles Linear.

## 2. Périmètre et Données
- Mapping bidirectionnel sans écrasement :
  - Équipes Linear <=> Domaines Life Wheel & Projets PARA.
  - Issues Linear <=> Tâches ScoreCard / Tactiques 12WY.
- Préservation du mode hors-ligne : mise en file d'attente locale (Outbox Blackboard) en cas d'absence de réseau.

## 3. Acceptation Fonctionnelle
- Transformation des items ScoreCard en payloads Linear valides.
- Résolution sans conflit des statuts Todo / In Progress / Review / Done.
- Tests fonctionnels exécutés : `npm run lint` et `npm run build` à 0 erreur.


---
## SOURCE : delegation-a-jules/categorie-1-agent-portal/PRD-013-AGENT-PORTAL-CRON-REGISTRY-REAL.md

# PRD-013 — Agent Portal : Remplacement des Mocks du Cron Registry


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-011 (les heartbeats/derniers pulses peuvent transiter par le blackboard events) ; PRD-014/PRD-015 pour la télémétrie de flotte affichée à côté.

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : `src/apps/agent-portal/components/CronsView.tsx` avec `MOCK_CRONS` (vérifié présent au 2026-09-12).
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** remplacement intégral de MOCK_CRONS ; lecture dynamique d'un registre de jobs réel déclaré dans le repo ; statut live et dernier pulse exacts ; activation/désactivation avec retour visuel.

**Critères d'acceptation négatifs (doivent rester vrais) :** aucune lecture au runtime du corpus ASpace OS V3 ni de `C:/Users` (le registre est une source de données du repo, exportée/distillée, jamais un chemin disque privé) ; l'exécution cron réelle est côté service/backend (Node), jamais des `setInterval` React prétendus crons ; aucune fréquence inventée sans source (Heartbeat 15m, Circadien 24h, Revue Hebdo W13 à sourcer dans le registre) ; aucun statut vert simulé.

**Sécurité / isolation / idempotence / persistance :** le registre est en lecture seule côté UI ; l'activation/désactivation passe par une API du service local, pas par une mutation directe de fichier ; idempotence des bascules.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** la vue statique MOCK_CRONS est remplacée : rollback = revert de CronsView ; conserver le mock sous feature flag le temps de la PR est acceptable mais il doit rester identifiable comme mock.

## 1. Valeur et Remplacement
- **Obstacle :** La vue `CronsView.tsx` affiche un tableau statique fictif (`MOCK_CRONS`, 32 crons fantômes).
- **Remplacement :** Connecter `CronsView.tsx` aux véritables tâches planifiées et aux heartbeats déterministes de Life OS et ASpace OS V3.

## 2. Périmètre et Données
- Lecture dynamique de la table des jobs réels ou du store des automatisations.
- Prise en charge des fréquences réelles (Heartbeat 15m, Circadien 24h, Revue Hebdo W13).
- Interface d'activation/désactivation de crons réels avec retour visuel d'exécution.

## 3. Acceptation Fonctionnelle
- Remplacement intégral de `MOCK_CRONS`.
- Affichage exact du statut live des tâches et du dernier pulse.
- Tests fonctionnels exécutés : `npm run lint` et `npm run build` à 0 erreur.


---
## SOURCE : delegation-a-jules/categorie-1-agent-portal/PRD-014-AGENT-PORTAL-FLEET-SCORECARD-A0-A2.md

# PRD-014 — Agent Portal : ScoreCard Transversal & Télémétrie A0-A2


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-011 (télémétrie via blackboard/stores) ; PRD-012 (attribution des items, même roster) ; PRD-013 (heartbeats pour le statut online/idle/busy).

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : `src/apps/agent-portal/components/dashboards/ScoreCard.tsx`, `src/apps/agent-portal/components/AgentStats.tsx` (vérifiés) ; `src/stores/` comme source.
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** attribution et transitions réelles des tâches Kanban avec notification d'agent ; jauges de charge et statut fondés sur des données de store réelles ; télémétrie synchronisée au panneau latéral.

**Critères d'acceptation négatifs (doivent rester vrais) :** aucun statut green simulé ; les placeholders « Awaiting V0.7 Neural Link » cités n'ont été retrouvés au 2026-09-12 que dans `src/apps/twelve-week/components/GoalCommandCard.tsx` (12WY, pas agent-portal) — relocaliser l'ancre avant de supprimer, et ne pas prétendre qu'il pollue les vues de détail de l'agent-portal sans l'avoir vérifié ; aucune télémétrie fictive.

**Sécurité / isolation / idempotence / persistance :** roster A0/A1/A2 déclaré comme données locales du repo (pas de disque privé) ; transitions idempotentes (double clic sans double notification).

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** revert des composants listés ; le Kanban conserve son état de store, un rollback n'efface pas les tâches.

## 1. Valeur et Remplacement
- **Obstacle :** Déconnexion entre la ScoreCard Kanban et l'état réel des agents A0 (Amadeus), A1 (Beth+Morty) et A2 (Orville, Discovery, Enterprise).
- **Remplacement :** Rendre la télémétrie de flotte réactive dans `ScoreCard.tsx` et `AgentStats.tsx` avec les métriques réelles de progression.

## 2. Périmètre et Données
- Relier chaque tâche Kanban à son agent assigné (couche A1/A2).
- Intégrer les jauges de charge réelle, de statut (online/idle/busy) et d'historique de log d'agent.
- Éliminer les faux placeholders "Awaiting V0.7 Neural Link" dans les vues de détail.

## 3. Acceptation Fonctionnelle
- Attribution et transition réelles des tâches entre états Kanban avec notification d'agent.
- Télémétrie de l'Armada synchronisée sur le panneau latéral droit.
- Tests fonctionnels exécutés : `npm run lint` et `npm run build` à 0 erreur.


---
## SOURCE : delegation-a-jules/categorie-1-agent-portal/PRD-015-RELATION-DIAGRAM-SKILL-TREE-NEXUS.md

# PRD-015 — Agent Portal : Nexus Relation Diagram & Skill Tree Dynamique


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-011 (nœuds vivants issus du store/blackboard) ; PRD-014 (exécution de tâches mettant à jour les compétences) ; PRD-003/PRD-032 pour la sémantique des frameworks (Ikigai, Wheel, 12WY, PARA, GTD, DEAL).

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : `src/apps/agent-portal/components/SkillsView.tsx`, `src/apps/agent-portal/components/RelationDiagram.tsx` (vérifiés).
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** graphe relationnel navigable sans plantage de rendu SVG/Canvas ; compétences validées vs en cours issues du store ; mise à jour réactive à l'exécution des tâches.

**Critères d'acceptation négatifs (doivent rester vrais) :** « Observatoire Amy » non retrouvé dans le repo au 2026-09-12 — A SOURCER avant d'intégrer un pont vers un panneau inexistant ; aucune compétence ou nœud inventé pour remplir le graphe ; aucun framework réduit à Business.

**Sécurité / isolation / idempotence / persistance :** rendu SVG/Canvas borné (limites de nœuds) pour éviter les boucles de rendu React ; le graphe ne reçoit jamais de payload arbitraire depuis un agent sans validation.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** revert des deux composants ; données de store intactes ; le graphe figé initial reste le fallback.

## 1. Valeur et Remplacement
- **Obstacle :** L'arbre de compétences (`SkillsView.tsx`) et le diagramme de relation (`RelationDiagram.tsx`) sont figés.
- **Remplacement :** Câbler le graphe sémantique dynamique reliant les 6 Frameworks (Ikigai, Wheel, 12WY, PARA, GTD, DEAL) aux compétences réelles de l'Armada.

## 2. Périmètre et Données
- Rendu interactif du Mindmap Canvas avec les nœuds vivants issus du store.
- Matrice des compétences validées vs compétences en cours d'acquisition.
- Intégration du pont vers le panneau de commande de l'Observatoire Amy.

## 3. Acceptation Fonctionnelle
- Navigation fluide dans le graphe relationnel sans plantage de rendu SVG/Canvas.
- Mise à jour réactive des compétences lors de l'exécution de tâches.
- Tests fonctionnels exécutés : `npm run lint` et `npm run build` à 0 erreur.


---
## SOURCE : delegation-a-jules/categorie-1-agent-portal/PRD-016-CROSS-CATEGORY-CONTRACTS-AND-INTEGRATION.md

# PRD-016 — Contrats inter-catégories et intégration sans collision

## Objectif
Permettre plusieurs catégories en parallèle sans dix variantes de blackboard, roster ou scheduler. Remplace les interfaces implicites par un contrat versionné unique. Appliquer [le contrat commun](../CONTRAT-COMMUN.md).

## Dépendances et périmètre
PRD-011 propriétaire des migrations blackboard ; PRD-041 propriétaire du roster. Cette fiche peut établir les interfaces minimales avec leurs owners avant implémentation des consommateurs. Périmètre proposé : `src/contracts/`, `tests/contracts/`, document d'ownership ; aucun second schéma SQL, aucun cron, aucun service ajouté. Racines partagées (`package.json`, routes globales) intégrées par un seul writer.

## Spécification
Versionner messages/erreurs : schemaVersion, eventId, correlationId, causationId, occurredAt UTC, aggregateId, aggregateVersion ; acteur/scope autorisés par service et non crus depuis payload. Un registre lie type d'événement à producteur, consommateur, contrat, idempotence et politique de rejet. Les événements transportent le minimum, pas les secrets ni le corpus brut. États de job documentés avec transitions autorisées et raison de refus. Contrats compatibles ascendants ou migration explicite. API navigateur séparée du driver SQLite et des runtimes agents.

Fournir une matrice fichiers partagés→writer et une matrice PRD→dépendances du lot. Un contrat non implémenté ne peut rendre un consommateur vert ; afficher indisponibilité sans mock métier. Chaque session doit pouvoir développer son module dans son scope puis proposer un petit patch d'intégration réservé.

## Acceptation fonctionnelle
1. Producteur de test et consommateur de test utilisent le même schéma et l'événement traverse jusqu'à son effet.
2. Version inconnue, payload invalide, tenant falsifié : rejet structuré et aucun effet.
3. Même eventId livré deux fois : un seul effet persistant ; correlationId conservé.
4. Deux tranches revendiquant le même writer : admission refusée avant dispatch ; deux scopes disjoints restent admissibles.
5. Ancien consommateur face à version incompatible : état BLOCKED_CONTRACT, pas succès simulé.

## Contrat de livraison
Tests de contrat et d'intégration avec commandes exactes créées si absentes, `npm run lint`, `npm run build`, mapping des dépendances. La présence du JSON schema seule ne valide pas son enforcement. Retour arrière par retour de version sur copie compatible, sans effacer événements ni données.
