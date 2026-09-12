# PRD-071: Franchise Core Engine & Dynamic Instance Model

## Objectif
Creer le modele generique de franchise permettant d executer ABC, RILCOT, Alikaly et Marina a partir d une architecture unique, en eliminant les 4 codebases disparates.

## Specifications
- Definir src/types/franchise.ts avec l interface FranchiseInstance :
  - id: 'abc_childcare' | 'rilcot' | 'alikaly_holding' | 'marina_cleaning'.
  - b1Config: North Star (1Y/3Y/10Y), 12WY Cycles de commandement.
  - activeModules: Array de modules actives (billing, member_portal, field_ops, holding_ledger).
  - b2Gates: Matrice des portes de graduation de projets.
- Factory de chargement dynamique FranchiseFactory.ts.
- Valider avec npm run build et tsc --noEmit.
