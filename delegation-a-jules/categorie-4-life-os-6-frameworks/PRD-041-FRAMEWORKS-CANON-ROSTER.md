# PRD-041: Modélisation Canonique des 6 Frameworks & Roster des Vaisseaux

## Objectif
Créer les contrats TypeScript, interfaces de données et composants visuels pour les 6 frameworks et vaisseaux d\'équipage (Orville, Zora, SNW, Cerritos, Protostar, Beth/Morty).

## Spécifications
- Créer src/types/frameworks.ts définissant FrameworkId, VesselConfig, AgentCrewMember.
- Exposer le roster complet des agents par vaisseau dans src/config/vessels.config.ts.
- Intégrer un sélecteur de Frameworks dans la barre latérale ou le Header de Life OS.
- Valider avec 
pm run build et 	sc --noEmit.
