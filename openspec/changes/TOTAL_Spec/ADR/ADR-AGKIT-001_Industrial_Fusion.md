# ADR: AG-KIT-001 - Industrial Fusion Architecture

## Status
Proposed (A2 Architecture Approval)

## Context
The user's A'Space OS currently operates on an artisanal BMad structure. The **Antigravity-Kit** provides a professional-grade set of agents and skills but uses a destructive installation method (`ag-kit update`). We need a way to merge these assets without overwriting the sovereign 3-Turn protocol and custom identity matrix.

## Decision
We will implement a **"Merge by Extraction"** architecture.

1. **Sibling Source (The Vault)**: Install `ag-kit` in `C:\Users\amado\Antigravity-Kit-Source`.
2. **Organique Renaming**: Map Kit agents to the existing Doctor/Crew nomenclature.
3. **Manual Sceau Injection**: Every imported file will be manually wrapped with the BMad 3-Turn seal to prevent "Gemini Laziness."
4. **Best Structure Precedence**: In case of conflict, professional industrial structures from the Kit overwrite artisanal ones, provided they pass the 3-Turn Veto.

## Consequences
- **Positive**: Massively increased agent intelligence and domain coverage.
- **Positive**: Persistence of the Sovereign Identity Matrix.
- **Negative**: Manual extraction effort required for each new Kit version.

## Technical Details
- **Isolation**: No global environment changes.
- **Storage**: `.agent/agents/` and `.agent/skills/` within the active project.
- **Orchestration**: Updated `orchestrate.md` to support A'Space Layer IDs (L0/L1/L2).

---
**Architect**: Doctor 13 (A2) 🧿🏰🚀
