import React from 'react';
import { useTelemetry } from '../hooks/useTelemetry';
import { useLifeWheelStore } from '../../../stores/fw-wheel.store';

export function HybridRadar() {
  const telemetry = useTelemetry();
  const domains = useLifeWheelStore(s => s.domains);

  // Ce composant affiche des jauges par domaine à l'absence de chart SVG lourd
  return (
    <div className="p-8 bg-black/40 border border-white/5 rounded-3xl backdrop-blur-md shadow-2xl">
       <div className="flex justify-between items-end mb-10">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-white/50 mb-1">Telemetry Nexus</h3>
            <p className="text-[10px] text-white/20 uppercase tracking-widest">Execution Reality vs Constitution</p>
          </div>
          <div className="text-right">
             <span className="text-5xl font-black text-amber-500 tracking-tighter">{telemetry.global}%</span>
             <p className="text-[8px] uppercase tracking-[0.3em] text-amber-500/50 mt-1 font-bold">Realized Index</p>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
         {domains.map(dom => {
            const realScore = telemetry.scores[dom.id] || 0;
            // "dom.score" était l'ancienne saisie manuelle (devient l'ambition cible)
            return (
              <div key={dom.id} className="relative group">
                 <div className="flex justify-between text-[10px] uppercase tracking-widest mb-2 font-bold">
                   <span style={{ color: dom.color }}>{dom.name}</span>
                   <span className="text-white/30 group-hover:text-white/60 transition-colors">Real: {realScore}% | Target: {dom.score}%</span>
                 </div>
                 <div className="h-5 bg-white/5 rounded-lg overflow-hidden relative border border-white/5">
                    {/* Calque Ambition (Target) - Background pattern or subtle fill */}
                    <div 
                      className="absolute top-0 left-0 h-full bg-white/[0.03] border-r border-white/10" 
                      style={{ width: `${dom.score}%` }} 
                    />
                    {/* Calque Réalité (Execution) - Glowing bar */}
                    <div 
                      className="absolute top-0 left-0 h-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(0,0,0,0.5)]" 
                      style={{ 
                        width: `${realScore}%`, 
                        backgroundColor: dom.color, 
                        opacity: 0.8,
                        boxShadow: `0 0 10px ${dom.color}40`
                      }} 
                    />
                 </div>
              </div>
            );
         })}
       </div>
       
       <div className="mt-10 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-center">
          <p className="text-[9px] uppercase tracking-[0.2em] text-amber-500/40">
            Telemetry is calculated from active projects progress and completion ratios in PARA.
          </p>
       </div>
    </div>
  );
}
