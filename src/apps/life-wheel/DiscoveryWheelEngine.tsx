import React from 'react';
import { useLifeWheelStore } from '../../stores/fw-wheel.store';
import { useTelemetry } from '../life-wheel/hooks/useTelemetry';
import { WHEEL_SWARM_CONFIG } from '../../config/wheel-swarms.config';
import { Shield, Target, ShieldCheck, Box, Activity } from 'lucide-react';
import { clsx } from 'clsx';

export default function DiscoveryWheelEngine() {
  const { domains } = useLifeWheelStore();
  const telemetry = useTelemetry();

  return (
    <div className="flex-1 flex flex-col gap-10 animate-in fade-in zoom-in-95 duration-1000 p-10 h-full overflow-y-auto">
      <header className="mb-6">
        <h2 className="text-3xl font-black text-[var(--theme-text)] uppercase tracking-tight flex items-center gap-4">
          <ShieldCheck className="w-8 h-8 text-amber-500" />
          Discovery Wheel Engine
        </h2>
        <p className="text-sm font-medium text-[var(--theme-text)]/50 uppercase tracking-widest mt-2">
          LD01-LD08 Subsystems & Business OS Swarms synchronization
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pb-20">
        {domains.map(domain => {
          const config = WHEEL_SWARM_CONFIG[domain.ldId];
          const rawScore = telemetry.scores[domain.id];
          // Determine status string based on whether we have a non-zero value
          // Technically 0 could be valid but PRD says "Une jauge sans donnée source affiche « non mesuré »"
          const displayScore = (rawScore && rawScore > 0) ? `${rawScore}%` : 'non mesuré';

          if (!config) return null; // Safe guard

          return (
            <div key={domain.id} className="glass-card rounded-2xl p-6 bg-white/[0.02] border-white/5 hover:border-white/20 transition-all shadow-xl group flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-inner"
                    style={{ backgroundColor: `${domain.color}1a`, borderColor: `${domain.color}33`, color: domain.color }}
                  >
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-wider text-[var(--theme-text)]">{domain.name}</h3>
                    <p className="text-[10px] font-bold text-[var(--theme-text)]/40 uppercase tracking-widest">{domain.ldId.toUpperCase()}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-3.5 h-3.5 text-[var(--theme-text)]/50" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--theme-text)]/50">Discovery Agent</span>
                  </div>
                  <p className="text-sm font-bold text-[var(--theme-text)]/90">{config.discoveryAgent}</p>
                </div>

                <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <Box className="w-3.5 h-3.5 text-[var(--theme-text)]/50" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--theme-text)]/50">Business OS Swarm</span>
                  </div>
                  <p className="text-sm font-bold text-amber-500/90">{config.swarmName}</p>
                </div>

                <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-3.5 h-3.5 text-[var(--theme-text)]/50" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--theme-text)]/50">Deliverable Source</span>
                  </div>
                  <p className="text-xs font-medium text-[var(--theme-text)]/70">{config.deliverableSource}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--theme-text)]/40">Realized Index</span>
                  <span className={clsx("text-lg font-black", displayScore === 'non mesuré' ? "text-[var(--theme-text)]/30 text-sm" : "")} style={{ color: displayScore !== 'non mesuré' ? domain.color : undefined }}>
                    {displayScore}
                  </span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full transition-all duration-1000 ease-out"
                    style={{ width: displayScore !== 'non mesuré' ? `${rawScore}%` : '0%', backgroundColor: domain.color }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
