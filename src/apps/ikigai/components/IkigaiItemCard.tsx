/** IkigaiItemCard — dynamic purpose card (V0.2.5) */
import { Compass } from 'lucide-react';
import type { IkigaiItem } from '../../../stores/fw-ikigai.store';

interface IkigaiItemCardProps {
  item: IkigaiItem;
  onClick: (item: IkigaiItem) => void;
}

export function IkigaiItemCard({ item, onClick }: IkigaiItemCardProps) {
  return (
    <button 
      onClick={() => onClick(item)}
      className="glass-card rounded-[2rem] p-8 border-white/5 bg-white/[0.01] hover:bg-white/[0.04] transition-all group border hover:border-purple-500/20 shadow-2xl relative overflow-hidden flex flex-col min-h-[220px] text-left"
    >
      <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-700 -rotate-12 group-hover:rotate-0 group-hover:scale-110">
        <Compass className="w-20 h-20" />
      </div>
      <div className="flex items-center justify-between mb-4">
         <h4 className="text-[9px] font-bold text-purple-400/50 uppercase tracking-[0.4em]">{item.pillar}</h4>
         <span className="text-[8px] font-black px-2 py-0.5 rounded-full border border-white/10 text-[var(--theme-text)]/20 uppercase">{item.horizon}</span>
      </div>
      <h3 className="text-base font-bold text-[var(--theme-text)]/90 uppercase tracking-wider mb-3 group-hover:text-purple-400 transition-colors leading-tight">{item.title}</h3>
      <p className="text-[12px] text-[var(--theme-text)]/40 leading-relaxed mb-8 font-light line-clamp-3">{item.description}</p>
      <div className="mt-auto flex items-center justify-between">
        <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden mr-4">
          <div className="h-full bg-purple-500/40" style={{ width: `${item.alignmentLevel}%` }} />
        </div>
        <span className="text-[10px] font-bold text-[var(--theme-text)]/20">{item.alignmentLevel}%</span>
      </div>
    </button>
  );
}

