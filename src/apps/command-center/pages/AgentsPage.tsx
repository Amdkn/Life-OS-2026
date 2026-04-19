/** CC Agents Page — Real-time fleet monitoring and log feed (P5.2/P5.3) */
import React from 'react';
import { useAgentsStore, Agent, Task } from '../../../stores/agents.store';
import { Cpu, Zap, Users, Terminal, Clock, ShieldCheck, Loader2 } from 'lucide-react';

export function AgentsPage() {
  const { agents, logs, tasks } = useAgentsStore();
  
  const a1Agents = agents.filter(a => a.layer === 'A1');
  const a2Agents = agents.filter(a => a.layer === 'A2');
  const a3Agents = agents.filter(a => a.layer === 'A3');

  return (
    <div className="p-8 flex flex-col gap-8 h-full animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
      <div className="shrink-0">
        <h1 className="text-2xl font-bold text-[var(--theme-text)] font-outfit uppercase tracking-[0.3em]">Agent Portal</h1>
        <p className="text-[var(--theme-text)]/40 text-[10px] uppercase tracking-[0.4em] mt-2">Active Strategic Fleet Operations</p>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-8 min-h-0">
        {/* Fleet Grid */}
        <div className="col-span-8 overflow-auto custom-scrollbar pr-4 space-y-10">
          <AgentSection title="Layer 1 — Core Defense" icon={ShieldCheck} color="text-emerald-400" agents={a1Agents} tasks={tasks} />
          <AgentSection title="Layer 2 — Strategic Vessles" icon={Zap} color="text-amber-400" agents={a2Agents} tasks={tasks} />
          <AgentSection title="Layer 3 — Logic Command" icon={Users} color="text-blue-400" agents={a3Agents} tasks={tasks} />
        </div>

        {/* Real-time Logs */}
        <div className="col-span-4 flex flex-col gap-4 min-h-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[var(--theme-text)]/40" />
              <h3 className="text-[10px] font-bold text-[var(--theme-text)]/40 uppercase tracking-widest">Protocol Logs</h3>
            </div>
          </div>
          <div className="flex-1 bg-black/40 rounded-3xl border border-white/5 p-4 font-mono text-[9px] overflow-auto custom-scrollbar flex flex-col-reverse gap-3">
            {logs.map(log => (
              <div key={log.id} className="animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="flex items-start gap-3">
                  <span className="text-[var(--theme-text)]/20 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                  <span className={`shrink-0 font-bold ${log.type === 'error' ? 'text-red-400' : log.type === 'warning' ? 'text-amber-400' : log.type === 'success' ? 'text-emerald-400' : log.type === 'command' ? 'text-blue-400' : 'text-[var(--theme-text)]/40'}`}>
                    {log.agentName} »
                  </span>
                  <span className="text-[var(--theme-text)]/60 font-mono">{log.message}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AgentSection({ title, icon: Icon, color, agents, tasks }: any) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-4 h-4 ${color}`} />
        <h3 className="text-xs font-bold text-[var(--theme-text)] uppercase tracking-widest font-outfit">{title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {agents.map((a: Agent) => (
          <AgentCard key={a.id} agent={a} activeTask={tasks.find((t: Task) => t.agentId === a.id && t.status === 'running')} />
        ))}
      </div>
    </section>
  );
}

const AgentCard: React.FC<{ agent: Agent, activeTask?: Task }> = ({ agent, activeTask }) => {
  const statusColors = {
    online: 'bg-emerald-500 shadow-[0_0_10px_#10b981]',
    idle: 'bg-amber-500 shadow-[0_0_10px_#f59e0b]',
    busy: 'bg-blue-500 shadow-[0_0_10px_#3b82f6]',
    warning: 'bg-red-500 shadow-[0_0_10px_#ef4444]',
    offline: 'bg-white/20',
  };

  return (
    <div className="glass-card rounded-xl p-4 border-white/5 bg-white/[0.02] border hover:border-white/10 transition-all group flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-black/20 ${agent.layer === 'A1' ? 'text-emerald-400' : agent.layer === 'A2' ? 'text-amber-400' : 'text-blue-400'}`}>
          {agent.layer === 'A1' ? <ShieldCheck className="w-5 h-5" /> : agent.layer === 'A2' ? <Zap className="w-5 h-5" /> : <Users className="w-5 h-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-[11px] font-bold text-[var(--theme-text)] uppercase tracking-wider truncate">{agent.name}</h4>
            <div className={`w-1.5 h-1.5 rounded-full ${statusColors[agent.status]}`} />
          </div>
          <div className="text-[9px] text-[var(--theme-text)]/30 uppercase tracking-tighter font-medium truncate">
            {agent.specialty || 'General Intelligence'}
          </div>
        </div>
      </div>

      {activeTask && (
        <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1">
          <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest">
            <span className="text-blue-400 flex items-center gap-1"><Loader2 className="w-2 h-2 animate-spin" /> Working...</span>
            <span className="text-[var(--theme-text)]/40">{Math.round(activeTask.progress)}%</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6] transition-all duration-500"
              style={{ width: `${activeTask.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

