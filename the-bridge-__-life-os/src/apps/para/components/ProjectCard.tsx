import React from 'react';
import { Layers, MoreVertical, Layout, Box, Archive } from 'lucide-react';
import type { Project } from '../../../stores/fw-para.store';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const isArchived = project.status === 'archived';

  return (
    <div 
      onClick={() => onClick(project)}
      className={`group p-6 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[var(--theme-accent)]/30 transition-all cursor-pointer relative overflow-hidden flex flex-col gap-6 ${isArchived ? 'opacity-60 grayscale-[0.5]' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${isArchived ? 'bg-white/5 border-white/10' : 'bg-[var(--theme-accent)]/10 border-[var(--theme-accent)]/20 group-hover:bg-[var(--theme-accent)]/20'}`}>
            <Layers className={`w-5 h-5 ${isArchived ? 'text-[var(--theme-text)]/40' : 'text-[var(--theme-accent)]'}`} />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-[var(--theme-text)]/80 group-hover:text-[var(--theme-accent)] transition-colors truncate max-w-[140px]">{project.title}</h4>
            <span className="text-[8px] font-bold uppercase text-[var(--theme-text)]/20 tracking-[0.2em]">{project.domain}</span>
          </div>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-white/10 text-[var(--theme-text)]/20 group-hover:text-[var(--theme-text)]/60 transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        {isArchived ? (
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[var(--theme-accent)]/50">
            <Archive className="w-3.5 h-3.5" />
            Archived {project.archivedAt ? new Date(project.archivedAt).toLocaleDateString() : 'N/A'}
          </div>
        ) : (
          <div className="flex-1 max-w-[120px]">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-[var(--theme-text)]/20">Progress</span>
              <span className="text-[9px] font-black font-mono text-[var(--theme-accent)]/80">{project.progress}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[var(--theme-accent)]/40 rounded-full transition-all duration-1000" 
                style={{ width: `${project.progress}%` }} 
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <div className="flex -space-x-2">
            {project.pillars.slice(0, 3).map((p, i) => (
              <div key={i} className="w-5 h-5 rounded-full bg-black/40 border border-white/5 flex items-center justify-center" title={p}>
                <Layout className="w-2.5 h-2.5 text-[var(--theme-text)]/30" />
              </div>
            ))}
          </div>
          {project.resources.length > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
              <Box className="w-2.5 h-2.5 text-[var(--theme-text)]/20" />
              <span className="text-[8px] font-black text-[var(--theme-text)]/40">{project.resources.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
