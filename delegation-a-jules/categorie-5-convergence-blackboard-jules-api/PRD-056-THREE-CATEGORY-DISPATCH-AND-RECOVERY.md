# PRD-056 — Admission trois catégories, parallélisme Jules et récupération

## Objectif
Supprimer le verrou sériel « une session active bloque tout », sans fabriquer des tâches pour consommer un abonnement. Tous les PRD des dix catégories entrent dans un backlog vérifiable ; trois catégories maximum sont admises simultanément. Remplace le suivi manuel sériel ; réutilise le scheduler/blackboard existant plutôt qu'ajouter un daemon concurrent. Appliquer [le contrat commun](../CONTRAT-COMMUN.md).

## Dépendances et périmètre
PRD-011/016 pour états/contrats, PRD-026 pour droits, PRD-051 pour adaptateur Jules. Périmètre proposé : module serveur de dispatch et tests ; carte UI dans namespace Jules ; aucune clé côté Vite. Le dispositif opératoire initial peut être un outil CLI borné, séparé du futur runtime applicatif et sans prétendre à une cadence autonome déjà installée.

## Spécification
1. File durable par catégorie puis tranches PRD : requested→ready→reserved→submitted→running→pr_ready→verified→integrated ; blocked/failed/uncertain distincts. `COMPLETED` Jules n'est pas integrated. Dépendances satisfaites par reçu de commit intégré + tests, pas existence de PR.
2. Jusqu'à trois catégories actives, parallélisme configurable par scopes disjoints sous plafond compte. Pro publié : 100 tâches/24h glissantes, 15 concurrentes ; pas garantie du compte. Inclure autres dépôts et sessions en attente dans l'admission prudente. Quota inconnu affiché UNKNOWN ; 429 gèle les créations et respecte Retry-After/backoff.
3. Reprise d'une session existante par ID avant création. Identité logique stable repository/category/tranche ; version de brief dans un hash distinct. Une retouche de texte ne doit pas créer un second job actif. Réservation atomique avec lease/fencing et expiration ; unicité des effets, pas seulement verrou process.
4. POST create : persister intention avant appel. Timeout après envoi = UNCERTAIN ; réconcilier par inventaire paginé avant retry, pas réessayer aveuglément. Lire la session exacte après création ; vérifier source, titre, branche, mode PR et statut. `AUTO_CREATE_PR`, `requirePlanApproval` et accès variables d'environnement sont explicites ; PR automatique n'est pas merge automatique.
5. Réveils pilotés par événements si transport documenté disponible, sinon polling déterministe borné avec backoff/jitter. Ne pas supposer un webhook Jules inexistant. Pas d'appel LLM pour compter des états. États terminal→arrêt du suivi ; pas de tâches de remplissage.
6. Une erreur/réparation dans C0 n'empêche pas un job indépendant C1 ou C4. En revanche un consommateur attend l'intégration de son prérequis. Admission refuse collisions de fichiers/schéma/lockfile. Limiter la file de PR non revues selon capacité de review mesurée.
7. Observabilité : attente ready→submitted, durée job, cause blocage, PR recevables, reprise/échec, compteur sessions observées avec fenêtre UTC. Aucune estimation de quota convertie en compteur officiel.

## Acceptation fonctionnelle
- C0 running, C1/C4 indépendants ready : les deux sont admis sans dupliquer C0. Une quatrième catégorie reste en attente.
- Deux processus admettent le même job : un seul POST. Restart après POST à réponse perdue : réconciliation retrouve l'ID, aucun doublon.
- Dépendance non intégrée ou mêmes write_scopes : refus explicite ; tâches sans conflit restent possibles.
- Pagination sur plusieurs pages et sessions externes : toutes comptées ; pagination interrompue = aucun nouveau POST.
- 401/403/429/5xx, quota inconnu, demande de feedback et statut inconnu : états distincts, aucun faux succès, aucune boucle de retry rapide.
- Stop opérateur et queue vide : zéro création ; restart n'annule pas stop. Revue/merge manuel non contournés.

## Contrat de livraison
Tests unitaires/adversariaux du scheduler sur données SYNTHÉTIQUES explicitement isolées puis un canari réel autorisé et relu. Le canari prouve le transport, pas le débit de 100/jour. Fournir `npm run lint`, `npm run build` et commandes des tests créés. Dossier de retour arrière avec checkpoint et reprise sans doublon, désactivation sans effacement de jobs. Aucun secret, merge, paiement ou déploiement de production automatique.
