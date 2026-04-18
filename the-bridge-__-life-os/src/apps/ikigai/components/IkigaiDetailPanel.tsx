/** IkigaiDetailPanel — slide-in detail view (V0.2.5) */
import { X, ShieldCheck, Target, Zap, Heart, Compass } from 'lucide-react';
import type { IkigaiItem } from '../../../stores/fw-ikigai.store';
import { clsx } from 'clsx';
import { ExecutionProofs } from './ExecutionProofs';

interface IkigaiDetailPanelProps {
  item: IkigaiItem | null;
  onClose: () => void;
}

export function IkigaiDetailPanel({ item, onClose }: IkigaiDetailPanelProps) {
  if (!item) return null;

  const pillarIcons = {
    craft: Zap,
    mission: Target,
    passion: Heart,
    vocation: ShieldCheck
  };
  const Icon = pillarIcons[item.pillar] || Compass;

  return (
    <div className="absolute inset-y-0 right-0 w-[400px] bg-black/80 backdrop-blur-2xl border-l border-white/10 z-50 animate-in slide-in-from-right duration-300 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col">
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 shrink-0">
        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--theme-text)]/40">Protocol Detail</h3>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-[var(--theme-text)]/20 hover:text-[var(--theme-text)]/80 transition-all">
          <X className="w-4 h-4" />
        </button>
      </header>

      <div className="flex-1 overflow-auto p-8 custom-scrollbar">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 rounded-[2rem] bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 shadow-2xl">
            <Icon className="w-8 h-8 text-purple-400" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-400/60 mb-2">{item.pillar}</span>
          <h2 className="text-2xl font-bold text-[var(--theme-text)] uppercase tracking-wider leading-tight mb-4">{item.title}</h2>
          <div className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold text-[var(--theme-text)]/40 uppercase tracking-widest">
            Horizon: {item.horizon}
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h4 className="text-[9px] font-bold text-[var(--theme-text)]/20 uppercase tracking-[0.3em] mb-3">Alignment Level</h4>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
              <div className="flex justify-between items-end mb-4">
                <span className="text-4xl font-black text-[var(--theme-text)]/90 tracking-tighter">{item.alignmentLevel}%</span>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Calibrated</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500/20 to-purple-500/80 rounded-full" style={{ width: `${item.alignmentLevel}%` }} />
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-[9px] font-bold text-[var(--theme-text)]/20 uppercase tracking-[0.3em] mb-3">Description</h4>
            <p className="text-sm text-[var(--theme-text)]/60 leading-relaxed font-light">
              {item.description || "No detailed protocol data recorded for this purpose item."}
            </p>
          </section>

          <ExecutionProofs visionId={item.id} />
        </div>
      </div>

      <footer className="p-6 border-t border-white/5 grid grid-cols-2 gap-4">
        <button className="py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-[var(--theme-text)]/40 hover:bg-white/10 transition-all">Archive</button>
        <button className="py-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold uppercase tracking-widest text-purple-400 hover:bg-purple-500/20 transition-all">Edit Data</button>
      </footer>
    </div>
  );
}

