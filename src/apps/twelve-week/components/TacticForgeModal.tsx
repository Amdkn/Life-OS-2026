import React, { useState } from 'react';
import { X, Zap, ArrowRightSquare } from 'lucide-react';
import { useTwelveWeekStore } from '../../../stores/fw-12wy.store';

interface TacticForgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledGoalId?: string;
  prefilledWeek?: number;
}

export function TacticForgeModal({ isOpen, onClose, prefilledGoalId, prefilledWeek }: TacticForgeModalProps) {
  const [title, setTitle] = useState('');
  const [goalId, setGoalId] = useState<string>(prefilledGoalId || '');
  const [targetWeek, setTargetWeek] = useState(prefilledWeek || 1);
  const [sendToGtd, setSendToGtd] = useState(false); // V0.7 Placeholder
  
  const addTactic = useTwelveWeekStore(s => s.addTactic);
  const goals = useTwelveWeekStore(s => s.goals);

  if (!isOpen) return null;

  const handleForge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !goalId) return;

    await addTactic({
      id: crypto.randomUUID(),
      type: 'wy-tactic',
      title,
      goalId,
      week: targetWeek,
      status: 'pending',
      domain: 'life',
      pillars: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    } as any);

    // TODO: V0.7 GTD Nexus
    if (sendToGtd) {
      console.log(`[V0.7 PREP] Tactic "${title}" should generate a Next Action in GTD Inbox`);
    }

    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-[500px] bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-white font-bold tracking-wide">Deploy Tactic</h2>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-black">12WY - Weekly Execution</p>
          </div>
        </div>

        <form onSubmit={handleForge} className="space-y-6">
          <div className="space-y-2">
            <input 
              autoFocus
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Write Chapter 1 (2,000 words)"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-emerald-400/50 focus:bg-white/10 transition-all font-medium"
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/60 font-bold ml-1">Parent Goal</label>
              <select 
                value={goalId} 
                onChange={e => setGoalId(e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400/50 font-medium cursor-pointer"
              >
                <option value="" disabled>-- Select Goal --</option>
                {goals.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/60 font-bold ml-1 mb-2 block">Execution Week</label>
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(w => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setTargetWeek(w)}
                    className={`h-10 rounded-lg text-xs font-bold font-mono transition-all ${w === targetWeek ? 'bg-emerald-500 text-black scale-105 shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}
                  >
                    W{w}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* V0.7 GTD Nexus Toggle */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                 <ArrowRightSquare className="w-4 h-4 text-indigo-400" />
               </div>
               <div>
                  <h4 className="text-[11px] font-bold text-white/80">Send to GTD Inbox</h4>
                  <p className="text-[8px] uppercase tracking-widest text-white/30 font-bold">Auto-Generate Next Actions</p>
               </div>
             </div>
             
             <button 
                type="button"
                onClick={() => setSendToGtd(!sendToGtd)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${sendToGtd ? 'bg-indigo-500' : 'bg-white/10'}`}
             >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${sendToGtd ? 'translate-x-6' : 'translate-x-0'}`} />
             </button>
          </div>

          <button 
            type="submit" 
            disabled={!title.trim() || !goalId}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            Deploy Tactic
          </button>
        </form>
      </div>
    </div>
  );
}
