import React, { useState } from 'react';
import { X, Archive, Trash2, Box, Activity } from 'lucide-react';
import type { Project } from '../../../stores/fw-para.store';
import { useParaStore } from '../../../stores/fw-para.store';
import { FrameworkBridge } from './FrameworkBridge';
import { ProjectFractal } from './ProjectFractal';
import { ForgeModal } from './ForgeModal';
import { ResourceMiniCard } from './ResourceMiniCard';
import { ResourceLinker } from './ResourceLinker';
import { FractalReadView } from './FractalReadView';
import { VisionAligner } from './VisionAligner';
import { GoalAligner } from './GoalAligner';

interface Props {
  project: Project | null;
  onClose: () => void;
}

export function ProjectCommandCard({ project, onClose }: Props) {
  const updateProject = useParaStore(s => s.updateProject);
  const archiveProject = useParaStore(s => s.archiveProject);
  const deleteProject = useParaStore(s => s.deleteProject);
  const allResources = useParaStore(s => s.resources);
  const [isForgeOpen, setIsForgeOpen] = useState(false);
  const [isLinkerOpen, setIsLinkerOpen] = useState(false);

  if (!project) return null;

  const attachedRes = allResources.filter(r => 
    r.projectId === project.id || (project.linkedResources || []).includes(r.id)
  );

  const handleUnlink = async (resId: string) => {
    const isDirectChild = allResources.find(r => r.id === resId)?.projectId === project.id;
    if (isDirectChild) return; // Cannot unlink direct child in this version
    
    const freshLinked = (project.linkedResources || []).filter(id => id !== resId);
    await updateProject(project.id, { linkedResources: freshLinked });
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#0a0f0d] flex animate-in zoom-in-95 duration-200 overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
      {/* Sidebar Command */}
      <aside className="w-80 border-r border-white/5 bg-black/20 p-8 flex flex-col">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-1 rounded bg-white/5 text-[9px] font-black uppercase text-[var(--theme-text)]/40 tracking-widest">{project.domain}</span>
            <select 
              value={project.status} 
              onChange={(e) => updateProject(project.id, { status: e.target.value as any })}
              className="px-2 py-1 rounded bg-transparent border border-white/10 text-[9px] font-black uppercase tracking-widest outline-none text-[var(--theme-text)]/60"
            >
              <option value="active" className="bg-[#0a0f0d]">Active</option>
              <option value="paused" className="bg-[#0a0f0d]">Paused</option>
              <option value="completed" className="bg-[#0a0f0d]">Completed</option>
            </select>
          </div>
          
          <textarea
            value={project.title}
            onChange={(e) => updateProject(project.id, { title: e.target.value })}
            className="w-full bg-transparent text-2xl font-bold uppercase tracking-wider text-[var(--theme-text)] outline-none resize-none mb-4 scrollbar-hide"
            rows={3}
          />

          <VisionAligner project={project} />
          <GoalAligner project={project} />

          <div className="space-y-4 mt-8">
            <h4 className="text-[10px] font-bold text-[var(--theme-text)]/30 uppercase tracking-widest">Progress Control</h4>
            <div className="h-6 bg-white/5 rounded-full overflow-hidden relative group cursor-ew-resize border border-white/5"
                 onClick={(e) => {
                   const rect = e.currentTarget.getBoundingClientRect();
                   const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                   updateProject(project.id, { progress: Math.max(0, Math.min(100, pct)) });
                 }}>
              <div className="absolute inset-y-0 left-0 bg-[var(--theme-accent)]/50 transition-all duration-300" style={{ width: `${project.progress}%` }} />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-[var(--theme-text)]">{project.progress}%</span>
            </div>
          </div>

          <ProjectFractal project={project} />
        </div>

        <footer className="pt-8 border-t border-white/5 flex gap-2">
          <button 
            onClick={() => { archiveProject(project.id); onClose(); }} 
            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest text-[var(--theme-text)]/40 transition-all flex items-center justify-center gap-2 border border-white/5"
          >
            <Archive className="w-3.5 h-3.5" /> Archive
          </button>
          <button 
            onClick={() => { if(window.confirm('Erase this project from existence?')) { deleteProject(project.id); onClose(); } }} 
            className="px-4 rounded-xl border border-rose-500/20 text-rose-500 hover:bg-rose-500/10 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </footer>
      </aside>

      {/* Main Bridge Area */}
      <main className="flex-1 flex flex-col bg-transparent">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10">
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--theme-text)]/40 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[var(--theme-accent)]" /> Operational Matrix
          </h3>
          <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 text-[var(--theme-text)]/40 hover:text-[var(--theme-text)] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 p-10 overflow-auto custom-scrollbar">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <FrameworkBridge target="GTD" projectId={project.id} />
            <FrameworkBridge target="12WY" projectId={project.id} />
          </div>

          <FractalReadView project={project} />

          <div className="mt-12">
             <div className="flex justify-between items-center mb-4">
               <h4 className="text-[10px] font-bold text-[var(--theme-text)]/30 uppercase tracking-widest flex items-center gap-2">
                <Box className="w-3.5 h-3.5" /> Resources (Geordi)
               </h4>
               <div className="flex gap-2">
                 <button 
                   onClick={() => setIsLinkerOpen(!isLinkerOpen)} 
                   className="px-2.5 py-1.5 bg-white/5 text-[var(--theme-text)]/60 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                 >
                   Link
                 </button>
                 <button 
                   onClick={() => setIsForgeOpen(true)} 
                   className="px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-amber-500/20 transition-all flex items-center gap-1"
                 >
                   <Box className="w-3 h-3" /> Forge
                 </button>
               </div>
             </div>

             {isLinkerOpen && <ResourceLinker project={project} onClose={() => setIsLinkerOpen(false)} />}

             <div className={`space-y-2 mt-4 ${attachedRes.length === 0 ? 'py-12 rounded-3xl border border-dashed border-white/10 text-center bg-white/[0.01]' : ''}`}>
                {attachedRes.length === 0 ? (
                   <p className="text-[10px] text-[var(--theme-text)]/20 uppercase tracking-widest">No resources aligned</p>
                ) : attachedRes.map(res => (
                   <ResourceMiniCard key={res.id} resource={res} onUnlink={() => handleUnlink(res.id)} />
                ))}
             </div>
          </div>
        </div>
      </main>

      {isForgeOpen && <ForgeModal project={project} onClose={() => setIsForgeOpen(false)} />}
    </div>
  );
}
