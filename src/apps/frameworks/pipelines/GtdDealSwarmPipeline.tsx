import React, { useState, useEffect } from 'react';
import { useGtdStore, GTDItem } from '../../../stores/fw-gtd.store';
import { useDealStore } from '../../../stores/fw-deal.store';
import { useTwelveWeekStore } from '../../../stores/fw-12wy.store';
import { recordActionReceipt } from '../../../lib/blackboard/client';
import { Zap, Play, CheckCircle2, Activity, ShieldAlert, Cpu } from 'lucide-react';

interface TelemetryData {
  timeMs: number;
  tokens: string;
  itemsProcessed: number;
  dealRoutes: number;
  twelveWyRoutes: number;
}

export function GtdDealSwarmPipeline() {
  const gtdStore = useGtdStore();
  const dealStore = useDealStore();
  const wyStore = useTwelveWeekStore();

  const [isRunning, setIsRunning] = useState(false);
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);

  // A1 Beth Qualification logic
  const qualifyItem = (item: GTDItem): 'DEAL' | '12WY' => {
    const text = item.content.toLowerCase();
    if (text.includes('automate') || text.includes('eliminate') || text.includes('delegate') || text.includes('friction') || text.includes('deal')) {
      return 'DEAL';
    }
    return '12WY';
  };

  const runPipeline = async () => {
    if (isRunning) return;
    setIsRunning(true);

    const startTime = Date.now();
    const inboxItems = gtdStore.items.filter(i => i.status === 'inbox');

    let dealRoutes = 0;
    let twelveWyRoutes = 0;

    for (const item of inboxItems) {
      const destination = qualifyItem(item);

      if (destination === 'DEAL') {
        await dealStore.absorbGtdTaskAsFriction(item.content, item.context, 'GtdDealSwarmPipeline');
        dealRoutes++;
      } else {
        const defaultVisionId = wyStore.visions?.[0]?.id || 'vision-placeholder';
        const newGoalId = crypto.randomUUID();

        await wyStore.addGoal({
          id: newGoalId,
          type: 'wy-goal',
          title: item.content,
          description: 'Promoted via GTD->12WY Pipeline',
          visionId: defaultVisionId,
          targetWeek: 1,
          status: 'pending',
          updatedAt: Date.now(),
          createdAt: Date.now()
        });

        const newTacticId = crypto.randomUUID();
        await wyStore.addTactic({
          id: newTacticId,
          type: 'wy-tactic',
          title: item.content,
          description: 'Promoted via GTD->12WY Pipeline',
          goalId: newGoalId,
          week: 1,
          status: 'pending',
          updatedAt: Date.now(),
          createdAt: Date.now()
        });

        twelveWyRoutes++;
      }

      await gtdStore.processItem(item.id, { status: 'completed' }, `Routed to ${destination} via Autonomous Pipeline`);

      // Save receipt to blackboard
      await recordActionReceipt(
        null,
        'a1-beth',
        'A1',
        {
          action: 'swarm_pipeline_route',
          itemId: item.id,
          destination,
          content: item.content
        }
      ).catch(e => console.error("Failed to record action receipt", e));
    }

    const timeMs = Date.now() - startTime;
    setTelemetry({
      timeMs,
      tokens: 'non mesuré',
      itemsProcessed: inboxItems.length,
      dealRoutes,
      twelveWyRoutes
    });

    setIsRunning(false);
  };

  const inboxCount = gtdStore.items.filter(i => i.status === 'inbox').length;

  return (
    <div className="p-8 glass-card rounded-[2.5rem] bg-black/40 border border-white/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Cpu className="w-40 h-40" />
      </div>

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex justify-center items-center border border-purple-500/20">
             <Zap className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Autonomous Swarm Pipeline</h2>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40">GTD Cerritos x DEAL Protostar</p>
          </div>
        </div>

        <div className="bg-black/40 p-6 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white/80">Pending Inbox Items</h3>
            <p className="text-3xl font-black text-white">{inboxCount}</p>
          </div>

          <button
            onClick={runPipeline}
            disabled={isRunning || inboxCount === 0}
            className={`px-6 py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all ${
              isRunning ? 'bg-white/10 text-white/40 cursor-not-allowed' :
              inboxCount === 0 ? 'bg-white/5 text-white/20 cursor-not-allowed' :
              'bg-purple-500 text-white hover:bg-purple-400 hover:scale-105 shadow-lg shadow-purple-500/20'
            }`}
          >
            {isRunning ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Processing...' : 'Engage Swarm'}
          </button>
        </div>

        {telemetry && (
          <div className="bg-black/40 p-6 rounded-2xl border border-white/5 mt-4">
             <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-4 flex items-center gap-2">
               <ShieldAlert className="w-4 h-4 text-purple-400" />
               Telemetry Report
             </h3>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                 <div className="text-2xl font-black text-white">{telemetry.timeMs}ms</div>
                 <div className="text-[9px] uppercase font-bold tracking-widest text-white/40 mt-1">Time Saved</div>
               </div>
               <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                 <div className="text-2xl font-black text-white">{telemetry.tokens}</div>
                 <div className="text-[9px] uppercase font-bold tracking-widest text-white/40 mt-1">Tokens Used</div>
               </div>
               <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                 <div className="text-2xl font-black text-emerald-400">{telemetry.dealRoutes}</div>
                 <div className="text-[9px] uppercase font-bold tracking-widest text-white/40 mt-1">DEAL Routes</div>
               </div>
               <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                 <div className="text-2xl font-black text-blue-400">{telemetry.twelveWyRoutes}</div>
                 <div className="text-[9px] uppercase font-bold tracking-widest text-white/40 mt-1">12WY Routes</div>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
