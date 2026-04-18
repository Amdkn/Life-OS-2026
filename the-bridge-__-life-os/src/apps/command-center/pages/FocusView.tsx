/** FocusView — GTD Overview skeleton (P5.4) */
import { Target, ListTodo, Clock, Zap } from 'lucide-react';

export function FocusView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="col-span-full lg:col-span-2 glass-card rounded-2xl p-8 border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-3 mb-8">
          <Target className="w-6 h-6 text-emerald-400" />
          <h2 className="text-lg font-bold text-[var(--theme-text)] uppercase tracking-widest font-outfit">Current Mission</h2>
        </div>
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
            <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-2">High Priority</h3>
            <p className="text-[var(--theme-text)]/80 text-sm leading-relaxed">Finalize V0.1.1 Deployment & Trinity Dashboard integration.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <StatCard icon={ListTodo} label="Next Actions" value="12" color="text-blue-400" />
            <StatCard icon={Clock} label="Waiting For" value="3" color="text-amber-400" />
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-8 border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-3 mb-8">
          <Zap className="w-6 h-6 text-pink-400" />
          <h2 className="text-lg font-bold text-[var(--theme-text)] uppercase tracking-widest font-outfit">Energy Flow</h2>
        </div>
        <div className="h-48 flex items-end justify-between gap-2 px-2">
          {[40, 70, 90, 60, 30, 80, 50].map((h, i) => (
            <div key={i} className="flex-1 bg-white/5 rounded-t-lg relative group overflow-hidden">
              <div 
                className="absolute bottom-0 w-full bg-gradient-to-t from-pink-500/40 to-pink-400/20 transition-all duration-1000" 
                style={{ height: `${h}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-[10px] font-bold text-[var(--theme-text)]/40 uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-xl font-bold text-[var(--theme-text)] font-mono">{value}</span>
    </div>
  );
}

