import React, { useState, useEffect } from 'react';
import { useTwelveWeekStore } from '../../../stores/fw-12wy.store';
import { getEvents, BlackboardEvent } from '../../../lib/blackboard/client';
import { JulesDispatcher } from '../../../services/jules/dispatch/dispatcher';
import { DispatchJob } from '../../../services/jules/dispatch/types';
import { AlertCircle, Target, Briefcase, PlayCircle } from 'lucide-react';

const FRANCHISES = [
  { id: 'abc_childcare', label: 'ABC Childcare' },
  { id: 'rilcot', label: 'Rilcot' },
  { id: 'alikaly_holding', label: 'Alikaly Holding' },
  { id: 'marina_cleaning', label: 'Marina Cleaning' }
];

export default function B1SummerVerseCockpit() {
  const { tactics, hydrate, isHydrated } = useTwelveWeekStore();
  const [arbitrations, setArbitrations] = useState<BlackboardEvent[]>([]);
  const [dispatchQueue, setDispatchQueue] = useState<DispatchJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [dispatchLoading, setDispatchLoading] = useState(false);

  useEffect(() => {
    if (!isHydrated) {
      hydrate();
    }
    loadArbitrations();
    loadDispatchQueue();
  }, [isHydrated, hydrate]);

  const loadArbitrations = async () => {
    try {
      const events = await getEvents();
      // PRD-072: handoff_ticket_assigned (as seen in b1-handoff-queue.ts memory)
      const pendingArbitrations = events.filter(e => e.event_type === 'handoff_ticket_assigned');
      setArbitrations(pendingArbitrations);
    } catch (err) {
      console.warn("Could not load arbitrations", err);
    }
  };

  const loadDispatchQueue = async () => {
    try {
      const state = await JulesDispatcher.getActiveState();
      const sortedJobs = Array.from(state.jobs.values()).sort((a,b) => b.createdAt - a.createdAt);
      setDispatchQueue(sortedJobs);
    } catch (err) {
       console.warn("Could not load dispatch queue", err);
    }
  };

  const handleQuickDispatch = async () => {
    try {
      setDispatchLoading(true);
      const result = await JulesDispatcher.createJob({
        categoryId: 'C7',
        repository: 'Life-OS-2026',
        tranche: 'PRD-075-COCKPIT-DISPATCH',
        payloadText: 'Délégation rapide transversale B1',
        writeScopes: [],
        dependencies: []
      });
      if (result.success) {
        await JulesDispatcher.scheduleTick();
        await loadDispatchQueue();
      }
    } catch (err) {
      console.error("Failed to quick dispatch", err);
    } finally {
      setDispatchLoading(false);
    }
  };

  // Calculate 12WY completion
  const completedTactics = tactics.filter(t => t.status === 'completed').length;
  const totalTactics = tactics.length;
  const twelyCompletionRate = totalTactics > 0 ? Math.round((completedTactics / totalTactics) * 100) : 0;

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden">
      <div className="mb-8">
        <h3 className="text-2xl font-black text-white uppercase italic tracking-wider mb-2">
          B1 Summer-Verse Command Cockpit
        </h3>
        <p className="text-sm text-[var(--text-muted)] font-medium">
          Tableau de bord de direction suprême (Amadou Kone)
        </p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8">

        {/* Section 1: Baromètre des 4 franchises */}
        <section className="glass rounded-2xl border border-[var(--glass-border)] p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-[var(--glass-border-subtle)] pb-4">
            <Briefcase className="w-5 h-5 text-[var(--brass)]" />
            <h4 className="text-lg font-bold text-white uppercase tracking-widest">Baromètre des 4 Franchises</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FRANCHISES.map(franchise => (
              <div key={franchise.id} className="bg-[var(--glass-l2-bg)] border border-[var(--glass-border-subtle)] rounded-xl p-4 flex flex-col gap-3">
                <h5 className="text-sm font-black text-white uppercase tracking-wider">{franchise.label}</h5>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[var(--text-muted)]">CA (Trésorerie)</span>
                    <span className="text-[var(--accent-warning)] flex items-center gap-1 font-bold italic">
                      <AlertCircle className="w-3 h-3" />
                      Source non connectée
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[var(--text-muted)]">Santé Opérationnelle</span>
                    <span className="text-[var(--accent-warning)] flex items-center gap-1 font-bold italic">
                      <AlertCircle className="w-3 h-3" />
                      Source non connectée
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[var(--text-muted)]">Complétion 12WY</span>
                    <span className="text-[var(--accent-primary)] font-bold">
                      {totalTactics > 0 ? `${twelyCompletionRate}%` : '0%'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: File d'attente des arbitrages B1 */}
        <section className="glass rounded-2xl border border-[var(--glass-border)] p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-[var(--glass-border-subtle)] pb-4">
            <Target className="w-5 h-5 text-[var(--brass)]" />
            <h4 className="text-lg font-bold text-white uppercase tracking-widest">File d'Arbitrages B1</h4>
          </div>

          {arbitrations.length === 0 ? (
            <div className="bg-[var(--glass-l2-bg)] border border-[var(--glass-border-subtle)] rounded-xl p-6 text-center flex flex-col items-center justify-center gap-2">
              <AlertCircle className="w-6 h-6 text-[var(--accent-warning)] opacity-80" />
              <p className="text-sm text-[var(--accent-warning)] font-bold italic">Source non connectée / Aucun arbitrage</p>
            </div>
          ) : (
             <ul className="space-y-3">
               {arbitrations.map(arb => (
                 <li key={arb.id} className="bg-[var(--glass-l2-bg)] border border-[var(--glass-border-subtle)] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                   <div className="flex flex-col gap-1">
                     <span className="text-xs font-mono text-[var(--text-secondary)]">{arb.id}</span>
                     <span className="text-sm font-bold text-white">Event: {arb.event_type}</span>
                   </div>
                   <div className="text-xs text-[var(--text-muted)]">
                     {new Date(arb.timestamp).toLocaleString()}
                   </div>
                 </li>
               ))}
             </ul>
          )}
        </section>

        {/* Section 3: Déclenchement rapide */}
        <section className="glass rounded-2xl border border-[var(--glass-border)] p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-[var(--glass-border-subtle)] pb-4">
            <PlayCircle className="w-5 h-5 text-[var(--brass)]" />
            <h4 className="text-lg font-bold text-white uppercase tracking-widest">Délégations Jules</h4>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
               <p className="text-sm text-[var(--text-muted)] mb-2">
                 Délégations actives connues localement : <span className="font-bold text-white">{dispatchQueue.length}</span>
               </p>
               <div className="max-h-32 overflow-y-auto custom-scrollbar pr-2">
                 {dispatchQueue.length === 0 ? (
                   <span className="text-xs italic text-[var(--text-muted)]">Aucune délégation dans la file.</span>
                 ) : (
                   <ul className="space-y-2">
                     {dispatchQueue.slice(0,5).map(job => (
                       <li key={job.id} className="flex justify-between items-center bg-[var(--glass-l2-bg)] px-3 py-2 rounded-lg">
                         <span className="text-xs font-mono truncate max-w-[200px] text-[var(--text-secondary)]">{job.id}</span>
                         <span className="text-[10px] font-bold uppercase tracking-wider bg-[var(--brass)]/20 text-[var(--brass)] px-2 py-0.5 rounded">
                           {job.state}
                         </span>
                       </li>
                     ))}
                   </ul>
                 )}
               </div>
            </div>

            <button
              onClick={handleQuickDispatch}
              disabled={dispatchLoading}
              className="bg-[var(--accent-primary)] hover:bg-[#10b981ee] text-black font-black uppercase px-6 py-3 rounded-xl shadow-[0_0_20px_var(--accent-primary-glow)] transition-all disabled:opacity-50 flex items-center justify-center shrink-0"
            >
              {dispatchLoading ? 'Déclenchement...' : 'Déclencher Transversale B1'}
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
