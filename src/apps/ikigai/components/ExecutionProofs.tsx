import React from 'react';
import { useParaStore } from '../../../stores/fw-para.store';
import { Activity, Target } from 'lucide-react';
import { useShellStore } from '../../../stores/shell.store';

export function ExecutionProofs({ visionId }: { visionId: string }) {
  const allProjects = useParaStore(s => s.projects);
  // Selector conditionnel asynchrone sécurisé
  const linkedProjects = allProjects.filter(p => p.ikigaiVisionId === visionId && p.status !== 'archived');
  const openApp = useShellStore(s => s.openApp);

  if (linkedProjects.length === 0) return (
     <div className="mt-6 p-4 rounded-xl border border-dashed border-white/10 text-center bg-white/[0.01]">
       <p className="text-[9px] uppercase tracking-widest text-white/20 italic">No execution proofs. This vision is a dream.</p>
     </div>
  );

  return (
    <div className="mt-8 border-t border-white/5 pt-6">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-4 flex items-center gap-2">
         <Activity className="w-3.5 h-3.5 text-emerald-500" /> Execution Proofs (PARA)
      </h3>
      <div className="space-y-2">
        {linkedProjects.map(p => (
           <div key={p.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.04] transition-all">
              <div>
                <span className="text-xs font-bold text-white/70 block group-hover:text-emerald-400 transition-colors">{p.title}</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500/40" style={{ width: `${p.progress}%` }} />
                  </div>
                  <span className="text-[8px] uppercase tracking-widest text-white/20">Progress: {p.progress}%</span>
                </div>
              </div>
              <button 
                onClick={() => openApp('para', 'P.A.R.A')} 
                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-emerald-500/10 text-emerald-500/50 hover:text-emerald-400 rounded-lg transition-all"
                title="Jump to PARA"
              >
                <Target className="w-4 h-4" />
              </button>
           </div>
        ))}
      </div>
    </div>
  );
}
