# PRD-073: Holding Treasury & Multi-Tenant Billing Engine

## Objectif
Fusionner le moteur de paiement d ABC Child Care avec la tresorerie inter-societes d Alikaly Bana Holding.

## Specifications
- Creer src/apps/franchise/billing/HoldingTreasuryEngine.tsx.
- Gestion des flux de tresorerie consolides :
  - Encaissements recurrents (frais de garde, cotisations cooperative, prestations nettoyage).
  - Ventilation automatique vers le grand livre de la Holding.
  - Calcul des marges nettes et alertes de seuil de tresorerie.
- Valider avec npm run build et tsc --noEmit.
