# PRD-004 — Tactiques persistantes et liens sans doublon

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
