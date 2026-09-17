import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getEvents, appendEvent, BlackboardEvent } from '../../lib/blackboard/client';
import { B3WorkerDescriptor, IntelligenceLevel, DeterminismLevel, B3SwarmTopology } from '../../types/b3-polymorphic';
import { ShieldCheck, Cpu, Database, Server, Zap, X, AlertTriangle, Fingerprint, Lock, ShieldAlert } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

const INTELLIGENCE_LEVELS: IntelligenceLevel[] = ['deterministic_code', 'rule_based', 'light_llm', 'deep_reasoning'];
const DETERMINISM_LEVELS: DeterminismLevel[] = ['strict_atomic', 'gated_validation', 'probabilistic_creative'];

type BadgeStatus = 'Idle' | 'Running' | 'Gated' | 'Complete';

interface MatrixWorker extends B3WorkerDescriptor {
  status: BadgeStatus;
  lastLogs: string;
  measuredComputeTime?: number;
  measuredBudgetTokens?: number;
  triggers: string[];
}

export default function B3MatrixCockpit() {
  const [events, setEvents] = useState<BlackboardEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchLiveEvents = async (isInitial = false) => {
      try {
        if (isInitial && isMounted) setIsLoading(true);
        const data = await getEvents();
        if (isMounted) {
          setEvents(data);
          setError(null);
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
    };

    fetchLiveEvents(true);
    const intervalId = setInterval(() => fetchLiveEvents(false), 10000);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const workers = useMemo(() => {
    const workerMap = new Map<string, MatrixWorker>();

    // Scan events to find workers and determine status
    // 1. Look for swarm topologies
    const topologies = events
      .filter(e => e.event_type === 'action_receipt' && e.actor_layer === 'B3' && e.payload_json.includes('B3SwarmTopology'))
      .sort((a, b) => b.timestamp - a.timestamp); // Sort latest first

    for (const ev of events) {
      if (ev.event_type === 'action_receipt' && (ev.actor_layer === 'B3' || ev.actor_layer === 'A3')) {
        try {
          const payload = JSON.parse(ev.payload_json);
          // If the payload contains a topology (from B3SwarmComposer)
          if (payload.workers && Array.isArray(payload.workers)) {
             payload.workers.forEach((w: B3WorkerDescriptor) => {
                 if (!workerMap.has(w.id)) {
                     workerMap.set(w.id, {
                         ...w,
                         status: 'Complete', // default from topology creation, will update below
                         lastLogs: 'Initialization from Swarm Topology...',
                         triggers: [ev.event_type],
                         measuredComputeTime: payload.metrics?.assemblyTimeMs,
                         measuredBudgetTokens: w.estimatedTokenCost
                     });
                 }
             });
          }
          // Generic worker execution receipt
          if (payload.workerId || payload.id) {
             const wid = payload.workerId || payload.id;
             let w = workerMap.get(wid);
             if (w) {
                 w.status = payload.status || 'Complete';
                 if (payload.computeTime) w.measuredComputeTime = payload.computeTime;
                 if (payload.budgetTokens) w.measuredBudgetTokens = payload.budgetTokens;
                 if (payload.logs) w.lastLogs = payload.logs.substring(0, 500) + (payload.logs.length > 500 ? '...' : '');
                 if (!w.triggers.includes(ev.event_type)) w.triggers.push(ev.event_type);
             } else if (payload.intelligence && payload.determinism) {
                 // Discover ad-hoc worker from receipt
                 workerMap.set(wid, {
                     id: wid,
                     incarnationType: payload.incarnationType || 'agent',
                     intelligence: payload.intelligence,
                     determinism: payload.determinism,
                     capabilities: payload.capabilities || [],
                     estimatedTokenCost: payload.budgetTokens || 0,
                     estimatedLatencyMs: payload.computeTime || 0,
                     ioAuthorizations: payload.ioAuthorizations || [],
                     executionVectors: payload.executionVectors || [],
                     status: payload.status || 'Complete',
                     lastLogs: (payload.logs || 'Discovered from telemetry.').substring(0, 500),
                     triggers: [ev.event_type],
                     measuredComputeTime: payload.computeTime,
                     measuredBudgetTokens: payload.budgetTokens
                 });
             }
          }
        } catch (e) {
          // parse error
        }
      } else if (ev.event_type.startsWith('cron_') || ev.event_type === 'job_updated') {
           // Also scan generic state events that might apply to workers
           try {
               const payload = JSON.parse(ev.payload_json);
               const wid = payload.workerId || payload.id;
               const w = workerMap.get(wid);
               if (w) {
                   if (ev.event_type === 'cron_executed') w.status = 'Complete';
                   if (ev.event_type === 'cron_pulsed') w.status = 'Running';
                   if (ev.event_type === 'job_updated') w.status = (payload.state === 'running' ? 'Running' : (payload.state === 'blocked' ? 'Gated' : w.status));
               }
           } catch(e) {}
      }
    }

    return Array.from(workerMap.values());
  }, [events]);

  const selectedWorker = useMemo(() => {
    return workers.find(w => w.id === selectedWorkerId) || null;
  }, [workers, selectedWorkerId]);

  const handleForceDeterministic = async () => {
    if (!selectedWorker) return;

    try {
      await appendEvent({
        id: crypto.randomUUID(),
        workspace_id: 'jules-dispatch-workspace', // or appropriate global workspace
        actor_id: 'operator',
        actor_layer: 'human',
        event_type: 'handoff_ticket_assigned', // Using standard event to ensure it is audited in the same stream, or specific action
        payload_json: JSON.stringify({
          action: 'force_arbitration',
          workerId: selectedWorker.id,
          originalDeterminism: selectedWorker.determinism,
          newDeterminism: 'strict_atomic',
          reason: 'Token economy enforced by operator',
          timestamp: Date.now()
        }),
        timestamp: Date.now()
      });

      // Update local state optimisticly (note: true update will come from next poll)
      alert("Arbitration forced to strict_atomic (CLI/Hook) and logged securely.");
    } catch (e) {
      console.error(e);
      alert("Failed to record arbitration");
    }
  };

  return (
    <div className="h-full flex relative overflow-hidden bg-[#020617]">
      <div className={`flex-1 flex flex-col p-8 transition-all duration-300 ${selectedWorker ? 'pr-96' : ''}`}>

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-1">
              B3 Matrix Cockpit
            </h1>
            <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.3em] mb-4">
              Intelligence vs Determinism Terminal
            </p>
          </div>
          {error && (
             <div className="flex items-center gap-2 px-3 py-2 bg-rose-500/10 border border-rose-500/30 rounded-xl">
               <AlertTriangle className="w-4 h-4 text-rose-500" />
               <span className="text-xs font-bold text-rose-500">{error}</span>
             </div>
          )}
        </div>

        {/* Matrix Grid Area */}
        <div className="flex-1 min-h-0 glass-card rounded-[2rem] border border-[var(--glass-border)] p-8 relative overflow-auto custom-scrollbar">
            {workers.length === 0 && !isLoading && !error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30">
                    <Cpu className="w-24 h-24 mb-4 text-[var(--text-muted)]" />
                    <span className="text-xl font-black uppercase tracking-widest text-[var(--text-muted)]">Matrice inoccupée</span>
                    <span className="text-xs font-bold mt-2">Aucune incarnation active</span>
                </div>
            ) : (
                <div className="min-w-[800px] h-full flex flex-col">
                    {/* Headers (X Axis - Intelligence) */}
                    <div className="grid grid-cols-[150px_1fr_1fr_1fr_1fr] gap-4 mb-4 items-end">
                        <div className="text-right text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest pb-2">Intelligence →<br/>Determinisme ↓</div>
                        {INTELLIGENCE_LEVELS.map(level => (
                            <div key={level} className="text-center text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider pb-2 border-b-2 border-[var(--glass-border-subtle)]">
                                {level.replace('_', ' ')}
                            </div>
                        ))}
                    </div>

                    {/* Rows (Y Axis - Determinism) */}
                    <div className="flex-1 flex flex-col gap-4">
                        {DETERMINISM_LEVELS.map(detLevel => (
                            <div key={detLevel} className="flex-1 grid grid-cols-[150px_1fr_1fr_1fr_1fr] gap-4 min-h-[120px]">
                                <div className="text-right text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider pr-4 border-r-2 border-[var(--glass-border-subtle)] flex items-center justify-end">
                                    {detLevel.replace('_', ' ')}
                                </div>
                                {INTELLIGENCE_LEVELS.map(intLevel => {
                                    const cellWorkers = workers.filter(w => w.intelligence === intLevel && w.determinism === detLevel);
                                    return (
                                        <div key={`${detLevel}-${intLevel}`} className="bg-[var(--glass-l2-bg)] border border-[var(--glass-border-subtle)] rounded-2xl p-3 flex flex-wrap gap-2 content-start overflow-y-auto custom-scrollbar shadow-inner relative">
                                            {cellWorkers.map(w => (
                                                <WorkerBadge
                                                    key={w.id}
                                                    worker={w}
                                                    isSelected={selectedWorkerId === w.id}
                                                    onClick={() => setSelectedWorkerId(w.id)}
                                                />
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {selectedWorker && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 bottom-0 w-96 bg-[var(--glass-bg)] border-l border-[var(--glass-border)] backdrop-blur-3xl shadow-2xl z-50 flex flex-col"
          >
            <div className="p-6 border-b border-[var(--glass-border-subtle)] flex items-start justify-between">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-wider mb-1 truncate w-64" title={selectedWorker.id}>{selectedWorker.id}</h2>
                <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-1 rounded bg-[var(--glass-l2-bg)] text-[9px] font-black uppercase text-[var(--brass)] border border-[var(--brass)]/30">
                        {selectedWorker.incarnationType}
                    </span>
                    <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${
                        selectedWorker.status === 'Running' ? 'bg-emerald-500/20 text-emerald-400' :
                        selectedWorker.status === 'Gated' ? 'bg-amber-500/20 text-amber-400' :
                        selectedWorker.status === 'Idle' ? 'bg-white/10 text-white/50' :
                        'bg-blue-500/20 text-blue-400'
                    }`}>
                        {selectedWorker.status}
                    </span>
                </div>
              </div>
              <button onClick={() => setSelectedWorkerId(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[var(--glass-l2-bg)] border border-[var(--glass-border-subtle)] rounded-xl p-3">
                        <div className="text-[8px] font-black uppercase text-[var(--text-muted)] tracking-widest mb-1">Measured Time</div>
                        <div className="text-sm font-mono text-white">{selectedWorker.measuredComputeTime || selectedWorker.estimatedLatencyMs} ms</div>
                    </div>
                    <div className="bg-[var(--glass-l2-bg)] border border-[var(--glass-border-subtle)] rounded-xl p-3">
                        <div className="text-[8px] font-black uppercase text-[var(--text-muted)] tracking-widest mb-1">Measured Tokens</div>
                        <div className="text-sm font-mono text-white flex items-center gap-1">
                            {selectedWorker.measuredBudgetTokens !== undefined ? selectedWorker.measuredBudgetTokens : selectedWorker.estimatedTokenCost}
                            {selectedWorker.measuredBudgetTokens === 0 && selectedWorker.incarnationType !== 'agent' && <ShieldCheck className="w-3 h-3 text-emerald-400" />}
                        </div>
                    </div>
                </div>

                {/* Triggers */}
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4" /> Triggers
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {selectedWorker.triggers.map((t, i) => (
                            <span key={i} className="text-[10px] font-mono px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-white/70">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>

                {/* I/O Authorizations */}
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-2 flex items-center gap-2">
                        <Lock className="w-4 h-4" /> I/O Capabilities
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {selectedWorker.capabilities.concat(selectedWorker.ioAuthorizations).map((c, i) => (
                            <span key={i} className="text-[10px] font-bold uppercase px-2 py-1 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 rounded-lg">
                                {c}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Logs */}
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-2 flex items-center gap-2">
                        <Server className="w-4 h-4" /> Execution Trace (Truncated)
                    </h3>
                    <div className="bg-black/40 border border-white/5 rounded-xl p-3 font-mono text-[9px] text-emerald-400/80 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-48 overflow-y-auto">
                        {selectedWorker.lastLogs}
                    </div>
                </div>

            </div>

            {/* Arbitration Footer */}
            <div className="p-6 border-t border-[var(--glass-border-subtle)] bg-black/20">
                <div className="flex items-start gap-3 mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
                    <p className="text-[9px] font-bold text-amber-400 leading-tight uppercase tracking-wide">
                        Arbitration forces execution via deterministic code (CLI/Hook) to bypass LLM and enforce 0-token cost.
                    </p>
                </div>
                <button
                    onClick={handleForceDeterministic}
                    disabled={selectedWorker.determinism === 'strict_atomic' || selectedWorker.intelligence === 'deterministic_code'}
                    className="w-full py-3 rounded-xl bg-[var(--brass)]/20 hover:bg-[var(--brass)]/40 text-[var(--brass)] border border-[var(--brass)]/50 font-black uppercase tracking-widest text-xs transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                >
                    Force Deterministic Mode
                </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function WorkerBadge({ worker, isSelected, onClick }: { worker: MatrixWorker, isSelected: boolean, onClick: () => void }) {
    const statusColors = {
        'Idle': 'bg-white/5 border-white/10 text-white/50',
        'Running': 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 animate-pulse',
        'Gated': 'bg-amber-500/20 border-amber-500/40 text-amber-400',
        'Complete': 'bg-blue-500/20 border-blue-500/40 text-blue-400',
    };

    const typeIcons: Record<string, React.ReactNode> = {
        'cli': <Server className="w-3 h-3" />,
        'hook': <Fingerprint className="w-3 h-3" />,
        'mcp': <Database className="w-3 h-3" />,
        'agent': <Cpu className="w-3 h-3" />,
        'skill': <Zap className="w-3 h-3" />
    };

    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all
                ${statusColors[worker.status]}
                ${isSelected ? 'ring-2 ring-[var(--brass)] shadow-[0_0_10px_var(--brass)]' : 'hover:scale-105 hover:brightness-125'}
            `}
            title={worker.id}
        >
            {typeIcons[worker.incarnationType] || <Cpu className="w-3 h-3" />}
            <span className="truncate max-w-[100px]">{worker.id.split('-')[0]}</span>
        </button>
    );
}
