/** DashboardHeader — OpenAI Platform style navigation for the Trinity View (P5.1) */
import { Layout, Target, Rocket } from 'lucide-react';

export type DashboardView = 'STANDARD' | 'FOCUS' | 'STRATEGY';

interface DashboardHeaderProps {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
}

export function DashboardHeader({ activeView, onViewChange }: DashboardHeaderProps) {
  const tabs: { id: DashboardView; label: string; icon: any }[] = [
    { id: 'STANDARD', label: 'Overview', icon: Layout },
    { id: 'FOCUS',    label: 'Focus (GTD)',  icon: Target },
    { id: 'STRATEGY', label: 'Strategy (12WY)', icon: Rocket },
  ];

  return (
    <div className="flex flex-col gap-6 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--theme-text)] font-outfit uppercase tracking-[0.3em]">Command Center</h1>
        <p className="text-xs text-[var(--theme-text)]/30 font-medium uppercase tracking-widest mt-1">L1 Layer — Amadeus-L1 / System Hub</p>
      </div>

      <div className="flex items-center gap-1 p-1 bg-white/5 border border-white/5 rounded-xl w-fit">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onViewChange(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                isActive 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                  : 'text-[var(--theme-text)]/30 hover:text-[var(--theme-text)]/60 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-[var(--theme-text)]/20'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

