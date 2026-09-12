# PRD-085: DEAL Liberation Engine & B2 Command Cockpit

## Objectif
Construire le cockpit de pilotage des 8 VP Managers dans Agent Portal et instrumenter la matrice de liberation DEAL pour le domaine LD01 (Business et Carriere).

## Specifications
- Creer src/apps/portal/components/B2CouncilCommandCenter.tsx.
- Composants visuels :
  - Radar des 8 Domaines B2 (jauges de sante en temps reel).
  - Jauge de liberation DEAL : volume de taches eliminees (E), automatisees via A3 (A), et heures d attention liberees pour le CEO (L).
  - File d attente des validations DoD en attente.
- Valider avec npm run build et tsc --noEmit.
