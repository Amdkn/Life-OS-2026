# DDD-V0.4.9 — Le Workflow de Liaison (Link & Preview)

> **ADR** : ADR-V0.4.9 · **Dossier** : `the-bridge-__-life-os/src/`

---

## Phase A : Typage

### Étape A.1 : `fw-para.store.ts`
```typescript
export interface Project extends ParaItem {
  // ...
  linkedResources?: string[]; // V0.4.9 Link
}
```

## Phase B : Composants de Liaison et d'Affichage

### Étape B.1 : `ResourceMiniCard.tsx`
**NEW** `src/apps/para/components/ResourceMiniCard.tsx`
```typescript
import React from 'react';
import type { Resource } from '../../../stores/fw-para.store';
import { ExternalLink, FileText, Video, Book, PenTool, Link as LinkIcon, X } from 'lucide-react';

export function ResourceMiniCard({ resource, onUnlink }: { resource: Resource, onUnlink?: () => void }) {
  const Icon = resource.type === 'video' ? Video : resource.type === 'book' ? Book : resource.type === 'tool' ? PenTool : resource.type === 'article' ? FileText : LinkIcon;
  
  return (
    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between group hover:border-[var(--theme-accent)]/30 transition-all">
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2 bg-[var(--theme-accent)]/10 rounded-lg text-[var(--theme-accent)] shrink-0">
          <Icon className="w-3.5 h-3.5" />
        </div>
        <div className="truncate pr-4">
          <p className="text-xs font-bold text-[var(--theme-text)]/80 truncate">{resource.title}</p>
          <span className="text-[9px] uppercase tracking-widest text-[var(--theme-text)]/30">{resource.type}</span>
        </div>
      </div>
      <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {resource.url && (
            <a href={resource.url} target="_blank" rel="noreferrer" className="p-1.5 hover:bg-white/10 rounded-md text-[var(--theme-text)]/40 hover:text-[var(--theme-accent)]">
              <ExternalLink className="w-3 h-3" />
            </a>
        )}
        {onUnlink && (
            <button onClick={onUnlink} className="p-1.5 hover:bg-rose-500/10 rounded-md text-[var(--theme-text)]/40 hover:text-rose-400">
               <X className="w-3 h-3" />
            </button>
        )}
      </div>
    </div>
  );
}
```

### Étape B.2 : `ResourceLinker.tsx`
**NEW** `src/apps/para/components/ResourceLinker.tsx`
```typescript
import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { useParaStore, type Project } from '../../../stores/fw-para.store';
import { writeToLD, DOMAIN_TO_LD } from '../../../utils/paraAdapter';

export function ResourceLinker({ project, onClose }: { project: Project, onClose: () => void }) {
  const [search, setSearch] = useState('');
  const allResources = useParaStore(s => s.resources);
  
  // Exclure les ressources déjà liées par projectId ou incluses dans le tableau
  const available = allResources.filter(r => 
    r.projectId !== project.id && 
    !(project.linkedResources || []).includes(r.id) &&
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleLink = async (resId: string) => {
    const freshLinked = [...(project.linkedResources || []), resId];
    // Sync React
    useParaStore.setState(s => ({
      projects: s.projects.map(p => p.id === project.id ? { ...p, linkedResources: freshLinked } : p)
    }));
    // Sync IDB
    const ldId = DOMAIN_TO_LD[project.domain];
    if (ldId) {
       await writeToLD(ldId, 'projects', 'put', { ...project, linkedResources: freshLinked }, 'para');
    }
    // onClose(); // On peut fermer ou juste reset la vue
  };

  return (
    <div className="mt-4 p-4 rounded-2xl bg-black/40 border border-white/5 animate-in slide-in-from-top-2">
      <div className="relative mb-3">
        <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[var(--theme-text)]/30" />
        <input 
          autoFocus value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search global repository..." 
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-[var(--theme-text)] focus:border-[var(--theme-accent)]/50 outline-none"
        />
      </div>
      <div className="space-y-1 max-h-40 overflow-auto custom-scrollbar">
        {available.length === 0 ? (
          <p className="text-[10px] text-center italic text-white/20 py-2">No unlinked resources found.</p>
        ) : available.slice(0, 10).map(r => (
           <div key={r.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5">
              <span className="text-[10px] text-[var(--theme-text)]/60 truncate mr-2">{r.title}</span>
              <button onClick={() => handleLink(r.id)} className="p-1 rounded bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/20">
                 <Plus className="w-3 h-3" />
              </button>
           </div>
        ))}
      </div>
      <button onClick={onClose} className="mt-3 w-full py-1.5 text-[9px] uppercase tracking-widest text-[var(--theme-text)]/30 hover:text-[var(--theme-text)]/60">Close Search</button>
    </div>
  );
}
```

## Phase C : Rendu Global (Section Resources de la carte PICARD)

### Étape C.1 : `ProjectCommandCard.tsx` (Mise à jour finale)
```typescript
import { ResourceMiniCard } from './ResourceMiniCard';
import { ResourceLinker } from './ResourceLinker';

// Dans le composant :
const allResources = useParaStore(s => s.resources);
const attachedRes = allResources.filter(r => r.projectId === project.id || (project.linkedResources || []).includes(r.id));
const [isLinkerOpen, setIsLinkerOpen] = useState(false);

const handleUnlink = async (resId: string) => {
    const isDirectChild = allResources.find(r => r.id === resId)?.projectId === project.id;
    if (isDirectChild) {
       // Déconnecter en mettant projectId à null (ou ignorer)
       // Pour la simplicité, on garde la logique de suppression du tableau linked
       return; 
    }
    const freshLinked = (project.linkedResources || []).filter(id => id !== resId);
    useParaStore.setState(s => ({
      projects: s.projects.map(p => p.id === project.id ? { ...p, linkedResources: freshLinked } : p)
    }));
    const ldId = DOMAIN_TO_LD[project.domain];
    if (ldId) await writeToLD(ldId, 'projects', 'put', { ...project, linkedResources: freshLinked }, 'para');
};

// Dans le render (Suite de C.1 de ForgeCreation), remplacer le bloc Resources par:
<div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
    <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--theme-text)]/60 flex items-center gap-2">
           <Book className="w-4 h-4" /> Resources
        </h4>
        <div className="flex gap-2">
            <button onClick={() => setIsLinkerOpen(!isLinkerOpen)} className="px-2.5 py-1.5 bg-white/5 text-[var(--theme-text)]/60 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-white/10">
                Link
            </button>
            <button onClick={() => setIsForgeOpen(true)} className="px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-amber-500/20 flex items-center gap-1">
                <Zap className="w-3 h-3" /> Forge
            </button>
        </div>
    </div>
    
    {isLinkerOpen && <ResourceLinker project={project} onClose={() => setIsLinkerOpen(false)} />}
    
    <div className={`space-y-2 mt-4 ${attachedRes.length === 0 ? 'py-4' : ''}`}>
        {attachedRes.length === 0 ? (
           <p className="text-[10px] text-center italic text-white/20">No resources aligned with this project.</p>
        ) : attachedRes.map(res => (
           <ResourceMiniCard key={res.id} resource={res} onUnlink={() => handleUnlink(res.id)} />
        ))}
    </div>
</div>
```
