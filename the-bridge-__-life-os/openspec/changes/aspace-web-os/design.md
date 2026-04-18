# A'Space Web OS — High-Level Design

> **Note A1**: This is the PRODUCT-level design. Infrastructure decisions (ports, DB engines, WSL isolation, Dokploy config) belong in **ADR** — use `/a2-adr`.

## Architecture Overview

```
┌─────────────────────── COMPONENT MAP ────────────────────────┐
│                                                               │
│  ┌── src/ ──────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │  main.tsx → App.tsx → <Desktop />                        │ │
│  │                                                          │ │
│  │  ┌── components/ (Shell) ────────────────────────────┐   │ │
│  │  │  TopBar.tsx      ← Veto, Boot, Clock, Badges      │   │ │
│  │  │  Desktop.tsx     ← Wallpaper + Window rendering    │   │ │
│  │  │  Dock.tsx        ← 8 slots + badges + Drawer btn   │   │ │
│  │  │  WindowFrame.tsx ← Glass window, drag, resize      │   │ │
│  │  │  Breadcrumbs.tsx ← Fil d'Ariane + ← Back           │   │ │
│  │  │  Toast.tsx       ← Notification toasts              │   │ │
│  │  │  AppDrawer.tsx   ← Grid of installed apps           │   │ │
│  │  └───────────────────────────────────────────────────┘   │ │
│  │                                                          │ │
│  │  ┌── apps/ (1 folder per app) ──────────────────────┐   │ │
│  │  │  command-center/                                  │   │ │
│  │  │    ├── manifest.json                              │   │ │
│  │  │    ├── CommandCenter.tsx  (entry)                  │   │ │
│  │  │    ├── Sidebar.tsx                                │   │ │
│  │  │    ├── AIPanel.tsx                                │   │ │
│  │  │    ├── DashboardPage.tsx                          │   │ │
│  │  │    └── pages/                                     │   │ │
│  │  │         ├── IkigaiWidget.tsx                      │   │ │
│  │  │         ├── LifeWheelWidget.tsx                   │   │ │
│  │  │         └── ...                                   │   │ │
│  │  │                                                    │   │ │
│  │  │  ikigai/                                          │   │ │
│  │  │    ├── manifest.json                              │   │ │
│  │  │    ├── IkigaiApp.tsx  (entry)                     │   │ │
│  │  │    ├── Sidebar.tsx                                │   │ │
│  │  │    └── pages/                                     │   │ │
│  │  │         ├── CraftPage.tsx                         │   │ │
│  │  │         ├── MissionPage.tsx                       │   │ │
│  │  │         └── ...                                   │   │ │
│  │  │                                                    │   │ │
│  │  │  life-wheel/ | twelve-week/ | para/ | gtd/ | deal/│   │ │
│  │  │    (same pattern as ikigai/)                       │   │ │
│  │  └───────────────────────────────────────────────────┘   │ │
│  │                                                          │ │
│  │  ┌── stores/ ───────────────────────────────────────┐   │ │
│  │  │  shell.store.ts   ← windows, dock, notifications  │   │ │
│  │  │  ld01.store.ts    ← Business domain (IndexedDB)   │   │ │
│  │  │  ld02.store.ts    ← Finance domain                │   │ │
│  │  │  ...              ← LD03-LD08                      │   │ │
│  │  │  agents.store.ts  ← A1/A2/A3 status + logs        │   │ │
│  │  │  router.store.ts  ← Cross-link + nav history       │   │ │
│  │  └───────────────────────────────────────────────────┘   │ │
│  │                                                          │ │
│  │  ┌── lib/ ──────────────────────────────────────────┐   │ │
│  │  │  cross-link.ts    ← Parse aspace:// URLs           │   │ │
│  │  │  idb.ts           ← IndexedDB wrapper per-LD       │   │ │
│  │  │  app-registry.ts  ← Load manifests, lazy-import    │   │ │
│  │  │  glass-tokens.ts  ← Design system constants        │   │ │
│  │  └───────────────────────────────────────────────────┘   │ │
│  │                                                          │ │
│  │  ┌── styles/ ───────────────────────────────────────┐   │ │
│  │  │  index.css        ← Glass tokens + base styles     │   │ │
│  │  │  fonts.css        ← Google Fonts (Inter/Outfit)    │   │ │
│  │  └───────────────────────────────────────────────────┘   │ │
│  └──────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

## Key Design Decisions

### State Architecture
```
            ┌───────────────────────────┐
            │     shell.store.ts        │
            │  (global: windows, dock,  │
            │   notifications, layout)  │
            └─────────┬─────────────────┘
                      │ reads/writes
        ┌─────────────┼─────────────────┐
        │             │                 │
   ┌────▼────┐  ┌────▼────┐     ┌─────▼─────┐
   │ ld01.ts │  │ ld02.ts │ ... │ agents.ts │
   │ (IDB)   │  │ (IDB)   │     │ (memory)  │
   └─────────┘  └─────────┘     └───────────┘
   ISOLATED     ISOLATED         SHARED
```

- **Shell store**: Global. Windows, dock state, notifications, layout persistence.
- **LD stores**: Isolated. Each has its own IndexedDB database. Cannot cross-read.
- **Agents store**: Shared. All agent status/logs in one place.
- **Router store**: Shared. Navigation stacks per-window, cross-link resolution.

### Cross-Link Protocol
```
aspace://app/para/projects/aspace-os
         │    │     │         │
         │    │     │         └── sub-page (project name)
         │    │     └──────────── page (sidebar item)
         │    └────────────────── app id (from manifest)
         └─────────────────────── protocol prefix
```

### Glassmorphism Rules
```
Level 0: Desktop (wallpaper, no blur)
Level 1: Window (backdrop-blur: 16px, bg: rgba(w,w,w,0.08))
Level 2: Card inside window (bg: rgba(w,w,w,0.05), no blur)
Level 3: OPAQUE (bg: solid dark, no transparency)
```

### App Registration (Manifest)
```json
{
  "id": "para",
  "name": "PARA",
  "icon": "folder",
  "version": "1.0.0",
  "entryComponent": "ParaApp",
  "dockSlot": 5,
  "a2Ship": "enterprise",
  "description": "Projects, Areas, Resources, Archives"
}
```

## Tradeoffs

| Decision | Why | Risk |
|----------|-----|------|
| IndexedDB per Area (not one DB) | True isolation LD01≠LD02 | More DB connections |
| Zustand (not Redux) | Already in place, lighter | No devtools middleware out of box |
| No backend API for MVP | Simpler, offline-first | No sync, no shared state |
| TailwindCSS 4 for glass | Native backdrop-blur support | May need polyfills for old browsers |
| Lazy-loading apps | Fast initial load | Slight delay on first app open |

## Redirect to ADR
The following decisions require formal ADR (Architecture Decision Record):
- WSL Amadeus-L1 configuration (ports, networking, Windows bridge)
- Dokploy local vs VPS container orchestration
- Firewall rules for production VPS
- IndexedDB schema per LD domain
