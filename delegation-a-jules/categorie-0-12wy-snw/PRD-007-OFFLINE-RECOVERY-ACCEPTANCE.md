# PRD-007 — Preuve offline durable et reprise sans résurrection

## Objectif
Compléter PRD-001 par une garantie testable de reprise ; remplacer les tentatives réseau perdues après fermeture, pas réécrire 12WY. Appliquer [le contrat commun](../CONTRAT-COMMUN.md).

## Dépendances et périmètre
PRD-001 intégré et PRD-024 pour le changement d'utilisateur. Sources existantes : `src/lib/idb.ts`, `src/lib/db/core-db.ts`, stores appelants à inventorier. Périmètre proposé : tests de persistance et module outbox sous `src/lib/`; interdiction de modifier les composants 12WY pendant la session PRD-003. Sérialiser les modifications partagées avec PRD-024 ; ne pas substituer le blackboard serveur à IndexedDB.

## Spécification complémentaire
Écriture métier et opération outbox doivent être atomiques dans la même transaction IndexedDB, résolution sur transaction complete (pas seulement request success). Déletion logique/tombstone, idempotency key persistée, tentative bornée/backoff, reprise après restart, état pending/conflict/error visible. Une version serveur plus ancienne ne ressuscite pas une suppression. Conflits versionnés sans écrasement silencieux ; reconnexion et changement d'utilisateur isolent les queues. Ne pas synchroniser une session de démonstration vers un compte réel. Si le protocole serveur ne permet pas l'idempotence/versioning, livrer explicitement le contrat manquant et ne pas annoncer la garantie acquise.

## Acceptation fonctionnelle
1. Réseau coupé : créer/modifier/supprimer ; fermer puis rouvrir navigateur ; état métier et file conservés.
2. Rétablir réseau ; chaque effet traité une fois malgré réponse perdue et retry ; outbox acquittée après preuve serveur.
3. Rejouer un snapshot serveur ancien : aucun élément supprimé ne réapparaît.
4. Deux onglets écrivent la même version : conflit explicite ou règle déterministe testée ; pas de dernière écriture arbitraire cachée.
5. Basculer comptes A/B : aucun élément ni opération A visible/exécuté sous B. Cas négatif sur transaction avortée : ni succès UI ni demi-écriture.

## Contrat de livraison
Tests navigateur IndexedDB réels avec fixtures isolées et serveur de test explicitement étiqueté. Fournir le runner et les commandes exactes ; `npm run lint` et `npm run build` requis mais insuffisants. Aucune mesure de latence inventée. Migration sur copie avec sauvegarde/restauration vérifiée ; rollback conserve les opérations non acquittées. Cette fiche complète PRD-001, ne le rejoue pas s'il est intégré.
