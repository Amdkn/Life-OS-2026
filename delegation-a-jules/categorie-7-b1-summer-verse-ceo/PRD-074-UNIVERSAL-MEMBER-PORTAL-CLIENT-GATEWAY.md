# PRD-074: Universal Member Portal & Client Gateway

## Objectif
Remplacer les espaces clients eclates par un portail unifie avec branding dynamique par franchise.

## Specifications
- Creer src/apps/franchise/portal/UniversalMemberPortal.tsx.
- Support multi-profils :
  - Parents (ABC) : presences, alertes, factures.
  - Adherents (RILCOT) : votes, documents partages, agenda communaute.
  - Clients (Marina) : demandes d intervention, validation de fin de chantier.
- Bascule de theme et logo dynamique selon le contexte de franchise.
- Valider avec npm run build et tsc --noEmit.
