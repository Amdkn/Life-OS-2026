/** App Store & Settings Dashboard — System Overview (V0.1.9) */
import { useMemo } from 'react';
import { useOsSettingsStore } from '../../../stores/os-settings.store';
import { getAllApps } from '../../../lib/app-registry';
import { 
  Monitor, Layout, Smartphone, CheckCircle2, 
  Settings, Zap, Palette, Globe,
  ShieldCheck, Activity, HardDrive
} from 'lucide-react';
import { clsx } from 'clsx';

interface StoreDashboardProps {
  embedded?: boolean;
}

export default function StoreDashboard({ embedded }: StoreDashboardProps) {
  const { theme, animations, dockPosition, language, toggleAnimations } = useOsSettingsStore();
  const installedApps = useMemo(() => getAllApps(), []);

  return (
    <div className={clsx(
      "flex-1 flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-1000",
      embedded ? "p-0" : "p-10"
    )}>
      {/* OS Health & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <HealthCard label="Active Modules" value={installedApps.length} icon={Layout} color="text-pink-400" />
        <HealthCard label="OS Integrity" value="100%" icon={ShieldCheck} color="text-emerald-400" />
        <HealthCard label="Neural Load" value="12%" icon={Activity} color="text-blue-400" />
        <HealthCard label="Storage" value="2.4MB" icon={HardDrive} color="text-amber-400" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Installed Apps Grid */}
        <div className="col-span-12 lg:col-span-8 glass-card rounded-[2.5rem] bg-black border-white/10 p-8 flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--theme-text)]/60 mb-8">Installed Neural Protocols</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {installedApps.map(app => (
              <div key={app.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center gap-3 group hover:bg-white/[0.05] transition-all">
                <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center border border-white/10 group-hover:border-pink-500/30 transition-all">
                   <div className="text-lg opacity-60 group-hover:opacity-100 transition-opacity">
                     {app.id === 'para' ? '📂' : app.id === 'ikigai' ? '🧿' : app.id === 'life-wheel' ? '🎡' : '🤖'}
                   </div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-[var(--theme-text)]/80 uppercase tracking-widest">{app.name}</p>
                  <p className="text-[8px] text-[var(--theme-text)]/20 font-bold mt-0.5">v{app.version}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Settings */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          <div className="glass-card rounded-[2.5rem] bg-pink-500/[0.02] border-pink-500/10 p-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-pink-400/80 mb-8">Quick System Access</h3>
            <div className="space-y-4">
              <SettingsToggle label="Neural Animations" active={animations} onToggle={toggleAnimations} icon={Zap} />
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3">
                  <Palette className="w-4 h-4 text-[var(--theme-text)]/20" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--theme-text)]/60">Theme</span>
                </div>
                <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest">{theme}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-[var(--theme-text)]/20" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--theme-text)]/60">Language</span>
                </div>
                <span className="text-[10px] font-black text-[var(--theme-text)]/40 uppercase tracking-widest">{language}</span>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-[2rem] bg-black/20 border-white/5 p-8 flex items-center justify-between group cursor-pointer hover:border-emerald-500/20 transition-all">
            <div className="flex items-center gap-4">
               <Monitor className="w-5 h-5 text-[var(--theme-text)]/20 group-hover:text-emerald-400 transition-colors" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--theme-text)]/40 group-hover:text-[var(--theme-text)]/80 transition-colors">Developer Console</span>
            </div>
            <Activity className="w-4 h-4 text-[var(--theme-text)]/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

function HealthCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="glass-card rounded-3xl p-6 bg-white/[0.01] border-white/5 hover:bg-white/[0.03] transition-all border flex items-center gap-5">
      <div className={clsx(
        "w-12 h-12 rounded-2xl flex items-center justify-center border bg-white/[0.02] border-white/5",
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

function SettingsToggle({ label, active, onToggle, icon: Icon }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 group cursor-pointer hover:bg-white/[0.04] transition-all" onClick={onToggle}>
      <div className="flex items-center gap-3">
        <Icon className={clsx("w-4 h-4 transition-colors", active ? "text-pink-400" : "text-[var(--theme-text)]/20")} />
        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--theme-text)]/60">{label}</span>
      </div>
      <div className={clsx(
        "w-10 h-5 rounded-full border p-1 transition-all duration-500 flex",
        active ? "bg-pink-500/20 border-pink-500/40 justify-end" : "bg-black/40 border-white/10 justify-start"
      )}>
        <div className={clsx("w-2.5 h-2.5 rounded-full transition-all", active ? "bg-pink-400" : "bg-white/20")} />
      </div>
    </div>
  );
}

