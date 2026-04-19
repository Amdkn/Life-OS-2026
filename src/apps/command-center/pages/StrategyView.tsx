/** StrategyView — 12WY Overview skeleton (P5.3) */
import { Rocket, Calendar, Flag, BarChart3 } from 'lucide-react';

export function StrategyView() {
  const weeks = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentWeek = 3;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 12 Week Progress Bar */}
      <div className="glass-card rounded-2xl p-8 border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Rocket className="w-6 h-6 text-blue-400" />
            <h2 className="text-lg font-bold text-[var(--theme-text)] uppercase tracking-widest font-outfit">12WY Journey</h2>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-[var(--theme-text)]/30 uppercase tracking-[0.2em]">Current Progress</span>
            <div className="text-lg font-bold text-blue-400 font-mono">Week {currentWeek} / 12</div>
          </div>
        </div>

        <div className="flex gap-2 h-12">
          {weeks.map(w => (
            <div 
              key={w} 
              className={`flex-1 rounded-lg border flex items-center justify-center text-[10px] font-bold transition-all ${
                w < currentWeek ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' :
                w === currentWeek ? 'bg-blue-500 border-blue-400 text-[var(--theme-text)] shadow-[0_0_20px_rgba(59,130,246,0.4)]' :
                'bg-white/5 border-white/10 text-[var(--theme-text)]/20'
              }`}
            >
              W{w}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Objectives */}
        <div className="glass-card rounded-2xl p-8 border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3 mb-6">
            <Flag className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-[var(--theme-text)] uppercase tracking-widest font-outfit">Core Objectives</h3>
          </div>
          <div className="space-y-4">
            <ObjectiveItem title="A'Space Kernel V1.0" progress={85} />
            <ObjectiveItem title="Business OS Scaling" progress={40} />
            <ObjectiveItem title="Health Optimization" progress={60} />
          </div>
        </div>

        {/* Metrics */}
        <div className="glass-card rounded-2xl p-8 border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-[var(--theme-text)] uppercase tracking-widest font-outfit">Execution Score</h3>
          </div>
          <div className="flex items-center justify-center h-32">
             <div className="text-5xl font-bold text-[var(--theme-text)] font-outfit tracking-tighter">72<span className="text-[var(--theme-text)]/20 text-2xl">%</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ObjectiveItem({ title, progress }: { title: string; progress: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[11px] font-bold uppercase tracking-tight">
        <span className="text-[var(--theme-text)]/60">{title}</span>
        <span className="text-[var(--theme-text)]/40">{progress}%</span>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500/50" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

