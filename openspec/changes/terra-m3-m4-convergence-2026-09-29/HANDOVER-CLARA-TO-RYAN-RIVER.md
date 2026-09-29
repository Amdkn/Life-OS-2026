# HANDOVER — Clara Terra M3→M4 → Ryan/Jules + River

Date: 2026-09-29
Repo: Amdkn/Life-OS-2026
Mission: GitHub #88

## Do not restart architecture

Terra is M3 — Integrated Platform, pre-convergence.
The task is horizontal convergence to M4, not feature invention.

## GitHub cells

- #88 parent continuous mission
- #89 P0 B3 contract/build truth
- #90 canonical bootstrap + persistence convergence
- #91 Terra API Runtime + Blackboard + WorkGraph receipts
- #93 truthful Agent Portal + GWS projection + M4 release canary

These are cells of one mission, not independent future projects.

## Durable design

openspec/changes/terra-m3-m4-convergence-2026-09-29/DESIGN.md
openspec/changes/terra-m3-m4-convergence-2026-09-29/FACTORY_BLUEPRINT.json
openspec/changes/terra-m3-m4-convergence-2026-09-29/RYAN_JULES_BUILD_PACKET.md

## Current executable truth

Canonical repo:
C:\Users\amado\ASpace_Worlds\Life_OS_2026

Baseline observed:
- npm run build PASS;
- npm run lint FAIL on B3 contract drift;
- current branch before design was main @ 3718ee6;
- local persistence code expects version/_deleted;
- migration service calls run_adr003_migration;
- duplicate :3001 implementations exist;
- CLI default Blackboard URL is stale;
- Blackboard is :4445;
- GWS business integration is absent from Terra and remains an external capability plane.

## Owner rule

Ryan owns BUILD-CAPABILITY and Jules task decomposition/worktrees.
Jules receives bounded Issue packets and produces PR/evidence.
River consumes published capabilities and owns operational FLOW/external effects.
Do not send runtime/config plumbing to River.

## Next move

Ryan starts #89 immediately while #90 can be researched/prepared in parallel.
After contracts are stable, #91 can proceed.
#93 consumes released capabilities and closes the M4 vertical slice.

No gate creates a new project.
