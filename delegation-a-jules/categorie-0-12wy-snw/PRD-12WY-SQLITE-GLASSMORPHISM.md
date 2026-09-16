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
