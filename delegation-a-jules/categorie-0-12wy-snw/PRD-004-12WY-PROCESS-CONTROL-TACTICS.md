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
