# Ryan → Jules Build Packet — Terra M3→M4

Parent mission: GitHub #81
Repository: Amdkn/Life-OS-2026
Owner: Ryan / BUILD-CAPABILITY
Worker: Jules
FLOW consumer: River
Rule: one continuous convergence mission; gates are evidence checkpoints.

## Execution law

Ryan:
- chooses bounded cell;
- prepares exact repo context and write scope;
- dispatches Jules;
- reviews diff/tests;
- integrates or requests correction;
- publishes receipts/capabilities;
- advances immediately to next READY cell.

Jules:
- edits only the authorized scope;
- runs required tests;
- opens PR;
- never merges/deploys;
- never invents missing product policy.

Do not revive the old 55-PRD dependency graph as the primary scheduler.
The six Terra issues #82–#87 are the convergence graph.
## Wave A — execute in parallel

### T1 / #82 Runtime + Blackboard
Write scope:
- server/blackboard/**
- scripts/runtime/** or a new bounded runtime launcher path
- package.json scripts only when necessary
- tests/blackboard/**

Do not touch framework stores, Supabase sync or B3 contracts.

Required proof:
single canonical bootstrap;
:4445 supervised health;
restart idempotence;
events/locks/artifacts survive restart;
duplicate :3001 authority identified and removed/redirected.

### T2 / #83 IndexedDB ↔ Supabase
Write scope:
- src/lib/idb.ts
- src/lib/sync.ts
- src/services/migration.service.ts
- src/types/migration.ts
- supabase/**
- scripts/test-offline-recovery.ts
- focused sync/migration tests

Do not change UI or B3 runtime.
T2 must also reconcile canonical LD identity:
LD01 Business
LD02 Finance
LD03 Health
LD04 Cognition
LD05 Relations
LD06 Habitat
LD07 Creativity
LD08 Impact

Legacy aliases may be migrated/read, never used for new canonical writes.

Required proof:
outbox exists;
offline write/delete replay exactly once;
tombstone cannot resurrect;
version conflict explicit;
real migration/RPC contract exists;
multi-user isolation;
migration replay-safe.

### T3 / #84 B3 System-One
Write scope:
- src/types/b3-polymorphic.ts
- src/types/b3-cognitive.ts
- src/services/b3-*.ts
- src/services/__tests__/b3-matrix-engine.test.ts
- scripts/test-b3-*.ts
- src/components/b3-matrix/**
- directly affected B3 consumers only

Do not redesign Life domains/frameworks.
Required proof:
npm run lint PASS;
npm run build PASS;
B3 tests PASS;
atomic task makes zero LLM/provider call;
ambiguous task emits typed System-Two escalation;
no random/simulated production metric.

## Wave B

### T4 / #85 Presence + cron receipts
Dependency: T1 + T3 accepted.

Write scope:
- src/apps/agent-portal/**
- src/services/cron-registry/**
- src/services/telemetry/**
- src/stores/crons.store.ts
- new focused runtime-presence adapter/tests

Use Agent OS RuntimePresence concepts; do not create a competing presence ontology.

Required proof:
no fresh evidence => never LIVE;
cron success has effect/postcondition or explicit no-op;
expired evidence => STALE;
restart => no duplicate scheduled effect;
receipt drill-down from Agent Portal.
### T5 / #86 GWS projection
Dependency: T2 stable IDs/persistence contract.

Prefer new isolated paths:
- src/services/gws/**
- scripts/gws/**
- tests/gws/**
- minimal UI links only if necessary

Use existing authenticated GWS CLI as adapter.
Google Workspace is projection/action plane, not Life SSOT.

Required proof:
stable external IDs + idempotency keys;
offline Terra remains usable;
replay creates zero duplicate Calendar/Task/Sheet objects;
external edit follows explicit reconciliation policy;
credentials stay outside browser/repo;
GWS links/provenance visible from Terra.

## Wave C

### T6 / #87 M4 convergence canary
Dependency: T1–T5 accepted.

No broad redesign.
Build only integration/e2e fixtures and missing glue.
Trace one real Life intent:
Framework
→ Life Domain
→ local-first write
→ runtime/work claim
→ B3 System-One or typed System-Two escalation
→ Blackboard/effect receipt
→ Supabase durable projection
→ GWS projection when applicable
→ reconciliation
→ next action without A0 manual routing.

Inject:
Blackboard restart;
Supabase offline/reconnect;
duplicate outbox replay;
stale binding;
provider unavailable;
GWS unavailable.

M4 PASS:
no false success;
no resurrection;
no duplicate consequential effect;
no manual human routing in the normal path.

## Review discipline

Each Jules PR must include:
issue ID;
bounded write scope;
tests run and exact result;
rollback note;
known limitations;
evidence refs.

Ryan does not wait for all Wave A PRs before reviewing/integrating an independent PASS.
After integration, update GitHub issue with receipt and unlock dependent cells.
