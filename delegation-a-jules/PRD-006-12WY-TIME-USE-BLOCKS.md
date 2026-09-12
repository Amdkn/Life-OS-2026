# PRD-006 — Blocs de temps choisis, pas imposés

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
