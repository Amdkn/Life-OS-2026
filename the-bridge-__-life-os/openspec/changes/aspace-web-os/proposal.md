# A'Space Web OS — Change Proposal

## Problem Statement
The Bridge (current state) is a **monolithic prototype** with all UI packed into a single 227-line component (`TheBridge.tsx`). It cannot scale to host multiple Life OS frameworks, agent management, or installable apps. The user needs a centralized Web OS that acts as the **single interface** for their entire Life Operating System — from Ikigai to GTD to Agent orchestration.

## Target User
- **Primary**: Amadeus (A0 Commanditaire) — uses the Web OS daily as his Life OS dashboard
- **Secondary**: AI Agents (A1-A3) — interact through the AI Panel and Agent Portal

## Vision (E-Myth 10-Year Lens)
This is not a weekend project. It's the **permanent interface** for all of A'Space. Every future framework, agent, and tool plugs into this shell. Build the **system**, not a task.

## Success Criteria
| # | Criterion | Measurable | Done When |
|---|-----------|------------|-----------|
| S1 | Apps launch from Dock | Observable | 6 Framework Apps + CC open in glassmorphic windows |
| S2 | Window manager works | Observable | Drag, resize, minimize, maximize, multi-instance |
| S3 | Navigation is deep-linkable | Observable | Cross-links between apps resolve to correct page |
| S4 | Data persists across reloads | Measurable | Close browser, reopen → same layout + data |
| S5 | Areas are isolated | Measurable | LD01 IndexedDB cannot read LD02 data |
| S6 | Glassmorphism is stable | Observable | Max 2 blur levels, no rendering artifacts |
| S7 | Veto Toggle works globally | Observable | Engaging Beth blocks all A3 executions |

## Scope

### IN Scope (MVP)
- OS Shell (TopBar, Desktop, Dock, WindowFrame)
- Command Center (3-column layout, Embed+Expand)
- 6 Framework Apps (Ikigai, Life Wheel, 12WY, PARA, GTD, DEAL)
- Agent Portal (hierarchy A1→A2→A3)
- AI Panel (contextual per Framework)
- Glassmorphism Design System
- IndexedDB cloisonné (LD01-LD08)
- Layout persistence + Boot propre
- Demo content + Onboarding wizard
- Cross-linking + Breadcrumbs + Back button

### OUT of Scope (Post-MVP)
- Mobile App (Linux Phone style)
- Real-time multi-user (Pusher/Redis)
- Sound system
- Backend API (IndexedDB only for MVP)
- App Store with external installs
- Virtual PC / DOS emulator
