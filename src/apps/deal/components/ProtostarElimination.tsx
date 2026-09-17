import { useState } from 'react';
import { useDealStore } from '../../../stores/fw-deal.store';
import { useTwelveWeekStore, type WyTactic } from '../../../stores/fw-12wy.store';
import { Zap, Clock, ShieldAlert, Check, X, Trash2 } from 'lucide-react';

export function ProtostarElimination() {
  const { automationRate, hoursLiberated, items, absorb12wyTacticAsFriction, deleteItem } = useDealStore();
  const { tactics } = useTwelveWeekStore(); // We'll just load them for display/absorption

  const [tacticToAbsorb, setTacticToAbsorb] = useState<string>('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const activeItems = items.filter(i => i.status === 'active');
  const availableTactics = tactics.filter(t => t.status === 'pending');

  const handleAbsorb = async () => {
    if (!tacticToAbsorb) return;
    const t = availableTactics.find(t => t.id === tacticToAbsorb);
    if (!t) return;

    await absorb12wyTacticAsFriction(t.id, t.title, '12WY Tactic');
    setTacticToAbsorb('');
  };

  const handleDelete = async (id: string) => {
    if (confirmDeleteId === id) {
      await deleteItem(id, true);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
      <div className="grid grid-cols-2 gap-6">
        <div className="glass-card p-6 border border-white/5 rounded-2xl flex items-center gap-4 bg-black/20">
          <div className="p-4 bg-blue-500/10 text-blue-400 rounded-xl">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <div className="text-sm text-white/40 uppercase tracking-widest font-bold">Automation Rate</div>
            <div className="text-4xl font-black text-white/90">{automationRate}%</div>
          </div>
        </div>

        <div className="glass-card p-6 border border-white/5 rounded-2xl flex items-center gap-4 bg-black/20">
          <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <div className="text-sm text-white/40 uppercase tracking-widest font-bold">Hours Liberated</div>
            <div className="text-4xl font-black text-white/90">{hoursLiberated}h</div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 border border-white/10 rounded-2xl bg-black/40">
        <h3 className="text-lg font-bold text-white/80 mb-4 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          Absorb 12WY Tactics as Friction
        </h3>

        <div className="flex gap-4">
          <select
            value={tacticToAbsorb}
            onChange={(e) => setTacticToAbsorb(e.target.value)}
            className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white/80 focus:outline-none focus:border-rose-500/50"
          >
            <option value="">Select a pending tactic...</option>
            {availableTactics.map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
          <button
            onClick={handleAbsorb}
            disabled={!tacticToAbsorb}
            className="px-6 py-2 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl hover:bg-rose-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold tracking-wider text-sm"
          >
            ABSORB
          </button>
        </div>
      </div>

      <div className="glass-card p-6 border border-white/5 rounded-2xl bg-black/20">
         <h3 className="text-lg font-bold text-white/80 mb-4">Pipeline Audit (Active)</h3>
         <div className="flex flex-col gap-3">
           {activeItems.length === 0 ? (
             <div className="text-center text-white/40 py-8">No active frictions in pipeline.</div>
           ) : (
             activeItems.map(item => (
               <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                 <div>
                   <div className="text-sm font-bold text-white/90">{item.title}</div>
                   <div className="text-xs text-white/40 uppercase tracking-wider flex gap-3 mt-1">
                     <span className="text-amber-400/80">Step: {item.step}</span>
                     <span>Score: {item.frictionScore}%</span>
                     {item.source && <span className="text-emerald-400/80">SRC: {item.source}</span>}
                   </div>
                 </div>

                 <div className="flex items-center gap-2">
                   {confirmDeleteId === item.id ? (
                     <div className="flex items-center gap-2 animate-in slide-in-from-right-2">
                       <button
                         onClick={() => handleDelete(item.id)}
                         className="p-2 bg-rose-500/20 text-rose-400 rounded-lg hover:bg-rose-500/40"
                         title="Confirm Delete"
                       >
                         <Check className="w-4 h-4" />
                       </button>
                       <button
                         onClick={() => setConfirmDeleteId(null)}
                         className="p-2 bg-white/10 text-white/60 rounded-lg hover:bg-white/20"
                         title="Cancel"
                       >
                         <X className="w-4 h-4" />
                       </button>
                     </div>
                   ) : (
                     <button
                       onClick={() => handleDelete(item.id)}
                       className="p-2 text-white/20 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                       title="Delete Data (Requires Confirmation)"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                   )}
                 </div>
               </div>
             ))
           )}
         </div>
      </div>
    </div>
  );
}
