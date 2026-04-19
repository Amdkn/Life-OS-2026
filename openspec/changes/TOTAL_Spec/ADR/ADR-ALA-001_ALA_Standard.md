# ADR-ALA-001 — Agentic Local Adapters (ALA) Standard

**Statut**: PROPOSED
**Date**: 2026-03-16
**Proposé par**: A0 (GravityClaw)
**Validé par**: Rick (A1) / Amadeus (A0)

## Contexte

Les agents A'Space OS (A0 à A3) ont besoin d'interagir avec des logiciels tiers installés localement (Blender, Godot, outils métier PME) sans dépendre d'APIs Cloud coûteuses ou de plateformes MCP centralisées. Le paradigme actuel de RPA visuel est trop fragile pour l'idempotence BMad.

Lien vers la Wishlist : [cli-anything-gateway.md](file:///c:/Users/amado/ASpace_OS_V2/_SPECS/wishlists/cli-anything-gateway.md)

## Décision

Nous adoptons le standard **ALA (Agentic Local Adapter)**. Un ALA est un wrapper généré automatiquement qui expose l'état et les commandes d'un logiciel via une interface JSON/CLI standardisée.

1.  **Registry Centralisé** : Un fichier de registre à `L0/Bedrock/registry/ala.json` liste les adaptateurs disponibles.
2.  **Format de Schéma** : Chaque ALA doit fournir un fichier `schema.json` décrivant les commandes, les arguments et les modèles d'états.
3.  **Local-First** : Aucun ALA ne peut exiger de connexion internet pour son fonctionnement de base.
4.  **Ingestion Protocol** : L'ajout d'un ALA suit un cycle de 7 phases (Download, Analyse, State Model, Code, Test, Doc, Package).

## Conséquences

### Positives
- **God Mode** : Les agents peuvent virtuellement utiliser n'importe quel logiciel open-source.
- **Souveraineté** : Contrôle total des données en local.
- **Performance** : Temps de latence réduit par rapport au Cloud.

### Négatives
- **Coût d'Analyse** : L'analyse initiale d'un logiciel complexe par H3 peut prendre du temps (10-15 min).
- **Stockage** : Nécessite de l'espace disque pour les clones de code source et les environnements de test.

### Risques
- **Sécurité** : L'agent pourrait invoquer des commandes destructrices dans le logiciel tiers. 
- *Atténuation* : Isolation par domaine et whitelist de commandes lors de la phase de test.

## Alternatives Considérées

| Alternative | Avantage | Inconvénient | Raison du rejet |
|-------------|----------|-------------|-----------------|
| MCP (Model Context Protocol) | Standard existant | Souvent Cloud-based, moins de granularité sur le local | Pas assez souverain / Local-First |
| RPA Visuel (Playwright) | Fonctionne sur tout | Très fragile, lent, non-idempotent | Contraire à la doctrine BMad |

## Impact sur l'Isolation

| Ressource | Avant | Après |
|-----------|-------|-------|
| Port | N/A | Ports dédiés par ALA si communication réseau locale requise |
| Token | N/A | Pas de partage de token requis |
| Database | N/A | Fichiers JSON isolés dans le domaine LD0X |
| Filesystem | Accès restreint | Lecture/Écriture uniquement dans le dossier de l'ALA |

## Vérification

1.  Présence du fichier `registry/ala.json`.
2.  Capacité d'un agent A3 à invoquer la commande `--help` d'un ALA nouvellement ingéré.

