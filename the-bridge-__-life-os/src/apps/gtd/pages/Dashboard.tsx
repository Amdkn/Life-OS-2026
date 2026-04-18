/** GTD Dashboard — Inbox & Action Overview (V0.2.8) */
import { useMemo, useState } from 'react';
import { useGtdStore } from '../../../stores/fw-gtd.store';
import { 
  Inbox, ListTodo, Zap, 
  Send, ChevronRight, Activity, Clock
} from 'lucide-react';
import { clsx } from 'clsx';
import { EngageView } from './EngageView';
import { OrganizeView } from './OrganizeView';

interface GtdDashboardProps {
  embedded?: boolean;
}

export default function GtdDashboard({ embedded }: GtdDashboardProps) {
  const { items, logs, addItem, activeTab } = useGtdStore();
  const [quickContent, setQuickContent] = useState('');

  if (activeTab === 'engage') {
    return <EngageView />;
  }

  if (activeTab === 'organize') {
    return <OrganizeView />;
  }

  const unprocessedCount = useMemo(() => items.filter(i => i.status === 'inbox').length, [items]);
  const actionableItems = useMemo(() => items.filter(i => i.status === 'actionable').slice(0, 5), [items]);

  const handleQuickCapture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickContent.trim()) return;
    addItem(quickContent);
    setQuickContent('');
  };

  return (
    <div className={clsx(
      "flex-1 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700",
      embedded ? "p-0" : "p-10"
    )}>
      {/* Quick Capture Bar */}
      <form onSubmit={handleQuickCapture} className="glass-card rounded-3xl bg-black/40 border-white/5 p-2 flex items-center gap-4 group focus-within:border-blue-500/30 transition-all shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 ml-1">
          <Zap className="w-5 h-5 text-blue-400" />
        </div>
        <input 
          type="text" 
          value={quickContent}
          onChange={(e) => setQuickContent(e.target.value)}
          placeholder="Capture anything to Inbox..." 
          className="bg-transparent border-none flex-1 py-4 px-2 text-sm text-[var(--theme-text)]/80 placeholder:text-[var(--theme-text)]/20 focus:outline-none"
        />
        <button type="submit" className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all mr-1">
          <Send className="w-4 h-4 text-[var(--theme-text)]/40 group-hover:text-blue-400" />
        </button>
      </form>

      <div className="grid grid-cols-12 gap-8">
        {/* Statistics */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          <div className="glass-card rounded-[2.5rem] bg-black/40 border-white/5 p-8 flex flex-col items-center justify-center relative overflow-hidden group hover:border-blue-500/20 transition-all">
            <div className="absolute -top-10 -right-10 p-8 opacity-5">
              <Inbox className="w-40 h-40" />
            </div>
            <span className="text-6xl font-black text-[var(--theme-text)]/90 tracking-tighter mb-2">{unprocessedCount}</span>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.4em]">Items in Inbox</span>
          </div>

          <div className="glass-card rounded-[2rem] bg-black/20 border-white/5 p-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--theme-text)]/40 mb-6 flex items-center gap-2">
              <Activity className="w-3 h-3" /> System Audit
            </h3>
            <div className="space-y-4">
              {logs.slice(0, 3).map(log => (
                <div key={log.id} className="flex flex-col gap-1 border-l border-white/10 pl-4 py-1">
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{log.action}</span>
                  <p className="text-[11px] text-[var(--theme-text)]/60 line-clamp-1">{log.reasoning}</p>
                  <span className="text-[8px] text-[var(--theme-text)]/20 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actionable List */}
        <div className="col-span-12 lg:col-span-8 glass-card rounded-[2.5rem] bg-black/20 border-white/5 p-8">
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--theme-text)]/60">Priority Next Actions</h3>
            <ListTodo className="w-4 h-4 text-blue-400/50" />
          </div>
          <div className="space-y-3">
            {actionableItems.map(item => (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                  <div>
                    <h4 className="text-[11px] font-bold text-[var(--theme-text)]/80 uppercase tracking-wider">{item.content}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[8px] font-bold text-blue-400/60 uppercase tracking-widest">{item.context || 'No Context'}</span>
                      <span className="w-1 h-1 rounded-full bg-white/10" />
                      <span className="text-[8px] font-bold text-[var(--theme-text)]/20 uppercase tracking-widest">{item.timeEstimate || 0} min</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--theme-text)]/10 group-hover:text-blue-400 transition-all group-hover:translate-x-1" />
              </div>
            ))}
            {actionableItems.length === 0 && (
              <div className="py-20 text-center opacity-20 flex flex-col items-center gap-4">
                <Clock className="w-12 h-12" />
                <p className="text-[11px] uppercase tracking-[0.5em] font-bold">Clear mind, no urgent actions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

