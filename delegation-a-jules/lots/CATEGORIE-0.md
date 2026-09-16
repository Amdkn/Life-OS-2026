# Mandat complet catégorie 0

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
## SOURCE : delegation-a-jules/categorie-0-12wy-snw/PRD-002-12WY-VISION-SOLARPUNK.md

# PRD-002 — Vision, horizons et provenance


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** aucune en amont ; PRD-003 (import d'objectifs) et PRD-002 se réferencent mutuellement pour la provenance des visions. PRD-12WY-SQLITE-GLASSMORPHISM (PRD-001, même dossier) porte la persistance — ne pas créer de second store.

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : `vue.html` (racine repo, vérifié présent), `src/apps/twelve-week/components/VisionCommandCard.tsx`, store 12WY `src/stores/fw-12wy.store.ts` (importé par useWeeklyScore).
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** source/statut/conflit affichés pour chaque vision ; édition persistée puis retrouvée après reload ; aucun doublon Ikigai.

**Critères d'acceptation négatifs (doivent rester vrais) :** un horizon sans donnée reste vide et explicite (null/A SOURCER), jamais rempli par une projection ; Quarter Intent jamais promu en engagement actif par une bannière ; aucun label opérationnel converti automatiquement.

**Sécurité / isolation / idempotence / persistance :** provenance traçable par repère de source ; inconnu structuré (null) et non jauge verte ; aucune donnée du corpus privé C:/Users chargée au runtime — `vue.html` est dans le repo, c'est la seule source.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** PR bornée : revert des fichiers listés dans write_scope ; aucune migration de données — les visions éditées vivent dans les stores existants, un rollback n'écrase pas Ikigai ni le plan 12WY.

## Valeur et remplacement
Obstacle : confusion entre sens à long terme et semaine d'exécution. Remplacer les projections métier imposées par une vue traçable des visions existantes, sans dupliquer Ikigai.

## Sources et périmètre
Lire `vue.html` à la racine : vue dérivée historique, pas canon ratifié. Les chemins V3 qu'elle cite ne sont pas disponibles dans le clone distant : afficher provenance non consultée, A SOURCER. Ne pas demander à Jules de lire C:/Users ni de télécharger le corpus.
Réutiliser `src/apps/twelve-week/components/VisionCommandCard.tsx` et les types/stores réels. `VisionAlignmentMatrix.tsx` est un fichier proposé seulement si les composants actuels ne suffisent pas.
Séparer `meaningHorizon` (H1/H3/H10/H30/H90 en années) et cadence d'exécution (cycle/semaine). Les labels opérationnels homonymes issus de la vue restent explicitement en conflit, jamais convertis automatiquement. Ne pas inventer une vision pour les horizons absents.
Quarter Intent : reprendre le texte exact de la vue avec statut historique Q3 2026 ; aucune bannière ne le promeut en engagement actuel. Le texte source dit « 12WY superset PARA superset DEAL », pas une égalité entre frameworks.

## Acceptation fonctionnelle
Afficher source/statut/conflit ; éditer une vision puis recharger ; vérifier absence de doublon Ikigai. Un horizon sans donnée reste vide expliqué, pas rempli par une projection plausible. Tester séparation années/semaines et absence de promotion automatique du Quarter Intent.

## Contrat de livraison
Bénéficiaire : Amadou, utilisateur de Life OS. Priorité : engagement Life OS courant, jamais un plancher de workers. Aucun lancement Jules, push, merge, déploiement ou signature humaine autorisé par ce document seul.
Les données historiques restent historiques ; les propositions restent proposées. Inconnu = null / A SOURCER, jamais une jauge verte fabriquée. Aucun secret ni corpus privé supplémentaire à publier.
Avant modification, lire les implémentations citées et leurs consommateurs. Livrer une PR bornée avec fichiers changés, résultat utilisateur avant/après, commandes et sorties réelles, risques et retour arrière. Exécuter `npm run lint` et `npm run build` ; ces commandes ne remplacent pas les tests fonctionnels ci-dessous. Aucun test applicatif n'a été exécuté lors de la rédaction de ce brief.


---
## SOURCE : delegation-a-jules/categorie-0-12wy-snw/PRD-003-12WY-PLANNING-OBJECTIFS.md

# PRD-003 — Historique distinct du plan actif


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-002 (provenance et horizons) ; PRD-005 (le score ne compte que les engagements du plan actif, jamais les cartes historiques importées) ; PRD-001 pour la persistance locale.

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : `src/apps/twelve-week/components/GoalCommandCard.tsx`, `GoalForgeModal.tsx`, store 12WY `src/stores/fw-12wy.store.ts`, source `vue.html` (racine repo).
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** second import sans doublon ; aucun objectif actif créé par le seul import ; sélection utilisateur explicite retrouvée identique après reload ; historique intact après édition du plan actif.

**Critères d'acceptation négatifs (doivent rester vrais) :** aucun OBJ-01..07 inventé ; aucune activation ni antidatation automatique de septembre 2026 ; les huit jauges vertes de l'ancien sprint restent une citation historique, jamais une condition de succès ; aucune bannière de validation humaine générée par le code.

**Sécurité / isolation / idempotence / persistance :** identifiants d'import stables explicitement non canoniques liés à leur repère de source ; espace historique séparé du plan actif ; idempotence par identifiant déterministe.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** l'import est additif et isolé : rollback = suppression des enregistrements d'import par leur marqueur de provenance, sans toucher le plan actif ni l'historique Ikigai.

## Valeur et remplacement
Obstacle : faux engagements préremplis. Remplacer les sept objectifs codés en dur et les alias inventés par un import explicite, traçable et idempotent des cartes historiques de `vue.html`.

## Périmètre et données
Réutiliser `src/apps/twelve-week/components/GoalCommandCard.tsx`, `GoalForgeModal.tsx` et le store 12WY existant. Ne pas recréer les cartes.
Ne pas inventer OBJ-01..07. Préserver tout identifiant réellement disponible dans la source ; pour une carte sans identifiant, créer un identifiant technique d'import stable explicitement non canonique, lié à son repère de source. Ne pas confondre les IDs de référence des actions hebdomadaires avec ceux des cartes.
Importer en espace historique séparé du plan actif, sans duplication au second import. Conserver titre, provenance, statut et liens proposés. Une sélection utilisateur explicite seule crée un engagement courant ; elle n'est pas une certification humaine du canon.
L'ancien sprint qui exigeait huit jauges vertes reste une citation historique, jamais une condition de succès. Pour une revue courante : faits sourcés, besoins, maintenir/avancer/reporter ; santé inconnue ne bloque pas mécaniquement l'économie et ne devient pas verte.
Conserver la contradiction W4/W13. Dates de cycle choisies explicitement ; aucune activation ou antidatation automatique de septembre 2026. W1-W12 et buffer W13 sont relatifs au cycle sélectionné. Filtrer LD01-LD08 sans réduire Life OS à Business.

## Acceptation fonctionnelle
Importer deux fois sans doublon ; aucun objectif actif à l'import seul. Sélectionner un objectif, recharger et retrouver le même engagement. Historique intact après édition du plan. Tester conflit calendrier, source manquante et filtres vides ; aucun statut ratifié créé par le code.

## Contrat de livraison
Bénéficiaire : Amadou, utilisateur de Life OS. Priorité : engagement Life OS courant, jamais un plancher de workers. Aucun lancement Jules, push, merge, déploiement ou signature humaine autorisé par ce document seul.
Les données historiques restent historiques ; les propositions restent proposées. Inconnu = null / A SOURCER, jamais une jauge verte fabriquée. Aucun secret ni corpus privé supplémentaire à publier.
Avant modification, lire les implémentations citées et leurs consommateurs. Livrer une PR bornée avec fichiers changés, résultat utilisateur avant/après, commandes et sorties réelles, risques et retour arrière. Exécuter `npm run lint` et `npm run build` ; ces commandes ne remplacent pas les tests fonctionnels ci-dessous. Aucun test applicatif n'a été exécuté lors de la rédaction de ce brief.


---
## SOURCE : delegation-a-jules/categorie-0-12wy-snw/PRD-004-12WY-PROCESS-CONTROL-TACTICS.md

# PRD-004 — Tactiques persistantes et liens sans doublon


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-003 (les tactiques se rattachent à un engagement issu d'un choix utilisateur, pas d'un import historique) ; PRD-005 (useWeeklyScore consomme ces tactiques — changer le schéma des tactiques change le score) ; PRD-031/032 pour la validité des liens projectId PARA.

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : store 12WY `src/stores/fw-12wy.store.ts`, `src/apps/twelve-week/components/TacticForgeModal.tsx`, store PARA `src/stores/fw-para.store.ts` (champ `projects[].resources` déjà typé).
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** états pending/completed/failed avec transitions réversibles et historisées (cycleId/week + horodatage) ; double création sans doublon ; lien GTD idempotent avec référence source ; lien orphelin visible si projet supprimé/archivé.

**Critères d'acceptation négatifs (doivent rester vrais) :** aucune priorité LD01 codée en dur contre Life OS ; pas de réécriture silencieuse des semaines passées ; une case cochée n'est jamais une preuve d'atteinte d'objectif ; les tactiques d'un autre cycle ne fuient pas au changement de cycle.

**Sécurité / isolation / idempotence / persistance :** idempotence de la création GTD par référence de source ; prévention des boucles de création ; persistance locale via les stores existants sans dépendance cloud bloquante (voir PRD-001).

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** les transitions sont historisées : rollback = restitution de l'état antérieur depuis l'historique ; aucune suppression de tactique au rollback.

## Valeur et remplacement
Obstacle : action hebdomadaire détachée du résultat choisi. Remplacer les saisies redondantes entre tactique, PARA et GTD par des liens identifiés.

## Périmètre
Lire le store 12WY et `src/apps/twelve-week/components/TacticForgeModal.tsx` avant de proposer `pages/TacticsPage.tsx` (nouveau fichier éventuel, pas existant présumé).
États explicites pending/completed/failed : trois états, pas un statut binaire. Rendre les transitions réversibles et historisées, avec cycleId/week et horodatage. Une case n'est pas une preuve d'atteinte de l'objectif.
Respecter la priorité utilisateur actuelle ; pas de priorité LD01 codée en dur contre Life OS. Lien PARA projectId validé ; création GTD idempotente, référence source et prévention des boucles de création. Projet supprimé/archivé => lien orphelin visible, sans supprimer la tactique.

## Acceptation fonctionnelle
Créer une tactique liée, changer d'état, recharger ; double clic ne duplique rien. Basculer de cycle n'affiche pas les tactiques d'un autre cycle portant le même numéro de semaine. Tester lien orphelin et disponibilité locale sans cloud. Les reports sont tracés, pas une réécriture silencieuse des semaines passées.

## Contrat de livraison
Bénéficiaire : Amadou, utilisateur de Life OS. Priorité : engagement Life OS courant, jamais un plancher de workers. Aucun lancement Jules, push, merge, déploiement ou signature humaine autorisé par ce document seul.
Les données historiques restent historiques ; les propositions restent proposées. Inconnu = null / A SOURCER, jamais une jauge verte fabriquée. Aucun secret ni corpus privé supplémentaire à publier.
Avant modification, lire les implémentations citées et leurs consommateurs. Livrer une PR bornée avec fichiers changés, résultat utilisateur avant/après, commandes et sorties réelles, risques et retour arrière. Exécuter `npm run lint` et `npm run build` ; ces commandes ne remplacent pas les tests fonctionnels ci-dessous. Aucun test applicatif n'a été exécuté lors de la rédaction de ce brief.


---
## SOURCE : delegation-a-jules/categorie-0-12wy-snw/PRD-005-12WY-MEASUREMENT-85PERCENT.md

# PRD-005 — Scorecard : mesure sans faux vert


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-004 (dénominateur = tactiques persistées ; le filtre par semaine doit porter cycleId+week) ; PRD-003 (les cartes historiques importées ne comptent pas) ; PRD-021 (`life-os 12wy status` expose ce même score, ne pas recalculer).

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : `src/apps/twelve-week/hooks/useWeeklyScore.ts` — constats vérifiés au 2026-09-12 : `totalCount === 0` retourne `{ score: 0, isCrit: true, hasTactics: false }` (score=0/isCrit sans tactique) et `Math.round` est appliqué avant le seuil ; `src/apps/twelve-week/components/MeasurementBar.tsx` présent ; store `src/stores/fw-12wy.store.ts`.
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** dénominateur nul => score null et affichage « Non mesuré » ; 17/20 => 85 ; 14/20 => 70 ; 11/13 reste sous 85 malgré l'arrondi d'affichage ; pending/failed comptent au dénominateur ; score par (cycleId, week) sans mélange de cycles.

**Critères d'acceptation négatifs (doivent rester vrais) :** aucun faux vert généré ; aucune métrique santé/finance plausible ; lag measures jamais déduites du score ; aucune manipulation du score historique via ajout/retrait rétroactif sans révision visible.

**Sécurité / isolation / idempotence / persistance :** seuils appliqués à la valeur non arrondie ; figeage des engagements à la revue avec révision visible ; déduplication des tactiques par identifiant.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** correction du calcul = un hook et ses consommateurs ; rollback git des fichiers listés ; aucune donnée persistée n'est réécrite par ce correctif.

## Valeur et remplacement
Obstacle : absence de tactiques interprétée comme échec et résultat métier confondu avec activité. Corriger `src/apps/twelve-week/hooks/useWeeklyScore.ts` et ses consommateurs plutôt que créer un second calcul.
Constat source : filtre par numéro de semaine seul, score=0/isCrit=true sans tactique, arrondi avant seuil. Vérifier les types et `src/apps/twelve-week/components/MeasurementBar.tsx`.

## Règle de calcul
85% est un repère d'exécution, pas une garantie d'atteinte des objectifs. Les lead measures mesurent les actions ; les lag measures proviennent d'observations distinctes, jamais déduites du score.
Score = 100 × completed / engagements de la semaine ET du cycle sélectionnés. Pending et failed restent au dénominateur. Dénominateur nul => score null, affichage « Non mesuré », ni rouge ni vert. Figer les engagements à la revue ; ajouts/retraits/reports portent une révision visible, pas de manipulation du score historique.
Seuils appliqués à la valeur non arrondie : vert >=85 ; jaune >=70 et <85 ; rouge <70. Arrondi pour affichage seulement. Éviter qu'une valeur 84.6 apparaisse 85 sans indication de précision.
Réutiliser le stockage existant ; aucune métrique santé/finance plausible générée. Historique par cycleId/week, déduplication des tactiques par identifiant.

## Acceptation fonctionnelle
Tests unitaires : zéro engagement => null ; 17/20 =>85 ; 14/20 =>70 ; 11/13 reste sous 85 malgré arrondi ; pending/failed comptent ; cycles distincts ne se mélangent pas. Tester score après rechargement, révision visible et lag absent restant inconnu. Une compilation TypeScript réussie ne prouve pas ces comportements.

## Contrat de livraison
Bénéficiaire : Amadou, utilisateur de Life OS. Priorité : engagement Life OS courant, jamais un plancher de workers. Aucun lancement Jules, push, merge, déploiement ou signature humaine autorisé par ce document seul.
Les données historiques restent historiques ; les propositions restent proposées. Inconnu = null / A SOURCER, jamais une jauge verte fabriquée. Aucun secret ni corpus privé supplémentaire à publier.
Avant modification, lire les implémentations citées et leurs consommateurs. Livrer une PR bornée avec fichiers changés, résultat utilisateur avant/après, commandes et sorties réelles, risques et retour arrière. Exécuter `npm run lint` et `npm run build` ; ces commandes ne remplacent pas les tests fonctionnels ci-dessous. Aucun test applicatif n'a été exécuté lors de la rédaction de ce brief.


---
## SOURCE : delegation-a-jules/categorie-0-12wy-snw/PRD-006-12WY-TIME-USE-BLOCKS.md

# PRD-006 — Blocs de temps choisis, pas imposés


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-004 (fin de timer != tactique accomplie ; les blocs référencent tactiques/domaines sans dupliquer leurs états) ; PRD-001 (persistance locale des blocs).

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : `src/apps/twelve-week/components/TimeUseMatrix.tsx` (vérifié présent).
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** blocs créés/édités/rechargés avec début/fin, fuseau IANA et rattachement (cycleId, week) ; timer fondé sur temps écoulé réel, pause/reprise/annulation, onglet suspendu sans fausse complétion ; chevauchements détectés.

**Critères d'acceptation négatifs (doivent rester vrais) :** aucune alerte de récupération transformée en diagnostic de santé ou veto ; aucune intégration d'événements vers un calendrier externe dans cette PR ; aucune durée ou priorité imposée (LD01/LD02 exclusifs interdits) ; breakout absent => proposition explicative non bloquante.

**Sécurité / isolation / idempotence / persistance :** fuseau IANA explicite pour le changement d'heure ; durées invalides rejetées sans écran blanc ; persistance locale rechargée après fermeture du navigateur.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** blocs = données utilisateur locales : rollback = restore du composant, jamais une purge des blocs ; timer en cours annulé proprement sans marquer quoi que ce soit d'accompli.

## Valeur et remplacement
Obstacle : dispersion et planning rigide. Étendre `src/apps/twelve-week/components/TimeUseMatrix.tsx` au lieu d'introduire un second calendrier. TimeUseSchedule.tsx éventuel doit remplacer une responsabilité existante, pas la dupliquer.

## Périmètre
Blocs strategic/buffer/breakout ; durées proposées modifiables (3h, 30-60min), domaines choisis selon priorité actuelle, pas exclusivement LD01/LD02. Les alertes de récupération sont informatives, jamais diagnostic de santé ou veto automatique à partir d'une donnée absente.
Persistance des début/fin, fuseau IANA et rattachement cycle/semaine ; gestion des chevauchements et changement d'heure. Timer paramétrable avec pause/reprise/annulation, fondé sur temps écoulé réel plutôt que nombre de ticks ; rechargement et onglet en arrière-plan sans fausse complétion. Fin de timer != tactique accomplie.
Ne pas intégrer ou envoyer d'événements vers un calendrier externe dans cette PR.

## Acceptation fonctionnelle
Créer/éditer/recharger un bloc ; timer pause/reprise/rechargement ; tester onglet suspendu, changement de jour/fuseau, durée invalide et chevauchement. Absence de breakout => proposition explicable et non bloquante. Navigation clavier et contrôle des animations réduites.

## Contrat de livraison
Bénéficiaire : Amadou, utilisateur de Life OS. Priorité : engagement Life OS courant, jamais un plancher de workers. Aucun lancement Jules, push, merge, déploiement ou signature humaine autorisé par ce document seul.
Les données historiques restent historiques ; les propositions restent proposées. Inconnu = null / A SOURCER, jamais une jauge verte fabriquée. Aucun secret ni corpus privé supplémentaire à publier.
Avant modification, lire les implémentations citées et leurs consommateurs. Livrer une PR bornée avec fichiers changés, résultat utilisateur avant/après, commandes et sorties réelles, risques et retour arrière. Exécuter `npm run lint` et `npm run build` ; ces commandes ne remplacent pas les tests fonctionnels ci-dessous. Aucun test applicatif n'a été exécuté lors de la rédaction de ce brief.


---
## SOURCE : delegation-a-jules/categorie-0-12wy-snw/PRD-007-OFFLINE-RECOVERY-ACCEPTANCE.md

# PRD-007 — Preuve offline durable et reprise sans résurrection

## Objectif
Compléter PRD-001 par une garantie testable de reprise ; remplacer les tentatives réseau perdues après fermeture, pas réécrire 12WY. Appliquer [le contrat commun](../CONTRAT-COMMUN.md).

## Dépendances et périmètre
PRD-001 intégré et PRD-024 pour le changement d'utilisateur. Sources existantes : `src/lib/idb.ts`, `src/lib/db/core-db.ts`, stores appelants à inventorier. Périmètre proposé : tests de persistance et module outbox sous `src/lib/`; interdiction de modifier les composants 12WY pendant la session PRD-003. Sérialiser les modifications partagées avec PRD-024 ; ne pas substituer le blackboard serveur à IndexedDB.

## Spécification complémentaire
Écriture métier et opération outbox doivent être atomiques dans la même transaction IndexedDB, résolution sur transaction complete (pas seulement request success). Déletion logique/tombstone, idempotency key persistée, tentative bornée/backoff, reprise après restart, état pending/conflict/error visible. Une version serveur plus ancienne ne ressuscite pas une suppression. Conflits versionnés sans écrasement silencieux ; reconnexion et changement d'utilisateur isolent les queues. Ne pas synchroniser une session de démonstration vers un compte réel. Si le protocole serveur ne permet pas l'idempotence/versioning, livrer explicitement le contrat manquant et ne pas annoncer la garantie acquise.

## Acceptation fonctionnelle
1. Réseau coupé : créer/modifier/supprimer ; fermer puis rouvrir navigateur ; état métier et file conservés.
2. Rétablir réseau ; chaque effet traité une fois malgré réponse perdue et retry ; outbox acquittée après preuve serveur.
3. Rejouer un snapshot serveur ancien : aucun élément supprimé ne réapparaît.
4. Deux onglets écrivent la même version : conflit explicite ou règle déterministe testée ; pas de dernière écriture arbitraire cachée.
5. Basculer comptes A/B : aucun élément ni opération A visible/exécuté sous B. Cas négatif sur transaction avortée : ni succès UI ni demi-écriture.

## Contrat de livraison
Tests navigateur IndexedDB réels avec fixtures isolées et serveur de test explicitement étiqueté. Fournir le runner et les commandes exactes ; `npm run lint` et `npm run build` requis mais insuffisants. Aucune mesure de latence inventée. Migration sur copie avec sauvegarde/restauration vérifiée ; rollback conserve les opérations non acquittées. Cette fiche complète PRD-001, ne le rejoue pas s'il est intégré.


---
## SOURCE : delegation-a-jules/categorie-0-12wy-snw/PRD-12WY-SQLITE-GLASSMORPHISM.md

# PRD-001 — Persistance local-first sans second moteur


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-011 (catégorie 1) est le SEUL propriétaire du schéma blackboard SQLite (service) ; PRD-052 (catégorie 5) en consomme sans second schéma. Cette PR (ID canonique PRD-001, nom de fichier historique `PRD-12WY-SQLITE-GLASSMORPHISM.md` conservé) reste sur DomainDB/IndexedDB navigateur et n'installe aucun moteur SQLite — pas de migration par décret.

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : `src/lib/idb.ts` — chemin cloud-first vérifié (getAll attend Supabase avant de retourner les données locales) ; `src/lib/ld-router.ts`, `src/lib/db/core-db.ts`, consommateurs Ikigai/Wheel/PARA/12WY.
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** lecture locale immédiate avant tout appel réseau ; écriture confirmée après transaction ; Supabase inaccessible n'empêche ni ouverture ni édition ; retries idempotents sans doublon ; conflits visibles sans écrasement silencieux.

**Critères d'acceptation négatifs (doivent rester vrais) :** aucun faux succès si IndexedDB échoue ; aucune clé serveur embarquée (VITE_SUPABASE_ANON_KEY reste anon, jamais service_key) ; aucun chiffre de latence ou % offline sans mesure réelle ; pas de service parallèle ni de suppression distante.

**Sécurité / isolation / idempotence / persistance :** isolation utilisateur déjà filtrée dans idb.ts (user_id) à préserver ; outbox persistante avec identifiants idempotents si sync activée ; suppressions représentées sans résurrection ; échec quota visible.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** le chemin cloud-first reste fonctionnel tant que la PR n'est pas fusionnée ; rollback = revert de idb.ts et consommateurs ; sauvegarde IndexedDB (export) avant toute modification de schéma de store.

## Valeur et remplacement
Obstacle : lecture locale retardée par le cloud. Remplacer le chemin cloud-first, pas IndexedDB par défaut. `src/lib/idb.ts:41-64` attend actuellement Supabase avant de retourner les données ; vérifier tous ses consommateurs et `src/lib/ld-router.ts`, `src/lib/db/core-db.ts`.

## Périmètre
Réutiliser DomainDB/IndexedDB et les stores existants. SQLite n'est pas une dépendance demandée : toute migration doit justifier ce qu'elle retire, compatibilité, sauvegarde et reprise sans perte avant décision séparée. Préserver l'isolation des domaines et utilisateurs.
Lecture locale immédiate, écriture locale confirmée après transaction, échec quota/transaction visible. Cloud optionnel et non bloquant ; indisponibilité Supabase ne bloque ni l'ouverture ni l'édition locale. Ne jamais embarquer une clé serveur.
Si synchronisation activée : outbox persistante, identifiants idempotents, retries bornés, conflits visibles sans écrasement silencieux, suppressions représentées sans résurrection. Intervalle proposé 24h, configurable ; navigateur fermé => aucune promesse de tâche active, rattrapage à la réouverture. Pas de service parallèle ou de suppression distante dans cette PR.
Conserver le design existant ; utiliser `motion` déjà déclaré, ne pas ajouter une bibliothèque d'animation équivalente. Aucun chiffre de latence ou pourcentage offline sans mesure.

## Acceptation fonctionnelle
Créer/modifier localement avec Supabase inaccessible ; recharger et retrouver les valeurs. Simuler échec IndexedDB et vérifier absence de faux succès. Répéter un retry sans doublon ; conflit signalé et données préservées. Vérifier les consommateurs Ikigai, Wheel, PARA et 12WY. Mesurer réellement les délais si rapportés. Le chargement initial hors réseau est une capacité distincte (cache applicatif/service worker à vérifier), pas une conséquence automatique d'IndexedDB.

## Contrat de livraison
Bénéficiaire : Amadou, utilisateur de Life OS. Priorité : engagement Life OS courant, jamais un plancher de workers. Aucun lancement Jules, push, merge, déploiement ou signature humaine autorisé par ce document seul.
Les données historiques restent historiques ; les propositions restent proposées. Inconnu = null / A SOURCER, jamais une jauge verte fabriquée. Aucun secret ni corpus privé supplémentaire à publier.
Avant modification, lire les implémentations citées et leurs consommateurs. Livrer une PR bornée avec fichiers changés, résultat utilisateur avant/après, commandes et sorties réelles, risques et retour arrière. Exécuter `npm run lint` et `npm run build` ; ces commandes ne remplacent pas les tests fonctionnels ci-dessous. Aucun test applicatif n'a été exécuté lors de la rédaction de ce brief.
