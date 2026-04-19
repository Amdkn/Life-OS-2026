# A'Space Web OS — Implementation Tasks

## Phase 1: OS Shell (Foundation)

### P1.1 — Design System + Glassmorphism Tokens
- [ ] Create `src/styles/index.css` with glass CSS custom properties
- [ ] Create `src/styles/fonts.css` with Inter/Outfit from Google Fonts
- [ ] Create `src/lib/glass-tokens.ts` exporting TW utility classes
- **Spec**: S-SHELL-06

### P1.2 — Shell Store (Zustand Global)
- [ ] Refactor `src/store.ts` → `src/stores/shell.store.ts`
- [ ] Add: layout persistence (save/restore to localStorage)
- [ ] Add: notification state (badges, toasts queue)
- [ ] Add: veto toggle state (global Beth lock)
- **Spec**: S-SHELL-05

### P1.3 — TopBar Refactor
- [ ] Redesign `src/components/TopBar.tsx` with glassmorphism
- [ ] Add: Veto Toggle (Beth lock/unlock)
- [ ] Add: Boot Clean button (reset layout)
- [ ] Add: Live clock
- [ ] Add: Notification badge counter
- [ ] Add: Search icon (placeholder for future)
- **Spec**: S-SHELL-02

### P1.4 — Desktop Refactor
- [ ] Redesign `src/components/Desktop.tsx`
- [ ] Add: Static Solarpunk wallpaper
- [ ] Add: Desktop shortcut icons (from App Drawer)
- [ ] Add: Window rendering from shell store
- **Spec**: S-SHELL-01

### P1.5 — Dock Refactor
- [ ] Redesign `src/components/Dock.tsx` with 8 slots
- [ ] Add: Badge numbers on icons
- [ ] Add: Drawer button (last slot)
- [ ] Add: Bounce animation on notification
- **Spec**: S-SHELL-03

### P1.6 — WindowFrame Glassmorphism
- [ ] Redesign `src/components/WindowFrame.tsx`
- [ ] Add: Draggable titlebar
- [ ] Add: Edge resize handles (8 directions)
- [ ] Add: Minimize, Maximize, Close buttons
- [ ] Add: Breadcrumbs slot (top, below titlebar)
- [ ] Add: ← Back button
- **Spec**: S-SHELL-04

### P1.7 — App Registry
- [ ] Create `src/lib/app-registry.ts`
- [ ] Create manifest.json for each app folder
- [ ] Implement lazy-loading via dynamic import
- **Spec**: S-AS-03

### P1.8 — Cross-Link Router
- [ ] Create `src/lib/cross-link.ts` (parse `aspace://` URLs)
- [ ] Create `src/stores/router.store.ts` (nav stacks per window)
- [ ] Integrate: clicking a cross-link opens/navigates target app
- **Spec**: S-SHELL-07

### P1.9 — Notification System
- [ ] Create `src/components/Toast.tsx`
- [ ] Integrate: toast queue in shell store
- [ ] Integrate: badge counter on Dock CC icon
- **Spec**: S-SHELL-08

---

## Phase 2: Command Center

### P2.1 — CC Layout (3 Columns)
- [ ] Create `src/apps/command-center/CommandCenter.tsx`
- [ ] Create `src/apps/command-center/Sidebar.tsx`
- [ ] Create `src/apps/command-center/AIPanel.tsx`
- [ ] Create `src/apps/command-center/manifest.json`
- **Spec**: S-CC-01

### P2.2 — Dashboard Page
- [ ] Create `src/apps/command-center/pages/DashboardPage.tsx`
- [ ] Add: Life Wheel radar chart (SVG)
- [ ] Add: Active tasks summary
- [ ] Add: Agent status overview
- **Spec**: S-CC-03

### P2.3 — Framework Widget Pages (Embed + Expand)
- [ ] Create widget components for each framework in `pages/`
- [ ] Each widget: compact summary + "↗ Open" button
- [ ] "↗ Open" triggers `shell.store.openApp()` for the full Framework App
- **Spec**: S-CC-02

### P2.4 — AI Panel Contextual
- [ ] A1 section: Beth + Morty (always visible)
- [ ] A2/A3 section: dynamic based on active sidebar page
- [ ] Command input field + log scroller
- [ ] Map each sidebar page → A2 ship + A3 crew (from Wishlist D5)
- **Spec**: S-CC-04

### P2.5 — Breadcrumbs + Back
- [ ] Create `src/components/Breadcrumbs.tsx`
- [ ] Integrate with router.store nav stack
- [ ] ← Back pops history, breadcrumb segments are clickable
- **Spec**: S-CC-05

---

## Phase 3: PARA App (First Framework)

### P3.1 — IndexedDB Cloisonné LD01
- [ ] Create `src/lib/idb.ts` (IndexedDB wrapper)
- [ ] Create `src/stores/ld01.store.ts` (Business domain)
- [ ] Schema: projects[], areas[], resources[], archives[]
- **Spec**: S-FW-04 (data layer)

### P3.2 — PARA App Shell
- [ ] Create `src/apps/para/ParaApp.tsx` + `manifest.json`
- [ ] Create `src/apps/para/Sidebar.tsx` (Projects, Areas, Resources, Archives)
- [ ] Create `src/apps/para/pages/ProjectsPage.tsx` (card grid)
- [ ] Create `src/apps/para/pages/AreasPage.tsx`
- [ ] Create `src/apps/para/pages/ResourcesPage.tsx`
- [ ] Create `src/apps/para/pages/ArchivesPage.tsx`
- **Spec**: S-FW-04

### P3.3 — PARA CRUD + Sub-pages
- [ ] Create/Read/Update/Delete items in card grid
- [ ] Sub-page: Projects → specific project → pages within
- [ ] Search within PARA
- [ ] Cross-link generation for items
- **Spec**: S-FW-04

---

## Phase 4: 5 Remaining Framework Apps

### P4.1 — Ikigai App
- [ ] Create `src/apps/ikigai/` (same pattern)
- [ ] 9 pages: Craft, Mission, Passion, Vocation, H1, H3, H10, H30, H90
- **Spec**: S-FW-01

### P4.2 — Life Wheel App
- [ ] Create `src/apps/life-wheel/`
- [ ] Dashboard radar chart + 8 LD domain pages
- [ ] Each LD page connects to its isolated IndexedDB store
- **Spec**: S-FW-02

### P4.3 — 12WY App
- [ ] Create `src/apps/twelve-week/`
- [ ] 5 pages: Vision, Weekly Plan, Focus, Measure, Comms
- **Spec**: S-FW-03

### P4.4 — GTD App
- [ ] Create `src/apps/gtd/`
- [ ] 5 pages: Inbox (drag-drop), Clarify, Organize, Reflect, Engage
- [ ] Cross-links to PARA Projects
- **Spec**: S-FW-05

### P4.5 — DEAL App
- [ ] Create `src/apps/deal/`
- [ ] 4 pages: Definition, Elimination, Automation, Liberation
- **Spec**: S-FW-06

### P4.6 — LD02-LD08 IndexedDB Stores
- [ ] Create `src/stores/ld02.store.ts` through `ld08.store.ts`
- [ ] Each isolated IndexedDB database
- **Spec**: S-FW-02 (data layer)

---

## Phase 5: Agent Portal + AI Panel

### P5.1 — Agents Store
- [ ] Create `src/stores/agents.store.ts`
- [ ] Agent registry: all A1, A2, A3 with status
- [ ] Log system: timestamped entries per agent
- **Spec**: S-AP-01

### P5.2 — Agent Portal Pages
- [ ] Create pages in CC: one per Spaceship
- [ ] Ship page: A2 header + A3 list + status indicators
- [ ] A3 sub-page: productions list + "Improve" button
- **Spec**: S-AP-01, S-AP-03

### P5.3 — Smart Task Split
- [ ] Implement task decomposition logic in agents store
- [ ] Max 1 active task per A3 queue
- [ ] Completion triggers next assignment + notification
- **Spec**: S-AP-02

---

## Phase 6: App Store + Drawer

### P6.1 — App Drawer
- [ ] Create `src/components/AppDrawer.tsx`
- [ ] Glassmorphic overlay, grid of non-dock apps
- [ ] Click launches app in window
- **Spec**: S-AS-01

### P6.2 — Desktop Shortcuts
- [ ] Right-click context menu in Drawer
- [ ] "Add to Desktop" / "Remove from Desktop"
- [ ] Persist shortcuts in localStorage
- **Spec**: S-AS-02

### P6.3 — Onboarding Wizard
- [ ] Create `src/apps/onboarding/OnboardingWizard.tsx`
- [ ] Steps: Welcome → Life Wheel scores → First Project → Done
- [ ] Seeds demo content into LD stores
- **Spec**: Proposal (D14)

---

## Phase 7: System Audit & Antifragility (S-AUDIT)

### P7.1 — Global Error Boundaries
- [ ] Create `src/components/ErrorBoundary.tsx` with glassmorphic Crash UI
- [ ] Wrap `Desktop` windows and `AppDrawer` in ErrorBoundary
- **Spec**: S-AUDIT-01

### P7.2 — App Registry Fail-safes
- [ ] Update `app-registry.ts` to validate registered components
- [ ] Handle `undefined` imports (export default vs named mismatch)
- [ ] Show ⚠️ badge on corrupted apps in Dock
- **Spec**: S-AUDIT-02

### P7.3 — DB Isolation & Veto Middleware
- [ ] Add proxy in `src/lib/idb.ts` to block writes if `vetoEngaged` is true
- [ ] Add `verifyIsolation()` script in CC Dashboard
- **Spec**: S-AUDIT-03, S-AUDIT-04

### P7.4 — Agent Trigger (Antigravity ↔ Gemini CLI)
- [ ] Create `scripts/trigger-gemini.ps1` to launch Gemini CLI headlessly with targeted prompt
- [ ] Add `npm run agent:phase7` to package.json
- **Spec**: S-AUDIT-05
