import React, { useMemo } from 'react';
import { ArrowLeft, Compass, Target, Box } from 'lucide-react';
import { useTwelveWeekStore } from '../../../stores/fw-12wy.store';
import { useIkigaiStore } from '../../../stores/fw-ikigai.store';
import { useLifeWheelStore } from '../../../stores/fw-wheel.store';

export function VisionCommandCard({ visionId }: { visionId: string }) {
  const setActiveVisionId = useTwelveWeekStore(s => s.setActiveVisionId);
  const setActiveGoalId = useTwelveWeekStore(s => s.setActiveGoalId); 
  
  const allVisions = useTwelveWeekStore(s => s.visions);
  const vision = allVisions.find(v => v.id === visionId);
  
  const allGoals = useTwelveWeekStore(s => s.goals);
  const childGoals = allGoals.filter(g => g.visionId === visionId);
  
  const allTactics = useTwelveWeekStore(s => s.tactics);

  const ikigaiVisions = useIkigaiStore(s => s.visions);
  const ikigaiRef = ikigaiVisions.find(v => v.id === vision?.ikigaiVisionId);
  
  const wheelDomains = useLifeWheelStore(s => s.domains);
  const domainRef = wheelDomains.find(v => v.id === vision?.domainId);

  if (!vision) return null;

  return (
    <div className="flex-1 flex flex-col p-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Header and Back Button */}
      <button 
        onClick={() => setActiveVisionId(null)}
        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white/80 transition-colors mb-8 w-max"
      >
        <ArrowLeft className="w-3 h-3" /> System Overview
      </button>

      {/* The Constitution Nexus Layer */}
      <div className="flex items-end justify-between mb-8 pb-8 border-b border-white/10">
        <div className="flex gap-4 items-center">
           <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex justify-center items-center shadow-[0_0_30px_rgba(245,158,11,0.15)]">
             <Compass className="w-8 h-8 text-amber-500" />
           </div>
           <div>
             <h1 className="text-4xl font-black text-white tracking-tight">{vision.title}</h1>
             <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500/80 bg-amber-500/10 px-2 py-0.5 rounded">3-Year Horizon</span>
                {domainRef && <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">{domainRef.name} Domain</span>}
             </div>
           </div>
        </div>
        
        {ikigaiRef && (
          <div className="text-right">
             <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Ikigai Protocol Nexus</p>
             <p className="text-sm font-bold text-white/80 mt-1">{ikigaiRef.title}</p>
          </div>
        )}
      </div>

      {/* Child Goals Grid */}
      <div>
         <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/50 mb-6 flex items-center gap-2">
           <Target className="w-4 h-4 text-teal-400" /> Tactical Goals (12-Week Sprints)
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {childGoals.map(goal => {
               const gTactics = allTactics.filter(t => t.goalId === goal.id);
               const done = gTactics.filter(t => t.status === 'completed').length;
               const progress = gTactics.length ? (done / gTactics.length) * 100 : 0;
               return (
                  <div 
                    key={goal.id} 
                    onClick={() => setActiveGoalId?.(goal.id)}
                    className="p-6 rounded-3xl bg-black/40 border border-white/10 hover:border-teal-500/40 hover:bg-[#111] transition-all cursor-pointer group shadow-xl"
                  >
                    <div className="flex justify-between items-start mb-4">
                       <h3 className="font-bold text-white/90 group-hover:text-teal-400 transition-colors">{goal.title}</h3>
                       <span className="text-[9px] font-black tracking-widest bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded">W{goal.targetWeek}</span>
                    </div>
                    
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-6">
                       <div className="h-full bg-teal-400 transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex justify-between mt-2">
                       <span className="text-[9px] uppercase tracking-widest text-white/30">{done} / {gTactics.length} Tactics</span>
                       <span className="text-[9px] font-bold text-teal-400">{Math.round(progress)}%</span>
                    </div>
                  </div>
               );
            })}
         </div>

         {childGoals.length === 0 && (
           <div className="w-full p-12 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center opacity-50">
             <Target className="w-8 h-8 text-white/20 mb-4" />
             <p className="text-sm font-medium text-white/60">No goals forged for this horizon.</p>
             <p className="text-[10px] uppercase tracking-widest text-teal-500 font-bold mt-2 cursor-pointer">Deploy Target Now</p>
           </div>
         )}
      </div>

    </div>
  );
}
