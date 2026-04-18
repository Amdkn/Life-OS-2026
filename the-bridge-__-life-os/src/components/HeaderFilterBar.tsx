/** HeaderFilterBar — horizontal filter tabs for framework headers */
import { clsx } from 'clsx';

export interface FilterItem {
  id: string;
  label: string;
}

interface HeaderFilterBarProps {
  items: FilterItem[];
  activeFilter: string;
  onFilterChange: (id: string) => void;
  scrollable?: boolean;
  accentColor?: 'emerald' | 'blue' | 'amber' | 'teal' | 'red' | 'purple';
}

export function HeaderFilterBar({ 
  items, 
  activeFilter, 
  onFilterChange, 
  scrollable = false, 
  accentColor = 'emerald' 
}: HeaderFilterBarProps) {
  const accent = accents[accentColor] ?? accents.emerald;
  
  return (
    <div className={clsx(
      "flex items-center gap-1 min-w-0 px-2 py-1 bg-white/[0.02] rounded-xl border border-white/5",
      scrollable && "overflow-x-auto no-scrollbar"
    )}>
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onFilterChange(item.id)}
          className={clsx(
            "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest font-outfit transition-all duration-200 whitespace-nowrap border",
            activeFilter === item.id
              ? `${accent.bg} ${accent.border} ${accent.text}`
              : "border-transparent text-[var(--theme-text)]/30 hover:bg-white/5 hover:text-[var(--theme-text)]/50"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

const accents: Record<string, { bg: string; border: string; text: string }> = {
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/30',    text: 'text-blue-400' },
  amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   text: 'text-amber-400' },
  teal:    { bg: 'bg-teal-500/10',    border: 'border-teal-500/30',    text: 'text-teal-400' },
  red:     { bg: 'bg-red-500/10',     border: 'border-red-500/30',     text: 'text-red-400' },
  purple:  { bg: 'bg-purple-500/10',  border: 'border-purple-500/30',  text: 'text-purple-400' },
};

