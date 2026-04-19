import React, { useMemo } from 'react';
import { Target, Play, CheckCircle2, Zap, Activity, Factory } from 'lucide-react';
import { useGtdStore } from '../../../stores/fw-gtd.store';
import { useDealStore } from '../../../stores/fw-deal.store';
import { clsx } from 'clsx';

export function EngageView() {
  const allItems = useGtdStore(s => s.items); 
  const activeContext = useGtdStore(s => s.activeContext);
  const processItem = useGtdStore(s => s.processItem);
  const absorbGtdTaskAsFriction = useDealStore(s => s.absorbGtdTaskAsFriction);

  const actionableTasks = useMemo(() => {
    return allItems
      .filter(i => i.status === 'actionable')
      .filter(i => activeContext === 'all' || i.context === activeContext)
      .sort((a,b) => {
         if (a.energy === 'high' && b.energy !== 'high') return -1;
         if (b.energy === 'high' && a.energy !== 'high') return 1;
         return 0;
      });
  }, [allItems, activeContext]);

  const handleSendToSpacedock = (taskId: string, content: string, context?: string) => {
    absorbGtdTaskAsFriction(content, context);
    processItem(taskId, { status: 'incubating' }, 'Sent to DEAL Spacedock for Reverse Engineering');
  };

  return (
    <div className="p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex justify-center items-center border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
           <Target className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-[var(--theme-text)]">Engage Protocol</h1>
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--theme-text)]/40">Executing {actionableTasks.length} targets for context [{activeContext}]</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 max-w-4xl">
         {actionableTasks.map(task => (
            <div key={task.id} className="p-5 rounded-2xl bg-[#0A0A0A] border border-white/5 hover:border-orange-500/30 transition-all flex items-center justify-between group">
               <div className="flex items-center gap-4">
                  <button 
                    onClick={() => processItem(task.id, { status: 'completed' }, 'Task accomplished')}
                    className="w-10 h-10 rounded-xl border border-white/10 hover:bg-orange-500 hover:border-orange-500 transition-all flex items-center justify-center group/btn shadow-lg"
                  >
                     <Zap className="w-4 h-4 text-white/20 group-hover/btn:text-[var(--theme-bg)] fill-current" />
                  </button>
                  <button 
                    title="Flag as Repetitive & Send to DEAL"
                    onClick={() => handleSendToSpacedock(task.id, task.content, task.context)}
                    className="w-10 h-10 rounded-xl border border-white/10 hover:bg-purple-500/20 hover:border-purple-500 hover:text-purple-400 transition-all flex items-center justify-center text-white/20"
                  >
                    <Factory className="w-4 h-4" />
                  </button>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--theme-text)]/90 group-hover:text-orange-400 transition-colors">{task.content}</h3>
                    <div className="flex items-center gap-3 mt-1 text-[9px] font-bold uppercase tracking-widest text-[var(--theme-text)]/30">
                       <span className="text-orange-400/80">{task.context || '@NONE'}</span>
                       {task.energy && <span className="flex items-center gap-1"><Activity className="w-2.5 h-2.5" /> {task.energy}</span>}
                       {task.timeEstimate && <span>{task.timeEstimate} MIN</span>}
                    </div>
                  </div>
               </div>
               
               <div className="flex gap-2">
                  {task.projectId && <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-[8px] font-black tracking-widest uppercase border border-blue-500/20">PARA</span>}
                  {task.goalId && <span className="px-2 py-1 rounded bg-teal-500/10 text-teal-400 text-[8px] font-black tracking-widest uppercase border border-teal-500/20">12WY</span>}
               </div>
            </div>
         ))}

         {actionableTasks.length === 0 && (
            <div className="text-center py-20 opacity-20 mt-10 border border-dashed border-white/10 rounded-[2.5rem]">
               <CheckCircle2 className="w-16 h-16 mx-auto mb-4" />
               <p className="text-xs uppercase tracking-[0.3em] font-bold">No tactical targets acquired</p>
            </div>
         )}
      </div>
    </div>
  );
}
