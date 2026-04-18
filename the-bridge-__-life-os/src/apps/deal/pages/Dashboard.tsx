/** DEAL Dashboard — Pipeline & Liberation Score (V0.2.9) */
import { useMemo } from 'react';
import { useDealStore } from '../../../stores/fw-deal.store';
import { 
  Scan, Scissors, Zap, LockOpen, 
  Activity, ArrowRight, ShieldAlert, Clock, Trophy
} from 'lucide-react';
import { clsx } from 'clsx';

interface DealDashboardProps {
  embedded?: boolean;
}

export default function DealDashboard({ embedded }: DealDashboardProps) {
  const { items, muses } = useDealStore();

  const pipelineStats = useMemo(() => {
    return {
      define: items.filter(i => i.step === 'define').length,
      eliminate: items.filter(i => i.step === 'eliminate').length,
      automate: items.filter(i => i.step === 'automate').length,
      liberate: items.filter(i => i.step === 'liberate').length
    };
  }, [items]);

  const totalRevenue = useMemo(() => 
    muses.reduce((acc, m) => acc + m.revenueEstimate, 0)
  , [muses]);

  return (
    <div className={clsx(
      "flex-1 flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-10 duration-1000",
      embedded ? "p-0" : "p-10"
    )}>
      {/* Visual Pipeline D-E-A-L */}
      <div className="grid grid-cols-4 gap-6">
        <PipelineStep label="Define" count={pipelineStats.define} icon={Scan} color="border-amber-500/30 text-amber-400" bg="bg-amber-500/5" />
        <PipelineStep label="Eliminate" count={pipelineStats.eliminate} icon={Scissors} color="border-rose-500/30 text-rose-400" bg="bg-rose-500/5" />
        <PipelineStep label="Automate" count={pipelineStats.automate} icon={Zap} color="border-blue-500/30 text-blue-400" bg="bg-blue-500/5" />
        <PipelineStep label="Liberate" count={pipelineStats.liberate} icon={LockOpen} color="border-emerald-500/30 text-emerald-400" bg="bg-emerald-500/5" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Active Frictions */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--theme-text)]/40">Neural Frictions</h3>
            <ShieldAlert className="w-4 h-4 text-rose-400/40" />
          </div>
          <div className="space-y-4">
            {items.slice(0, 4).map(item => (
              <div key={item.id} className="glass-card rounded-[2rem] p-6 bg-white/[0.01] border-white/5 hover:bg-white/[0.03] transition-all group border hover:border-rose-500/20 flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[var(--theme-text)]/40">
                    <Scan className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-[var(--theme-text)]/80 uppercase tracking-wider">{item.title}</h4>
                    <p className="text-[9px] text-[var(--theme-text)]/20 uppercase tracking-widest mt-1">Pipeline: {item.step} • Friction: {item.frictionScore}%</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--theme-text)]/10 group-hover:text-rose-400 transition-all group-hover:translate-x-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Muse Tracker Summary */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-8">
          <div className="glass-card rounded-[3rem] bg-gradient-to-br from-emerald-500/10 via-black/40 to-blue-500/10 border-white/5 p-10 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)]" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.5em] mb-4">Ecosystem Revenue</span>
            <div className="relative">
              <span className="text-7xl font-black text-[var(--theme-text)]/90 tracking-tighter drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">${totalRevenue}</span>
              <span className="absolute -top-2 -right-10 text-xs font-bold text-[var(--theme-text)]/30 uppercase">/mo</span>
            </div>
            <p className="text-[10px] text-[var(--theme-text)]/40 mt-8 text-center leading-relaxed italic max-w-[200px]">
              "Automate the repetitive, liberate the creative."
            </p>
          </div>

          <div className="glass-card rounded-[2rem] bg-black/20 border-white/5 p-8 flex items-center justify-between group cursor-pointer hover:border-blue-500/20 transition-all">
            <div className="flex items-center gap-4">
               <Trophy className="w-5 h-5 text-[var(--theme-text)]/20 group-hover:text-blue-400 transition-colors" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--theme-text)]/40 group-hover:text-[var(--theme-text)]/80 transition-colors">Active Muses</span>
            </div>
            <div className="text-xs font-bold text-[var(--theme-text)]/20 group-hover:text-[var(--theme-text)]/60">{muses.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PipelineStep({ label, count, icon: Icon, color, bg }: any) {
  return (
    <div className={clsx(
      "glass-card rounded-[2rem] border p-6 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105",
      color, bg
    )}>
      <Icon className="w-6 h-6" />
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      <div className="px-3 py-1 rounded-full bg-white/5 text-[9px] font-bold border border-current opacity-40">{count} Items</div>
    </div>
  );
}

