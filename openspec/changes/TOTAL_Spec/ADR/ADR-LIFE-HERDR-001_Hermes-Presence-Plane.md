# ADR-LIFE-HERDR-001 — Herdr / Hermes Presence Plane for Life OS

**Status**: ACCEPTED FOR PILOT  
**Date**: 2026-09-28  
**World**: Terra — Life OS 2026  
**Steward**: Amy / PRESENT  
**Pilot domain**: LD01 — Career & Business

## Context

Life OS already has a durable hierarchy:

- A1 Beth = ADMIT / VETO.
- A1 Morty = ROUTE / COMPILE bounded execution.
- A2 = Orville, Discovery, Curie/SNW, Enterprise, Cerritos, Protostar.
- A3 = Starfleet crews attached to framework responsibilities.
- Business OS is nested through LD01, PARA and 12WY; it is not a parallel Life OS.

Herdr observes authoritative runtime state from Hermes, Claude, Codex and Antigravity hooks. It becomes the human-visible Life execution habitat without becoming a new source of truth.

## Decision

Herdr is the **Presence Plane** for Life OS agents. Hermes is the default persistent conversational harness where appropriate. Antigravity remains a System-2 design/execution harness and is observable by Herdr. Amy owns presentation and continuity UX, not semantic authority.

Authority:

`Intent/IPBD -> Beth -> Morty -> A2 framework -> A3 bounded worker -> Evidence -> Rory coherence`

Interface:

`Hermes/Antigravity/Codex/Claude runtime -> Herdr state -> Amy PRESENT -> human attention`

Herdr may display, focus, wait, resume and annotate agent sessions. It MUST NOT decide priority, close IPBD, redefine A1/A2/A3 parentage, or treat pane/session identity as durable agent identity.

## Terra Life hierarchy in Herdr

Canonical labels SHOULD preserve stable Life identity:

- `life:a1:beth` — clearance, veto, safety, context admission.
- `life:a1:morty` — routing, Context Pack compilation, execution receipts.
- `life:a2:orville` — Ikigai.
- `life:a2:discovery` — Life Wheel / ZORA.
- `life:a2:curie` — 12WY.
- `life:a2:enterprise` — PARA.
- `life:a2:cerritos` — GTD.
- `life:a2:protostar` — DEAL.

A3 sessions are created only for bounded work cells as `life:a3:<ship>:<crew>:<work-id>`. The session is disposable; work ID, evidence and provenance are durable.

## LD01 Career & Business pilot

LD01 is represented by Book inside Discovery as Career & Business domain officer.

Pilot path:

`LD01 signal -> Book -> Beth clearance -> Morty routing -> Enterprise/PARA project -> Curie/12WY cycle -> Cerritos/GTD next action -> Protostar/DEAL automation -> Business OS A3 work cell -> evidence -> Rory reconciliation`

River/GWS executes Workspace effects when needed. Clara may compile mission topology; Ryan may build bounded reversible cells. Nardole may dispatch throughout the mission. These capabilities are transverse, not a fixed pipeline and not owned by one Doctor.

## Herdr event policy

Use System-1 first:

1. Runtime state change arrives from an authoritative hook.
2. Deterministic rule decides whether human attention is needed.
3. Zero anomaly => zero LLM.
4. Ambiguity, veto conflict or irreversible action => Beth/Doctor/System-2.
5. Completion produces an addressable receipt; Rory reconciles projections.

Preferred order: webhook/event -> deterministic rule -> reversible action; cron only for reconciliation; agent reasoning only when semantics are unresolved.

Herdr does not generate empty heartbeats or spawn duplicate conversations merely to prove that an agent exists.

## Current measured integration

Verified on 2026-09-28:

- Herdr: 0.8.2-preview.2026-08-19.
- Hermes integration: current (v5).
- Claude integration: current (v8).
- Codex integration: current (v8).
- Antigravity CLI integration: current (v2).
- Antigravity hook: `~/.gemini/config/hooks/herdr-agent-state.ps1`.

This ADR depends on runtime hooks for presence signals but survives harness changes because durable identity and work state live outside Herdr.

## Acceptance for LD01 pilot

A successful pilot demonstrates one bounded LD01 Business work cell where:

- Beth clearance is explicit.
- Morty route is explicit.
- one A2 framework context is visible.
- one A3 worker session is visible through Herdr.
- evidence is persisted outside Herdr.
- session restart does not lose work identity.
- no false Linear In Progress is produced.

## Non-goals

- Herdr is not IPBD SSOT, WorkGraph SSOT, Linear replacement or Git history.
- Amy is not a universal orchestrator.
- Hermes is not a durable identity.
- A3 crews are not permanent panes.
- Business repositories are not absorbed into Terra Git history.

## Related canon

- `ADR-V0.3.5_DoctrineBeth.md`
- `ADR-V0.3.3_FleetGateway.md`
- `ADR-FWK-018_AgentPortal_Structure.md`
- `ADR-FWK-020_Framework-LD-Cooperation.md`
- A'Space handovers: Rory Fractal Coherence, Clara Design-of-Design, Astra Sol/Terra/Luna Federation, Antigravity Fractal Mission Topology.
