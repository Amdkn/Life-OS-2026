# Spec: Command Center

## User Stories

### S-CC-01: 3-Column Layout
**As** Amadeus, **I want** the Command Center to have Sidebar | Content | AI Panel columns, **so that** I can navigate frameworks, see content, and interact with agents simultaneously.
- **Acceptance**: Left sidebar (240px) lists pages. Center content fills remaining space. Right AI panel (320px) shows contextual agents. All columns glassmorphic.
- **TVR**: ✅T ✅V ✅R

### S-CC-02: Framework Widget Pages (Embed + Expand)
**As** Amadeus, **I want** compact widgets in the CC content area with an "↗ Open" button, **so that** I can preview frameworks without leaving the CC.
- **Acceptance**: Each framework page shows a summary widget (radar chart, card grid, etc.). "↗ Open" button opens the full Framework App in a new window.
- **TVR**: ✅T ✅V ✅R

### S-CC-03: Dashboard Page
**As** Amadeus, **I want** a Dashboard page with a Life Wheel radar chart, active tasks, and agent status, **so that** I see the big picture at a glance.
- **Acceptance**: Radar chart shows 8 LD domain scores. Active tasks section shows top 5 in-progress items. Agent status shows online/offline counts.
- **TVR**: ✅T ✅V ✅R

### S-CC-04: AI Panel Contextual
**As** Amadeus, **I want** the AI Panel to show A1 (Beth, Morty) always, plus the A2 and A3 relevant to the active page, **so that** I can interact with the right agents.
- **Acceptance**: A1 section always visible. A2/A3 section changes based on selected sidebar page (mapping per Wishlist D5 table). Command input field to send instructions. Scrollable log of agent activity.
- **TVR**: ✅T ✅V ✅R

### S-CC-05: Breadcrumbs + Back
**As** Amadeus, **I want** a breadcrumb trail and back button at the top of the CC, **so that** I can navigate complex page hierarchies.
- **Acceptance**: Breadcrumbs show `CC / Frameworks / Ikigai / Craft`. Each segment clickable. ← Back button pops navigation stack.
- **TVR**: ✅T ✅V ✅R
