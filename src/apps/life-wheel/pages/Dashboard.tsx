/** Life Wheel Dashboard — Framework Overview (V0.5.3) */
import React, { useMemo } from 'react';
import { useLifeWheelStore } from '../../../stores/fw-wheel.store';
import { useTelemetry } from '../hooks/useTelemetry';
import { HybridRadar } from '../components/HybridRadar';
import { 
  Activity, PieChart, TrendingUp, Target, 
  ChevronRight, Award, Zap, Compass
} from 'lucide-react';
import { clsx } from 'clsx';

interface LifeWheelDashboardProps {
  embedded?: boolean;
}

export default function LifeWheelDashboard({ embedded }: LifeWheelDashboardProps) {
  const { domains, history } = useLifeWheelStore();
  const telemetry = useTelemetry();

  return (
    <div className={clsx(
      "flex-1 flex flex-col gap-10 animate-in fade-in zoom-in-95 duration-1000",
      embedded ? "p-0" : "p-10"
    )}>
      {/* Visual Core: Radar & Global Score */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-7">
          <HybridRadar />
        </div>

        {/* Domain Stats Grid */}
        <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-4 content-start">
          {domains.map(domain => {
            const realScore = telemetry.scores[domain.id] || 0;
            return (
              <DomainMiniCard key={domain.id} domain={domain} realScore={realScore} />
            );
          })}
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 glass-card rounded-[2.5rem] bg-black/20 border-white/5 p-8 shadow-xl">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--theme-text)]/60">Historical Evolution</h3>
              <TrendingUp className="w-4 h-4 text-amber-400/50" />
           </div>
           <div className="h-48 flex items-end gap-2 px-4">
              {/* Dummy Bars */}
              {[45, 52, 48, 60, 55, 65, 58, 70, 68, 75, 72, 80].map((v, i) => (
                <div key={i} className="flex-1 bg-amber-500/10 hover:bg-amber-500/30 transition-all rounded-t-lg group relative" style={{ height: `${v}%` }}>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-bold text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">{v}%</div>
                </div>
              ))}
           </div>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
           <div className="glass-card rounded-[2rem] bg-amber-500/[0.03] border-amber-500/10 p-8 flex-1 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                 <Award className="w-5 h-5 text-amber-400" />
                 <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400/80">Peak Domain</h3>
              </div>
              <p className="text-lg font-bold text-[var(--theme-text)] mb-1 uppercase tracking-wider">Cognition</p>
              <p className="text-[10px] text-[var(--theme-text)]/30 leading-relaxed italic">"The greatest wealth is the knowledge that helps you grow in every domain."</p>
           </div>
           <div className="glass-card rounded-[2rem] bg-black/20 border-white/5 p-8 flex items-center justify-between group cursor-pointer hover:border-amber-500/20 transition-all shadow-xl">
              <div className="flex items-center gap-4">
                 <Zap className="w-5 h-5 text-[var(--theme-text)]/20 group-hover:text-amber-400 transition-colors" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--theme-text)]/40 group-hover:text-[var(--theme-text)]/80 transition-colors">Sync Telemetry</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--theme-text)]/10" />
           </div>
        </div>
      </div>
    </div>
  );
}

function DomainMiniCard({ domain, realScore }: { domain: any, realScore: number }) {
  return (
    <div className="glass-card rounded-2xl p-4 bg-white/[0.01] border-white/5 hover:bg-white/[0.04] transition-all group border hover:border-amber-500/20 shadow-xl">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[8px] font-black text-[var(--theme-text)]/30 uppercase tracking-widest truncate max-w-[80px]" style={{ color: domain.color + '80' }}>
          {domain.name}
        </span>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-[var(--theme-text)]/80 group-hover:text-amber-400 transition-colors">{realScore}%</span>
          <span className="text-[7px] font-bold text-white/10 uppercase">Real</span>
        </div>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden relative">
        <div className="absolute inset-0 bg-white/5" style={{ width: `${domain.score}%` }} />
        <div 
          className="h-full relative z-10 transition-all duration-1000 shadow-[0_0_8px_rgba(0,0,0,0.5)]" 
          style={{ width: `${realScore}%`, backgroundColor: domain.color }} 
        />
      </div>
    </div>
  );
}
