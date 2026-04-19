/** AppNavBar — shared sidebar navigation for Framework Apps */
import { clsx } from 'clsx';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface AppNavBarProps {
  items: NavItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  accentColor?: 'blue' | 'emerald' | 'amber' | 'teal' | 'red' | 'purple' | 'pink' | 'slate';
  title: string;
  subtitle?: string;
  titleIcon?: LucideIcon;
}

export function AppNavBar({ 
  items, 
  activeTab, 
  onTabChange, 
  accentColor = 'blue', 
  title, 
  subtitle, 
  titleIcon: TitleIcon 
}: AppNavBarProps) {
  const accent = accentColors[accentColor] ?? accentColors.blue;

  return (
    <div className="flex flex-col gap-6 p-6 h-full">
      {/* App Header */}
      <div className="flex items-center gap-4 px-2">
        {TitleIcon && (
          <div className={`w-10 h-10 rounded-2xl ${accent.bg} flex items-center justify-center border ${accent.border} shadow-lg group`}>
            <TitleIcon className={`w-5 h-5 ${accent.text} group-hover:scale-110 transition-transform`} />
          </div>
        )}
        <div>
          {subtitle && <h3 className={`text-[9px] font-bold ${accent.textMuted} uppercase tracking-[0.3em]`}>{subtitle}</h3>}
          <h2 className="text-base font-bold uppercase tracking-widest text-[var(--theme-text)]/90">{title}</h2>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col gap-1.5">
        {items.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={clsx(
                "flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-500 border group relative overflow-hidden w-full text-left",
                isActive 
                  ? "bg-white/5 border-white/10 text-[var(--theme-text)] shadow-xl translate-x-1" 
                  : "border-transparent text-[var(--theme-text)]/20 hover:bg-white/[0.02] hover:text-[var(--theme-text)]/40"
              )}
            >
              {isActive && <div className={`absolute left-0 top-1/4 bottom-1/4 w-1 ${accent.indicator} rounded-full shadow-lg`} />}
              <item.icon className={clsx("w-4 h-4 transition-all duration-500 group-hover:scale-125", isActive ? accent.text : "text-current opacity-50")} />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] flex-1">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-1.5 py-0.5 rounded-md ${accent.badgeBg} text-[8px] font-black animate-pulse`}>{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

const accentColors: Record<string, { bg: string; border: string; text: string; textMuted: string; indicator: string; badgeBg: string }> = {
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    text: 'text-blue-400',    textMuted: 'text-blue-400/50',    indicator: 'bg-blue-500',    badgeBg: 'bg-blue-500' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', textMuted: 'text-emerald-400/50', indicator: 'bg-emerald-500', badgeBg: 'bg-emerald-500' },
  amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   text: 'text-amber-400',   textMuted: 'text-amber-400/50',   indicator: 'bg-amber-500',   badgeBg: 'bg-amber-500' },
  teal:    { bg: 'bg-teal-500/10',    border: 'border-teal-500/20',    text: 'text-teal-400',    textMuted: 'text-teal-400/50',    indicator: 'bg-teal-500',    badgeBg: 'bg-teal-500' },
  red:     { bg: 'bg-red-500/10',     border: 'border-red-500/20',     text: 'text-red-400',     textMuted: 'text-red-400/50',     indicator: 'bg-red-500',     badgeBg: 'bg-red-500' },
  purple:  { bg: 'bg-purple-500/10',  border: 'border-purple-500/20',  text: 'text-purple-400',  textMuted: 'text-purple-400/50',  indicator: 'bg-purple-500',  badgeBg: 'bg-purple-500' },
  pink:    { bg: 'bg-pink-500/10',    border: 'border-pink-500/20',    text: 'text-pink-400',    textMuted: 'text-pink-400/50',    indicator: 'bg-pink-500',    badgeBg: 'bg-pink-500' },
  slate:   { bg: 'bg-slate-500/10',   border: 'border-slate-500/20',   text: 'text-slate-400',   textMuted: 'text-slate-400/50',   indicator: 'bg-slate-500',   badgeBg: 'bg-slate-500' },
};

