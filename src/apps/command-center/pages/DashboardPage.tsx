/** CC Dashboard — overview page with Life Wheel metrics and agent status */
import { useState } from 'react';
import { Activity, Shield, Zap, Layout, CheckCircle2 } from 'lucide-react';
import { DashboardHeader, type DashboardView } from '../components/DashboardHeader';
import { FocusView } from './FocusView';
import { StrategyView } from './StrategyView';

export function DashboardPage() {
  const [activeView, setActiveView] = useState<DashboardView>('STANDARD');

  const renderView = () => {
    switch (activeView) {
      case 'FOCUS':    return <FocusView />;
      case 'STRATEGY': return <StrategyView />;
      default:         return <Overview />;
    }
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <DashboardHeader activeView={activeView} onViewChange={setActiveView} />
      <div className="flex-1 overflow-y-auto no-scrollbar pb-12">
        {renderView()}
      </div>
    </div>
  );
}

/* ═══ Standard Overview View ═══ */

function Overview() {
  return (
    <div className="grid grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Life Wheel Radar */}
      <div className="col-span-12 lg:col-span-7 glass-card rounded-2xl p-6 border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-[var(--theme-text)] uppercase tracking-widest font-outfit">Life Wheel Metrics</h3>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold tracking-widest uppercase">System Healthy</span>
        </div>
        <div className="flex items-center justify-center py-4">
          <LifeWheelRadar />
        </div>
      </div>

      {/* Right Column: Tasks & Fleet */}
      <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
        {/* Active Tasks */}
        <div className="glass-card rounded-2xl p-6 border-white/10 bg-white/[0.02] flex-1">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-[var(--theme-text)] uppercase tracking-widest font-outfit">Active Operations</h3>
          </div>
          <div className="space-y-4">
            <TaskItem title="Phase 1: OS Shell" progress={100} status="complete" />
            <TaskItem title="Phase 2: Command Center" progress={65} status="running" />
            <TaskItem title="Phase 3: PARA Framework" progress={10} status="pending" />
          </div>
        </div>

        {/* Fleet Status */}
        <div className="glass-card rounded-2xl p-6 border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-[var(--theme-text)] uppercase tracking-widest font-outfit">Fleet Readiness</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FleetBadge name="Orville" status="online" />
            <FleetBadge name="Discovery" status="online" />
            <FleetBadge name="SNW" status="idle" />
            <FleetBadge name="Enterprise" status="online" />
            <FleetBadge name="Cerritos" status="idle" />
            <FleetBadge name="Protostar" status="offline" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ Sub-components ═══ */

function LifeWheelRadar() {
  const domains = ['Business', 'Finance', 'Health', 'Cognition', 'Relations', 'Habitat', 'Creativity', 'Impact'];
  const values = [8.5, 6.2, 7.8, 9.1, 7.5, 5.4, 8.0, 7.2];
  const cx = 150, cy = 150, r = 120;

  const points = values.map((v, i) => {
    const angle = (Math.PI * 2 * i) / domains.length - Math.PI / 2;
    const dist = (v / 10) * r;
    return `${cx + dist * Math.cos(angle)},${cy + dist * Math.sin(angle)}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[320px] h-auto drop-shadow-[0_0_20px_rgba(16,185,129,0.1)]">
      <defs>
        <radialGradient id="radarGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {[0.2, 0.4, 0.6, 0.8, 1].map(scale => (
        <circle key={scale} cx={cx} cy={cy} r={r * scale}
          fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray={scale === 1 ? "0" : "4 4"} />
      ))}

      {domains.map((label, i) => {
        const angle = (Math.PI * 2 * i) / domains.length - Math.PI / 2;
        const lx = cx + (r + 25) * Math.cos(angle);
        const ly = cy + (r + 25) * Math.sin(angle);
        return (
          <g key={i}>
            <line x1={cx} y1={cy} x2={cx + r * Math.cos(angle)} y2={cy + r * Math.sin(angle)}
              stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
              className="fill-white/40 text-[9px] font-bold uppercase tracking-widest font-outfit">{label}</text>
          </g>
        );
      })}

      <polygon points={points} fill="url(#radarGrad)" stroke="#10b981" strokeWidth="2.5" className="animate-pulse" />
      
      {values.map((v, i) => {
        const angle = (Math.PI * 2 * i) / domains.length - Math.PI / 2;
        const dx = cx + (v / 10) * r * Math.cos(angle);
        const dy = cy + (v / 10) * r * Math.sin(angle);
        return (
          <circle key={i} cx={dx} cy={dy} r="4" fill="#10b981" className="shadow-[0_0_10px_#10b981]" />
        );
      })}
    </svg>
  );
}

function TaskItem({ title, progress, status }: { title: string; progress: number; status: 'complete' | 'running' | 'pending' }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className={`text-[11px] font-bold uppercase tracking-wider ${status === 'pending' ? 'text-[var(--theme-text)]/30' : 'text-[var(--theme-text)]/70'}`}>{title}</span>
        <span className="text-[10px] font-mono text-[var(--theme-text)]/40">{progress}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
        <div 
          className={`h-full transition-all duration-1000 ${
            status === 'complete' ? 'bg-emerald-500' : 
            status === 'running' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 
            'bg-white/10'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function FleetBadge({ name, status }: { name: string; status: 'online' | 'idle' | 'offline' }) {
  const colors = {
    online: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    idle: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    offline: 'text-[var(--theme-text)]/20 bg-white/5 border-white/5',
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all hover:bg-white/5 cursor-default ${colors[status]}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${
        status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 
        status === 'idle' ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 
        'bg-white/20'
      }`} />
      <span className="text-[10px] font-bold uppercase tracking-widest font-outfit truncate">{name}</span>
    </div>
  );
}

