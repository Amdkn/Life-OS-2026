import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LDId, writeToLD } from '../lib/ld-router';
import { DOMAIN_TO_LD, projectToParaItem } from '../utils/paraAdapter';
import { exportParaToRdf } from '../lib/paraRdfExporter';

/** 
 * PARA Framework Store — V0.4.2 Picard
 * Matrix: 8 Life Domains x 8 Business Pillars
 * Integrated with LD-Router for IDB Persistence
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
  description?: string; // V2 Doctrinal Manifest
  id: string;
  title: string;
  status: 'active' | 'paused' | 'completed' | 'archived';
  domain: LifeWheelDomain;
  pillars: string[]; // ids of DomainPillar
  resources: string[]; // ids of Resource
  progress: number;
  archivedAt?: number;
  archiveReason?: string;
  lessonsLearned?: string;
  updatedAt?: number;
  pillarsContent?: Partial<Record<BusinessPillar, string>>; // V0.4.7 Fractal
  linkedResources?: string[]; // V0.4.9 Link
  ikigaiVisionId?: string; // V0.5.2 Alignment
  wheelAmbitionId?: string; // V0.5.2 Alignment
  twelveWeekGoalId?: string; // V0.6.3 — Pointer vers un WyGoal Trimestriel
}

export type ResourceType = 'book' | 'tool' | 'contact' | 'template' | 'course' | 'article' | 'video' | 'sop' | 'blueprint' | 'guide' | 'legal' | 'fiscal' | 'archive' | 'other';

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  category: string;
  domain: LifeWheelDomain;
  linkedProjects: string[];
  linkedPillars: string[];
  url?: string; // V0.4.8
  projectId?: string; // V0.4.8 Auto-Injection
}

interface ParaState {
  activeTab: 'overview' | 'projects' | 'areas' | 'resources' | 'archives';
  activeLdFilter: LDId | 'all';
  projects: Project[];
  resources: Resource[];
  customResourceTypes: string[];
  
  // Resources View State
  resourceSearchQuery: string;
  resourceActiveType: ResourceType | 'all';

  // Actions
  setActiveTab: (tab: ParaState['activeTab']) => void;
  setActiveLdFilter: (d: LDId | 'all') => void;
  addCustomResourceType: (type: string) => void;
  setResourceSearchQuery: (query: string) => void;
  setResourceActiveType: (type: ResourceType | 'all') => void;
  getFilteredResources: () => Resource[];

  // New CRUD & Sync Actions (V0.4.1+)
  initializeProjects: (projects: Project[]) => void;
  addProject: (p: Project) => Promise<void>;
  addResource: (r: Resource) => Promise<void>;
  updateProject: (id: string, partial: Partial<Project>) => Promise<void>;
  archiveProject: (id: string, reason?: string, lessonsLearned?: string) => Promise<void>;
  unarchiveProject: (id: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  exportToRdf: () => { turtle: string; jsonld: string };
}

const PICARD_PROJECTS: Project[] = [
  { id: 'PRJ-PICARD-01', title: 'OMK Business OS (B2/B3 Core)', status: 'active', domain: 'business', pillars: ['growth', 'operations'], resources: [], progress: 100, updatedAt: Date.now(), description: 'Manifest: B2/B3 Core operations & strategy' },
  { id: 'PRJ-PICARD-02', title: 'ABC OS & Child Care BOS (Franchise)', status: 'active', domain: 'business', pillars: ['operations', 'product'], resources: [], progress: 100, updatedAt: Date.now(), description: 'Manifest: Franchise scaling & SOP integration' },
  { id: 'PRJ-PICARD-03', title: 'RILCOT Members Space OS', status: 'active', domain: 'relations', pillars: ['people', 'product'], resources: [], progress: 100, updatedAt: Date.now(), description: 'Manifest: Members space community engine' },
  { id: 'PRJ-PICARD-04', title: 'Alikaly Bana Holding to LLC', status: 'active', domain: 'finance', pillars: ['legal', 'finance'], resources: [], progress: 100, updatedAt: Date.now(), description: 'Manifest: Legal & corporate transition' },
  { id: 'PRJ-PICARD-05', title: 'Marina Cleaning BOS & SOP', status: 'active', domain: 'habitat', pillars: ['operations', 'people'], resources: [], progress: 100, updatedAt: Date.now(), description: 'Manifest: Cleaning operations SOP mapping' },
  { id: 'PRJ-PICARD-06', title: 'Cerritos Plane Onboarding', status: 'active', domain: 'cognition', pillars: ['meta', 'it'], resources: [], progress: 100, updatedAt: Date.now(), description: 'Manifest: Pilot onboarding systems' },
  { id: 'PRJ-PICARD-07', title: 'ClaudeClaw Agent & Mission Control', status: 'active', domain: 'creativity', pillars: ['it', 'product'], resources: [], progress: 100, updatedAt: Date.now(), description: 'Manifest: Agent mission control AI systems' },
  { id: 'PRJ-PICARD-08', title: 'Graphify Out Context Graphs', status: 'active', domain: 'creativity', pillars: ['it', 'meta'], resources: [], progress: 100, updatedAt: Date.now(), description: 'Manifest: Graph topology orchestration' },
  { id: 'PRJ-PICARD-09', title: 'OMK Services BOS', status: 'active', domain: 'business', pillars: ['growth', 'operations'], resources: [], progress: 100, updatedAt: Date.now(), description: 'Manifest: OMK external services delivery' },
];

export const useParaStore = create<ParaState>()(
  persist(
    (set, get) => ({
      activeTab: 'overview',
      activeLdFilter: 'all',
      resourceSearchQuery: '',
      resourceActiveType: 'all',
      projects: [...PICARD_PROJECTS],
      resources: [], 
      customResourceTypes: [],

      setActiveTab: (activeTab) => set({ activeTab }),
      setActiveLdFilter: (activeLdFilter) => set({ activeLdFilter }),
      addCustomResourceType: (type) => set((s) => ({ customResourceTypes: [...s.customResourceTypes, type] })),
      setResourceSearchQuery: (resourceSearchQuery) => set({ resourceSearchQuery }),
      setResourceActiveType: (resourceActiveType) => set({ resourceActiveType }),
      getFilteredResources: () => {
        const state = get();
        return state.resources.filter(r => {
          const matchesSearch = r.title.toLowerCase().includes(state.resourceSearchQuery.toLowerCase()) || (r.category?.toLowerCase() || '').includes(state.resourceSearchQuery.toLowerCase());
          const matchesType = state.resourceActiveType === 'all' || r.type === state.resourceActiveType;
          return matchesSearch && matchesType;
        });
      },

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
        // Default to ld01 for generic resources in this phase, or match domain logic
        await writeToLD('ld01', 'resources', 'add', {
          id: r.id,
          title: r.title,
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

      archiveProject: async (id, reason, lessonsLearned) => {
        await get().updateProject(id, { status: 'archived', archivedAt: Date.now(), archiveReason: reason, lessonsLearned: lessonsLearned });
      },

      unarchiveProject: async (id) => {
        await get().updateProject(id, { status: 'active', updatedAt: Date.now() });
      },

      deleteProject: async (id) => {
        const project = get().projects.find(p => p.id === id);
        set(s => ({ projects: s.projects.filter(p => p.id !== id) }));
        if (project?.domain) {
          const ldId = DOMAIN_TO_LD[project.domain];
          if (ldId) await writeToLD(ldId, 'projects', 'delete', { id }, 'para');
        }
      },

      exportToRdf: () => {
        const state = get();
        return exportParaToRdf(state.projects, state.resources);
      }
    }),
    { 
      name: 'aspace-fw-para-v2',
      partialize: (state) => ({ 
        activeTab: state.activeTab, 
        activeLdFilter: state.activeLdFilter, 
        projects: state.projects,
        resources: state.resources,
        customResourceTypes: state.customResourceTypes 
      }),
      onRehydrateStorage: (state) => {
        return (hydratedState, error) => {
          if (error) {
            console.error('[PARA Store] Pre-load hydration failure:', error);
            return;
          }
          // PEPIITES Armor / Picard Distillation
          // Ensure all Picard projects are present
          if (hydratedState) {
            if (!hydratedState.projects) {
              hydratedState.projects = [];
            }

            let missingProjects = false;
            for (const picardProj of PICARD_PROJECTS) {
              if (!hydratedState.projects.some(p => p.id === picardProj.id)) {
                hydratedState.projects.push({ ...picardProj });
                missingProjects = true;
              }
            }

            if (missingProjects) {
              console.warn('[PARA Store] Injected missing Picard Distillation Projects.');
            }
          }
        };
      }
    }
  )
);
