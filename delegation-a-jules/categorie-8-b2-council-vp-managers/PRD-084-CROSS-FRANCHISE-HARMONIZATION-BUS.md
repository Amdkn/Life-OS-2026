# PRD-084: Cross-Franchise Harmonization Bus

## Objectif
Mettre en place le bus d harmonisation inter-projets permettant de retroceder automatiquement les briques innovantes developpees pour un projet vers les 3 autres.

## Specifications
- Creer src/services/franchise/cross-franchise-bus.ts.
- Regles de synchronisation :
  - Module facture valide sur ABC Child Care -> Notification et proposition d adoption sur Marina Cleaning et RILCOT.
  - Checklists terrain validees sur Marina Cleaning -> Export des templates vers ABC et RILCOT.
  - Baux et fiscalite d Alikaly Bana -> Standardisation des contrats pour l ensemble des entites.
- Valider avec npm run build et tsc --noEmit.
