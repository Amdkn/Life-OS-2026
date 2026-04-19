import React, { useMemo, useState } from 'react';
import { useGtdStore, type GTDItem } from '../../../stores/fw-gtd.store';
import { RotateCcw, ArrowRight, Check, X, ShieldAlert, Archive, Trash2 } from 'lucide-react';

export function ClarifyView() {
  const { items, processItem, removeItem } = useGtdStore();
  const [activeItem, setActiveItem] = useState<GTDItem | null>(null);

  const inboxItems = useMemo(() => items.filter(i => i.status === 'inbox'), [items]);

  const handleDecision = async (id: string, patch: Partial<GTDItem>, reasoning: string) => {
    await processItem(id, patch, reasoning);
    setActiveItem(null);
  };

  return (
    <div className="p-10 animate-in fade-in duration-700">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex justify-center items-center border border-amber-500/20">
           <RotateCcw className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-[var(--theme-text)]">Clarify Protocol</h1>
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--theme-text)]/40">Is it actionable? Decision needed for {inboxItems.length} items</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* Inbox List */}
        <div className="col-span-12 lg:col-span-5 space-y-3">
           {inboxItems.map(item => (
             <button 
               key={item.id}
               onClick={() => setActiveItem(item)}
               className={`w-full p-5 rounded-2xl border text-left transition-all flex items-center justify-between group
                 ${activeItem?.id === item.id ? 'bg-[var(--theme-accent)] border-[var(--theme-accent)] shadow-lg' : 'bg-black/40 border-white/5 hover:border-amber-500/30'}
               `}
             >
               <span className={`text-sm font-bold truncate ${activeItem?.id === item.id ? 'text-[var(--theme-bg)]' : 'text-[var(--theme-text)]/80'}`}>
                 {item.content}
               </span>
               <ArrowRight className={`w-4 h-4 transition-transform ${activeItem?.id === item.id ? 'translate-x-1 text-[var(--theme-bg)]' : 'text-white/10 group-hover:text-amber-400'}`} />
             </button>
           ))}
           
           {inboxItems.length === 0 && (
             <div className="text-center py-20 opacity-20 border border-dashed border-white/10 rounded-[2.5rem]">
               <Check className="w-12 h-12 mx-auto mb-4" />
               <p className="text-[10px] uppercase font-bold tracking-widest text-[var(--theme-text)]">Inbox Zero Reached</p>
             </div>
           )}
        </div>

        {/* Decision Console */}
        <div className="col-span-12 lg:col-span-7">
           {activeItem ? (
             <div className="glass-card rounded-[2.5rem] bg-black/20 border-white/5 p-10 sticky top-10">
                <h2 className="text-2xl font-black text-[var(--theme-text)] mb-6 leading-tight">"{activeItem.content}"</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <DecisionButton 
                     icon={Check} 
                     label="Actionable" 
                     sub="Move to Organize" 
                     color="emerald" 
                     onClick={() => handleDecision(activeItem.id, { status: 'actionable' }, 'Determined as actionable')} 
                   />
                   <DecisionButton 
                     icon={ShieldAlert} 
                     label="Incubate" 
                     sub="Sometime / Maybe" 
                     color="blue" 
                     onClick={() => handleDecision(activeItem.id, { status: 'incubating' }, 'Sent to Someday/Maybe')} 
                   />
                   <DecisionButton 
                     icon={Archive} 
                     label="Reference" 
                     sub="Knowledge Base" 
                     color="purple" 
                     onClick={() => handleDecision(activeItem.id, { status: 'reference' }, 'Saved as reference data')} 
                   />
                   <DecisionButton 
                     icon={Trash2} 
                     label="Trash" 
                     sub="Erase Item" 
                     color="rose" 
                     onClick={() => removeItem(activeItem.id)} 
                   />
                </div>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center opacity-10 py-20 border border-dashed border-white/10 rounded-[2.5rem]">
                <RotateCcw className="w-20 h-20 mb-6" />
                <p className="text-xs uppercase font-bold tracking-[0.4em]">Select item to clarify</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

function DecisionButton({ icon: Icon, label, sub, color, onClick }: any) {
  const colorMap: any = {
    emerald: 'hover:bg-emerald-500 hover:border-emerald-500 text-emerald-400',
    blue: 'hover:bg-blue-500 hover:border-blue-500 text-blue-400',
    purple: 'hover:bg-purple-500 hover:border-purple-500 text-purple-400',
    rose: 'hover:bg-rose-500 hover:border-rose-500 text-rose-400'
  };

  return (
    <button 
      onClick={onClick}
      className={`p-6 rounded-3xl bg-white/[0.02] border border-white/5 transition-all text-left group ${colorMap[color]}`}
    >
       <Icon className="w-6 h-6 mb-4 transition-colors group-hover:text-[var(--theme-bg)]" />
       <p className="font-black uppercase tracking-widest text-xs group-hover:text-[var(--theme-bg)]">{label}</p>
       <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 group-hover:text-[var(--theme-bg)] mt-1">{sub}</p>
    </button>
  );
}
