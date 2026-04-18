# DDD-V0.4.1 — Unification Noyau (The Enterprise Computer)

> **ADR** : ADR-V0.4.1 · **Dossier** : `the-bridge-__-life-os/src/`

---

## Phase A : Adaptateur de Données

### Étape A.1 : Modifier `ParaItem` (Modification `ld01.store.ts`)
Trouver l'interface `ParaItem` (idéalement la définir dans un fichier `types.ts` ou la mettre à jour in-situ) :
```typescript
// Si dans ld01.store.ts
export interface ParaItem {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold' | 'paused' | 'archived';
  updatedAt: number;
  // --- NOUVEAU (V0.4.1) ---
  pillars?: string[];
  resources?: string[];
  progress?: number;
  domain?: LifeWheelDomain;
  archivedAt?: number;
}
```

### Étape A.2 : Créer `paraAdapter.ts`
**NEW** `src/utils/paraAdapter.ts`
```typescript
import { Project, LifeWheelDomain } from '../stores/fw-para.store';
import { ParaItem } from '../stores/ld01.store';
import { LDId } from '../lib/ld-router';

// Helper pour mapper ld01 vers le domaine "business" as LifeWheelDomain
export const LD_TO_DOMAIN: Record<LDId, LifeWheelDomain> = {
  ld01: 'business', ld02: 'finance', ld03: 'health', ld04: 'cognition',
  ld05: 'relations', ld06: 'habitat', ld07: 'creativity', ld08: 'impact'
};

export const DOMAIN_TO_LD: Record<string, LDId> = {
  business: 'ld01', finance: 'ld02', health: 'ld03', cognition: 'ld04',
  relations: 'ld05', habitat: 'ld06', creativity: 'ld07', impact: 'ld08'
};

export function projectToParaItem(project: Project): ParaItem {
  return {
    id: project.id,
    title: project.title,
    description: '', // Géré séparément si besoin ou stocké dans metadata
    status: project.status,
    updatedAt: Date.now(),
    pillars: project.pillars,
    resources: project.resources,
    progress: project.progress,
    domain: project.domain,
    archivedAt: project.archivedAt
  };
}

export function paraItemToProject(item: ParaItem, ldId?: LDId): Project {
  // Fallback sûr si les champs V0.4 sont manquants (anciens items)
  return {
    id: item.id,
    title: item.title,
    status: item.status as Project['status'],
    domain: item.domain || (ldId ? LD_TO_DOMAIN[ldId] : 'business'),
    pillars: item.pillars || [],
    resources: item.resources || [],
    progress: item.progress || 0,
    archivedAt: item.archivedAt
  };
}
```

## Phase B : Synchronisation Bidirectionnelle

### Étape B.1 : Mettre à jour `fw-para.store.ts`
**MODIFY** `src/stores/fw-para.store.ts`
```typescript
import { writeToLD, LDId } from '../lib/ld-router';
import { DOMAIN_TO_LD, projectToParaItem } from '../utils/paraAdapter';

// ... (interfaces remain the same) ...

interface ParaState {
  // ... (etat existant) ...
  initializeProjects: (projects: Project[]) => void;
  addProject: (p: Project) => void;
  updateProject: (id: string, partial: Partial<Project>) => void;
  archiveProject: (id: string) => void;
}

export const useParaStore = create<ParaState>()(
  persist(
    (set, get) => ({
      // État initial (Vider les seed data)
      activeTab: 'overview', activeLdFilter: 'all', customResourceTypes: [],
      projects: [], resources: [], // Vide !

      setActiveTab: (tab) => set({ activeTab: tab }),
      setActiveLdFilter: (d) => set({ activeLdFilter: d }),
      addCustomResourceType: (t) => set(s => ({ customResourceTypes: [...s.customResourceTypes, t] })),

      // Nouvelles actions CRUD
      initializeProjects: (projects) => set({ projects }),
      addProject: async (p) => {
        set(s => ({ projects: [...s.projects, p] }));
        if (p.domain) {
           const ldId = DOMAIN_TO_LD[p.domain as string];
           if (ldId) await writeToLD(ldId, 'projects', 'add', projectToParaItem(p), 'para');
        }
      },
      updateProject: async (id, partial) => {
        let updated: Project | null = null;
        set(s => {
          const np = s.projects.map(p => {
             if (p.id === id) { updated = { ...p, ...partial }; return updated; }
             return p;
          });
          return { projects: np };
        });
        if (updated && updated.domain) {
           const ldId = DOMAIN_TO_LD[updated.domain as string];
           if (ldId) await writeToLD(ldId, 'projects', 'update', projectToParaItem(updated), 'para');
        }
      },
      archiveProject: async (id) => {
        get().updateProject(id, { status: 'archived', archivedAt: Date.now() });
      }
    }),
    { 
      name: 'aspace-fw-para-v2',
      // OPTIONNEL MAIS RECOMMANDÉ : On ne persiste QUE activeTab et activeLdFilter. Les projets viennent de l'IndexedDB.
      partialize: (state) => ({ activeTab: state.activeTab, activeLdFilter: state.activeLdFilter, customResourceTypes: state.customResourceTypes })
    }
  )
);
```

### Étape B.2 : Créer `useSyncLD.ts`
**NEW** `src/hooks/useSyncLD.ts`
```typescript
import { useEffect } from 'react';
import { useParaStore } from '../stores/fw-para.store';
import { readFromLD, LDId } from '../lib/ld-router';
import { paraItemToProject } from '../utils/paraAdapter';
import { ParaItem } from '../stores/ld01.store';

const DOMAINS: LDId[] = ['ld01', 'ld02', 'ld03', 'ld04', 'ld05', 'ld06', 'ld07', 'ld08'];

export function useSyncLD() {
  const initializeProjects = useParaStore(s => s.initializeProjects);

  useEffect(() => {
    async function loadAll() {
      try {
        const allProjectsPromises = DOMAINS.map(async (ld) => {
          const items = await readFromLD<ParaItem>(ld, 'projects');
          return items.map(i => paraItemToProject(i, ld));
        });
        
        const results = await Promise.all(allProjectsPromises);
        const flatProjects = results.flat();
        
        initializeProjects(flatProjects);
        console.log("[useSyncLD] PARA Projects Hydrated:", flatProjects.length);
      } catch (err) {
        console.error("Failed to sync LD stores", err);
      }
    }
    
    loadAll();
  }, [initializeProjects]);
}
```

### Étape B.3 : Câblage dans `ParaApp.tsx`
**MODIFY** `src/apps/para/ParaApp.tsx`
```typescript
import { useSyncLD } from '../../hooks/useSyncLD';
import { ItemModal } from './components/ItemModal';
// ... dans le composant ParaApp
const [isModalOpen, setIsModalOpen] = useState(false);
const addProject = useParaStore(s => s.addProject);
// Call hook
useSyncLD();

// ... Bouton New
<button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10...">
  <Plus className="w-3.5 h-3.5" /> New {activeTab.slice(0, -1)}
</button>

// ... En bas du composant avant le </div> final
{isModalOpen && (
  <ItemModal 
    item={null} 
    type="Project"
    onClose={() => setIsModalOpen(false)}
    onSave={(ldId, data) => {
      addProject({
        id: `prj-${Date.now()}`,
        title: data.title || 'New Project',
        status: 'active',
        domain: LD_TO_DOMAIN[ldId],
        pillars: [], resources: [], progress: 0
      });
      setIsModalOpen(false);
    }}
  />
)}
```
