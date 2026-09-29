# Terra M3 → M4 Convergence Architecture

Date: 2026-09-29
Owner DESIGN: Clara
Primary BUILD: Ryan
Execution worker: Jules
FLOW / external effects: River

## Status

Terra is **M3 — Integrated Platform, pre-convergence**.

M3 is already real:
- React/Vite product and local-first UX;
- 6 frameworks: Ikigai, Life Wheel, PARA, 12WY, GTD, DEAL;
- 8 Life Domains;
- IndexedDB + tombstones + outbox/retry/conflict logic;
- Supabase/Auth/RLS code path;
- Blackboard SQLite/WAL/locks/events/receipts;
- HTTP, CLI, MCP adapters;
- B1/B2/B3 governance/runtime primitives;
- cross-framework and cross-category contracts;
- Jules integration and tests.

M4 is **Operational Convergence**, not "more features".
M4 means the existing planes share stable contracts, one canonical bootstrap, truthful effect receipts and end-to-end recovery.

## Preserve / Repair / Connect

PRESERVE:
- shell and framework UX;
- 6 framework semantics;
- LD01-LD08;
- IndexedDB local-first behavior;
- durable outbox model;
- Blackboard event/receipt primitive;
- existing auth/MCP/API/cross-category contracts.

REPAIR:
- B3 type drift currently breaking tsc;
- canonical runtime path / launcher split-brain;
- IndexedDB ↔ Supabase schema drift;
- missing run_adr003_migration contract;
- duplicate :3001 API implementations;
- CLI endpoint drift;
- cwd-dependent Blackboard placement;
- non-portable Windows release gate;
- cron "pulse == success" semantics;
- simulated/random Agent Portal truth.

CONNECT:
- Terra semantic core → Terra API Runtime;
- Terra API Runtime → Blackboard / Supabase / WorkGraph;
- CapabilityRequest → River → external effect adapter;
- GWS as external operational projection;
- GitHub as software-factory collaboration;
- receipts → Graham / Rory / Amy.

## Authority map

IndexedDB
= immediate personal local state and offline UX.

Terra Blackboard
= local operational event bus, locks, artifacts and receipts.

Terra Supabase
= durable multi-device/user Life OS projection.

Astra WorkGraph
= agent/execution coordination, claims, leases and continuation.

Git/GitHub
= source/version/collaboration truth.

Google Workspace
= daily operational surface; never Terra's canonical semantic state.

Amy/UI
= projection only, never execution authority.

## Terra API Runtime

Create one internal service layer consumed by React, HTTP, CLI and MCP.

React ─┐
HTTP ──┼─> Terra Service Contracts ─> domain/framework services
CLI  ──┤                         ├─> IndexedDB adapters
MCP  ──┘                         ├─> Blackboard adapter
                                  ├─> Supabase projection adapter
                                  └─> CapabilityRequest emitter

Retire duplicated business logic in transport adapters.
Transport adapters validate/authenticate/translate; domain effects live once.

Canonical local ports may remain separate where technically useful, but contracts and lifecycle are unified:
- 4444 = UI
- 4445 = Blackboard service
- 3001 = one authenticated Terra API Runtime bridge
- 3002 = Jules adapter only if still required

## Persistence convergence

Do NOT invent a universal database.

Replication contract v1 requires:
- id;
- user_id / tenant scope;
- type where table multiplexing needs it;
- version;
- _deleted tombstone;
- created_at;
- updated_at;
- idempotency identity for replicated mutation.

Server migration must make the deployed Supabase schema compatible with the already-shipped client semantics, or the client contract must be intentionally revised. No reconnect before this is tested.

run_adr003_migration must either:
1. exist as a versioned, tested server RPC; or
2. be removed and replaced by an explicit migration endpoint/workflow.
No dead RPC reference remains in M4.

Recovery test:
local mutation → offline → restart → reconnect → replay → one cloud effect → readback → no resurrection of tombstone.

## Blackboard convergence

Blackboard remains useful but ceases to be an isolated Terra universe.

Requirements:
- DB path resolved from canonical Terra runtime root, not cwd;
- supervised start/stop/health;
- append-only event identity;
- locks with TTL;
- action/effect receipts;
- adapter to WorkGraph/evidence for agent execution;
- no fake "success" from an emitted pulse alone.

Cron lifecycle:
SCHEDULED → CLAIMED → EXECUTING → EFFECT_OBSERVED → RECEIPT → SUCCEEDED
or UNKNOWN when effect cannot be established.

## B3 convergence

The current main branch builds but fails TypeScript because PRs merged against drifting B3 contracts.

One canonical B3 contract must replace parallel field vocabularies.

Normalize:
B3WorkerDescriptor
B3TaskProfile
MatrixWorker
B3SwarmComposer
B3CognitiveDispatcher
WeeklyUplink/B3 consumers

No compatibility by unchecked casts.
A migration adapter may bridge old names temporarily, with tests.

The M4 build gate cannot pass until:
npm run lint = PASS
npm run build = PASS
cross-platform gate = PASS

## Capability execution

Agent Portal stops being an agent runtime of its own.
Agents become projections of capabilities/executions/receipts.

Terra emits typed CapabilityRequest objects for effects outside its semantic core.

Examples:
- calendar.block.create
- task.create
- drive.area.ensure
- sheet.muse.update
- document.development.append
- github.issue.create
- business.signal.publish

River selects/composes the external adapter.
Ryan owns the adapter/runtime package.
Rory reconciles effect truth.
Graham preserves provenance.
Amy renders the result.

## Google Workspace

Do not embed a second Life OS inside Google Workspace.

Projection mapping:
- Ikigai → Docs/Slides development artifacts;
- Life Wheel → Drive/Area views when useful;
- PARA → Drive folder/project projections;
- 12WY → Calendar blocks;
- GTD → Tasks (and Keep only where a supported adapter exists);
- DEAL → Sheets ledgers / automation candidates.

Terra owns meaning.
GWS owns external effect.
Every write returns an EffectReceipt with external_id, before/after or readback evidence, correlation_id and replay semantics.

## M3 → M4 continuous gates

These are evidence gates in ONE mission, not future projects.

T0 Baseline Truth
- freeze current evidence;
- restore lint/build truth;
- no new feature scope.

T1 Canonical Bootstrap
- ASpace_Worlds/Life_OS_2026 is runtime identity;
- launcher fixed;
- env/config migration is explicit and secrets stay out of git;
- old checkout becomes archive/source only after evidence extraction.

T2 Persistence Contract
- Supabase schema compatible with version/_deleted or contract intentionally migrated;
- dead migration RPC resolved;
- offline/reconnect canary passes.

T3 Terra API Runtime
- one service contract layer;
- duplicate :3001 path retired;
- CLI/MCP/HTTP use the same service semantics;
- release gate works on Windows and CI.

T4 Blackboard / WorkGraph
- canonical DB location;
- supervised service;
- execution/event receipts bridge to WorkGraph;
- cron effect truth fixed.

T5 B3 Runtime Truth
- B3 contracts converge;
- no simulated/random execution status in Agent Portal;
- capability/execution projections are evidence-backed.

T6 GWS Operational Projection
- bounded capability requests for 12WY/PARA/GTD/DEAL;
- River runs adapters;
- readback receipts prove effects.

T7 M4 Release Canary
One real life intent traverses:
Ikigai/Life Wheel → 12WY → PARA/GTD → capability request → River external effect → receipt → Terra persistence → Blackboard/WorkGraph evidence → Amy presentation.

Then failure injection:
offline cloud, service restart, duplicate replay, stale binding, GWS failure, runtime restart.

## M4 acceptance

M4 is achieved only when:
1. npm run lint and npm run build pass from canonical repo.
2. no launcher/runtime path points to the stale checkout.
3. Supabase replication supports the real local contract.
4. offline replay is idempotent and tombstones do not resurrect.
5. one authenticated Terra API contract serves React/HTTP/CLI/MCP semantics.
6. Blackboard lifecycle is supervised and cwd-independent.
7. cron success requires observed effect + receipt.
8. B3 execution/status is evidence-backed.
9. external GWS writes are capability-driven and receipt-backed.
10. one intent is traceable end-to-end with correlation/provenance.
11. restart/reconnect does not require ChatGPT context or A0 copy/paste.
12. Ryan can leave after publishing substrate; River can continue operational flows.
