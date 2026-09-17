import React from 'react';
import type { IkigaiVision, IkigaiPillar, IkigaiHorizon } from '../../../stores/fw-ikigai.store';
import type { VesselConfig } from '../../../types/frameworks';

interface HorizonsMatrixProps {
  visions: IkigaiVision[];
  onSelect?: (item: IkigaiVision) => void;
  vesselConfig?: VesselConfig; // Just to fulfill the 'Consommer les types canoniques' rule
}

const PILLARS: { id: IkigaiPillar, label: string }[] = [
  { id: 'passion', label: 'Passion' },
  { id: 'mission', label: 'Mission' },
  { id: 'vocation', label: 'Vocation' },
  { id: 'craft', label: 'Profession' },
];

const HORIZONS: { id: IkigaiHorizon, label: string, desc: string, kardashev: string }[] = [
  { id: 'H1', label: '1 Year', desc: 'Observer', kardashev: 'Type 0 / Local' },
  { id: 'H3', label: '3 Years', desc: 'Explorer', kardashev: 'Type 0.1 / Ascending' },
  { id: 'H10', label: '10 Years', desc: 'Guardian', kardashev: 'Type 0.5 / Planetary' },
  { id: 'H30', label: '30 Years', desc: 'Multi-Horizon', kardashev: 'Type 0.7 / Transitional' },
  { id: 'H90', label: 'Solarpunk', desc: 'Keeper', kardashev: 'Type I / Kardashev' },
];

export function HorizonsMatrix({ visions, onSelect, vesselConfig }: HorizonsMatrixProps) {

  const getCellItem = (pId: IkigaiPillar, hId: IkigaiHorizon) => {
    return visions.find(v => v.pillar === pId && v.horizon === hId);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-auto custom-scrollbar animate-in fade-in slide-in-from-bottom-6 duration-1000">

      {vesselConfig && (
        <div className="mb-4 px-8 py-2 bg-black/40 border border-white/10 rounded-xl inline-block w-fit">
          <span className="text-[10px] uppercase tracking-widest text-purple-400 font-bold">Vessel: {vesselConfig.vesselName}</span>
        </div>
      )}

      {/* Matrix Header */}
      <div className="flex sticky top-0 z-10 bg-black/80 backdrop-blur-md pb-4 border-b border-white/5 min-w-max">
        <div className="w-40 shrink-0" />
        {HORIZONS.map(h => (
          <div key={h.id} className="flex-1 min-w-[200px] px-4 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">{h.id}</span>
            <span className="text-xs font-bold text-[var(--theme-text)]/80 mt-1">{h.label}</span>
            <span className="text-[9px] uppercase tracking-widest text-[var(--theme-text)]/50 mt-0.5">{h.desc}</span>
            <span className="text-[8px] uppercase tracking-widest text-[var(--theme-text)]/30 mt-0.5 text-blue-400/50">{h.kardashev}</span>
          </div>
        ))}
      </div>

      {/* Matrix Body */}
      <div className="flex flex-col min-w-max pb-10">
        {PILLARS.map(p => (
          <div key={p.id} className="flex border-b border-white/5 group">
            {/* Row Header */}
            <div className="w-40 shrink-0 sticky left-0 bg-black/80 backdrop-blur-md z-10 flex items-center justify-end pr-8 py-8 border-r border-white/5 transition-colors group-hover:bg-white/[0.02]">
              <span className="text-xs font-bold uppercase tracking-[0.4em] text-[var(--theme-text)]/60 text-right">
                {p.label}
              </span>
            </div>

            {/* Cells */}
            {HORIZONS.map(h => {
              const item = getCellItem(p.id, h.id);

              return (
                <div key={`${p.id}-${h.id}`} className="flex-1 min-w-[200px] p-4 border-r border-white/5 last:border-r-0 relative group/cell">
                  {item ? (
                    <button
                      onClick={() => onSelect && onSelect(item)}
                      className="w-full h-full min-h-[120px] bg-white/[0.02] hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/30 rounded-xl p-4 flex flex-col items-start text-left transition-all relative overflow-hidden"
                    >
                      <h4 className="text-xs font-bold text-[var(--theme-text)]/90 uppercase tracking-wider mb-2 leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-[var(--theme-text)]/40 line-clamp-3 leading-relaxed">
                        {item.description || item.content}
                      </p>

                      <div className="mt-auto w-full pt-4">
                        <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500/50"
                            style={{ width: `${item.alignmentLevel}%` }}
                          />
                        </div>
                      </div>
                    </button>
                  ) : (
                    <div className="w-full h-full min-h-[120px] flex items-center justify-center opacity-40 group-hover/cell:opacity-100 transition-opacity">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/20 border border-white/5 text-[var(--theme-text)]/40 text-[9px] font-bold uppercase tracking-widest">
                        A SOURCER
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

    </div>
  );
}
