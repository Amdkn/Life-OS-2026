import React from 'react';
import { Cpu, Zap, MessageSquare, Target, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { useFleetGatewayStore, AgentStrata, CostTier } from '../../../stores/fleet-gateway.store';

const STRATA_CONFIG: Record<AgentStrata, { label: string; icon: any; color: string }> = {
  'a3-background': { label: 'A3 (Background/VFS)', icon: Cpu, color: 'text-slate-400' },
  'a2-logic':      { label: 'A2 (Logic/Logic)',      icon: Target, color: 'text-blue-400' },
  'a1-chat':       { label: 'A1 (Interactive)',   icon: MessageSquare, color: 'text-emerald-400' },
  'a0-strategic':  { label: 'A0 (Strategic)',     icon: Zap, color: 'text-amber-400' },
};

export const ModelRouter: React.FC = () => {
  const { modelAllocations, setModelForStrata, connectors } = useFleetGatewayStore();

  return (
    <div className="space-y-3">
      {modelAllocations.map(alloc => (
        <StrataRow 
          key={alloc.strata} 
          alloc={alloc} 
          onUpdate={setModelForStrata}
          providers={connectors.map(c => c.id)}
        />
      ))}

      <div className="mt-6 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          <span className="text-[10px] font-bold text-[var(--theme-text)]/60 uppercase tracking-widest">Global Fleet Efficiency</span>
        </div>
        <div className="flex gap-4">
           <div className="text-right">
             <div className="text-[10px] font-bold text-[var(--theme-text)]/30 uppercase">Free Strata</div>
             <div className="text-sm font-bold text-[var(--theme-text)] font-mono">{modelAllocations.filter(a => a.costTier === 'free').length} / 4</div>
           </div>
           <div className="text-right">
             <div className="text-[10px] font-bold text-[var(--theme-text)]/30 uppercase">Paid Strata</div>
             <div className="text-sm font-bold text-emerald-400 font-mono">{modelAllocations.filter(a => a.costTier === 'paid').length} / 4</div>
           </div>
        </div>
      </div>
    </div>
  );
};

interface RowProps {
  alloc: any;
  onUpdate: any;
  providers: string[];
}

const StrataRow: React.FC<RowProps> = ({ alloc, onUpdate, providers }) => {
  const config = STRATA_CONFIG[alloc.strata as AgentStrata];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
      <div className={`w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center ${config.color}`}>
        <Icon className="w-5 h-5" />
      </div>

      <div className="flex-1">
        <h4 className="text-xs font-bold text-[var(--theme-text)]/80 uppercase tracking-tight mb-1">{config.label}</h4>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-mono text-[var(--theme-text)]/30 uppercase">{alloc.provider}</span>
           <span className="text-[10px] font-mono text-[var(--theme-text)]/20">•</span>
           <span className={`text-[10px] font-bold uppercase ${alloc.costTier === 'free' ? 'text-emerald-400/50' : 'text-amber-400/50'}`}>
             {alloc.costTier}
           </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative group/select">
          <select 
            value={alloc.model}
            onChange={(e) => onUpdate(alloc.strata, e.target.value, alloc.provider, alloc.costTier)}
            className="appearance-none bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-[11px] text-[var(--theme-text)]/70 font-medium pr-10 focus:border-emerald-500/40 outline-none cursor-pointer"
          >
            <option value={alloc.model}>{alloc.model}</option>
            <option value="minimax-m2.5">minimax-m2.5</option>
            <option value="glm-4.7-flash">glm-4.7-flash</option>
            <option value="mistral-small-latest">mistral-small</option>
            <option value="gpt-4o-mini">gpt-4o-mini</option>
            <option value="codex-alpha">codex-alpha</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--theme-text)]/20 pointer-events-none" />
        </div>

        <button 
          onClick={() => onUpdate(alloc.strata, alloc.model, alloc.provider, alloc.costTier === 'free' ? 'paid' : 'free')}
          className={`px-3 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest border transition-all
            ${alloc.costTier === 'free' ? 'border-emerald-500/20 text-emerald-400/60 hover:bg-emerald-500/10' : 'border-amber-500/20 text-amber-400/60 hover:bg-amber-500/10'}
          `}
        >
          {alloc.costTier}
        </button>
      </div>
    </div>
  );
};

