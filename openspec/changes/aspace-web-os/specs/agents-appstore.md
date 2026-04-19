# Spec: Agent Portal + App Store

## Agent Portal

### S-AP-01: Agent Hierarchy View
**As** Amadeus, **I want** to see all agents organized by Spaceship (A2) with their crew (A3), **so that** I can monitor the entire organization.
- **Sidebar**: One entry per Spaceship (Orville, Discovery, SNW, Enterprise, Cerritos, Protostar)
- **Content**: Selected ship shows A2 (manager) at top, list of A3 (crew) with status indicators (●online, ○offline, ◐working)
- **Sub-pages**: Click an A3 → see their recent productions, quality score, and "Improve" button
- **Acceptance**: All 6 ships render. Each shows its correct A3 crew. Status dots animate.
- **TVR**: ✅T ✅V ✅R

### S-AP-02: Smart Task Split
**As** a A2 manager, **I want** tasks to be split intelligently so each A3 gets only 1 focused task at a time, **so that** agents are never overwhelmed.
- **Acceptance**: When A2 receives a complex task, it decomposes into single-focus sub-tasks. Each A3 queue has max 1 active task. Completion triggers next task assignment.
- **TVR**: ✅T ✅V ✅R

### S-AP-03: Production History
**As** Amadeus, **I want** to see what each A3 has produced recently, **so that** I can review quality and request improvements.
- **Acceptance**: Each A3 sub-page shows a reverse-chronological list of outputs with timestamps and status (draft/approved/rejected).
- **TVR**: ✅T ✅V ✅R

## App Store + Drawer

### S-AS-01: App Drawer
**As** Amadeus, **I want** a drawer accessible from the Dock that shows all installed non-core apps, **so that** I can launch them without cluttering the Dock.
- **Acceptance**: Drawer button in Dock opens a glassmorphic overlay panel. Grid of installed app icons. Click launches app in a window.
- **TVR**: ✅T ✅V ✅R

### S-AS-02: Desktop Shortcuts
**As** Amadeus, **I want** to create and remove shortcuts on the Desktop for any installed app, **so that** my most-used prototypes are one click away.
- **Acceptance**: Right-click app in Drawer → "Add to Desktop". Icon appears on Desktop canvas. Right-click Desktop shortcut → "Remove". Shortcuts persist across reloads.
- **TVR**: ✅T ✅V ✅R

### S-AS-03: App Manifest
**As** a developer, **I want** each app to declare its capabilities in a manifest.json, **so that** the OS can register, load, and display it correctly.
- **Acceptance**: Each app folder contains `manifest.json` with `{id, name, icon, version, entryComponent, dockSlot?}`. App Registry reads manifests on boot.
- **TVR**: ✅T ✅V ✅R
