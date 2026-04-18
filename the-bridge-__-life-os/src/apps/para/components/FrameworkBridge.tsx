import React, { useState } from 'react';
import { useShellStore } from '../../../stores/shell.store';
import { useGtdStore } from '../../../stores/fw-gtd.store';
import { useTwelveWeekStore } from '../../../stores/fw-12wy.store';
import { AlertTriangle, CheckCircle, Plus, Target, Zap } from 'lucide-react';

interface Props { target: 'GTD' | '12WY'; projectId: string; }

export function FrameworkBridge({ target, projectId }: Props) {
  const openApp = useShellStore(s => s.openApp);
  const [quickAdd, setQuickAdd] = useState('');

  // GTD Bridge
  const allGtdItems = useGtdStore(s => s.items);
  const addGtdItem = useGtdStore(s => s.addItem);
  const gtdItems = allGtdItems.filter(i => i.projectId === projectId);

  // 12WY Bridge
  const allGoals = useTwelveWeekStore(s => s.goals);
  const goals = allGoals.filter(g => g.projectId === projectId);
  const currentWeek = Math.ceil((Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)) % 12 || 1;

  if (target === 'GTD') {
    const count = gtdItems.length;
    const isStalled = count === 0;
    return (
      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-[var(--theme-accent)]/30 hover:bg-[var(--theme-accent)]/5 transition-all">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--theme-text)]/60 flex items-center gap-2">
            <Zap className="w-4 h-4" /> GTD Actions
          </h4>
          {isStalled ? (
            <span className="px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-[8px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Stalled
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/20 text-[8px] font-black text-[var(--theme-accent)] uppercase">
              {count} action{count > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="space-y-2 mb-4 max-h-40 overflow-auto custom-scrollbar">
          {gtdItems.map(item => (
            <div key={item.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-[var(--theme-text)]/60 flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-[var(--theme-accent)]/40 shrink-0" /> {item.content}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input 
            value={quickAdd} onChange={e => setQuickAdd(e.target.value)}
            onKeyDown={e => { if(e.key === 'Enter' && quickAdd.trim()) { addGtdItem(quickAdd, { projectId }); setQuickAdd(''); }}}
            placeholder="Quick add action..." 
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-[var(--theme-text)] outline-none focus:border-[var(--theme-accent)]/30"
          />
          <button onClick={() => { if(quickAdd.trim()) { addGtdItem(quickAdd, { projectId }); setQuickAdd(''); }}} className="p-2 rounded-xl bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/20 text-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/20">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <button onClick={() => openApp('gtd', 'GTD Nexus')} className="mt-4 w-full py-2 rounded-xl bg-white/5 text-[10px] font-bold uppercase tracking-widest text-[var(--theme-text)]/30 hover:text-[var(--theme-text)]/60 transition-all">
          Open GTD →
        </button>
      </div>
    );
  }

  // 12WY Bridge
  return (
    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-[var(--theme-accent)]/30 hover:bg-[var(--theme-accent)]/5 transition-all">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--theme-text)]/60 flex items-center gap-2">
          <Target className="w-4 h-4" /> 12WY Goals
        </h4>
        <span className="text-[8px] font-bold text-[var(--theme-text)]/30 uppercase tracking-widest">Week {currentWeek}/12</span>
      </div>
      <div className="space-y-2 mb-4">
        {goals.length === 0 ? (
          <p className="text-[10px] text-[var(--theme-text)]/20 italic py-4 text-center">No goals linked to this project.</p>
        ) : goals.map(g => (
          <div key={g.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex justify-between items-center">
            <span className="text-xs text-[var(--theme-text)]/60">{g.title}</span>
            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
              g.status === 'achieved' ? 'text-[var(--theme-accent)] bg-[var(--theme-accent)]/10' :
              g.targetWeek <= currentWeek ? 'text-rose-400 bg-rose-500/10' :
              'text-amber-400 bg-amber-500/10'
            }`}>
              {g.status === 'achieved' ? '✓ Done' : g.targetWeek <= currentWeek ? 'Behind' : 'On Track'}
            </span>
          </div>
        ))}
      </div>
      <button onClick={() => openApp('twelve-week', '12 Week Year')} className="w-full py-2 rounded-xl bg-white/5 text-[10px] font-bold uppercase tracking-widest text-[var(--theme-text)]/30 hover:text-[var(--theme-text)]/60 transition-all">
        Open 12WY →
      </button>
    </div>
  );
}
