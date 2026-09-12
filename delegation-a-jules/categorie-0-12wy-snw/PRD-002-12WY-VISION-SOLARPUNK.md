# PRD-002 — Vision, horizons et provenance

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
