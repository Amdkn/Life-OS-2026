import React, { useState } from 'react';
import { Target, ChevronDown } from 'lucide-react';
import { useParaStore, type Project } from '../../../stores/fw-para.store';
import { useTwelveWeekStore } from '../../../stores/fw-12wy.store';

export function GoalAligner({ project }: { project: Project }) {
  const [isOpen, setIsOpen] = useState(false);
  const allGoals = useTwelveWeekStore(s => s.goals);
  const currentGoal = allGoals.find(g => g.id === project.twelveWeekGoalId);
  const updateProject = useParaStore(s => s.updateProject);

  const handleAlign = async (goalId: string) => {
    // Si clique sur celui déjà actif, on annule
    const newId = goalId === project.twelveWeekGoalId ? undefined : goalId;
    await updateProject(project.id, { twelveWeekGoalId: newId });
    setIsOpen(false);
  };

  return (
    <div className="relative mt-2">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center gap-2 px-3 py-1.5 bg-teal-500/5 hover:bg-teal-500/10 border border-teal-500/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-teal-400 transition-colors shadow-sm"
      >
        <Target className="w-3 h-3" />
        {currentGoal ? `Quarterly: ${currentGoal.title}` : 'Align to 12WY Goal'}
        <ChevronDown className={`w-3 h-3 opacity-50 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
           <h5 className="text-[8px] uppercase tracking-widest text-white/30 px-2 py-1 mb-1 font-bold">Select 12 Week Goal</h5>
           <div className="max-h-40 overflow-auto custom-scrollbar">
             {allGoals.map(g => (
               <button 
                 key={g.id} 
                 onClick={() => handleAlign(g.id)}
                 className={`w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-white/5 truncate transition-colors ${g.id === currentGoal?.id ? 'text-teal-400 font-bold bg-teal-500/5' : 'text-white/60'}`}
               >
                 [W{g.targetWeek}] {g.title}
               </button>
             ))}
             {allGoals.length === 0 && (
               <div className="px-2 py-4 text-center">
                 <span className="text-[10px] text-white/20 italic">No goals found in protocol.</span>
               </div>
             )}
           </div>
        </div>
      )}
    </div>
  );
}
