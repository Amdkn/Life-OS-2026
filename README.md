# 🌉 The Bridge — Life OS Client (V0.9)

This is the primary user interface and logic engine for the **A'Space Life OS**. It is a modern, high-fidelity Web OS shell built for speed, aesthetics, and agentic coordination.

## 🛠️ Technical Stack

- **Core**: [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Logic**: [Zustand 5](https://github.com/pmndrs/zustand) (State Management)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) + [Motion](https://motion.dev/)
- **Persistence**: [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) (Domain isolation via `idb.ts`)
- **API**: [Supabase JS](https://supabase.com/docs/guides/auth/auth-helpers/nextjs) (Dual-write sync)

## 🏢 Internal Frameworks (Apps)

| App ID | Ship Class | Purpose |
| :--- | :--- | :--- |
| `command-center` | USS Hood | The Bridge & Core Shell |
| `para` | USS Enterprise | Project & Knowledge Management |
| `ikigai` | USS Orville | Purpose & Vocation Tracking |
| `life-wheel` | USS Discovery | 8 Domains of Life Metrics |
| `agent-portal` | Fleet Admiral | Agent Orchestration (A0-A3) |

## 🏗️ Development

### Local Setup
1.  **Install**: `npm install`
2.  **Config**: Create `.env` based on `.env.example`.
3.  **Run**: `npm run dev` (Default port: **4444**)

### Production Build
1.  **Build**: `npm run build`
2.  **Verify**: `npm run preview`
3.  **Docker**: Use the included `Dockerfile` for Nginx-based deployment.

## 📐 Architecture Note
The **Bridge** uses a strictly **Spec-Driven Development (SDD)** approach. For architectural decisions, refer to the [ADR](./openspec/ADR/) or the root [**`REALITY_MAP.md`**](../REALITY_MAP.md).

---
<p align="center"><i>End of Transmission — A0 Amadeus</i></p>


<!-- ASPACE-WORLD-FEDERATION:BEGIN -->
## A'Space World Federation

This repository is a sovereign world/member of one A'Space V3 federation, not a monorepo subtree.

- **Astra** — [Amdkn/Aspace_OS_V3](https://github.com/Amdkn/Aspace_OS_V3): unified system / Design-of-Design / registry.
- **Sol** — [Amdkn/Agent-OS-Desktop](https://github.com/Amdkn/Agent-OS-Desktop): Agent OS interface & observability; local desktop `127.0.0.1:5555`.
- **Terra** — [Amdkn/Life-OS-2026](https://github.com/Amdkn/Life-OS-2026): Life OS 2026.
- **Luna** — Business federation: [BusinessOS](https://github.com/Amdkn/BusinessOS), [Business-Office-3-OS](https://github.com/Amdkn/Business-Office-3-OS), [01-OMK-Business-OS](https://github.com/Amdkn/01-OMK-Business-OS), [The-OMK-Office1.0-JaaS](https://github.com/Amdkn/The-OMK-Office1.0-JaaS), [Mobile Back Office](https://github.com/Amdkn/The-OMK-Mobile-Back-Office), [OMK Desktop Web OS](https://github.com/omk-services/OMK-DESKTOP-WEB-OS), [OMK SaaS OS](https://github.com/omk-services/00-omk-saas-os), and the private OMK landing repository.

Filesystem junctions/symlinks are navigation projections only. Every member keeps its own Git history, remote, CI and release boundary. Canonical location mapping lives in Astra's `ASPACE_WORKSPACE_REGISTRY.json`.
<!-- ASPACE-WORLD-FEDERATION:END -->
