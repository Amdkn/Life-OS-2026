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
