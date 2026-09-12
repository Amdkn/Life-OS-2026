# PRD-081: B2 Council Engine & 8 VP Managers Roster

## Objectif
Creer l infrastructure TypeScript et le moteur de gouvernance meso representant le Conseil des 8 VP Managers B2.

## Specifications
- Definir src/types/b2-council.ts :
  - `VpRole`: 'growth_superman' | 'sales_martian' | 'product_flash' | 'ops_batman' | 'it_cyborg' | 'finance_wonderwoman' | 'people_greenlantern' | 'legal_aquaman'.
  - `DomainHealthStatus`: Score 0-100, blocages actifs, lead indicators, lag indicators.
  - `VpCouncilDecision`: Arbitrage collegial sur les priorites de la semaine.
- Exposer la configuration des 8 VP dans src/config/b2-council.config.ts.
- Valider avec npm run build et tsc --noEmit.
