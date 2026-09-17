import { type DealItem, useDealStore } from '../../stores/fw-deal.store';
import { ProtostarElimination } from './components/ProtostarElimination';
import { vesselConfigs } from '../../config/vessels.config';
import {
  Scan, Scissors, Zap, LockOpen, Activity
} from 'lucide-react';
import { clsx } from 'clsx';
import { useMemo } from 'react';

interface DealProtostarViewProps {
  items: DealItem[];
}

export function DealProtostarView({ items }: DealProtostarViewProps) {
  const { frictionThreshold, updateDealItem } = useDealStore();

  const protostarConfig = vesselConfigs.find(c => c.id === 'FW06');

  const getCrewMemberName = (roleStr: string, fallback: string) => {
    const member = protostarConfig?.crew.find(c => c.role.includes(roleStr) || c.id.includes(roleStr.toLowerCase()));
    return member ? member.name : fallback;
  };

  const reclassify = async (id: string, newStep: 'define' | 'eliminate' | 'automate' | 'liberate') => {
    await updateDealItem(id, { step: newStep });
  };

  return (
    <div className="flex flex-col gap-8">
      <ProtostarElimination />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {items.map(item => {
        const isSevere = item.frictionScore >= frictionThreshold;

        return (
          <div key={item.id} className={clsx(
            "glass-card rounded-[2rem] p-8 border bg-white/[0.01] hover:bg-white/[0.04] transition-all group shadow-2xl relative overflow-hidden flex flex-col min-h-[250px]",
            isSevere ? "border-rose-500/30 hover:border-rose-500/50" : "border-white/5 hover:border-white/20"
          )}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col gap-1">
                <h4 className="text-[9px] font-bold text-rose-400/50 uppercase tracking-[0.4em]">{item.step}</h4>
                {item.source && (
                  <span className="text-[8px] font-bold text-emerald-400/50 uppercase tracking-[0.3em]">SRC: {item.source}</span>
                )}
              </div>
              <div className="h-1.5 w-16 bg-white/5 rounded-full overflow-hidden flex-shrink-0">
                <div className="h-full bg-rose-500/40" style={{ width: `${item.frictionScore}%` }} />
              </div>
            </div>

            <h3 className="text-base font-bold text-[var(--theme-text)]/90 uppercase tracking-wider mb-4 leading-tight">{item.title}</h3>

            <div className="mt-auto pt-4 border-t border-white/5">
              <div className="flex items-center justify-between mb-4">
                <span className={clsx(
                  "text-[8px] font-black uppercase tracking-widest",
                  isSevere ? "text-rose-400/80" : "text-[var(--theme-text)]/20"
                )}>
                  Friction: {item.frictionScore}%
                </span>
                {isSevere && <Activity className="w-3.5 h-3.5 text-rose-400/50" />}
              </div>

              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => reclassify(item.id, 'define')}
                  title={`Define with ${getCrewMemberName('Define', 'Holo-Janeway')}`}
                  className={clsx(
                    "p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all group/btn",
                    item.step === 'define'
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                      : "bg-white/5 border-white/5 text-[var(--theme-text)]/40 hover:bg-white/10"
                  )}
                >
                  <Scan className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => reclassify(item.id, 'eliminate')}
                  title={`Eliminate with ${getCrewMemberName('Eliminate', 'Rok-Tahk')}`}
                  className={clsx(
                    "p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all group/btn",
                    item.step === 'eliminate'
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                      : "bg-white/5 border-white/5 text-[var(--theme-text)]/40 hover:bg-white/10"
                  )}
                >
                  <Scissors className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => reclassify(item.id, 'automate')}
                  title={`Automate with ${getCrewMemberName('Automate', 'Zero')}`}
                  className={clsx(
                    "p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all group/btn",
                    item.step === 'automate'
                      ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                      : "bg-white/5 border-white/5 text-[var(--theme-text)]/40 hover:bg-white/10"
                  )}
                >
                  <Zap className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => reclassify(item.id, 'liberate')}
                  title={`Liberate with ${getCrewMemberName('Delegate', 'Gwyn')}`}
                  className={clsx(
                    "p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all group/btn",
                    item.step === 'liberate'
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-white/5 border-white/5 text-[var(--theme-text)]/40 hover:bg-white/10"
                  )}
                >
                  <LockOpen className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
          </div>
    </div>
  );
}
