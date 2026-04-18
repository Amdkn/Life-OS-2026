# Spec: Framework Apps

## Shared Pattern (all 6 apps follow this)
Each Framework App is a standalone windowed app with:
- Its own sidebar for sub-navigation
- Content area for the active page
- Breadcrumbs + ← Back at the top
- Receives cross-links from other apps

### S-FW-01: Ikigai App (USS Orville — Meaning Engine)
**As** Amadeus, **I want** an Ikigai app with pages for Craft (Ed), Mission (Kelly), Passion (Gordon), Vocation (Claire), and Horizons H1-H90, **so that** I can explore and document my Ikigai.
- **Sidebar**: Craft, Mission, Passion, Vocation | H1, H3, H10, H30, H90
- **Content**: Each page = editable card grid for reflections/goals
- **Acceptance**: All 9 sidebar pages render. Cards persist in IndexedDB.
- **TVR**: ✅T ✅V ✅R

### S-FW-02: Life Wheel App (USS Discovery/Zora — Balance)
**As** Amadeus, **I want** a Life Wheel app with a radar chart overview and pages for each LD domain, **so that** I can track balance across all life areas.
- **Sidebar**: Dashboard (radar), LD01-Business, LD02-Finance, LD03-Health, LD04-Cognition, LD05-Relations, LD06-Habitat, LD07-Creativity, LD08-Impact
- **Content**: Dashboard = radar chart. Each LD page = metrics + journal
- **Data**: Each LD page reads from its isolated IndexedDB store
- **Acceptance**: Radar chart reflects scores. Each domain page is cloisonné.
- **TVR**: ✅T ✅V ✅R

### S-FW-03: 12WY App (USS SNW/Synthesizer — Execution)
**As** Amadeus, **I want** a 12-Week Year app with Vision (Pike), Weekly Plan (Una), Focus (M'Benga), Measure (Chapel), and Comms (Uhura) pages, **so that** I can execute quarterly goals.
- **Sidebar**: Vision, Weekly Plan, Focus, Measure, Comms
- **Content**: Vision = text. Weekly = checklist. Focus = timer/pomodoro card. Measure = progress bars. Comms = notes.
- **Acceptance**: All 5 pages render with editable content. Data persists.
- **TVR**: ✅T ✅V ✅R

### S-FW-04: PARA App (USS Enterprise/Computer — Structure)
**As** Amadeus, **I want** a PARA file manager with Projects (Picard), Areas (Spock), Resources (Geordi), and Archives (Data), **so that** I can organize all my information.
- **Sidebar**: Projects, Areas, Resources, Archives | Pinned items
- **Content**: Card grid showing folders/files with tags, dates, counts
- **Sub-pages**: Projects → Project X → pages within that project
- **Data**: Areas map to LD01-LD08 (isolated IndexedDB). Projects within same Area share space.
- **Acceptance**: CRUD operations on items. Search works. Cross-links to items from other apps resolve.
- **TVR**: ✅T ✅V ✅R

### S-FW-05: GTD App (USS Cerritos/HoloDeck — Chaos Engine)
**As** Amadeus, **I want** a GTD app with Capture (Mariner), Clarify (Boimler), Organize (Tendi), Reflect (Rutherford), and Engage (Freeman), **so that** I can process chaos into action.
- **Sidebar**: Inbox, Clarify, Organize, Reflect, Engage
- **Content**: Inbox = drag-and-drop triage (like The Airlock reference). Clarify = actionable/not-actionable sort. Organize = projects/contexts. Reflect = weekly review. Engage = today's tasks.
- **Cross-link**: Items can link to PARA Projects via `aspace://app/para/projects/<id>`
- **Acceptance**: Items flow through all 5 stages. Drag-drop works in Inbox.
- **TVR**: ✅T ✅V ✅R

### S-FW-06: DEAL App (USS Protostar/Holo-Janeway — Liberation)
**As** Amadeus, **I want** a DEAL app with Definition (Dal), Elimination (Rok-Tahk), Automation (Zero), and Liberation (Gwyn), **so that** I can systematically free myself from unnecessary work.
- **Sidebar**: Definition, Elimination, Automation, Liberation
- **Content**: Definition = list tasks/processes. Elimination = tag what to remove. Automation = tag what to automate. Liberation = timeline of freed hours.
- **Acceptance**: All 4 pages render. Items can be tagged and moved between stages.
- **TVR**: ✅T ✅V ✅R
