/** PARA Dashboard — Framework Overview (V0.4.6) */
import React, { useMemo } from 'react';
import { useParaProjects } from '../../../hooks/useParaProjects';
import { 
  BarChart3, Box, Layers, Archive, 
  TrendingUp, Activity, Shield
} from 'lucide-react';
import { clsx } from 'clsx';
import { LifeWheelBalance } from '../components/LifeWheelBalance';
import { FrictionLog } from '../components/FrictionLog';
import { ArchiveRadar } from '../components/ArchiveRadar';

interface ParaDashboardProps {
  embedded?: boolean;
}

export default function ParaDashboard({ embedded }: ParaDashboardProps) {
  const { items, isLoading } = useParaProjects();
  
  const stats = useMemo(() => {
    const active = items.filter(i => i.status === 'active').length;
    const completed = items.filter(i => i.status === 'completed').length;
    const total = items.length;
    return { active, completed, total, efficiency: total ? Math.round((completed / total) * 100) : 0 };
  }, [items]);

  return (
    <div className={clsx(
      "flex-1 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700",
      embedded ? "p-0" : "p-10"
    )}>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard label="Active Projects" value={stats.active} icon={Activity} color="text-[var(--theme-accent)]" />
        <KpiCard label="Completed" value={stats.completed} icon={Shield} color="text-blue-400" />
        <KpiCard label="Efficiency" value={`${stats.efficiency}%`} icon={TrendingUp} color="text-amber-400" />
        <KpiCard label="Total Items" value={stats.total} icon={Layers} color="text-purple-400" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Recent Activity */}
        <div className="col-span-12 lg:col-span-8 glass-card rounded-[2.5rem] bg-black/40 border-white/5 p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--theme-text)]/60">Recent Strategic Items</h3>
            <BarChart3 className="w-4 h-4 text-[var(--theme-accent)]/50" />
          </div>
          <div className="space-y-4">
            {items.slice(0, 5).map(item => (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent)] shadow-[0_0_8px_var(--theme-accent)] shrink-0" />
                  <div className="min-w-0">
                    <h4 className="text-[11px] font-bold text-[var(--theme-text)]/80 uppercase tracking-wider truncate">{item.title}</h4>
                    <p className="text-[9px] text-[var(--theme-text)]/20 font-light truncate max-w-[300px]">{item.description || 'No data recorded.'}</p>
                  </div>
                </div>
                <div className="text-[9px] text-[var(--theme-text)]/10 font-mono shrink-0">{new Date(item.updatedAt).toLocaleDateString()}</div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="py-20 text-center opacity-20 flex flex-col items-center gap-2">
                <Box className="w-10 h-10" />
                <p className="text-[10px] uppercase tracking-widest font-bold">No protocol items found</p>
              </div>
            )}
          </div>
        </div>

        {/* Fleet Scanner (Widgets) */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <LifeWheelBalance />
          <FrictionLog />
          <ArchiveRadar />
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="glass-card rounded-3xl p-6 bg-white/[0.01] border-white/5 hover:bg-white/[0.03] transition-all group border hover:border-white/10 flex items-center gap-5 shadow-2xl">
      <div className={clsx(
        "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 shadow-lg",
        "bg-white/[0.02] border-white/5 group-hover:bg-white/5",
        color
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[9px] font-bold text-[var(--theme-text)]/30 uppercase tracking-[0.2em] mb-0.5">{label}</p>
        <p className="text-xl font-black text-[var(--theme-text)]/90 tracking-tighter">{value}</p>
      </div>
    </div>
  );
}
