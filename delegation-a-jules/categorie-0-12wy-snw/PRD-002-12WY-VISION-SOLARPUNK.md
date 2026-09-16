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
