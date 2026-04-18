import React from 'react';
import { Zap, Archive } from 'lucide-react';
import { useParaStore } from '../../../stores/fw-para.store';
import { useDealStore } from '../../../stores/fw-deal.store';
import { useShellStore } from '../../../stores/shell.store';

export function ArchiveRadar() {
  const allProjects = useParaStore(s => s.projects);
  const archived = allProjects
    .filter(p => p.status === 'archived' || p.status === 'completed')
    .sort((a, b) => (b.archivedAt || 0) - (a.archivedAt || 0))
    .slice(0, 5);
  const createDef = useDealStore(s => s.createDefinitionFromText);
  const openApp = useShellStore(s => s.openApp);

  if (archived.length === 0) return null;

  return (
    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
      <h3 className="text-[10px] font-bold text-[var(--theme-text)]/30 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
        <Archive className="w-3.5 h-3.5" /> Archive Radar (Data)
      </h3>
      <div className="space-y-2">
        {archived.map(p => (
          <div key={p.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between items-center group">
            <div className="min-w-0">
              <span className="text-xs text-[var(--theme-text)]/50 truncate block uppercase font-bold tracking-tight">{p.title}</span>
              {p.archivedAt && <span className="text-[8px] text-[var(--theme-text)]/20 uppercase font-black">{new Date(p.archivedAt).toLocaleDateString()}</span>}
            </div>
            <button 
              onClick={() => { createDef(`[PARA] ${p.title}`); openApp('deal', 'D.E.A.L'); }}
              className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[8px] font-black uppercase opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 shrink-0"
            >
              <Zap className="w-3 h-3" /> DEAL
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
