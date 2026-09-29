# Terra M3 → M4 Convergence Architecture

Parent mission: GitHub #81
BUILD owner: Ryan
Bounded code worker: Jules
FLOW owner after capability publication: River

## Canonical Life structure

The architecture preserves the existing 6 × 8 matrix:

Frameworks:
Ikigai, Life Wheel, PARA, 12WY, GTD, DEAL.

Life Domains:
Business, Finance, Health, Cognition, Relations, Habitat, Creativity, Impact.

Frameworks are transformation lenses.
Life Domains are durable life-state partitions.
Neither should be duplicated into new ontology layers.

## Runtime path

Human/Life signal
→ Framework transformation
→ LD Router / local-first write
→ Work/Execution request when action is required
→ B3 deterministic substrate when possible
→ System-Two escalation through published Harness Runtime only when needed
→ Blackboard event/effect receipt
→ Supabase durable projection
→ optional GWS projection/action
→ evidence/reconciliation
→ next Framework/Domain action.

## Truth planes

- IndexedDB: local-first working state and offline queue.
- Supabase: authenticated durable shared projection/history.
- Blackboard: append-only operational events, locks and artifacts.
- B3: deterministic decision/execution substrate.
- Agent/runtime layer: actual capability execution and liveness.
- GWS: human-native productivity projection/action plane.
- GitHub: development contracts, changes and evidence.
- Agent OS/Amy: presentation of runtime/work truth, not source of Life state.

No generic last-write-wins exists between these planes.

## Domain identity invariant

Canonical LD identity for M4:

LD01 = Business
LD02 = Finance
LD03 = Health
LD04 = Cognition
LD05 = Relations
LD06 = Habitat
LD07 = Creativity
LD08 = Impact

Legacy migration aliases may be read during migration, but no new write may persist the obsolete LD05 Environment / LD06 Relationships / LD07 Emotions / LD08 Purpose mapping.

## Continuous convergence cells

### T1 — Runtime / Blackboard (#82)
One canonical Life runtime bootstrap and supervised Blackboard service.

### T2 — Persistence / Supabase (#83)
One versioned schema contract shared by IndexedDB sync and Supabase.

### T3 — B3 / System-One (#84)
One canonical B3 worker/task contract across Matrix, Swarm, Cognitive and temporal consumers.

### T4 — Presence / Receipts (#85)
Evidence-backed Agent Portal and cron effects.

### T5 — GWS projection (#86)
Google Workspace as idempotent projection/action plane.

### T6 — M4 canary (#87)
End-to-end Life intent plus failure injection.

These are gates inside one mission. They are not six projects to leave half-finished.

## Parallelism

Wave A can execute in parallel:
- T1 Runtime
- T2 Sync
- T3 B3

Wave B:
- T4 after T1 + T3
- T5 after T2 identifiers/sync contract are stable

Wave C:
- T6 after T1–T5 evidence is available

Ryan owns integration and capability publication.
Jules receives only bounded write scopes.
River begins operating recurring/sync flows after Ryan publishes the required substrate.
