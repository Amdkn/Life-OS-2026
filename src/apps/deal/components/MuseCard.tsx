import { DollarSign, AlertTriangle, Activity, Trash } from 'lucide-react';
import type { Muse } from '../../../stores/fw-deal.store';
import { useDealStore } from '../../../stores/fw-deal.store';
import { ExecutionTrigger } from './ExecutionTrigger';

interface MuseCardProps {
  muse: Muse;
}

export function MuseCard({ muse }: MuseCardProps) {
  const isFailing = muse.status === 'failing';
  const isDeprecated = muse.status === 'deprecated';
  const decommissionMuse = useDealStore(s => s.decommissionMuse);

  return (
    <div className={`glass-card rounded-[2rem] p-8 border-white/5 transition-all group border hover:border-emerald-500/20 shadow-2xl relative overflow-hidden flex flex-col min-h-[260px] ${isDeprecated ? 'opacity-50 grayscale' : 'bg-emerald-500/[0.02] hover:bg-emerald-500/[0.05]'}`}>
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <DollarSign className="w-6 h-6 text-emerald-400" />
        </div>
        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase ${isFailing ? 'border-red-500/20 text-red-400' : 'border-emerald-500/20 text-emerald-400'}`}>
          {muse.status}
        </span>
      </div>
      
      <h3 className="text-base font-bold text-[var(--theme-text)]/90 uppercase tracking-wider mb-2">{muse.title}</h3>
      
      <div className="flex justify-between items-center mt-2">
        <div>
          <p className="text-[10px] font-bold text-[var(--theme-text)]/20 uppercase tracking-widest">Revenue</p>
          <p className="text-lg font-black text-emerald-400">${muse.revenueEstimate}<span className="text-[10px] font-bold">/mo</span></p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-[var(--theme-text)]/20 uppercase tracking-widest">Time Cost</p>
          <p className="text-sm font-bold text-[var(--theme-text)]/60">{muse.timeCost}h/wk</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-3 bg-white/5 border border-white/10 rounded-xl mt-6">
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
          <span className="text-white/40">Build Cost</span>
          <span className="text-white"> {muse.buildCost} hrs </span>
        </div>
        
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
          <span className="text-white/40">MCO Status</span>
          {isFailing ? (
            <span className="text-red-400 flex items-center gap-1 animate-pulse"><AlertTriangle className="w-3 h-3"/> FAILING</span>
          ) : muse.status === 'operational' ? (
            <span className="text-emerald-400 flex items-center gap-1"><Activity className="w-3 h-3"/> OPERATIONAL</span>
          ) : (
            <span className="text-blue-400 uppercase">{muse.status}</span>
          )}
        </div>
      </div>

      {!isDeprecated && <ExecutionTrigger muse={muse} />}

      {!isDeprecated ? (
        <button 
          onClick={() => {
            if (window.confirm('Retire this drone from the active fleet?')) {
              decommissionMuse(muse.id);
            }
          }}
          className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-[10px] uppercase font-bold tracking-[0.2em] transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash className="w-3.5 h-3.5" /> Decommission Drone
        </button>
      ) : (
        <div className="mt-6 text-center text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] border border-dashed border-white/10 py-3 rounded-xl">
           Honorably Discharged
        </div>
      )}
    </div>
  );
}
