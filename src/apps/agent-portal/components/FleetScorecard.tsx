import React, { useEffect } from 'react';
import { useFleetStore } from '../../../stores/fleet.store';

const FleetScorecard: React.FC = () => {
  const { agents, fetchTelemetry } = useFleetStore();

  useEffect(() => {
    // Initial fetch
    fetchTelemetry();

    // Poll every 5s for real-time telemetry updates
    const intervalId = setInterval(() => {
      fetchTelemetry();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [fetchTelemetry]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ACTIVE': return 'text-emerald-500';
      case 'IDLE': return 'text-slate-400';
      case 'BLOCKED': return 'text-amber-500';
      case 'ERROR': return 'text-red-500';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-bold text-white mb-2">Fleet Telemetry Scorecard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <div key={agent.id} className="glass-card p-4 border border-[var(--glass-border-subtle)] rounded-xl bg-[var(--glass-bg)] flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">{agent.name}</h3>
                <span className="text-[10px] text-[var(--text-muted)] italic">{agent.role}</span>
              </div>
              <div className={`px-2 py-1 rounded text-[10px] font-black tracking-widest bg-black/40 border border-white/5 ${getStatusColor(agent.status)}`}>
                {agent.status}
              </div>
            </div>

            <div className="flex flex-col gap-1 mt-2">
               <div className="flex justify-between text-[11px] text-[var(--text-secondary)]">
                 <span>Active Tasks</span>
                 <span className="font-mono text-white">{agent.activeTasks}</span>
               </div>
               <div className="flex justify-between text-[11px] text-[var(--text-secondary)]">
                 <span>Completed Tasks</span>
                 <span className="font-mono text-white">{agent.completedTasks}</span>
               </div>
               <div className="flex justify-between text-[11px] text-[var(--text-secondary)]">
                 <span>Errors</span>
                 <span className="font-mono text-white">{agent.errorCount}</span>
               </div>
            </div>

            {agent.lastEventTime && (
               <div className="mt-2 text-[9px] text-[var(--text-muted)] text-right">
                  Last event: {new Date(agent.lastEventTime).toLocaleTimeString()}
               </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FleetScorecard;
