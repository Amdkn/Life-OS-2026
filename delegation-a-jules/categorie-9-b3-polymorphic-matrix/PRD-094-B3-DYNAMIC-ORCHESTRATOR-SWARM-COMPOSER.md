# PRD-094: B3 Swarm Composer & Dynamic Topology Adaptor

## Correctif de délégation (audit 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (C7-9). Composeur d'essaims — dépend de tout le socle cat 9.

- **Dépendances PRD réelles** : PRD-091 (`resolveIncarnation` — la composition appelle le moteur de résolution, elle ne recrée pas la matrice des rôles) ; PRD-092 (CLI d'ingestion et Hook de certification sont des incarnations du substrat) ; PRD-093 (les agents d'analyse et MCP d'accès sont des bras cognitifs) ; émetteur : PRD-082 (directive de mission transmise par B2) ou B1 via PRD-072/075.
- **Typos réparées** : «
ssembleSwarm» → `assembleSwarm` (corruption mesurée du texte initial).
- **Write_scope (chemins concrets)** : `src/services/b3-swarm-composer.ts` (création), types de topologie dans `src/types/b3-polymorphic.ts` (référencés, pas réécrits — coordonner avec PRD-091).
- **Critères positifs** : `assembleSwarm(missionDirective: MissionDirective): B3SwarmTopology` produit l'escouade déclarée (1 CLI d'ingestion, 1 MCP d'accès, 2 agents d'analyse parallèles, 1 hook de certification) ; vérification de compatibilité d'interfaces avant le montage (rejet explicite si incompatibles) ; métriques réelles (empreinte mémoire mesurée via performance.node, temps de traitement, ratio erreurs/validations) ; `npm run lint` + `npm run build` à 0 erreur.
- **Critères négatifs** : pas de deadlock par conception (verrous ordonnés, timeouts déclarés) ; pas d'essaim lancé sans directive de mission venant de B1/B2 (règle d'arrêt PRD-072) ; pas de métriques simulées — si une métrique n'est pas mesurable, elle est absente, jamais fausse ; pas de double exécution d'un même worker dans l'essaim.
- **Sécurité & isolation** : chaque worker de l'escouade hérite des autorisations I/O de son B3WorkerDescriptor (PRD-091), appliquées par les hooks PRD-092 ; l'escouade ne peut pas accéder aux secrets.
- **Idempotence & persistance** : `assembleSwarm` est déterministe (même directive → même topologie) et ne démarre rien : montage de la topologie seulement ; le cycle de vie d'un essaim persisté côté blackboard SQLite service (schéma PRD-011, consommation PRD-052).
- **Reprise / rollback non destructif** : l'arrêt d'un essaim libère ses ressources dans l'ordre inverse du montage ; traces conservées ; rollback = désenregistrement du composeur, sans effet sur les services PRD-092/093.

## Objectif
Fournir le composeur dynamique capable d assembler des essaims heterogenes de B3 a la volee en reponse a un profil de mission complexe transmis par les VP B2 ou le Summer-Verse CEO B1.

## Specifications
- Implementer src/services/b3-swarm-composer.ts :
  - assembleSwarm(missionDirective: MissionDirective): B3SwarmTopology.
  - Capable de monter une escouade sur mesure combinant :
    - 1 CLI deterministe d ingestion (B3 Substrat).
    - 1 MCP d acces ontologique / bases (B3 Plomberie).
    - 2 Agents d analyse paralleles (B3 Cognitifs).
    - 1 Hook de cloture et certification (B3 Gate).
  - Verification de compatibilite des interfaces et absence de deadlock mutex.
- Metriques et observabilite :
  - Suivi en temps reel de l empreinte memoire, du temps de traitement et de la fiabilite (ratio erreurs / validations) — mesures réelles, pas de télémétrie fictive.