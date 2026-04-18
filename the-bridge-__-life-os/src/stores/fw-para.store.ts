import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LDId, writeToLD } from '../lib/ld-router';
import { DOMAIN_TO_LD, projectToParaItem } from '../utils/paraAdapter';

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
  id: string;
  title: string;
  status: 'active' | 'paused' | 'completed' | 'archived';
  domain: LifeWheelDomain;
  pillars: string[]; // ids of DomainPillar
  resources: string[]; // ids of Resource
  progress: number;
  archivedAt?: number;
  updatedAt?: number;
  pillarsContent?: Partial<Record<BusinessPillar, string>>; // V0.4.7 Fractal
  linkedResources?: string[]; // V0.4.9 Link
  ikigaiVisionId?: string; // V0.5.2 Alignment
  wheelAmbitionId?: string; // V0.5.2 Alignment
  twelveWeekGoalId?: string; // V0.6.3 — Pointer vers un WyGoal Trimestriel
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
  url?: string; // V0.4.8
  projectId?: string; // V0.4.8 Auto-Injection
}

interface ParaState {
  activeTab: 'overview' | 'projects' | 'areas' | 'resources' | 'archives';
  activeLdFilter: LDId | 'all';
  projects: Project[];
  resources: Resource[];
  customResourceTypes: string[];
  
  // Actions
  setActiveTab: (tab: ParaState['activeTab']) => void;
  setActiveLdFilter: (d: LDId | 'all') => void;
  addCustomResourceType: (type: string) => void;

  // New CRUD & Sync Actions (V0.4.1+)
  initializeProjects: (projects: Project[]) => void;
  addProject: (p: Project) => Promise<void>;
  addResource: (r: Resource) => Promise<void>;
  updateProject: (id: string, partial: Partial<Project>) => Promise<void>;
  archiveProject: (id: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useParaStore = create<ParaState>()(
  persist(
    (set, get) => ({
      activeTab: 'overview',
      activeLdFilter: 'all',
      projects: [
        {
          id: 'SD-AGENT-PORTAL',
          title: 'Nexus Architecture Deployment',
          status: 'active',
          domain: 'business',
          pillars: ['growth', 'operations'],
          resources: [],
          progress: 100,
          updatedAt: Date.now()
        },
        {
          id: 'SD-FW-PARA',
          title: 'PARA Transversal Sync Hooks',
          status: 'active',
          domain: 'business',
          pillars: ['operations'],
          resources: [],
          progress: 85,
          updatedAt: Date.now()
        },
        {
          id: 'SD-LIFE-OS',
          title: 'Life Domains IndexedDB Schema',
          status: 'paused',
          domain: 'impact',
          pillars: ['meta'],
          resources: [],
          progress: 40,
          updatedAt: Date.now()
        }
      ], 
      resources: [], 
      customResourceTypes: [],

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
          // PEPIITES Armor: If after hydration the projects are empty, inject the seed data
          // This prevents localStorage from serving an 'empty' state if user has some old data.
          if (hydratedState && (!hydratedState.projects || hydratedState.projects.length === 0)) {
            console.warn('[PARA Store] State found empty. Injecting Sovereign Pépites.');
            // Note: We use the seed data defined in the create() template
            // For safety, we redeclare them here or trust the current state if we can't find them
            // But better to just use a small list here for absolute certainty
            hydratedState.projects = [
              {
                id: 'SD-AGENT-PORTAL',
                title: 'Nexus Architecture Deployment',
                status: 'active',
                domain: 'business',
                pillars: ['growth', 'operations'],
                resources: [],
                progress: 100,
                updatedAt: Date.now()
              },
              {
                id: 'SD-FW-PARA',
                title: 'PARA Transversal Sync Hooks',
                status: 'active',
                domain: 'business',
                pillars: ['operations'],
                resources: [],
                progress: 85,
                updatedAt: Date.now()
              },
              {
                id: 'SD-LIFE-OS',
                title: 'Life Domains IndexedDB Schema',
                status: 'paused',
                domain: 'impact',
                pillars: ['meta'],
                resources: [],
                progress: 40,
                updatedAt: Date.now()
              }
            ];
          }
        };
      }
    }
  )
);
