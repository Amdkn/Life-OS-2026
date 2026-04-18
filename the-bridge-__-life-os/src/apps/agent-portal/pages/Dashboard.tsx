/** Agent Portal Dashboard — Fleet & Logs Overview (V0.1.8) */
import { useMemo, useState } from 'react';
import { useAgentsStore, Agent, AgentLog } from '../../../stores/agents.store';
import { 
  Bot, Terminal, Zap, Shield, 
  ChevronRight, Activity, Cpu, Send,
  Layers, Disc
} from 'lucide-react';
import { clsx } from 'clsx';

interface AgentsDashboardProps {
  embedded?: boolean;
}

export default function AgentsDashboard({ embedded }: AgentsDashboardProps) {
  const { agents, logs, assignTask } = useAgentsStore();
  const [taskTitle, setTaskTitle] = useState('');
  const [targetLayer, setTargetLayer] = useState<'A1' | 'A2' | 'A3'>('A3');

  const handleInject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    assignTask(taskTitle, targetLayer);
    setTaskTitle('');
  };

  return (
    <div className={clsx(
      "flex-1 flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-1000",
      embedded ? "p-0" : "p-10"
    )}>
      {/* Fleet Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <LayerCard layer="A3" count={agents.filter(a => a.layer === 'A3').length} icon={Shield} color="text-emerald-400" />
        <LayerCard layer="A2" count={agents.filter(a => a.layer === 'A2').length} icon={Layers} color="text-blue-400" />
        <LayerCard layer="A1" count={agents.filter(a => a.layer === 'A1').length} icon={Cpu} color="text-amber-400" />
        <LayerCard layer="A0" count={1} icon={Disc} color="text-rose-400" label="Sovereign" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Terminal Logs */}
        <div className="col-span-12 lg:col-span-8 glass-card rounded-[2.5rem] bg-black border-white/10 p-6 flex flex-col min-h-[500px] shadow-2xl">
          <div className="flex items-center justify-between mb-6 px-4">
            <div className="flex items-center gap-3">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-emerald-500/60">Neural Bridge Console</h3>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
            </div>
          </div>
          <div className="flex-1 bg-black/40 rounded-2xl p-6 font-mono text-[11px] overflow-auto custom-scrollbar border border-white/5">
            <div className="space-y-2">
              {logs.map(log => (
                <div key={log.id} className="flex gap-4 group">
                  <span className="text-[var(--theme-text)]/10 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                  <span className={clsx(
                    "font-bold shrink-0",
                    log.type === 'command' ? "text-blue-400" : 
                    log.type === 'success' ? "text-emerald-400" :
                    log.type === 'warning' ? "text-amber-400" :
                    log.type === 'error' ? "text-rose-400" : "text-[var(--theme-text)]/40"
                  )}>{log.agentName}:</span>
                  <span className="text-[var(--theme-text)]/70 group-hover:text-[var(--theme-text)] transition-colors">{log.message}</span>
                </div>
              ))}
              {logs.length === 0 && <div className="text-emerald-500/20 animate-pulse">_ Awaiting neural signal...</div>}
            </div>
          </div>
        </div>

        {/* Task Injector & Active Agents */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          <div className="glass-card rounded-[2.5rem] bg-emerald-500/[0.02] border-emerald-500/10 p-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400/80 mb-8">Task Injector</h3>
            <form onSubmit={handleInject} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--theme-text)]/30">Layer Target</label>
                <div className="flex gap-2">
                  {(['A1', 'A2', 'A3'] as const).map(l => (
                    <button 
                      key={l}
                      type="button"
                      onClick={() => setTargetLayer(l)}
                      className={clsx(
                        "flex-1 py-2 rounded-xl border text-[10px] font-black transition-all",
                        targetLayer === l ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" : "bg-white/5 border-white/5 text-[var(--theme-text)]/20 hover:bg-white/10"
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--theme-text)]/30">Directive</label>
                <input 
                  type="text" 
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Enter task command..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-[var(--theme-text)]/80 focus:outline-none focus:border-emerald-500/30 transition-all"
                />
              </div>
              <button type="submit" className="w-full py-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all group">
                Inject Directive <Send className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>

          <div className="glass-card rounded-[2rem] bg-black/20 border-white/5 p-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--theme-text)]/40 mb-6">Active Fleet</h3>
            <div className="space-y-4">
              {agents.slice(0, 4).map(agent => (
                <div key={agent.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      "w-2 h-2 rounded-full",
                      agent.status === 'online' ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" : "bg-white/20"
                    )} />
                    <span className="text-[11px] font-bold text-[var(--theme-text)]/80">{agent.name}</span>
                  </div>
                  <span className="text-[8px] font-bold text-[var(--theme-text)]/20 uppercase tracking-widest">{agent.layer}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LayerCard({ layer, count, icon: Icon, color, label }: any) {
  return (
    <div className="glass-card rounded-3xl p-6 bg-white/[0.01] border-white/5 hover:bg-white/[0.03] transition-all group border hover:border-white/10 flex items-center gap-5 shadow-2xl">
      <div className={clsx(
        "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 shadow-lg",
        "bg-white/[0.02] border-white/5 group-hover:bg-white/5",
        color
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[9px] font-bold text-[var(--theme-text)]/30 uppercase tracking-[0.2em] mb-0.5">{label || `${layer} Layer`}</p>
        <p className="text-xl font-black text-[var(--theme-text)]/90 tracking-tighter">{count} Active</p>
      </div>
    </div>
  );
}




