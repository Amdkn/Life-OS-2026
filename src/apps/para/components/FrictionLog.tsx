import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { useParaStore } from '../../../stores/fw-para.store';
import { useGtdStore } from '../../../stores/fw-gtd.store';

const STALE_THRESHOLD = 14 * 24 * 60 * 60 * 1000; // 14 jours

export function FrictionLog() {
  const allProjects = useParaStore(s => s.projects);
  const projects = allProjects.filter(p => p.status === 'active');
  const gtdItems = useGtdStore(s => s.items);

  const frictionItems = projects.map(p => {
    const hasActions = gtdItems.some(i => i.projectId === p.id);
    const isStale = p.updatedAt ? (Date.now() - p.updatedAt) > STALE_THRESHOLD : false;
    if (!hasActions || isStale) {
      return { project: p, reason: !hasActions ? 'NO ACTIONS' : 'STALLED' };
    }
    return null;
  }).filter(Boolean) as { project: any; reason: string }[];

  if (frictionItems.length === 0) {
    return (
      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
        <h3 className="text-[10px] font-bold text-[var(--theme-text)]/30 uppercase tracking-[0.3em] mb-4">Friction Log</h3>
        <p className="text-[10px] text-emerald-400/40 italic text-center py-4 uppercase tracking-widest">All clear — System Aligned.</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
      <h3 className="text-[10px] font-bold text-[var(--theme-text)]/30 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Friction Log
      </h3>
      <div className="space-y-2 max-h-60 overflow-auto custom-scrollbar pr-1">
        {frictionItems.map(({ project, reason }) => (
          <div key={project.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between items-center group">
            <div className="flex items-center gap-2 min-w-0">
              <Clock className="w-3 h-3 text-[var(--theme-text)]/20 group-hover:text-amber-400 transition-colors shrink-0" />
              <span className="text-xs text-[var(--theme-text)]/60 truncate font-bold uppercase tracking-tight">{project.title}</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase shrink-0 ${
              reason === 'STALLED' ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20' : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
            }`}>
              {reason}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
