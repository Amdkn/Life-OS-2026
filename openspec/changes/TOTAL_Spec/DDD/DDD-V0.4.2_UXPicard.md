# DDD-V0.4.2 — UX Picard (The Enterprise Computer)

> **ADR** : ADR-V0.4.2 · **Dossier** : `the-bridge-__-life-os/src/`

---

## Phase A : Suppression et Création (Command Card)

### Étape A.1 : Suppression (Manuel ou CLI)
Supprimer `src/apps/para/components/ProjectDetailPanel.tsx`

### Étape A.2 & C.1 & C.2 : Command Card Complete
**NEW** `src/apps/para/components/ProjectCommandCard.tsx`
```typescript
import React from 'react';
import { X, Archive, Trash2, Box, Activity } from 'lucide-react';
import type { Project } from '../../../stores/fw-para.store';
import { useParaStore } from '../../../stores/fw-para.store';
import { FrameworkBridge } from './FrameworkBridge';

interface Props {
  project: Project | null;
  onClose: () => void;
}

export function ProjectCommandCard({ project, onClose }: Props) {
  const updateProject = useParaStore(s => s.updateProject);
  const archiveProject = useParaStore(s => s.archiveProject);
  const deleteProject = useParaStore(s => s.deleteProject);

  if (!project) return null;

  return (
    <div className="absolute inset-0 z-50 bg-[#0a0f0d] flex animate-in zoom-in-95 duration-200">
      {/* Sidebar Command */}
      <aside className="w-80 border-r border-white/5 bg-black/20 p-8 flex flex-col">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-1 rounded bg-white/5 text-[9px] font-black uppercase text-white/40 tracking-widest">{project.domain}</span>
            <select 
              value={project.status} 
              onChange={(e) => updateProject(project.id, { status: e.target.value as any })}
              className="px-2 py-1 rounded bg-transparent border border-white/10 text-[9px] font-black uppercase tracking-widest outline-none"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <textarea
            value={project.title}
            onChange={(e) => updateProject(project.id, { title: e.target.value })}
            className="w-full bg-transparent text-2xl font-bold uppercase tracking-wider text-[var(--theme-text)] outline-none resize-none mb-8"
            rows={3}
          />

          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Progress</h4>
            <div className="h-6 bg-white/5 rounded-full overflow-hidden relative group cursor-ew-resize"
                 onClick={(e) => {
                   const rect = e.currentTarget.getBoundingClientRect();
                   const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                   updateProject(project.id, { progress: Math.max(0, Math.min(100, pct)) });
                 }}>
              <div className="absolute inset-y-0 left-0 bg-emerald-500/50" style={{ width: `${project.progress}%` }} />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black">{project.progress}%</span>
            </div>
          </div>
        </div>

        <footer className="pt-8 border-t border-white/5 flex gap-2">
          <button onClick={() => { archiveProject(project.id); onClose(); }} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest text-[var(--theme-text)]/40 transition-all flex items-center justify-center gap-2">
            <Archive className="w-3.5 h-3.5" /> Archive
          </button>
          {/* Note: deleteProject must be implemented in fw-para.store with ld-router sync */}
          <button onClick={() => { if(window.confirm('Erase this project from existence?')) { deleteProject(project.id); onClose(); } }} className="px-4 rounded-xl border border-rose-500/20 text-rose-500 hover:bg-rose-500/10">
            <Trash2 className="w-4 h-4" />
          </button>
        </footer>
      </aside>

      {/* Main Bridge Area */}
      <main className="flex-1 flex flex-col">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10">
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--theme-text)]/40 flex items-center gap-2">
            <Activity className="w-4 h-4" /> Operational Matrix
          </h3>
          <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 text-[var(--theme-text)]/40">
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 p-10 overflow-auto">
          <div className="grid grid-cols-2 gap-6">
            <FrameworkBridge target="GTD" projectId={project.id} />
            <FrameworkBridge target="12WY" projectId={project.id} />
          </div>

          <div className="mt-12">
             <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Box className="w-3.5 h-3.5" /> Resources (Geordi)
             </h4>
             <div className="p-6 rounded-2xl border border-dashed border-white/10 text-center text-white/20 text-xs">
               Select resources to link (Implementation TBD)
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
```

## Phase B : FrameworkBridge

### Étape B.1 : Ponts Inter-Frameworks
**NEW** `src/apps/para/components/FrameworkBridge.tsx`
```typescript
import React from 'react';
import { useShellStore } from '../../../stores/shell.store';
// Imports simplifiés, il faudra mocker ou lire les stores réels fw-gtd et fw-12wy
// import { useGtdStore } from '../../../stores/fw-gtd.store'; 

interface Props {
  target: 'GTD' | '12WY';
  projectId: string;
}

export function FrameworkBridge({ target, projectId }: Props) {
  const openApp = useShellStore(s => s.openApp);
  
  // LOGIQUE DE LUTTE PARESSEUSE (LAZY LOOKUP)
  // const gtdCount = useGtdStore(s => s.items.filter(i => i.linkedProject === projectId).length);
  // (Placeholder en attendant la V0.7 GTD)
  const count = 0; 

  const onClick = () => {
    if (target === 'GTD') openApp('gtd', 'GTD Nexus');
    if (target === '12WY') openApp('twelve-week', '12 Week Year');
  };

  return (
    <div 
      onClick={onClick}
      className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--theme-text)]/60 group-hover:text-emerald-400">{target} Bridge</h4>
        <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-black text-white/40 group-hover:bg-emerald-500/20 group-hover:text-emerald-400">
          {count}
        </span>
      </div>
      <p className="text-[10px] text-white/30 uppercase tracking-widest leading-relaxed">
        {target === 'GTD' ? 'Manage Next Actions and inbox items related to this project.' : 'Align with quarterly goals and high-level 12 Week Year objectives.'}
      </p>
    </div>
  );
}
```

### Étape A.3 : Relier au App
**MODIFY** `src/apps/para/ParaApp.tsx`
Remplacer `<ProjectDetailPanel />` par `<ProjectCommandCard project={selectedProject} onClose={() => setSelectedProject(null)} />` à la fin du JSX.
