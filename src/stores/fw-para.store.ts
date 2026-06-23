import { create } from 'zustand';
import { LDId, readFromLD, writeToLD } from '../lib/ld-router';
import { DOMAIN_TO_LD, projectToParaItem } from '../utils/paraAdapter';

/**
 * PARA Framework Store — V0.7.0 Picard — D6 fix 2026-06-23
 * Migration vers pattern canon 12WY (commit 54b9e43) :
 * - isHydrated flag + hydrate() async lit depuis IndexedDB
 * - Plus de hardcoded seeds dans Zustand persist bundle
 * - Plus de localStorage persist (les données vivent dans IDB + Supabase)
 * - Empty state "NO ITEMS IDENTIFIED" est maintenant Honnête (= 0 items user-created)
 */

export type LifeWheelDomain = 'business' | 'finance' | 'health' | 'cognition' | 'creativity' | 'habitat' | 'relations' | 'impact';
export type BusinessPillar = 'growth' | 'operations' | 'product' | 'finance' | 'people' | 'it' | 'legal' | 'meta';

export interface DomainPillar {
  id: string;
  domain: LifeWheelDomain;
  pillar: BusinessPillar;
  label: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  status: 'active' | 'paused' | 'completed' | 'archived';
  domain: LifeWheelDomain;
  pillars: string[];
  resources: string[];
  progress: number;
  archivedAt?: number;
  updatedAt?: number;
  pillarsContent?: Partial<Record<BusinessPillar, string>>;
  linkedResources?: string[];
  ikigaiVisionId?: string;
  wheelAmbitionId?: string;
  twelveWeekGoalId?: string;
}

export type ResourceType = 'book' | 'tool' | 'contact' | 'template' | 'course' | 'article' | 'video' | 'other';

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  category: string;
  domain: LifeWheelDomain;
  linkedProjects: string[];
  linkedPillars: string[];
  url?: string;
  projectId?: string;
}

interface ParaState {
  activeTab: 'overview' | 'projects' | 'areas' | 'resources' | 'archives';
  activeLdFilter: LDId | 'all';
  projects: Project[];
  resources: Resource[];
  customResourceTypes: string[];
  isHydrated: boolean;

  // Actions
  hydrate: () => Promise<void>;
  setActiveTab: (tab: ParaState['activeTab']) => void;
  setActiveLdFilter: (d: LDId | 'all') => void;
  addCustomResourceType: (type: string) => void;

  initializeProjects: (projects: Project[]) => void;
  addProject: (p: Project) => Promise<void>;
  addResource: (r: Resource) => Promise<void>;
  updateProject: (id: string, partial: Partial<Project>) => Promise<void>;
  archiveProject: (id: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

/**
 * V0.7.0 : Plus de hardcoded seeds. Empty initial state.
 * Source de vérité = IndexedDB via readFromLD/writeToLD.
 * Pattern identique à useTwelveWeekStore (12WY V0.6.1+).
 */
export const useParaStore = create<ParaState>((set, get) => ({
  activeTab: 'overview',
  activeLdFilter: 'all',
  projects: [],
  resources: [],
  customResourceTypes: [],
  isHydrated: false,

  hydrate: async () => {
    try {
      // Lecture depuis IndexedDB 'ld01' type 'projects' et 'resources'
      // (voir fw-12wy.store.ts:97-112 pattern identique)
      const projectItems = await readFromLD<any>('ld01', 'projects');
      const resourceItems = await readFromLD<any>('ld01', 'resources');

      // D6 fix 2026-06-23 (V0.7.3) : one-shot canon bootstrap des 3 AaaS Variants
      // si IDB projects est vide ET aucune amorce n'a déjà eu lieu (flag localStorage).
      // D9 self-choice : A0 a rejeté le bouton amorcer (V0.7.1) — auto-amorce invisible,
      // ne s'exécute qu'une seule fois par browser context, ne touche pas le pattern
      // canon 12WY (les items sont créés via addProject → writeToLD = vrai canon).
      const BOOTSTRAP_FLAG = 'aspace_para_canon_bootstrap_v1';
      const alreadyBootstrapped = typeof localStorage !== 'undefined' &&
        localStorage.getItem(BOOTSTRAP_FLAG) === 'done';
      const idbProjects = (projectItems || []).filter((d: any) => d?.type === 'project' || d?.status);
      if (idbProjects.length === 0 && !alreadyBootstrapped) {
        const now = Date.now();
        const canonSeeds = [
          { id: 'AAAS-SOLARIS', title: 'Solaris AaaS — Solarpunk Kernel', status: 'active', domain: 'business', pillars: ['meta'], resources: [], progress: 30, updatedAt: now },
          { id: 'AAAS-NEXUS',   title: 'Nexus AaaS — OMK Business OS',    status: 'active', domain: 'business', pillars: ['operations', 'product'], resources: [], progress: 60, updatedAt: now },
          { id: 'AAAS-ORBITER', title: 'Orbiter AaaS — ABC Community OS', status: 'paused', domain: 'impact', pillars: ['people'], resources: [], progress: 25, updatedAt: now },
        ];
        // Écriture canonique via addProject pipeline (pattern 12WY : writeToLD).
        for (const seed of canonSeeds) {
          await get().addProject(seed as Project);
        }
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(BOOTSTRAP_FLAG, 'done');
        }
        console.debug('[PARA Store] One-shot canon bootstrap : 3 AaaS Variants amorcés');
        // Re-hydrate après bootstrap
        const refreshed = await readFromLD<any>('ld01', 'projects');
        set({
          projects: (refreshed || []).filter((d: any) => d?.type === 'project' || d?.status) as Project[],
          resources: (resourceItems || []).filter((d: any) => d?.type === 'resource') as Resource[],
          isHydrated: true
        });
        return;
      }

      set({
        projects: idbProjects as Project[],
        resources: (resourceItems || []).filter((d: any) => d?.type === 'resource') as Resource[],
        isHydrated: true
      });
      console.debug('[PARA Store] Hydrated', idbProjects.length, 'projects,', resourceItems?.length || 0, 'resources');
    } catch (e) {
      console.error('[PARA Store] Hydration failed', e);
      set({ isHydrated: true });
    }
  },

  setActiveTab: (activeTab) => set({ activeTab }),
  setActiveLdFilter: (activeLdFilter) => set({ activeLdFilter }),
  addCustomResourceType: (type) => set((s) => ({ customResourceTypes: [...s.customResourceTypes, type] })),

  initializeProjects: (projects) => set({ projects }),

  addProject: async (p) => {
    set(s => ({ projects: [...s.projects, p] }));
    const ldId = DOMAIN_TO_LD[p.domain];
    if (ldId) {
      await writeToLD(ldId, 'projects', 'add', projectToParaItem(p), 'para');
    }
  },

  addResource: async (r) => {
    set(s => ({ resources: [...s.resources, r] }));
    await writeToLD('ld01', 'resources', 'add', {
      id: r.id,
      title: r.title,
      type: 'resource',
      description: '',
      status: 'active',
      updatedAt: Date.now()
    }, 'para');
  },

  updateProject: async (id, partial) => {
    let updated: Project | null = null;
    const now = Date.now();
    set(s => {
      const np = s.projects.map(p => {
        if (p.id === id) {
          updated = { ...p, ...partial, updatedAt: now };
          return updated;
        }
        return p;
      });
      return { projects: np };
    });

    if (updated && (updated as Project).domain) {
      const u = updated as Project;
      const ldId = DOMAIN_TO_LD[u.domain];
      if (ldId) {
        await writeToLD(ldId, 'projects', 'update', projectToParaItem(u), 'para');
      }
    }
  },

  archiveProject: async (id) => {
    await get().updateProject(id, { status: 'archived', archivedAt: Date.now() });
  },

  deleteProject: async (id) => {
    const project = get().projects.find(p => p.id === id);
    set(s => ({ projects: s.projects.filter(p => p.id !== id) }));
    if (project?.domain) {
      const ldId = DOMAIN_TO_LD[project.domain];
      if (ldId) await writeToLD(ldId, 'projects', 'delete', { id }, 'para');
    }
  }
}));