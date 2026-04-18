import React from 'react';
import { Target, Inbox, Coffee } from 'lucide-react';
import { useTwelveWeekStore, type TimeBlockType } from '../../../stores/fw-12wy.store';
import { useDealStore } from '../../../stores/fw-deal.store';
import { useMemo } from 'react';

const BLOCKS = [
  { type: 'strategic' as TimeBlockType, label: 'Strategic (3h Focus)', icon: Target, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  { type: 'buffer' as TimeBlockType, label: 'Buffer (Admin/Comm)', icon: Inbox, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { type: 'breakout' as TimeBlockType, label: 'Breakout (Recharge)', icon: Coffee, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
];

export function TimeUseMatrix({ week }: { week: number }) {
  const allTimeBlocks = useTwelveWeekStore(s => s.timeBlocks);
  const timeBlocks = allTimeBlocks.filter(b => b.week === week);
  const toggleTimeBlock = useTwelveWeekStore(s => s.toggleTimeBlock);
  const addTimeBlock = useTwelveWeekStore(s => s.addTimeBlock);

  const muses = useDealStore(s => s.muses);
  const totalMuseTax = useMemo(() => {
    return muses
       .filter(m => m.status === 'operational') 
       .reduce((acc, m) => acc + (m.timeCost || 0), 0);
  }, [muses]);

  // Auto-Générateur si un bloc n'existe pas pour la semaine
  const handleBlockEnsure = async (type: TimeBlockType) => {
    const existing = timeBlocks.find(b => b.blockType === type);
    if (existing) {
       await toggleTimeBlock(existing.id);
    } else {
       await addTimeBlock({
         id: crypto.randomUUID(), type: 'wy-timeblock', status: 'active',
         title: `${type} W${week}`, week, blockType: type, completed: true, 
         description: '', updatedAt: Date.now(), createdAt: Date.now()
       } as any);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-black/40 border border-white/5 shadow-xl backdrop-blur-md">
       <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-4 px-1">Time Use Matrix</h4>
       <div className="grid grid-cols-3 gap-4">
         {BLOCKS.map(def => {
           const block = timeBlocks.find(b => b.blockType === def.type);
           const isDone = block?.completed;

           return (
             <button 
                key={def.type}
                onClick={() => handleBlockEnsure(def.type)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${isDone ? `${def.bg} ${def.border}` : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10'}`}
             >
                <def.icon className={`w-5 h-5 mb-2 transition-transform ${isDone ? `${def.color} scale-110` : 'text-white/20'}`} />
                <span className={`text-[9px] uppercase tracking-widest font-black text-center leading-tight ${isDone ? def.color : 'text-white/40'}`}>{def.label}</span>
                {isDone && (
                  <div className="mt-3 flex flex-col items-center gap-1">
                    <span className="text-[7px] font-black bg-white/10 px-2 py-0.5 rounded text-white/60 tracking-tighter uppercase">LOCKED</span>
                  </div>
                )}
             </button>
           );
         })}
       </div>

       {totalMuseTax > 0 && (
         <div className="flex justify-between items-center px-5 py-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl mt-6 shadow-[0_0_15px_rgba(244,63,94,0.05)]">
           <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-[0.2em]">Muses Maintenance Tax</span>
           </div>
           <span className="text-sm font-black text-rose-500 font-mono">{totalMuseTax} h / week</span>
         </div>
       )}
    </div>
  );
}
