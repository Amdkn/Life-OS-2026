import React from 'react';
import { useWeeklyScore } from '../hooks/useWeeklyScore';

export function MeasurementBar({ weekNumber }: { weekNumber: number }) {
  const { score, status, hasTactics } = useWeeklyScore(weekNumber);

  if (!hasTactics || score === null) {
     return (
       <div className="w-full h-8 bg-white/5 rounded-xl border border-dashed border-white/10 flex items-center justify-center">
         <span className="text-[9px] uppercase tracking-widest text-white/20">Non mesuré</span>
       </div>
     );
  }

  // CSS Conditionnel basé sur `status`
  const barColor = status === 'green' ? 'bg-emerald-500' : (status === 'yellow' ? 'bg-amber-400' : 'bg-rose-500');
  const shadowColor = status === 'green' ? 'rgba(16, 185, 129, 0.4)' : (status === 'yellow' ? 'rgba(251, 191, 36, 0.4)' : 'rgba(244, 63, 94, 0.4)');
  const textColor = status === 'green' ? 'text-emerald-500' : (status === 'yellow' ? 'text-amber-400' : 'text-rose-500');

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

       {status === 'red' && score > 0 && (
         <p className="mt-2 text-[8px] uppercase tracking-widest text-rose-500/70">
           Warning: Execution below 70% critical threshold.
         </p>
       )}
       {status === 'yellow' && score > 0 && (
         <p className="mt-2 text-[8px] uppercase tracking-widest text-amber-400/70">
           Warning: Execution below 85% optimal threshold.
         </p>
       )}
    </div>
  );
}
