/** 12 Week Year Dashboard — Strategic Overview (V0.6.1) */
import React, { useMemo } from 'react';
import { useTwelveWeekStore } from '../../../stores/fw-12wy.store';
import { 
  Trophy, Target, Zap, Calendar, 
  Activity, Compass
} from 'lucide-react';
import { clsx } from 'clsx';

import { MeasurementBar } from '../components/MeasurementBar';
import { TimeUseMatrix } from '../components/TimeUseMatrix';
import { GoalCommandCard } from '../components/GoalCommandCard';

interface TwelveWeekDashboardProps {
  embedded?: boolean;
}

export default function TwelveWeekDashboard({ embedded }: TwelveWeekDashboardProps) {
  const { visions, goals, tactics, activeWeek, activeGoalId, setActiveGoalId } = useTwelveWeekStore();
  
  if (activeGoalId) {
    return <GoalCommandCard goalId={activeGoalId} />;
  }

  const currentWeek = activeWeek === 'all' ? 1 : activeWeek;

  return (
    <div className={clsx(
      "flex-1 flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-8 duration-1000",
      embedded ? "p-0" : "p-10"
    )}>
      {/* Execution Matrix Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard label="Active Goals" value={goals.length} icon={Target} color="text-teal-400" />
        <KpiCard label="Strategic Visions" value={visions.length} icon={Compass} color="text-amber-400" />
        <KpiCard label="Tactics Total" value={tactics.length} icon={Zap} color="text-emerald-400" />
        <KpiCard label="Current Week" value={`W${currentWeek}`} icon={Calendar} color="text-blue-400" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Weekly Performance Timeline */}
        <div className="col-span-12 lg:col-span-8 glass-card rounded-[2.5rem] bg-black/40 border-white/5 p-8">
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-[var(--theme-text)]/60">Execution Timeline</h3>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">W1 - W12 Performance Radar</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {Array.from({ length: 12 }, (_, i) => (
              <MeasurementBar key={i + 1} weekNumber={i + 1} />
            ))}
          </div>

          <div className="mt-12">
             <TimeUseMatrix week={currentWeek} />
          </div>
        </div>

        {/* Tactical Focus */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          <div className="glass-card rounded-[2.5rem] bg-teal-500/[0.02] border-teal-500/10 p-8 flex-1">
            <div className="flex items-center gap-4 mb-8">
              <Zap className="w-5 h-5 text-teal-400" />
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-teal-400/80">Tactical Priority</h3>
            </div>
            <div className="space-y-4">
              {goals.slice(0, 3).map(goal => (
                <div 
                  key={goal.id} 
                  onClick={() => setActiveGoalId(goal.id)}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.05] hover:border-teal-500/30 transition-all cursor-pointer"
                >
                  <h4 className="text-[11px] font-bold text-[var(--theme-text)]/80 uppercase tracking-wider mb-1 group-hover:text-teal-400 transition-colors">{goal.title}</h4>
                  <p className="text-[8px] text-[var(--theme-text)]/20 font-bold uppercase tracking-widest">W{goal.targetWeek}</p>
                </div>
              ))}
              {goals.length === 0 && (
                <p className="text-[10px] text-white/10 italic text-center py-8">No goals forged yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, icon: Icon, color }: any) {
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
        <p className="text-[9px] font-bold text-[var(--theme-text)]/30 uppercase tracking-[0.2em] mb-0.5">{label}</p>
        <p className="text-xl font-black text-[var(--theme-text)]/90 tracking-tighter">{value}</p>
      </div>
    </div>
  );
}
