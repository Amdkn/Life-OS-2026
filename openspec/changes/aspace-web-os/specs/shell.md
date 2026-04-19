# Spec: OS Shell

## User Stories

### S-SHELL-01: Desktop Environment
**As** Amadeus, **I want** a desktop canvas with a Solarpunk wallpaper, **so that** I have a visual workspace for windowed apps.
- **Acceptance**: Static wallpaper renders full-screen behind all windows.
- **TVR**: ✅T (CSS background-image) ✅V (foundation for everything) ✅R (no human needed)

### S-SHELL-02: TopBar
**As** Amadeus, **I want** a persistent top bar with Veto Toggle, Boot Clean button, clock, notification badges, and search, **so that** I have global controls always accessible.
- **Acceptance**: TopBar renders above all windows. Veto Toggle changes state visibly. Boot Clean resets layout. Clock shows real time. Badge shows unread count.
- **TVR**: ✅T ✅V ✅R

### S-SHELL-03: Dock
**As** Amadeus, **I want** a bottom dock with 8 persistent slots (CC + 6 Frameworks + Drawer), **so that** I can launch any core app with one click.
- **Acceptance**: 8 icons render in dock. Click opens app window. Badge shows on CC icon when notifications exist. Drawer opens a panel of installed apps.
- **TVR**: ✅T ✅V ✅R

### S-SHELL-04: Window Manager
**As** Amadeus, **I want** glassmorphic windows I can drag, resize, minimize, maximize, and close, **so that** I can multitask with multiple apps.
- **Acceptance**: Windows support drag (titlebar), resize (edges), minimize (hides to dock), maximize (full desktop), close (removes). Z-index brings focused window to top. Breadcrumbs show path. Back button navigates history.
- **TVR**: ✅T ✅V ✅R

### S-SHELL-05: Layout Persistence
**As** Amadeus, **I want** my window layout saved automatically, **so that** I can close the browser and return to the same workspace.
- **Acceptance**: On unload, save all window positions/sizes/open-state to localStorage. On load, restore exactly. Boot Clean button resets to default.
- **TVR**: ✅T ✅V ✅R

### S-SHELL-06: Glassmorphism Design System
**As** a developer, **I want** a CSS token system for glassmorphism, **so that** all components share the same visual language.
- **Acceptance**: Tokens defined in `index.css` (--glass-bg, --glass-blur, --glass-border, --glass-shadow). Max 2 levels of blur. 3rd level = opaque.
- **TVR**: ✅T ✅V ✅R

### S-SHELL-07: Cross-Link Router
**As** Amadeus, **I want** to click a link in one app and navigate to a specific page in another app, **so that** my data is connected.
- **Acceptance**: Links formatted as `aspace://app/<name>/page/subpage` open the target app at the correct page. If app is not open, it opens. If open, it navigates.
- **TVR**: ✅T ✅V ✅R

### S-SHELL-08: Notification System
**As** Amadeus, **I want** badge counts on Dock icons and toast notifications, **so that** I know when agents complete tasks.
- **Acceptance**: Badge number on CC dock icon. Toast slides in from top-right, auto-dismisses after 5s. Smart-split: A2 sends max 1 task at a time to each A3.
- **TVR**: ✅T ✅V ✅R
