# PRD-016 — Contrats inter-catégories et intégration sans collision

## Objectif
Permettre plusieurs catégories en parallèle sans dix variantes de blackboard, roster ou scheduler. Remplace les interfaces implicites par un contrat versionné unique. Appliquer [le contrat commun](../CONTRAT-COMMUN.md).

## Dépendances et périmètre
PRD-011 propriétaire des migrations blackboard ; PRD-041 propriétaire du roster. Cette fiche peut établir les interfaces minimales avec leurs owners avant implémentation des consommateurs. Périmètre proposé : `src/contracts/`, `tests/contracts/`, document d'ownership ; aucun second schéma SQL, aucun cron, aucun service ajouté. Racines partagées (`package.json`, routes globales) intégrées par un seul writer.

## Spécification
Versionner messages/erreurs : schemaVersion, eventId, correlationId, causationId, occurredAt UTC, aggregateId, aggregateVersion ; acteur/scope autorisés par service et non crus depuis payload. Un registre lie type d'événement à producteur, consommateur, contrat, idempotence et politique de rejet. Les événements transportent le minimum, pas les secrets ni le corpus brut. États de job documentés avec transitions autorisées et raison de refus. Contrats compatibles ascendants ou migration explicite. API navigateur séparée du driver SQLite et des runtimes agents.

Fournir une matrice fichiers partagés→writer et une matrice PRD→dépendances du lot. Un contrat non implémenté ne peut rendre un consommateur vert ; afficher indisponibilité sans mock métier. Chaque session doit pouvoir développer son module dans son scope puis proposer un petit patch d'intégration réservé.

## Acceptation fonctionnelle
1. Producteur de test et consommateur de test utilisent le même schéma et l'événement traverse jusqu'à son effet.
2. Version inconnue, payload invalide, tenant falsifié : rejet structuré et aucun effet.
3. Même eventId livré deux fois : un seul effet persistant ; correlationId conservé.
4. Deux tranches revendiquant le même writer : admission refusée avant dispatch ; deux scopes disjoints restent admissibles.
5. Ancien consommateur face à version incompatible : état BLOCKED_CONTRACT, pas succès simulé.

## Contrat de livraison
Tests de contrat et d'intégration avec commandes exactes créées si absentes, `npm run lint`, `npm run build`, mapping des dépendances. La présence du JSON schema seule ne valide pas son enforcement. Retour arrière par retour de version sur copie compatible, sans effacer événements ni données.
