/** App Registry — manifest-based app loading system */
import type { ComponentType } from 'react';

/* ═══ Types ═══ */

export interface AppManifest {
  id: string;
  name: string;
  icon: string;
  version: string;
  description: string;
  component: ComponentType;
  dockSlot?: number;
  a2Ship?: string;
}

// 🧿 APEX ZENITH — CORES: Statically import critical apps to bypass discovery race conditions
import AgentPortalApp from '../apps/agent-portal/AgentPortalApp';

/* ═══ Registry ═══ */

/** Central registry of all installed apps — Singleton Guard */
const GLOBAL_KEY = '__ASPACE_APP_REGISTRY__';

// Helper to get or create the registry on the window object
const getRegistry = (): Map<string, AppManifest> => {
  if (typeof window !== 'undefined') {
    if (!(window as any)[GLOBAL_KEY]) {
      (window as any)[GLOBAL_KEY] = new Map<string, AppManifest>();
    }
    return (window as any)[GLOBAL_KEY];
  }
  // Fallback for non-browser environments
  return new Map<string, AppManifest>();
};

const registry = getRegistry();

// 🧿 APEX ZENITH — REGISTRATION: Force-register core apps statically
registry.set('agent-portal', {
  id: 'agent-portal',
  name: 'Agent Portal',
  icon: '🎛️',
  version: '0.9.0',
  description: 'The Nexus Convergence — Sovereign Control Center',
  component: AgentPortalApp,
  dockSlot: 1
});

/** Register an app with its manifest (including component) */
export function registerApp(manifest: AppManifest): void {
  registry.set(manifest.id, manifest);
}

/** Get a registered app by id */
export function getApp(id: string): AppManifest | undefined {
  return registry.get(id);
}

/** Get all registered apps */
export function getAllApps(): AppManifest[] {
  return Array.from(registry.values());
}

/** Get apps that have dock slots, sorted by slot number */
export function getDockApps(): AppManifest[] {
  return getAllApps()
    .filter(a => a.dockSlot !== undefined)
    .sort((a, b) => (a.dockSlot ?? 0) - (b.dockSlot ?? 0));
}

/** Get apps without dock slots (for the drawer) */
export function getDrawerApps(): AppManifest[] {
  return getAllApps().filter(a => a.dockSlot === undefined);
}
