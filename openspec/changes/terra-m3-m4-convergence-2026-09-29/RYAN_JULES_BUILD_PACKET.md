# Ryan → Jules Build Packet — Terra M3→M4

Mission owner: Ryan / BUILD-CAPABILITY
Primary coding worker: Jules
Design: Clara
FLOW consumer: River

## Mission rule

This is ONE continuous convergence mission.
T0–T7 are checkpoints, not separate future projects.
Do not add new Life OS features until M4 convergence passes.

Ryan controls:
- issue decomposition;
- worktree/branch strategy;
- Jules task packets;
- runtime/config/hooks/skills needed to build;
- tests and release receipts.

Jules changes code only inside the bounded Issue/PR cell assigned by Ryan.

## Recommended execution order

Parallelizable first wave:
A. B3 contract repair / lint restoration.
B. canonical runtime/bootstrap audit + launcher fix.
C. Supabase replication migration design/test fixture.

Second wave after contracts stabilize:
D. Terra API Runtime unification + CLI/MCP/HTTP adapters.
E. Blackboard canonical path/supervision + WorkGraph receipt bridge.

Third wave:
F. evidence-backed Agent Portal/B3 projection.
G. GWS CapabilityRequest adapter integration with River.
H. end-to-end M4 release canary.

## Jules packet requirements

Every Jules task must include:
- GitHub Issue URL/number;
- exact allowed files;
- canonical branch base;
- precondition;
- required tests;
- negative tests;
- evidence expected;
- rollback;
- no unrelated refactor.

## Immediate P0

Current main evidence:
- vite production build PASS;
- tsc FAIL due B3 contract drift after merged PRs.

Fix the contract, not the symptoms.
Do not cast to any.
Do not fork a second B3 model.

Likely impacted:
src/types/b3-polymorphic.ts
src/components/b3-matrix/B3MatrixCockpit.tsx
src/services/b3-cognitive-dispatcher.ts
src/services/b3-swarm-composer.ts
src/services/temporal/weekly-uplink-engine.ts

Acceptance:
npm run lint
npm run build

## Release evidence

Each Issue closes only with PR + command output + contract assertions.
The parent mission closes only after T7 end-to-end evidence.
