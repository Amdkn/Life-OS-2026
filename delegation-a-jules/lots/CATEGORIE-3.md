# Mandat complet catégorie 3

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
## SOURCE : delegation-a-jules/categorie-3-para-enterprise-distillation/PRD-031-PARA-PROJECTS-PICARD-DISTILLATION.md

# PRD-031 — Distillation des Projets Picard V2 vers Life OS


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-032 (areas rattachées aux projets) ; PRD-033 (resources liées aux projets) ; PRD-034 (cycle de vie active/archived) ; PRD-035 (export RDF de ces mêmes projets — un seul store source).

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : `src/stores/fw-para.store.ts`, `src/hooks/useParaProjects.ts`, `src/utils/paraAdapter.ts` (vérifiés).
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** 9 projets visibles dans l'onglet PROJECTS ; KPI Active Projects mis à jour ; IDs PRJ-PICARD-01..09 stables et réimportables sans doublon.

**Critères d'acceptation négatifs (doivent rester vrais) :** aucune donnée du corpus privé copiée (manifests distillés seulement, sans secrets ni contenus clients) ; le chiffre « 9 initiatives » cité dans le texte en liste 7 noms (OMK, ABC OS, RILCOT, Alikaly Bana, Marina Cleaning, ClaudeClaw, OMK Services) pour 9 IDs — la liste des 9 IDs fait foi ; aucun projet fantôme au-delà des 9.

**Sécurité / isolation / idempotence / persistance :** pas de secrets clients dans les métadonnées de seed ; isolation par domaine Life Wheel conservée ; idempotence du seed par ID.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** seed additif : rollback = retirer le module de seed et vider les enregistrements marqués PRJ-PICARD-* ; les projets créés par l'utilisateur ensuite restent.

## 1. Valeur et Remplacement
- **Origine V2 :** `ASpace_OS_V2/20_Life_OS/24_PARA_Enterprise/01_Projects_Picard` (485 000+ fichiers, 10,7 Go dont 98% de `node_modules`).
- **Obstacle dans Life OS :** Dashboard PARA affichant 0 Projets actifs dans `127.0.0.1:4444` alors que 9 initiatives majeures existent (OMK, ABC OS, RILCOT, Alikaly Bana, Marina Cleaning, ClaudeClaw, OMK Services).
- **Remplacement :** Importer les métadonnées et manifests doctrinaux distillés des 9 projets Picard dans `useParaStore` et IndexedDB sans copier les dépendances lourdes (`node_modules`).

## 2. Périmètre et Implémentation
- Seed structuré des 9 Projets Picard dans `fw-para.store.ts` :
  1. `PRJ-PICARD-01` : OMK Business OS (B2/B3 Core).
  2. `PRJ-PICARD-02` : ABC OS & Child Care BOS (Franchise).
  3. `PRJ-PICARD-03` : RILCOT Members Space OS.
  4. `PRJ-PICARD-04` : Alikaly Bana Holding to LLC.
  5. `PRJ-PICARD-05` : Marina Cleaning BOS & SOP.
  6. `PRJ-PICARD-06` : Cerritos Plane Onboarding.
  7. `PRJ-PICARD-07` : ClaudeClaw Agent & Mission Control.
  8. `PRJ-PICARD-08` : Graphify Out Context Graphs.
  9. `PRJ-PICARD-09` : OMK Services BOS.
- Alignement sur les 8 piliers business (Growth, Ops, Product, Finance, People, IT, Legal, Meta) et les domaines Life Wheel.

## 3. Acceptation Fonctionnelle
- Affichage immédiat des projets dans l'onglet **PROJECTS** et mise à jour du KPI **Active Projects** sur le Dashboard PARA.
- Tests fonctionnels exécutés : `npm run lint` et `npm run build` (0 erreur).


---
## SOURCE : delegation-a-jules/categorie-3-para-enterprise-distillation/PRD-032-PARA-AREAS-SPOCK-JERRY-INCUBATION.md

# PRD-032 — Intégration des Domaines d'Action (Areas Spock & Jerry Pulse)


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-031 (les projets se rattachent aux areas) ; PRD-033/034 ; `fw-wheel.store.ts` et stores `ld01..ld08` pour les domaines LD01-LD08.

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : `src/apps/para/components/DomainCard.tsx` (vérifié) ; **`AreasView` NON RETROUVÉ dans src/apps/para au 2026-09-12** — l'onglet 'areas' existe dans `fw-para.store.ts` (activeTab), localiser le composant réel ou créer la vue : ne pas présumer le fichier.
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** filtrage interactif par Area/domaine sans carte orpheline ; chaque Area liée à son escadre Jerry canonique ; projets rattachés affichés par pilier.

**Critères d'acceptation négatifs (doivent rester vrais) :** « Structuration des 8 Areas » vs liste de 4 lignes regroupées : trancher explicitement (8 domaines LD01-LD08 mappés sur 4 escadres J01-J04) et aligner le texte ; aucune métrique de responsabilité ou veille inventée sans source ; pas de doublon avec les domaines du Wheel.

**Sécurité / isolation / idempotence / persistance :** liens Area<=>escadre déclarés comme données du repo (pas de disque privé) ; idempotence de la structuration.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** liaisons additives : rollback = retirer les champs de liaison ; DomainCard retombe sur son affichage actuel.

## 1. Valeur et Remplacement
- **Origine V2 :** `02_Areas_Spock` (J01 Jerry Prime LD01, J02 Jerry Bio LD03/04, J03 Jerry Nexus LD02/06, J04 Jerry Solarpunk LD05/07/08).
- **Obstacle dans Life OS :** L'onglet **AREAS** (`AreasView` / `DomainCard.tsx`) n'a pas de liens vivants vers les capitaines B1 Jerry et leurs standards (FIP Standard, E-Myth, Vitality).
- **Remplacement :** Relier chaque Area de Life OS à son escadre Jerry canonique et afficher les métriques de responsabilité et de veille.

## 2. Périmètre et Implémentation
- Structuration des 8 Areas dans `fw-para.store.ts` :
  - Business (J01 Prime / E-Myth SYSTEMIZE).
  - Finance & Habitat (J03 Nexus / FIP Standard).
  - Health & Cognition (J02 Bio / Vitalité & Nutrition).
  - Relations, Creativity, Impact (J04 Solarpunk / Sunday Uplink).
- Affichage des projets rattachés par pilier dans `DomainCard.tsx`.

## 3. Acceptation Fonctionnelle
- Filtrage interactif par Area et par domaine sans carte orpheline.
- Tests fonctionnels exécutés : `npm run lint` et `npm run build` à 0 erreur.


---
## SOURCE : delegation-a-jules/categorie-3-para-enterprise-distillation/PRD-033-PARA-RESOURCES-COLD-VAULT.md

# PRD-033 — Coffre de Ressources Découplé (Resources Vault & SOPs)


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-031 (liaison bidirectionnelle vers PRJ-PICARD-*) ; PRD-032 (domaine Life Wheel) ; PRD-034 (une resource peut être distillée en archive).

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : `src/apps/para/components/ResourceCard.tsx` (vérifié) ; type réel `ResourceType = 'book' | 'tool' | 'contact' | 'template' | 'course' | 'article' | 'video' | 'other'` dans `fw-para.store.ts` — **'sop' n'existe pas** : étendre le type ou mapper SOP->'template', ne pas prétendre que le champ existe.
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** recherche et filtrage dynamiques ; injection d'une ressource avec liaison immédiate à un projet ; liaison bidirectionnelle cohérente (projet.resources <-> ressource.projects).

**Critères d'acceptation négatifs (doivent rester vrais) :** aucune URL/Path fictive ; les ressources canoniques citées (SOPs Marina, Ownerbook OMK, Manifeste Summers's Verse, Spécifications Plane/Linear) sont des ENTRÉES de catalogue (titre + type + provenance), pas des documents à importer depuis le disque privé ; pas de doublon de liaison.

**Sécurité / isolation / idempotence / persistance :** pas de secrets ni identifiants dans les resources ; URL externes validées comme chaînes, pas exécutées ; idempotence de la liaison par identifiant.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** ajout d'entités : rollback = retirer les records ; aucune donnée projet touchée.

## 1. Valeur et Remplacement
- **Origine V2 :** `03_Resources_Berman` et les SOPs opérationnelles (Marina SOPs, Ownerbooks OMK).
- **Obstacle dans Life OS :** L'onglet **RESOURCES** est vide (0 items).
- **Remplacement :** Créer la bibliothèque de ressources classifiées par type (`book`, `tool`, `template`, `sop`, `contact`) avec liaison bidirectionnelle vers les Projets Picard.

## 2. Périmètre et Implémentation
- Modélisation de l'entité `Resource` enrichie :
  - Type, URL/Path, Domaine Life Wheel, Projets associés.
- Intégration des ressources canoniques :
  - SOPs de nettoyage Marina Cleaning.
  - Ownerbook OMK Services.
  - Manifeste Summers's Verse.
  - Spécifications Plane & Linear.

## 3. Acceptation Fonctionnelle
- Recherche et filtrage dynamique dans `ResourceCard.tsx`.
- Injection d'une nouvelle ressource avec liaison immédiate à un projet.
- Tests fonctionnels exécutés : `npm run lint` et `npm run build` à 0 erreur.


---
## SOURCE : delegation-a-jules/categorie-3-para-enterprise-distillation/PRD-034-PARA-ARCHIVES-LIFECYCLE-RADAR.md

# PRD-034 — Cycle de Vie des Archives & Radar d'Entropie


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-031 (archiveProject s'applique aux PRJ-PICARD-* comme aux projets créés) ; PRD-033 (les resources des projets archivés restent consultables) ; PRD-035 (distillation vers l'ontologie au lieu de la perte sèche).

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : **`src/apps/para/components/ArchiveRadar.tsx` EXISTE DÉJÀ** (vérifié au 2026-09-12) : le PRD dit « Implémenter le composant ArchiveRadar.tsx » — remplacer par « étendre l'existant », pas de second fichier du même nom ; onglet 'archives' déjà présent dans `fw-para.store.ts` (activeTab) ; présence d'une action `archiveProject` dans le store : A SOURCER avant d'ajouter.
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** transition active->archived avec raison et lessonsLearned horodatées ; désarchivage possible ; historique consultable.

**Critères d'acceptation négatifs (doivent rester vrais) :** pas de suppression destructrice au déplacement en archives ; pas de réécriture de l'historique ; pas de distillation automatique vers OKF sans validation humaine (le verrou humain reste) ; pas d'archivage automatique par entropie calculée sans seuil sourcé.

**Sécurité / isolation / idempotence / persistance :** archivage réversible (désarchivage) ; horodatage et raison obligatoires ; le bilan d'apprentissage est une saisie utilisateur, jamais générée.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** archiveProject est réversible par design : rollback = désarchiver ; revert du composant/store sans perte de données.

## 1. Valeur et Remplacement
- **Origine V2 :** Projets abandonnés ou dormants accumulant de la dette technique.
- **Obstacle dans Life OS :** L'onglet **ARCHIVES** est inerte ; pas de protocole pour archiver proprement un projet avec bilan d'apprentissage.
- **Remplacement :** Implémenter le composant `ArchiveRadar.tsx` et le protocole d'archivage avec horodatage, raison d'arrêt et synthèse de liquidation (anti-paperclip).

## 2. Périmètre et Implémentation
- Action `archiveProject(id, reason, lessonsLearned)` dans `fw-para.store.ts`.
- Vue dédiée aux projets archivés avec possibilité de désarchivage ou de distillation vers la mémoire OKF.
- Liaison avec le journal DOX d'audit.

## 3. Acceptation Fonctionnelle
- Déplacement fluide d'un projet de `active` à `archived`.
- Visualisation de l'historique et des motifs d'archivage.
- Tests fonctionnels exécutés : `npm run lint` et `npm run build` à 0 erreur.


---
## SOURCE : delegation-a-jules/categorie-3-para-enterprise-distillation/PRD-035-PARA-ONTOLOGY-RDF-SYNCHRONIZATION.md

# PRD-035 — Synchronisation Bidirectionnelle PARA <=> Ontologie RDF Graham


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-031/032/033/034 (les exports portent projets, areas, resources, archives — une seule source : fw-para.store) ; aucun doublon d'export ailleurs.

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : `src/stores/fw-para.store.ts` comme seule source ; **les chemins V3 cités (`70_Onthologies/sujets/*.ttl`, `onto_gate.py`) sont HORS REPO (corpus privé)** : le repo ne peut pas les lire au runtime.
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** export propre de l'état PARA au format Turtle/JSON-LD ; triplets aspace:Document/aspace:covers/aspace:partOf générés depuis le store ; vérification de cohérence exécutée quand l'environnement la fournit.

**Critères d'acceptation négatifs (doivent rester vrais) :** **la ligne d'acceptation citée ne couvre que `npm run build` : ajouter `npm run lint` (tsc --noEmit, pas un test)** ; aucune synchronisation bidirectionnelle au runtime avec le disque privé (l'import V3->UI est une opération manuelle/scriptée hors repo, jamais un watcher) ; aucun triplet inventé pour combler un projet absent.

**Sécurité / isolation / idempotence / persistance :** export en lecture seule : aucun écriture du store depuis l'ontologie sans validation humaine ; l'export ne contient ni secrets ni corpus privé ; idempotence de l'export (sortie déterministe pour un état donné).

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** exportateur additif : rollback = supprimer le module et le dossier exports/ généré.

## 1. Valeur et Remplacement
- **Origine V3 :** `70_Onthologies/sujets/01_Projects_Picard.ttl` (938 documents) et `02_Areas_Spock.ttl` (263 documents).
- **Obstacle dans Life OS :** L'interface UI de Life OS ignore les triplets RDF de l'ontologie de Graham et vice versa.
- **Remplacement :** Mettre en place la passerelle d'export/sync entre le store `fw-para.store.ts` et le graphe RDF (`aspace:Document`, `aspace:covers`, `aspace:partOf`).

## 2. Périmètre et Implémentation
- Exportateur JSON-LD / Turtle des projets et areas actifs.
- Vérification de cohérence avec `onto_gate.py`.
- Intégration de la télémétrie de synchronisation dans le header PARA.

## 3. Acceptation Fonctionnelle
- Export propre de l'état PARA au format Turtle validé par Graham.
- Zéro régression TypeScript (`npm run build` à 0 erreur).
