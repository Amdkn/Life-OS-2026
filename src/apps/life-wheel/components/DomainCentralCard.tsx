import React from 'react';
import { X, Target, Flame, Activity } from 'lucide-react';
import { useLifeWheelStore, type WheelDomain } from '../../../stores/fw-wheel.store';
import { useTelemetry } from '../hooks/useTelemetry';
import { useDealStore } from '../../../stores/fw-deal.store';
import { useMemo } from 'react';

interface Props {
  domain: WheelDomain;
  onClose: () => void;
}

export function DomainCentralCard({ domain, onClose }: Props) {
  const { ambitions } = useLifeWheelStore();
  const telemetry = useTelemetry();
  const muses = useDealStore(s => s.muses);
  
  const domainAmbition = ambitions.find(a => a.domainId === domain.id);
  const realScore = telemetry.scores[domain.id] || 0;

  const passiveMRR = useMemo(() => {
    return muses
       .filter(m => m.status === 'operational')
       .reduce((acc, muse) => acc + (muse.revenueEstimate || 0), 0);
  }, [muses]);

  return (
    <div className="absolute inset-0 z-50 bg-[#050505]/60 backdrop-blur-3xl flex animate-in zoom-in-95 duration-200 overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl">
      {/* Left Sidebar Info */}
      <aside className="w-80 border-r border-white/5 bg-black/40 p-10 flex flex-col">
        <div className="flex-1">
          <div className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center border shadow-lg"
               style={{ backgroundColor: `${domain.color}1a`, borderColor: `${domain.color}33`, color: domain.color }}>
            <Target className="w-8 h-8" />
          </div>
          
          <h2 className="text-3xl font-black uppercase tracking-tighter text-[var(--theme-text)] mb-2">
            {domain.name}
          </h2>
          <p className="text-[10px] font-bold text-[var(--theme-text)]/20 uppercase tracking-[0.4em] mb-10">
            Sovereign Domain
          </p>

          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-end mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--theme-text)]/40">Realized Index</span>
                <span className="text-2xl font-black" style={{ color: domain.color }}>{realScore}%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div className="h-full transition-all duration-1000 ease-out" 
                     style={{ width: `${realScore}%`, backgroundColor: domain.color }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--theme-text)]/40">Ambition Target</span>
                <span className="text-2xl font-black text-amber-500">{domain.score}%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-amber-500/40" style={{ width: `${domain.score}%` }} />
              </div>
            </div>

            {domain.name.toLowerCase() === 'finance' && passiveMRR > 0 && (
              <div className="mt-8 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex flex-col gap-1 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <span className="text-[8px] uppercase font-black text-emerald-500/60 tracking-[0.2em]">Spacedock MRR</span>
                <span className="text-xl font-black text-emerald-400">
                    ${passiveMRR.toLocaleString()} <span className="text-[10px] font-bold text-emerald-500/50">/ mo</span>
                </span>
              </div>
            )}
          </div>
        </div>

        <footer className="pt-8 border-t border-white/5">
           <button className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest text-[var(--theme-text)]/40 transition-all border border-white/5">
             Calibrate Weight ({domain.weight}x)
           </button>
        </footer>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10">
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--theme-text)]/40 flex items-center gap-3">
            <Flame className="w-4 h-4 text-amber-500" /> Constitutional Ambition
          </h3>
          <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 text-[var(--theme-text)]/40 hover:text-[var(--theme-text)] transition-colors">
            <X className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 p-12 overflow-auto custom-scrollbar">
          {domainAmbition ? (
            <div className="max-w-3xl">
              <h1 className="text-4xl font-black text-[var(--theme-text)] mb-8 tracking-tight leading-tight">
                {domainAmbition.title}
              </h1>
              <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
                <p className="text-lg leading-relaxed text-[var(--theme-text)]/80 whitespace-pre-wrap font-light">
                  {domainAmbition.content}
                </p>
              </div>
              
              <div className="mt-12 flex items-center gap-4 p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                 <Activity className="w-5 h-5 text-emerald-400" />
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60">Execution Proof</p>
                    <p className="text-xs text-[var(--theme-text)]/40 mt-1">This ambition is currently monitored via PARA telemetry.</p>
                 </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-20">
               <Flame className="w-16 h-16 mb-6" />
               <h3 className="text-xl font-bold uppercase tracking-[0.4em]">No Ambition Forged</h3>
               <p className="text-sm max-w-xs mt-4">Use the Forge button to define your sovereign principles for this domain.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
