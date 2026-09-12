# PRD-061: A3 Skills Matrix & Compiler Engine

## Objectif
Standardiser et compiler les compétences des agents A3 des 6 Frameworks Life OS (Orville, Zora, SNW, Cerritos, Protostar, Beth/Morty) et des 8 Escouades Business OS (Guardians, Illuminati, Avengers, Fantastic4, Kang, Thunderbolts, X-Men, Eternals).

## Spécifications
- Créer src/types/a3-skills.ts définissant A3SkillManifest, ToolRequirement, ExecutionCapability.
- Créer le registre central src/config/a3-skills-registry.ts référençant les capacités réelles de chaque agent.
- Générateur d\'arbre de compétences (SkillTree.tsx) visualisant les dépendances et niveaux de maîtrise.
- Valider avec 
pm run build et 	sc --noEmit.
