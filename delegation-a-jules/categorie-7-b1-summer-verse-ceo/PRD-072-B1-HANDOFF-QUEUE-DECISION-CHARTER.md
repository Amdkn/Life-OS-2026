# PRD-072: B1 Handoff Queue & Decision Charter (B1->B2->B3)

## Objectif
Materialiser le protocole canonique documente dans 04_B2_HANDOFF_QUEUE.md et 03_DECISION_CHARTER.md pour empecher tout travail d execution sans mandat B1.

## Specifications
- Creer src/services/governance/b1-handoff-queue.ts.
- Implementer les regles d arret :
  - Aucun travail B2 sans ticket dans la file de transmission B1.
  - Aucun travail A3/B3 sans DoD (Definition of Done) validee par B2.
  - Alerte de derive de direction transmise au CEO.
- Valider avec npm run build et tsc --noEmit.
