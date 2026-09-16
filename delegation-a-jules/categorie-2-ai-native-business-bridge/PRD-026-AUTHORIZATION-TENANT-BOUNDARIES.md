# PRD-026 — Autorisations serveur, secrets et frontières des tenants

## Objectif
Rendre les bridges CLI/MCP/HTTP sûrs avant d'exposer orchestration et finance. Remplace la confiance dans un champ de payload par une autorisation effective. Appliquer [le contrat commun](../CONTRAT-COMMUN.md).

## Dépendances et périmètre
PRD-011 pour stockage serveur, PRD-016 pour contrats, PRD-024 pour migration de scopes. Ne dépend pas de l'UI holding PRD-075 ; celle-ci consomme ce socle. Examiner auth/routeurs existants. Périmètre proposé : middleware et tests sous `server/` ou backend existant après découverte ; adaptation de `src/lib/ld-router.ts` seulement en coordination avec son owner. Aucun fournisseur d'identité parallèle, aucun durcissement cassant la session courante sans rollback.

## Spécification
Principal authentifié→scopes accordés→action allowlistée→ressource tenant ; deny by default. Lire/écrire/dispatcher sont des droits distincts. Les clients MCP et CLI passent par les mêmes contrôles que HTTP ; aucun shell générique, chemin arbitraire, accès `.env` ou simple endpoint proxy réseau. Bloquer traversal, jonctions hors racines, SSRF localhost/cloud metadata pour URLs contrôlées par client. Taille/durée/rate limits et journal d'audit sans secrets. Origines CORS allowlistées ; mutations protégées contre requêtes cross-site selon le mécanisme d'auth retenu. Clés Jules exclusivement backend, rotation via configuration hors git. Secrets inaccessibles aux sessions Jules par défaut.

## Acceptation fonctionnelle
1. A autorisé agit sur ressource A ; preuve sur la vraie route/DB de test.
2. Même requête remplaçant tenantId par B : 403/404 et données B inchangées.
3. Token absent/expiré, rôle lecture sur commande d'écriture : refus sans effet.
4. Modes démo/local sans identité ne peuvent pas accéder au cloud ni aux tenants réels.
5. Traversal, chemin via jonction externe, injection shell et URL privée : rejets testés ; aucune fuite de token dans bundle, logs ou erreurs.
6. Redémarrage/rotation clé : anciennes sessions suivent politique explicitée, pas élévation de privilège.

## Contrat de livraison
Tests adversariaux isolés, commandes exactes, `npm run lint`, `npm run build`, scan du bundle contre marqueur-secret de test (jamais clé réelle). Démontrer un refus et une autorisation à travers chaque adaptateur. Rollback de configuration contrôlé, sans désactiver silencieusement les protections ni supprimer données. Aucun paiement ni déploiement réel requis.
