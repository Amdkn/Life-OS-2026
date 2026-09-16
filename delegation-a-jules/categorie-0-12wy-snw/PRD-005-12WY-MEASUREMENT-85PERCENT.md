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
