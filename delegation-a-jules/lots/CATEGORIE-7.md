# Mandat complet catégorie 7

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
## SOURCE : delegation-a-jules/categorie-7-b1-summer-verse-ceo/PRD-071-FRANCHISE-CORE-DYNAMIC-INSTANCE-MODEL.md

# PRD-071: Franchise Core Engine & Dynamic Instance Model

## Correctif de délégation (audit 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (cartographie C7-9) — ce PRD est le socle B1 des catégories 7-9.

- **Dépendances PRD réelles** : aucune en amont (socle). Sont dépendants de PRD-071 : PRD-072, PRD-073, PRD-074, PRD-075 (cat 7) et PRD-084 (bus cat 8). Ne pas lancer les dépendants avant l'intégration de ce socle.
- **Write_scope (chemins concrets)** : `src/types/franchise.ts` (création), `src/services/franchise/franchise-factory.ts` (création — le PRD initial ne fixe pas de chemin ; `src/services/` existe, seul `migration.service.ts` y vit). Interdiction de toucher `src/types/twelve-week.ts`, `src/stores/*` et les apps existantes.
- **Critères positifs** : `npm run lint` (= `tsc --noEmit`, ce n'est pas une suite de tests) et `npm run build` à 0 erreur ; interface `FranchiseInstance` avec exactement les 4 IDs déclarés ; la factory instancie une instance à partir de son id et expose `activeModules` typés (billing, member_portal, field_ops, holding_ledger).
- **Critères négatifs** : aucune donnée réelle des sociétés ABC/RILCOT/Alikaly/Marina dans le repo front — la factory ne charge que des définitions de configuration ; aucune télémétrie fictive ; aucune clé/API dans les constantes ; pas d'écriture dans un store existant.
- **Sécurité & isolation** : `b1Config` ne transporte aucun secret ; les franchises sont isolées par type discriminé, pas par branches de `any` ; rien côté navigateur ne décide de la ventilation financière (voir PRD-073).
- **Idempotence & persistance** : le modèle est pur (types + factory déterministe) ; pas de persistance ici. La persistance de gouvernance relève du blackboard SQLite côté service — propriétaire du schéma : PRD-011 (cat 1) ; consommation : PRD-052 (cat 5). Ne pas créer un second schéma, et ne pas décréter que DomainDB/IndexedDB navigateur remplace le service.
- **Reprise / rollback non destructif** : fichiers exclusivement nouveaux, sans fusion avec des modules existants ; rollback = suppression des 2 fichiers créés, sans impact sur le shell.
- **Correction de typo** : commandes de validation re-rondes (`npm run build`, `tsc --noEmit`) ; le libellé « tsc --noEmit » seul est accepté uniquement via `npm run lint`.

## Objectif
Creer le modele generique de franchise permettant d executer ABC, RILCOT, Alikaly et Marina a partir d une architecture unique, en eliminant les 4 codebases disparates.

## Specifications
- Definir src/types/franchise.ts avec l interface FranchiseInstance :
  - id: 'abc_childcare' | 'rilcot' | 'alikaly_holding' | 'marina_cleaning'.
  - b1Config: North Star (1Y/3Y/10Y), 12WY Cycles de commandement.
  - activeModules: Array de modules actives (billing, member_portal, field_ops, holding_ledger).
  - b2Gates: Matrice des portes de graduation de projets.
- Factory de chargement dynamique src/services/franchise/franchise-factory.ts (FranchiseFactory.ts).
- Valider avec npm run lint (tsc --noEmit) et npm run build.

---
## SOURCE : delegation-a-jules/categorie-7-b1-summer-verse-ceo/PRD-072-B1-HANDOFF-QUEUE-DECISION-CHARTER.md

# PRD-072: B1 Handoff Queue & Decision Charter (B1->B2->B3)

## Correctif de délégation (audit 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (C7-9).

- **Dépendances PRD réelles** : PRD-071 (types `FranchiseInstance`, `b2Gates`) ; consommateur aval : PRD-082 (pipeline DoD B2, cat 8) qui lit cette file. Ne pas démarrer PRD-082 avant intégration de PRD-072.
- **Risque mesuré** : le PRD initial cite `04_B2_HANDOFF_QUEUE.md` et `03_DECISION_CHARTER.md` — documents absents du repo (mesuré : glob sans résultat). Ils vivent dans le corpus privé hors repo. Le PRD doit embarquer l'extrait canonique des règles (les 3 ci-dessous) et ne pas dépendre de fichiers hors repo.
- **Write_scope (chemins concrets)** : `src/services/governance/b1-handoff-queue.ts` (création, dossier à créer), `src/types/governance.ts` (types du ticket handoff, dossier à créer). Interdiction de toucher les PRD des autres catégories et les stores existants.
- **Critères positifs** : un ticket B1→B2 est créé, assigné, refusé ou honoré avec historique ; aucun état de ticket non défini dans un type union strict ; `npm run lint` + `npm run build` à 0 erreur.
- **Critères négatifs** : aucune UI dans ce PRD (le cockpit PRD-075 visualise) ; aucune notification sortante vers Jules ici ; aucun contournement du verrou « pas de mandat B1 → pas de travail B2 » ; pas de données fictives dans la file.
- **Sécurité & isolation** : le ticket ne transporte jamais de secret ; l'alerte de dérive de direction est un événement interne, pas un envoi réseau.
- **Idempotence & persistance** : création de ticket idempotente (clé de déduplication id franchise + référence docket) ; la file persiste côté blackboard SQLite service (schéma propriétaire PRD-011, consommation PRD-052) — pas un localStorage navigateur. Le service n'existe pas encore (mesuré : express en deps, aucun fichier serveur) : à créer dans `src/server/` ou à déclarer dépendance explicite de PRD-011.
- **Reprise / rollback non destructif** : rollback = retrait du service et des 2 fichiers créés ; la file est additive, jamais destructive sur des données existantes.

## Objectif
Materialiser le protocole canonique documente dans 04_B2_HANDOFF_QUEUE.md et 03_DECISION_CHARTER.md pour empecher tout travail d execution sans mandat B1.

## Specifications
- Creer src/services/governance/b1-handoff-queue.ts.
- Implementer les regles d arret :
  - Aucun travail B2 sans ticket dans la file de transmission B1.
  - Aucun travail A3/B3 sans DoD (Definition of Done) validee par B2.
  - Alerte de derive de direction transmise au CEO.
- Valider avec npm run lint (tsc --noEmit) et npm run build.

---
## SOURCE : delegation-a-jules/categorie-7-b1-summer-verse-ceo/PRD-073-HOLDING-TREASURY-MULTI-TENANT-BILLING.md

# PRD-073: Holding Treasury & Multi-Tenant Billing Engine

## Correctif de délégation (audit 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (C7-9). PRD à risque financier — lecture obligatoire avant toute exécution.

- **Dépendances PRD réelles** : PRD-071 (modules `billing`, `holding_ledger`) ; PRD-072 (aucune écriture de trésorerie sans ticket B1) ; PRD-011 (schéma blackboard pour la persistance du grand livre) ; consommateur : PRD-074 (factures parents) et PRD-075 (baromètre CA).
- **Risque mesuré** : express est en dependencies mais **aucun fichier serveur n'existe** dans le repo. Ce PRD est fondamentalement backend : moteur de facturation Stripe/ACH, ventilation comptable, écritures de grand livre = service Node, jamais React.
- **Write_scope (chemins concrets)** : `src/server/treasury/holding-treasury-engine.ts` (moteur backend, à créer), `src/server/treasury/ledger.ts` (écritures), UI de lecture seule `src/apps/franchise/billing/HoldingTreasuryEngine.tsx` (dossiers à créer — conserve le chemin initial comme interface UI uniquement).
- **Critères positifs** : chaque écriture comptable porte une clé d'idempotence et un solde recalculable à partir du journal ; ventilation déterministe vers le grand livre holding ; seuils de trésorerie configurés en source ; `npm run lint` + `npm run build` à 0 erreur (le build Vite n'entre pas dans src/server/, vérifier aussi `npx tsc --noEmit`).
- **Critères négatifs** : aucune clé Stripe/ACH dans `VITE_*` ni dans le bundle navigateur ; aucun calcul de marge ou d'encaissement dans React ; sans connexion réelle, l'UI affiche un état vide/erreur explicite — jamais des chiffres de démonstration ni de télémetrie fictive ; pas d'exécution réelle de virement (porte irréversible, hors mandat automatisé).
- **Sécurité & isolation** : secrets uniquement côté service (variables d'environnement serveur) ; isolation multi-tenant stricte par franchise sur chaque requête ; journal d'audit append-only.
- **Idempotence & persistance** : grand livre SQLite côté service avec clés de déduplication (idempotency-key Stripe côté backend) ; écritures immuables + contre-passation, jamais de mise à jour en place ; schéma propriété PRD-011, pas de second schéma.
- **Reprise / rollback non destructif** : une contre-passation annule une écriture, jamais une suppression ; rollback du PRD = retrait du module sans altérer le shell ni les stores existants.

## Objectif
Fusionner le moteur de paiement d ABC Child Care avec la tresorerie inter-societes d Alikaly Bana Holding.

## Specifications
- Creer src/server/treasury/holding-treasury-engine.ts (moteur backend ; HoldingTreasuryEngine.tsx reste la vue de lecture seule).
- Gestion des flux de tresorerie consolides :
  - Encaissements recurrents (frais de garde, cotisations cooperative, prestations nettoyage).
  - Ventilation automatique vers le grand livre de la Holding.
  - Calcul des marges nettes et alertes de seuil de tresorerie.
- Valider avec npm run lint (tsc --noEmit) et npm run build ; le moteur backend est vérifié par npx tsc --noEmit (pas de script `test` dans package.json — ne pas prétendre en exécuter).

---
## SOURCE : delegation-a-jules/categorie-7-b1-summer-verse-ceo/PRD-074-UNIVERSAL-MEMBER-PORTAL-CLIENT-GATEWAY.md

# PRD-074: Universal Member Portal & Client Gateway

## Correctif de délégation (audit 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (C7-9).

- **Dépendances PRD réelles** : PRD-071 (branding et modules par franchise) ; PRD-073 (factures parents ABC) ; consommateur : PRD-075 (vue exécutive).
- **Write_scope (chemins concrets)** : `src/apps/franchise/portal/UniversalMemberPortal.tsx` et composants du dossier (dossiers à créer), thème/logos dans `src/apps/franchise/portal/themes/`. Ne pas réécrire `src/types/profile.ts` ni `src/stores/auth.store.ts` — consommer le profil existant.
- **Critères positifs** : les 3 profils (parents ABC, adhérents RILCOT, clients Marina) rendent chacun leur liste de fonctionnalités depuis les types PRD-071 ; bascule de thème/logo déterministe par franchise ; `npm run lint` + `npm run build` à 0 erreur.
- **Critères négatifs** : pas de données parents/adhérents/clients fictives préremplies — état vide ou erreur explicite tant que les données réelles ne sont branchées ; pas de signature/achat/demande d'intervention exécutée côté navigateur sans backend (PRD-073) ; pas de copie du code des 4 codebases historiques.
- **Sécurité & isolation** : isolation stricte des données par franchise et par profil (un parent ABC ne voit jamais RILCOT) ; aucune donnée sensible (présences, factures) dans `VITE_*` ou le localStorage — persistance serveur (PRD-011/PRD-073), cache navigateur lecture seule.
- **Idempotence & persistance** : la configuration de branding est déclarative (objet franchise), pas un état mutable navigateur ; les demandes d'intervention clients sont idempotentes côté service.
- **Reprise / rollback non destructif** : app isolée enregistrée via `src/apps/agent-portal/register.ts` ou montage dédié ; rollback = retrait du dossier portal sans impact sur les apps existantes.

## Objectif
Remplacer les espaces clients eclates par un portail unifie avec branding dynamique par franchise.

## Specifications
- Creer src/apps/franchise/portal/UniversalMemberPortal.tsx.
- Support multi-profils :
  - Parents (ABC) : presences, alertes, factures.
  - Adherents (RILCOT) : votes, documents partages, agenda communaute.
  - Clients (Marina) : demandes d intervention, validation de fin de chantier.
- Bascule de theme et logo dynamique selon le contexte de franchise.
- Valider avec npm run lint (tsc --noEmit) et npm run build.

---
## SOURCE : delegation-a-jules/categorie-7-b1-summer-verse-ceo/PRD-075-B1-SUMMER-VERSE-CEO-COMMAND-COCKPIT.md

# PRD-075: B1 Summer-Verse CEO Command Cockpit

## Correctif de délégation (audit 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (C7-9). Cockpit terminal B1 — n'affiche que ce qui existe.

- **Dépendances PRD réelles** : PRD-071 (franchises), PRD-072 (file d'arbitrages B1), PRD-073 (CA/trésorerie), PRD-081/PRD-085 (santé des 8 domaines B2, cat 8), PRD-051 (client serveur Jules, cat 5 — le « déclenchement de délégations Jules d'un simple clic » passe par ce client existant, pas un second client). Dépendants : aucun (PRD final de cat 7).
- **Quota Jules — fait mesuré** : docs officiels = 100 tâches/24 h glissantes (Pro) et 15 tâches concurrentes ; l'API ne prouve pas de compteur par utilisateur. Le cockpit n'affiche donc pas un « quota restant » mais le nombre de délégations actives connues localement.
- **Write_scope (chemins concrets)** : `src/apps/agent-portal/components/B1SummerVerseCockpit.tsx` (chemin corrigé : `src/apps/portal/` n'existe pas dans le repo — l'app réelle est `src/apps/agent-portal/`). Interdiction de créer `src/apps/portal/`.
- **Critères positifs** : baromètre des 4 franchises alimenté par PRD-071/073 ; file d'arbitrages branchée sur PRD-072 ; lancement de délégation Jules via PRD-051 ; `npm run lint` + `npm run build` à 0 erreur.
- **Critères négatifs** : aucune métrique simulée quand la source est vide — jauge vide + libellé « source non connectée » ; pas de second client Jules ; pas de chiffre de trésorerie calculé côté navigateur (PRD-073 fournit les états) ; aucune donnée des sociétés réelles codée en dur.
- **Sécurité & isolation** : le cockpit est en lecture/ordonnancement, pas en écriture comptable ; tout déclenchement de délégation passe par la file PRD-072 (pas de travail sans mandat) ; aucun secret dans le composant.
- **Idempotence & persistance** : clic de délégation idempotent (déduplication côté client de l'entrée de file) ; l'état du cockpit est une projection lecture seule des stores existants (`fw-12wy.store.ts`, `ld01.store.ts`) et des services PRD-072/073.
- **Reprise / rollback non destructif** : composant ajouté à la navigation existante sans modifier les autres pages ; rollback = retrait du composant et de sa route.

## Objectif
Construire le tableau de bord de direction supreme dans Agent Portal pour Amadou Kone (CEO B1).

## Specifications
- Creer src/apps/agent-portal/components/B1SummerVerseCockpit.tsx.
- Synthese executive :
  - Barometre des 4 franchises (Chiffre d affaires, Taux de completion 12WY, Sante operationnelle).
  - File d attente des arbitrages B1 (decisions strategiques requises).
  - Declenchement rapide de delegations Jules transversales d un simple clic.
- Valider avec npm run lint (tsc --noEmit) et npm run build.