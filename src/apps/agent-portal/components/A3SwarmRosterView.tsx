import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Network, AlertTriangle, ShieldCheck, Database, Zap, Clock } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { useAgentsStore } from '../../../stores/agents.store';
import { ARMADA_FOLDERS } from '../../../constants';
import { getEvents, type BlackboardEvent } from '../../../lib/blackboard/client';
import ProofReceiptModal from './ProofReceiptModal';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type AgentStatus = 'Idle' | 'Active' | 'Executing MCP' | 'Blocked' | 'Unknown';

interface AgentCardData {
  id: string;
  name: string;
  role: string;
  vessel: string;
  status: AgentStatus;
  budgetTokens: string;
  computeTime: string;
  receipts: BlackboardEvent[];
}

export default function A3SwarmRosterView() {
  const [events, setEvents] = useState<BlackboardEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  // Using the centralized agents store for A3 agents
  const { agents: storeAgents } = useAgentsStore();
  const a3Agents = storeAgents.filter(a => a.layer === 'A3');

  useEffect(() => {
    let isMounted = true;

    async function fetchLiveEvents(isInitial = false) {
      try {
        if (isInitial) setIsLoading(true);
        setError(null);
        const liveEvents = await getEvents();
        if (isMounted) {
          setEvents(liveEvents);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to fetch Blackboard events", err);
          setError("Service injoignable: Blackboard API is currently unreachable. Live status disabled.");
        }
      } finally {
        if (isMounted && isInitial) {
          setIsLoading(false);
        }
      }
    }

    fetchLiveEvents(true);

    // Poll every 10 seconds for live updates
    const intervalId = setInterval(() => fetchLiveEvents(false), 10000);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const agentCards: AgentCardData[] = useMemo(() => {
    return a3Agents.map(agent => {
      // Find vessel/squad from ARMADA_FOLDERS
      let vesselName = 'Unknown Vessel';
      for (const folder of ARMADA_FOLDERS) {
        if (folder.agents.some(a => a.name.includes(agent.name) || agent.name.includes(a.name))) {
          vesselName = folder.label;
          break;
        }
      }

      const agentEvents = events.filter(e =>
        e.actor_id === agent.id ||
        e.actor_id === agent.name ||
        e.actor_layer === 'A3' // fallback, but potentially noisy
      ).sort((a, b) => b.timestamp - a.timestamp); // latest first

      const receipts = agentEvents.filter(e => e.event_type === 'action_receipt');

      // Determine status from event history (strictly no simulated data)
      let status: AgentStatus = error ? 'Unknown' : 'Idle';
      if (!error && agentEvents.length > 0) {
        const latestEvent = agentEvents[0];
        const type = latestEvent.event_type;
        if (type.includes('mcp_start') || type.includes('mcp_exec')) {
          status = 'Executing MCP';
        } else if (type.includes('block')) {
          status = 'Blocked';
        } else if (type.includes('start') || type.includes('active') || type.includes('running')) {
          status = 'Active';
        } else if (type.includes('complete') || type === 'action_receipt' || type.includes('idle')) {
          status = 'Idle';
        }
      }

      // Calculate compute time and budget tokens from receipts if available
      let budgetTokens = 'non mesuré';
      let computeTime = 'non mesuré';

      if (receipts.length > 0) {
        // Try to parse metrics from the latest receipt
        try {
          const latestReceipt = receipts[0];
          const payload = JSON.parse(latestReceipt.payload_json);
          if (payload.budgetTokens !== undefined) budgetTokens = String(payload.budgetTokens);
          if (payload.computeTime !== undefined) computeTime = String(payload.computeTime);
        } catch (e) {
          // ignore parsing errors
        }
      }

      return {
        id: agent.id,
        name: agent.name,
        role: agent.specialty || 'Unassigned Role',
        vessel: vesselName,
        status,
        budgetTokens,
        computeTime,
        receipts
      };
    });
  }, [a3Agents, events, error]);

  const selectedAgentData = agentCards.find(a => a.id === selectedAgentId);

  return (
    <div className="h-full flex flex-col p-8 overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-1">
            A3 Swarm Visualizer
          </h1>
          <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.3em] mb-4">
            Multidimensional Roster Supervision
          </p>
        </div>
        <div className="flex items-center gap-3">
           <Network className="w-8 h-8 text-[var(--accent-primary)] opacity-50" />
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-center gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
          <p className="text-xs font-bold text-rose-400">{error}</p>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && events.length === 0 && !error && (
        <div className="flex-1 flex flex-col items-center justify-center opacity-50">
           <div className="w-8 h-8 border-2 border-[var(--brass)] border-t-transparent rounded-full animate-spin mb-4" />
           <p className="text-xs font-black uppercase tracking-widest text-[var(--brass)]">Synchronizing Telemetry...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && agentCards.length === 0 && (
         <div className="flex-1 flex flex-col items-center justify-center opacity-30">
           <Network className="w-16 h-16 text-[var(--text-muted)] mb-4" />
           <p className="text-sm font-black uppercase tracking-widest text-[var(--text-muted)]">No A3 Agents Found in Roster.</p>
         </div>
      )}

      {/* Roster Grid */}
      {(!isLoading || events.length > 0) && agentCards.length > 0 && (
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {agentCards.map(agent => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onViewReceipts={() => setSelectedAgentId(agent.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Proof Receipt Modal */}
      <ProofReceiptModal
        isOpen={selectedAgentId !== null}
        onClose={() => setSelectedAgentId(null)}
        agentId={selectedAgentId || ''}
        agentName={selectedAgentData?.name || ''}
        receipts={selectedAgentData?.receipts || []}
      />
    </div>
  );
}

function AgentCard({ agent, onViewReceipts }: { agent: AgentCardData, onViewReceipts: () => void }) {
  const statusColors = {
    'Idle': 'text-[var(--text-muted)] bg-[var(--glass-bg)] border-[var(--glass-border-subtle)]',
    'Active': 'text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/30',
    'Executing MCP': 'text-[var(--brass)] bg-[var(--brass)]/10 border-[var(--brass)]/30',
    'Blocked': 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    'Unknown': 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  };

  const statusColorClass = statusColors[agent.status];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass-card rounded-[2rem] p-6 border border-[var(--glass-border)] flex flex-col gap-4 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none transition-opacity group-hover:opacity-10">
        <ShieldCheck className="w-24 h-24" />
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-black text-white uppercase tracking-wider mb-1">{agent.name}</h3>
          <p className="text-[10px] font-bold text-[var(--brass)] uppercase tracking-widest">{agent.role}</p>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full border flex items-center gap-2",
          statusColorClass
        )}>
          {agent.status === 'Active' || agent.status === 'Executing MCP' ? (
             <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse shadow-[0_0_5px_currentColor]" />
          ) : (
             <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
          )}
          <span className="text-[9px] font-black uppercase tracking-widest leading-none mt-[1px]">
            {agent.status}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1 mt-2">
         <span className="text-[8px] text-[var(--text-muted)] font-black uppercase tracking-widest">Assigned Vessel</span>
         <span className="text-[11px] font-medium text-[var(--text-secondary)] bg-[var(--glass-l2-bg)] px-3 py-1.5 rounded-lg border border-[var(--glass-border-subtle)] inline-block w-fit">
           {agent.vessel}
         </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className="bg-[var(--glass-l2-bg)] p-3 rounded-xl border border-[var(--glass-border-subtle)]">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-3 h-3 text-[var(--accent-primary)] opacity-70" />
            <span className="text-[8px] text-[var(--text-muted)] font-black uppercase tracking-widest">Budget Tokens</span>
          </div>
          <span className="text-sm font-mono font-bold text-[var(--text-secondary)]">{agent.budgetTokens}</span>
        </div>
        <div className="bg-[var(--glass-l2-bg)] p-3 rounded-xl border border-[var(--glass-border-subtle)]">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-3 h-3 text-[var(--brass)] opacity-70" />
            <span className="text-[8px] text-[var(--text-muted)] font-black uppercase tracking-widest">Compute Time</span>
          </div>
          <span className="text-sm font-mono font-bold text-[var(--text-secondary)]">{agent.computeTime}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--glass-border-subtle)] flex items-center justify-between">
        <div className="flex items-center gap-2 opacity-60">
          <Database className="w-4 h-4 text-[var(--text-muted)]" />
          <span className="text-[10px] font-bold text-[var(--text-muted)]">{agent.receipts.length} Receipts</span>
        </div>
        <button
          onClick={onViewReceipts}
          className="px-4 py-2 rounded-xl bg-[var(--glass-bg-active)] hover:bg-[var(--brass)]/20 border border-[var(--glass-border)] hover:border-[var(--brass)]/30 transition-colors text-[10px] font-black text-white uppercase tracking-widest"
        >
          View Proofs
        </button>
      </div>
    </motion.div>
  );
}
