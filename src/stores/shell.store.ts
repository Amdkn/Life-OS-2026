/** Shell store — global OS state (windows, dock, notifications, layout, veto) */
import { create } from 'zustand';

/* ═══ Types ═══ */

export interface AppWindow {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface Toast {
  id: string;
  message: string;
  source: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
}

interface ShellState {
  /* Window management */
  windows: AppWindow[];
  activeWindowId: string | null;

  /* Global controls */
  vetoEngaged: boolean;
  notificationCount: number;
  toasts: Toast[];

  /* Actions — windows */
  openApp: (id: string, title: string) => void;
  closeApp: (id: string) => void;
  minimizeApp: (id: string) => void;
  maximizeApp: (id: string) => void;
  focusApp: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  updateWindowState: (id: string, position: { x: number; y: number }, size: { width: number; height: number }) => void;

  /* Actions — global */
  toggleVeto: () => void;
  bootClean: () => void;
  addToast: (toast: Omit<Toast, 'id' | 'timestamp'>) => void;
  dismissToast: (id: string) => void;
  incrementNotifications: () => void;
  clearNotifications: () => void;

  /* Persistence */
  saveLayout: () => void;
  restoreLayout: () => void;
}

/* ═══ Constants & Helpers ═══ */

const TOPBAR_HEIGHT = 40; // Slightly more for safety
const DOCK_SAFE_AREA = 100;

/** Clamp position within viewport boundaries */
function clampPosition(x: number, y: number) {
  // Use fallback if window isn't ready
  const vWidth = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const vHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  
  return {
    x: Math.max(20, Math.min(x, vWidth - 200)),
    y: Math.max(TOPBAR_HEIGHT + 10, Math.min(y, vHeight - DOCK_SAFE_AREA - 100))
  };
}

/** Calculate next z-index above all existing windows, capped at 1000 */
function nextZ(windows: AppWindow[]): number {
  const maxZ = Math.max(0, ...windows.map(w => w.zIndex));
  return Math.min(1000, maxZ + 1);
}

/** Generate a unique toast id */
function toastId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

/** Layout persistence settings */
const LAYOUT_KEY = 'aspace-shell-layout-v1';
const SCHEMA_VERSION = '0.1.1';

/* ═══ Store ═══ */

export const useShellStore = create<ShellState>((set, get) => ({
  windows: [],
  activeWindowId: null,
  vetoEngaged: false,
  notificationCount: 0,
  toasts: [],

  openApp: (id, title) => set((s) => {
    const existing = s.windows.find(w => w.id === id);
    if (existing) {
      return {
        windows: s.windows.map(w =>
          w.id === id
            ? { ...w, isOpen: true, isMinimized: false, zIndex: nextZ(s.windows) }
            : w
        ),
        activeWindowId: id,
      };
    }
    
    // Fixed initial offset logic to avoid negative or out-of-bounds start
    const offset = (s.windows.filter(w => w.isOpen).length % 5) * 40;
    const initialPos = clampPosition(100 + offset, 80 + offset);
    
    return {
      windows: [...s.windows, {
        id, title, isOpen: true, isMinimized: false, isMaximized: false,
        zIndex: nextZ(s.windows),
        position: initialPos,
        size: { width: 1000, height: 650 },
      }],
      activeWindowId: id,
    };
  }),

  closeApp: (id) => set((s) => ({
    windows: s.windows.map(w => w.id === id ? { ...w, isOpen: false } : w),
    activeWindowId: s.activeWindowId === id ? null : s.activeWindowId,
  })),

  minimizeApp: (id) => set((s) => ({
    windows: s.windows.map(w => w.id === id ? { ...w, isMinimized: true } : w),
    activeWindowId: s.activeWindowId === id ? null : s.activeWindowId,
  })),

  maximizeApp: (id) => set((s) => ({
    windows: s.windows.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w),
  })),

  focusApp: (id) => set((s) => ({
    windows: s.windows.map(w =>
      w.id === id
        ? { ...w, zIndex: nextZ(s.windows), isMinimized: false }
        : w
    ),
    activeWindowId: id,
  })),

  updatePosition: (id, x, y) => set((s) => ({
    windows: s.windows.map(w => {
      if (w.id !== id) return w;
      const pos = clampPosition(x, y);
      return { ...w, position: pos };
    }),
  })),

  updateWindowState: (id, position, size) => set((s) => ({
    windows: s.windows.map(w => {
      if (w.id !== id) return w;
      return { ...w, position, size };
    }),
  })),

  toggleVeto: () => set((s) => ({ vetoEngaged: !s.vetoEngaged })),

  bootClean: () => {
    localStorage.removeItem(LAYOUT_KEY);
    set({
      windows: [],
      activeWindowId: null,
      notificationCount: 0,
      toasts: [],
    });
    window.location.reload(); // Force reload to ensure fresh start
  },

  addToast: (toast) => set((s) => ({
    toasts: [...s.toasts, { ...toast, id: toastId(), timestamp: Date.now() }],
    notificationCount: s.notificationCount + 1,
  })),

  dismissToast: (id) => set((s) => ({
    toasts: s.toasts.filter(t => t.id !== id),
  })),

  incrementNotifications: () => set((s) => ({
    notificationCount: s.notificationCount + 1,
  })),

  clearNotifications: () => set({ notificationCount: 0 }),

  saveLayout: () => {
    const { windows, vetoEngaged } = get();
    const data = { 
      version: SCHEMA_VERSION,
      state: { windows, vetoEngaged } 
    };
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(data));
  },

  restoreLayout: () => {
    const raw = localStorage.getItem(LAYOUT_KEY);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      if (data.version === SCHEMA_VERSION) {
        set({ 
          windows: data.state.windows || [], 
          vetoEngaged: data.state.vetoEngaged || false 
        });
      } else {
        console.warn(`A'Space: Schema mismatch (found ${data.version}, expected ${SCHEMA_VERSION}). Clearing layout.`);
        localStorage.removeItem(LAYOUT_KEY);
      }
    } catch { /* corrupted layout, ignore */ }
  },
}));
