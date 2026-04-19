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
