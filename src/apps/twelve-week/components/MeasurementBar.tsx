import React from 'react';
import { useWeeklyScore } from '../hooks/useWeeklyScore';
import { useTwelveWeekStore } from '../../../stores/fw-12wy.store';

export function MeasurementBar({ weekNumber }: { weekNumber: number }) {
  const { score, isCrit, hasTactics } = useWeeklyScore(weekNumber);

  // D1 verify (2026-06-22, Chapel SNW canon): Lead/Lag breakdown — Moran 12WY best practice.
  // Lead indicator = tactics completed this week (predicts Rock achievement).
  // Lag indicator = Rocks (WyGoals) achieved for this week (confirms past outcome).
  const goals = useTwelveWeekStore(s => s.goals);
  const tactics = useTwelveWeekStore(s => s.tactics);

  const leadCompleted = tactics.filter(t => t.week === weekNumber && t.status === 'completed').length;
  const leadTotal = tactics.filter(t => t.week === weekNumber).length;
  const lagAchieved = goals.filter(g => g.targetWeek === weekNumber && g.status === 'achieved').length;
  const lagPlanned = goals.filter(g => g.targetWeek === weekNumber).length;
  const leadPct = leadTotal > 0 ? Math.round((leadCompleted / leadTotal) * 100) : 0;
  const lagPct = lagPlanned > 0 ? Math.round((lagAchieved / lagPlanned) * 100) : 0;

  // Pike H10 alignment: score >= 85% on track with Quarter Intent, else Drift detected.
  const pikeOnTrack = score >= 85;

  if (!hasTactics) {
     return (
       <div className="w-full h-8 bg-white/5 rounded-xl border border-dashed border-white/10 flex items-center justify-center">
         <span className="text-[9px] uppercase tracking-widest text-white/20">No Execution Plan</span>
       </div>
     );
  }

  // CSS Conditionnel basé sur `isCrit` (< 85%)
  const barColor = isCrit ? 'bg-rose-500' : 'bg-emerald-500';
  const shadowColor = isCrit ? 'rgba(244, 63, 94, 0.4)' : 'rgba(16, 185, 129, 0.4)';
  const textColor = isCrit ? 'text-rose-500' : 'text-emerald-500';

  return (
    <div className="relative w-full">
       <div className="flex justify-between items-end mb-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">W{weekNumber} Execution</span>
          <span className={`text-lg font-black ${textColor}`}>{score}%</span>
       </div>

       <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
          <div
            className={`absolute top-0 left-0 h-full transition-all duration-700 ease-out ${barColor}`}
            style={{ width: `${score}%`, boxShadow: `0 0 10px ${shadowColor}` }}
          />
       </div>

       {/* Pike H10 Vision alignment badge — Chapel SNW canon (2026-06-22) */}
       <div className={`mt-2 flex items-center gap-1.5 text-[8px] uppercase tracking-widest ${pikeOnTrack ? 'text-emerald-400/70' : 'text-rose-400/70'}`}>
         <span className={`inline-block w-1.5 h-1.5 rounded-full ${pikeOnTrack ? 'bg-emerald-400' : 'bg-rose-400'}`} />
         {pikeOnTrack
           ? 'On track with Quarter Intent Q3 2026'
           : 'Drift detected — re-anchor on Pike H10 Vision'}
       </div>

       {/* Lead/Lag breakdown — Chapel SNW canon (2026-06-22) */}
       <div className="mt-2 grid grid-cols-2 gap-2">
         <div className="rounded-lg border border-white/5 bg-white/[0.02] px-2 py-1.5">
           <div className="flex items-center justify-between">
             <span className="text-[8px] uppercase tracking-widest text-white/40">Lead · Tactics</span>
             <span className="text-[10px] font-bold text-white/70">{leadPct}%</span>
           </div>
           <div className="mt-1 w-full h-1 bg-white/5 rounded-full overflow-hidden">
             <div className="h-full bg-sky-400/70 transition-all duration-700 ease-out" style={{ width: `${leadPct}%` }} />
           </div>
           <div className="mt-0.5 text-[7px] text-white/30">{leadCompleted}/{leadTotal} completed</div>
         </div>
         <div className="rounded-lg border border-white/5 bg-white/[0.02] px-2 py-1.5">
           <div className="flex items-center justify-between">
             <span className="text-[8px] uppercase tracking-widest text-white/40">Lag · Rocks</span>
             <span className="text-[10px] font-bold text-white/70">{lagPct}%</span>
           </div>
           <div className="mt-1 w-full h-1 bg-white/5 rounded-full overflow-hidden">
             <div className="h-full bg-amber-400/70 transition-all duration-700 ease-out" style={{ width: `${lagPct}%` }} />
           </div>
           <div className="mt-0.5 text-[7px] text-white/30">{lagAchieved}/{lagPlanned} achieved</div>
         </div>
       </div>

       {isCrit && score > 0 && (
         <p className="mt-2 text-[8px] uppercase tracking-widest text-rose-500/70">
           Warning: Execution below 85% critical threshold.
         </p>
       )}
    </div>
  );
}
