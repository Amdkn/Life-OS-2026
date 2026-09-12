import React from 'react';
import { useTwelveWeekStore } from '../../../stores/fw-12wy.store';
import { Compass, Info } from 'lucide-react';
import { type MeaningHorizon } from '../../../types/twelve-week';
import { clsx } from 'clsx';

const HORIZONS: { id: MeaningHorizon; label: string; year: string }[] = [
  { id: 'H1', label: 'H1', year: '1 an' },
  { id: 'H3', label: 'H3', year: '3 ans' },
  { id: 'H10', label: 'H10', year: '10 ans' },
  { id: 'H25', label: 'H25', year: '25 ans' },
  { id: 'H90', label: 'H90', year: '90 ans' },
];

export function VisionAlignmentMatrix() {
  const visions = useTwelveWeekStore(s => s.visions);
  const setActiveVisionId = useTwelveWeekStore(s => s.setActiveVisionId);

  return (
    <div className="flex-1 flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex justify-center items-center">
          <Compass className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Solarpunk Vision Matrix</h2>
          <p className="text-[10px] uppercase font-bold tracking-widest text-amber-500/80 mt-1">
            Alignment view separating meaning horizon (years) from operational cadence (weeks)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {HORIZONS.map(horizon => {
          const horizonVisions = visions.filter(v => v.meaningHorizon === horizon.id);

          return (
            <div key={horizon.id} className="flex flex-col gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col items-center justify-center">
                <h3 className="text-lg font-black text-white">{horizon.label}</h3>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{horizon.year}</p>
              </div>

              {horizonVisions.length > 0 ? (
                horizonVisions.map(v => (
                  <div
                    key={v.id}
                    onClick={() => setActiveVisionId(v.id)}
                    className="p-5 rounded-2xl bg-black/40 border border-amber-500/10 hover:border-amber-500/30 transition-all cursor-pointer group shadow-xl"
                  >
                    <h4 className="font-bold text-white/90 group-hover:text-amber-400 transition-colors line-clamp-2 mb-2">{v.title}</h4>
                    {v.provenance && (
                      <p className="text-[9px] text-white/50 italic mb-2 border-l-2 border-amber-500/20 pl-2">
                        {v.provenance}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {v.operationalCadence && (
                        <span className="text-[8px] uppercase tracking-widest bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20">
                          {v.operationalCadence}
                        </span>
                      )}
                      {!v.provenance && (
                        <span className="text-[8px] uppercase tracking-widest bg-white/5 text-white/40 px-1.5 py-0.5 rounded border border-white/10">
                          A SOURCER
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 rounded-2xl border border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center opacity-50">
                  <Info className="w-5 h-5 text-white/20 mb-2" />
                  <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Unmapped Horizon</p>
                  <p className="text-[10px] text-white/40 mt-1">No manufactured projection.</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
