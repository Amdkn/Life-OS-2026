# Plan de délégation des 55 PRD Life OS à Jules

## Portée et preuves
Plan seulement, aucune session créée ni PR fusionnée pendant cette préparation. Sources lues : delegation-a-jules/orchestration/governance/work-items.json (55 entrées), paragraphes dépendances et périmètres des 55 PRD, corrections du contrat et de l'audit. Inventaire API Jules paginé et API GitHub des PR1–4 consultés pendant cette préparation.

État observé : PRD001 PR1 fusionnée ; PRD002 PR2 fusionnée ; PRD011 PR3 ouverte non fusionnée ; PRD041 PR4 ouverte non fusionnée. PRD003 session1391687838750096362 COMPLETED sans PR dans outputs : livrable à récupérer/vérifier, jamais recréer aveuglément. Aucun Life OS actif dans l'inventaire ; trois tâches actives ailleurs sur le compte. Ce snapshot ne garantit pas les slots futurs. Fusion ne prouve pas tous les DoD : tests et critères restent à vérifier.

## Première admission depuis l'état observé
- Reprendre les sessions PRD011 (7587937436525114170) et PRD041 (3716194391895641129) pour correction/DoD si nécessaire ; les PR3/4 sont disponibles pour revue. Pas de nouvel exemplaire.
- Reprendre PRD003 (1391687838750096362) pour obtenir PR, commit et tests manquants.
- En parallèle : PRD024 (scopes/migration défensive), PRD051 (client Jules SERVEUR dans son namespace), PRD071 (modèle de franchise).
- PRD031 (import PARA) en parallèle si ses véritables sources sont embarquées dans le dépôt/brief. Si non, préparer l'adaptateur et ses tests mais ne pas déclarer l'import réel terminé. Ne pas fabriquer le corpus privé.
- PRD007 peut suivre PRD024 ; ne pas attendre les PR3/4 pour l'offline.
- PRD042/043/044/053 attendent PRD041 disponible sur leur base ; PRD013/052 attendent PRD011 disponible sur leur base.

## Vagues conservatrices de référence (reconstruction complète)
Chaque ligne représente des scopes déclarés disjoints ; l'intégration dans les fichiers partagés est réservée à un seul writer. Ne pas attendre toute la vague : chaque job démarre dès SES prérequis disponibles et vérifiés. Les 001/002 déjà fusionnés ne sont pas à refaire.

| Vague | PRD parallélisables |
|---|---|
| 0 | 001, 011, 024, 031, 041, 051, 071 |
| 1 | 002, 007, 013, 016, 023, 032, 042, 043, 044, 052, 053, 091 |
| 2 | 003, 012, 014, 026, 033, 045, 062, 072, 081, 092 |
| 3 | 004, 015, 034, 056, 063, 064, 073, 082, 083, 084 |
| 4 | 005, 006, 035, 054, 061, 074, 085 |
| 5 | 021, 025, 055, 065, 075, 093 |
| 6 | 022, 094 |
| 7 | 095 |

La racine 024 désigne le module de scoping ; son raccordement à IndexedDB exige001. La racine051 désigne le client serveur, pas l'ensemble de l'UI/pipeline dépendant. Le registre donne des scopes plus étroits que certaines fiches : tout élargissement impose une nouvelle vérification des collisions.

## Liste fonctionnelle exhaustive
- C0 : 001 persistance local-first ; 002 vision/horizons ; 003 historique/plan actif ; 004 tactiques ; 005 scorecard ; 006 blocs de temps ; 007 reprise offline.
- C1 : 011 schéma blackboard ; 012 Linear HQ ; 013 registre crons ; 014 scorecard flotte ; 015 relations/skills ; 016 contrats inter-catégories.
- C2 : 021 CLI ; 022 MCP ; 023 assistant multi-agents ; 024 scopes/migrations ; 025 API Business Bridge ; 026 droits/tenants.
- C3 : 031 projets PARA ; 032 areas ; 033 resources ; 034 archives ; 035 RDF.
- C4 : 041 roster ; 042 Ikigai ; 043 GTD ; 044 DEAL ; 045 pont frameworks-blackboard.
- C5 : 051 client Jules ; 052 moteur blackboard ; 053 Wheel ; 054 pipeline GTD/DEAL ; 055 dashboard convergence ; 056 admission/reprise.
- C6 : 061 compilateur skills ; 062 gates/hooks ; 063 outils MCP ; 064 crons/télémétrie ; 065 visualiseur swarms.
- C7 : 071 franchises ; 072 handoff B1 ; 073 trésorerie ; 074 portail membres ; 075 cockpit B1.
- C8 : 081 roster VP ; 082 traduction DoD/JTBD ; 083 uplink hebdomadaire ; 084 bus inter-franchises ; 085 cockpit B2.
- C9 : 091 matrice B3 ; 092 runtime déterministe ; 093 bras cognitifs ; 094 compositeur ; 095 inspecteur.

## Dépendances inter-catégories à protéger
Le registre seul sous-spécifie certaines intégrations. Ordre conservateur proposé, pas prétendu déjà canonisé :
- 041 avant091 (la fiche041 déclare091 consommateur du roster).
- 031/032 avant004 pour les liens PARA.
- 003/032 avant015 ; 015/091 avant061 pour l'intégration de l'arbre et la propriété des types.
- 005 avant021 ; 005/006/011 avant025 pour les sorties mesurées.
- 052 avant072 pour sa file persistée.
- 092 avant064 pour réutiliser le scheduler plutôt qu'en créer un autre.
- 043/044/056 avant054 pour l'enchaînement complet autorisé.
- 045/005 avant055 pour les vues alimentées réellement.
Les mentions croisées 012/014, 003/005, etc. ne sont pas toutes des dépendances de construction : figer contrats/rosters communs et tester l'intégration, ne pas créer de cycles artificiels. La table est une proposition prudente, pas une preuve d'absence de toute collision non déclarée.

## Réutilisation, parallélisme et intégration
Une session traite une chaîne séquentielle sur sa branche ; elle ne fait pas tourner plusieurs jobs simultanément. Pour042,043,044 en parallèle après041 : sessions séparées basées sur une révision contenant041. Réutiliser la session041 pour une de ces branches est possible ; les autres consomment les contrats vérifiés. Par défaut les dépendants attendent la fusion autorisée ; des PR empilées sont une alternative explicite, avec branche de base exacte, tests et dépendances affichées, sans qualifier ces changements d'intégrés main.

Ne pas lancer toute une catégorie monolithique : les dépendances croisent les catégories. Ne pas imposer l'ancien plafond trois catégories à cette proposition : il contredit le mandat utilisateur plus récent. PRD056/config/tests doivent être alignés avant automatisation ; les fichiers existants ne sont PAS modifiés par ce plan.

15 simultanées est plafond COMPTE, tous dépôts et sessions en attente inclus selon comptage prudent. Documentation Pro :100 tâches/24h glissantes. Ce n'est pas100 tâches obligatoires ni preuve qu'une session vit24h. Réutilisation prioritaire, gratuité illimitée non garantie ici. Rafraîchir inventaire/quota avant chaque admission ;429 respecte Retry-After, POST ambigu réconcilié avant répétition.

## Ownership obligatoire
Un seul writer pour package.json, package-lock.json, migrations/schema, routes globales, Desktop/AppDrawer/header/sidebar. Envoi parallèle = modules réservés + patch de raccordement sérialisé.
- 002/003/004 et raccordement043 : fw-12wy.store.ts partagé.
- 031/033/004 et raccordement043 : fw-para.store.ts partagé.
- 007 réserve largement src/lib/ dans le registre : ne pas le superposer aux jobs écrivant dans ce sous-arbre sans scope affiné et validé.
- 022/091 peuvent nécessiter dépendances de test : faire intégrer le changement package par le writer unique, pas deux modifications concurrentes.
- 061 utilise l'arbre015 ;064 utilise scheduler092 ;051 reste le client Jules unique.

## Contrat de chaque mandat Jules
Inclure PRD complet, contrat commun, JTBD précis, dépendances et base commit, fichiers autorisés, DoD positifs/négatifs, commandes de tests réelles, attentes de PR et suite proposée. Retour attendu : commit/PR, commandes+rc, tests exécutés, critères satisfaits/non satisfaits, limites et prochain job prêt. COMPLETED seul reste PR_READY/à vérifier, jamais VERIFIED/INTEGRATED.

DoD minimum : comportement fonctionnel demandé, persistance/reprise lorsque requises, erreur/vide explicites, droits/idempotence, absence de secrets navigateur, tests métier + lint/build. Pas de mock en production, pas de preuve inventée. Stripe/ACH de073/063 : implémentation et tests autorisés, transaction réelle uniquement GO humain.

## Managers et surveillance
Managers GLM portent les DoD et décisions de dispatch ; Jules implémente les JTBD. La surveillance compte/réconcilie de façon déterministe, n'appelle GLM que sur événement utile, puis choisit correction, réutilisation ou job prêt suivant. Vérification et livraison d'une tâche déclenchent le choix suivant, pas abandon global du programme. Réutiliser les crons existants, ne pas ajouter une nouvelle couche de routage. Architecture anti-réinfection intacte ; aucun proxy modifié par ce plan.
