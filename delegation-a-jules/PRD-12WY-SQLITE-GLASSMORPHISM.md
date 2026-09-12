# PRD-001 — Persistance local-first sans second moteur

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
