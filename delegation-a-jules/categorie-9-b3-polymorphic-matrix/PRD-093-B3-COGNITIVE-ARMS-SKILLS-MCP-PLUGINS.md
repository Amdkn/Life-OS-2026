# PRD-093: B3 Cognitive Arms (Skills, MCP Servers & Antigravity Plugins)

## Objectif
Implementer la couche cognitive extensible des agents B3 pour les taches a fort besoin de raisonnement et de navigation semantique via les interfaces MCP, les skills specialises et les plugins Antigravity.

## Specifications
- Creer src/types/b3-cognitive.ts et src/services/b3-cognitive-dispatcher.ts :
  - B3SkillModule : Fiche d instructions operationnelles executables (SKILL.md) avec YAML frontmatter et protocoles d activation.
  - B3McpBridge : Connecteur standardise pour exposer et consommer des outils via le protocole MCP (Model Context Protocol) : exploration, bases de donnees, filesystem, API partenaires.
  - B3PluginAdapter : Enregistrement modulaire des extensions pour l ecosysteme Agent OS et Antigravity.
- Gestionnaire de quotas et de contexte :
  - Prise en compte dynamique du budget de tokens et de la fenetre de contexte.
  - Aiguillage intelligent : delegation de premier niveau a flash/flash_lite pour la collecte, escalade vers pro pour l arbitrage de haut niveau.
