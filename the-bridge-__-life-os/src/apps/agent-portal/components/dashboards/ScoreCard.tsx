import React from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Layout, CheckCircle2, Clock, Eye, AlertCircle, MoreHorizontal } from 'lucide-react';
import { useParaStore } from '../../../../stores/fw-para.store';
import { useDealStore } from '../../../../stores/fw-deal.store';
import { useOsSettingsStore } from '../../../../stores/os-settings.store';
import { LDId } from '../../../../lib/ld-router';
import { LD_TO_DOMAIN } from '../../../../utils/paraAdapter';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ScoreCard: React.FC = () => {
  const { projects } = useParaStore();
  const { muses } = useDealStore();
  const { activeLdFilter } = useOsSettingsStore();

  // 🧿 V0.9 — REVENUE BRIDGE & TIME TAX CALCULATION
  const totalMonthlyRevenue = muses
    .filter(m => m.status === 'operational')
    .reduce((acc, m) => acc + (m.revenueEstimate || 0), 0);
  
  const totalWeeklyTimeTax = muses
    .filter(m => m.status === 'operational')
    .reduce((acc, m) => acc + (m.timeCost || 0), 0);

  // Map PARA projects to ScoreCard Tasks with Transversal Filtering
  const tasks = projects
    .filter(p => p.status !== 'archived')
    .filter(p => {
      if (activeLdFilter === 'all') return true;
      const targetDomain = LD_TO_DOMAIN[activeLdFilter as LDId];
      return p.domain === targetDomain;
    })
    .map(p => ({
      id: p.id.substring(0, 8).toUpperCase(),
      title: p.title,
      status: p.status === 'completed' ? 'done' : 
              p.status === 'paused' ? 'review' :
              p.progress > 0 ? 'in-progress' : 'todo',
      steps: ['PLAN', 'BUILD', 'TEST', 'DEPLOY'], // Standard Protocol
      activeStep: Math.floor((p.progress / 100) * 3),
      label: p.domain.toUpperCase(),
      progress: p.progress
    }));

  const columns = [
    { id: 'todo', label: 'TODO', icon: Layout, color: 'text-slate-400', bg: 'bg-slate-400' },
    { id: 'in-progress', label: 'IN PROGRESS', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500' },
    { id: 'review', label: 'REVIEW', icon: Eye, color: 'text-blue-500', bg: 'bg-blue-500' },
    { id: 'done', label: 'DONE', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500' }
  ];

  const stats = {
    done: tasks.filter(t => t.status === 'done').length,
    review: tasks.filter(t => t.status === 'review').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    todo: tasks.filter(t => t.status === 'todo').length,
    total: tasks.length || 1
  };

  const percentComplete = Math.round((stats.done / stats.total) * 100);

  return (
    <div className="h-full flex flex-col p-8 pb-0 overflow-hidden">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-1">
            Sprint — <span className="text-[var(--brass)] px-2">Wk13</span>
          </h1>
          <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.3em] mb-4">
            Mar 24 — Mar 28, 2026
          </p>
          <div className="flex items-center gap-3">
             <p className="text-xs text-[var(--text-secondary)] italic opacity-60">
                Transversal View: {activeLdFilter === 'all' ? 'Universal Node' : activeLdFilter.toUpperCase()}
             </p>
             {activeLdFilter !== 'all' && (
               <div className="px-2 py-0.5 rounded-md bg-[var(--brass)]/10 border border-[var(--brass)]/20 text-[8px] font-black text-[var(--brass)] uppercase tracking-widest">
                 Filtering Active
               </div>
             )}
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <div className="flex gap-4 mb-2">
            <div className="text-right">
              <div className="text-xl font-black text-emerald-500 italic leading-none">${totalMonthlyRevenue.toLocaleString()}</div>
              <div className="text-[8px] text-[var(--text-muted)] font-black uppercase tracking-widest mt-1">Monthly Revenue</div>
            </div>
            <div className="text-right border-l border-white/10 pl-4">
              <div className="text-xl font-black text-amber-500 italic leading-none">{totalWeeklyTimeTax}h/wk</div>
              <div className="text-[8px] text-[var(--text-muted)] font-black uppercase tracking-widest mt-1">Time Tax</div>
            </div>
          </div>
          <div className="text-right opacity-40">
            <div className="text-2xl font-black text-white italic leading-none">5</div>
            <div className="text-[8px] text-[var(--text-muted)] font-black uppercase tracking-widest mt-1">days left</div>
          </div>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="mb-12">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
          <div className="flex gap-4">
            <span className="text-emerald-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_emerald]" />
              {stats.done} done
            </span>
            <span className="text-blue-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_blue]" />
              {stats.review} review
            </span>
            <span className="text-amber-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_5px_amber]" />
              {stats.inProgress} in progress
            </span>
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              {stats.todo} todo
            </span>
          </div>
          <div className="text-[var(--text-muted)] italic">
            {percentComplete}% domain progress
          </div>
        </div>
        
        <div className="h-1.5 w-full bg-[var(--glass-l2-bg)] rounded-full overflow-hidden flex gap-0.5">
          <div className="bg-emerald-500 h-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" style={{ width: `${(stats.done/stats.total)*100}%` }} />
          <div className="bg-blue-500 h-full shadow-[0_0_10px_rgba(59,130,246,0.3)]" style={{ width: `${(stats.review/stats.total)*100}%` }} />
          <div className="bg-amber-500 h-full shadow-[0_0_10px_rgba(245,158,11,0.3)]" style={{ width: `${(stats.inProgress/stats.total)*100}%` }} />
          <div className="bg-slate-700 h-full" style={{ width: `${(stats.todo/stats.total)*100}%` }} />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 grid grid-cols-4 gap-6 overflow-hidden min-h-0 pb-8">
        {columns.map((col) => (
          <div key={col.id} className="flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <div className={cn("w-1.5 h-1.5 rounded-full", col.bg)} />
                <h3 className="text-[11px] font-black text-white tracking-[0.2em] uppercase">{col.label}</h3>
              </div>
              <span className="w-5 h-5 rounded-full bg-[var(--glass-l2-bg)] flex items-center justify-center text-[10px] font-black text-[var(--text-muted)]">
                {tasks.filter(t => t.status === col.id).length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2 pb-8">
              {tasks.length === 0 && col.id === 'todo' && (
                <div className="p-8 border-2 border-dashed border-white/5 rounded-2xl text-center opacity-20">
                  <span className="text-[10px] font-black uppercase tracking-widest">No projects in this domain</span>
                </div>
              )}
              {tasks.filter(t => t.status === col.id).map((task) => (
                <motion.div
                  key={task.id}
                  whileHover={{ y: -2, scale: 1.01 }}
                  className="glass-card p-4 border border-[var(--glass-border-subtle)] relative group cursor-pointer hover:border-[var(--glass-border)] transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">{task.id}</span>
                    <MoreHorizontal className="w-3.5 h-3.5 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <h4 className="text-[13px] font-bold text-white leading-tight mb-4 group-hover:text-[var(--brass)] transition-colors">
                    {task.title}
                  </h4>

                  <div className="grid grid-cols-4 gap-1 mb-3">
                    {task.steps.map((step, idx) => (
                      <div 
                        key={step} 
                        className={cn(
                          "h-4 rounded-[4px] flex items-center justify-center text-[7px] font-black tracking-tighter uppercase",
                          idx <= task.activeStep 
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                            : "bg-[var(--glass-bg)] text-[var(--text-muted)] border border-[var(--glass-border-subtle)]"
                        )}
                      >
                        {step}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className={cn(
                      "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                      task.label === 'BUSINESS' || task.label === 'FINANCE'
                        ? "bg-amber-500/10 text-amber-500/80" 
                        : "bg-blue-500/10 text-blue-500/80"
                    )}>
                      {task.label}
                    </div>
                    {task.progress > 0 && (
                      <span className="text-[9px] font-black text-[var(--brass)]">{task.progress}%</span>
                    )}
                  </div>
                  
                  {/* Subtle progress indicator */}
                  {(col.id === 'in-progress' || col.id === 'review') && (
                    <div 
                      className="absolute bottom-0 left-0 h-[1.5px] bg-[var(--brass)] shadow-[0_0_8px_var(--brass)]" 
                      style={{ width: `${task.progress}%` }} 
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreCard;
