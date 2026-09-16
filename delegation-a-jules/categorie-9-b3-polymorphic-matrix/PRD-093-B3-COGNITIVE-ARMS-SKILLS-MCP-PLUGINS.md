# PRD-093: B3 Cognitive Arms (Skills, MCP Servers & Antigravity Plugins)

## Correctif de délégation (audit 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (C7-9). Bras cognitifs B3.

- **Dépendances PRD réelles** : PRD-091 (types B3 — B3SkillModule etc. se déclarent comme incarnations du socle) ; PRD-092 (le pipeline de validation Hook s'applique aux outputs de ce dispatcher) ; **PRD-061 (cat 6) est propriétaire de la compilation des compétences** : ce PRD définit l'interface d'aiguillage, pas une deuxième bibliothèque de skills. PRD-051 (cat 5) est propriétaire du client serveur Jules — l'aiguillage flash/pro du PRD initial doit passer par ce client et ne pas créer un second client d'inférence.
- **Write_scope (chemins concrets)** : `src/types/b3-cognitive.ts` (création), `src/services/b3-cognitive-dispatcher.ts` (création). Le bridge MCP vit côté service Node (I/O disque/réseau) ; seul l'aiguillage est importable côté UI.
- **Critères positifs** : B3SkillModule représente une fiche SKILL.md avec frontmatter YAML et protocoles d'activation (format déclaré, pas un parser exécutant des compétences recréées) ; B3McpBridge typé pour exposer/consommer des outils via le protocole MCP ; B3PluginAdapter enregistre les extensions Agent OS/Antigravity ; l'aiguillage de quota prend en compte un budget de tokens fourni en configuration, jamais deviné ; `npm run lint` + `npm run build` à 0 erreur.
- **Critères négatifs** : aucune clé API ni endpoint authentifié dans le code navigateur ou `VITE_*` — les credentials MCP vivent côté service ; pas de compteur de quota Jules inventé (quota officiel : 100 tâches/24 h glissantes Pro, 15 concurrentes — pas de compte par utilisateur prouvé) ; pas de recréation des skills de PRD-061 ; pas de télémétrie fictive dans le dispatcher.
- **Sécurité & isolation** : la fenêtre de contexte passée à un worker est tronquée par le dispatcher, jamais débordée ; escalade light_llm → deep_reasoning décide localement et deterministiquement (seuil déclaratif).
- **Idempotence & persistance** : l'enregistrement de plugins/skills est idempotent (clé = id de module) ; l'usage des bras cognitifs est journalisé côté service (schéma PRD-011, consommation PRD-052) pour l'observabilité, sans contenu sensible.
- **Reprise / rollback non destructif** : retrait des fichiers créés ; les plugins tiers non branchés restent inertes, pas de migration destructive.

## Objectif
Implementer la couche cognitive extensible des agents B3 pour les taches a fort besoin de raisonnement et de navigation semantique via les interfaces MCP, les skills specialises et les plugins Antigravity.

## Specifications
- Creer src/types/b3-cognitive.ts et src/services/b3-cognitive-dispatcher.ts :
  - B3SkillModule : Fiche d instructions operationnelles executables (SKILL.md) avec YAML frontmatter et protocoles d activation.
  - B3McpBridge : Connecteur standardise pour exposer et consommer des outils via le protocole MCP (Model Context Protocol) : exploration, bases de donnees, filesystem, API partenaires — côté service Node, credentials hors du bundle navigateur.
  - B3PluginAdapter : Enregistrement modulaire des extensions pour l ecosysteme Agent OS et Antigravity.
- Gestionnaire de quotas et de contexte :
  - Prise en compte dynamique du budget de tokens et de la fenetre de contexte (budget fourni en configuration, jamais inventé).
  - Aiguillage intelligent : delegation de premier niveau a flash/flash_lite pour la collecte, escalade vers pro pour l arbitrage de haut niveau — via le client PRD-051, pas de second client.