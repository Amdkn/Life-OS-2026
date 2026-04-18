import React from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  Eye, 
  Rocket, 
  Shield, 
  Infinity, 
  Compass, 
  Search, 
  Target, 
  Zap,
  Activity,
  BarChart3,
  Globe,
  Clock,
  Layers,
  MessageSquare
} from 'lucide-react';
import { ARMADA_FOLDERS } from '../../../../constants';
import AgentChatbot from '../AgentChatbot';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HorizonData {
  id: string;
  label: string;
  icon: any;
  range: string;
  focus: string;
  progress: number;
  status: 'Critical' | 'Stable' | 'Expanding';
  priorities: string[];
  allocation: { label: string, value: number, color: string }[];
  context: string;
}

const HORIZONS_DATA: Record<string, HorizonData> = {
  'H1 Observer': {
    id: 'h1',
    label: 'H1 Observer',
    icon: Eye,
    range: '0-90 Days',
    focus: 'Operational Excellence & Tactical Execution',
    progress: 85,
    status: 'Stable',
    priorities: ['Daily Execution Sprints', 'Metric Monitoring', 'Core Revenue Stability', 'Immediate Bug Resolution'],
    allocation: [
      { label: 'Tactical Ops', value: 75, color: '#f59e0b' },
      { label: 'Resource Buffering', value: 15, color: '#10b981' },
      { label: 'Drift Correction', value: 10, color: '#ef4444' }
    ],
    context: 'The Observer horizon ensures the current engine is running at peak efficiency. It is the tactical bridge between intention and reality.'
  },
  'H3 Explorer': {
    id: 'h3',
    label: 'H3 Explorer',
    icon: Rocket,
    range: '1-3 Years',
    focus: 'Strategic Growth & Innovation Pivots',
    progress: 45,
    status: 'Expanding',
    priorities: ['Product Iteration', 'Market Expansion', 'Strategic Partnerships', 'New Tech Integration'],
    allocation: [
      { label: 'R&D Sprints', value: 50, color: '#8b5cf6' },
      { label: 'Market Prototyping', value: 30, color: '#3b82f6' },
      { label: 'Scaling Architecture', value: 20, color: '#f59e0b' }
    ],
    context: 'The Explorer horizon identifies new territories for growth. It tests hypotheses and expands the system boundaries.'
  },
  'H10 Guardian': {
    id: 'h10',
    label: 'H10 Guardian',
    icon: Shield,
    range: '3-10 Years',
    focus: 'Systems Scaling & Institutional Resilience',
    progress: 25,
    status: 'Expanding',
    priorities: ['Infrastructure Architecture', 'Brand Moat Building', 'Team Culture Sovereignty', 'Asset Shielding'],
    allocation: [
      { label: 'Moat Construction', value: 40, color: '#10b981' },
      { label: 'Systemic Hardening', value: 40, color: '#ef4444' },
      { label: 'Talent Ecosystem', value: 20, color: '#8b5cf6' }
    ],
    context: 'The Guardian horizon protects the core assets and ensures long-term stability. It builds the moats that keep the system sovereign.'
  },
  'H30 Multi-Horizon': {
    id: 'h30',
    label: 'H30 Multi-Horizon',
    icon: Compass,
    range: '10-30 Years',
    focus: 'Legacy Architecture & Asset Shielding',
    progress: 12,
    status: 'Stable',
    priorities: ['Asset Diversification', 'Philanthropic Design', 'Generational Knowledge Transfer', 'Global Influence Mapping'],
    allocation: [
      { label: 'Trust Architecture', value: 60, color: '#3b82f6' },
      { label: 'Legacy Assets', value: 30, color: '#f59e0b' },
      { label: 'Governance Design', value: 10, color: '#10b981' }
    ],
    context: 'The Multi-Horizon transition focuses on generational stability and the shielding of complex asset trees.'
  },
  'H90 Cycle Keeper': {
    id: 'h90',
    label: 'H90 Cycle Keeper',
    icon: Infinity,
    range: '30-90 Years',
    focus: 'Total Legacy & Infinite Game Execution',
    progress: 5,
    status: 'Stable',
    priorities: ['Cosmic Alignment', 'Infinite Game Protocols', 'Final Architecture', 'Ecosystem Fruition'],
    allocation: [
      { label: 'Infinite Game', value: 80, color: '#8b5cf6' },
      { label: 'Ethical Legacy', value: 15, color: '#10b981' },
      { label: 'Final Handover', value: 5, color: '#ef4444' }
    ],
    context: 'The Cycle Keeper horizon looks beyond a single lifetime. it ensures the work continues as a self-sustaining ecosystem.'
  }
};

const HorizonCard: React.FC<{ horizon: HorizonData, delay?: number, isActive?: boolean }> = ({ horizon, delay = 0, isActive }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className={cn(
      "glass-card p-10 border relative transition-all duration-700",
      isActive ? "border-[var(--brass)] bg-[var(--brass)]/10 shadow-[0_0_50px_rgba(184,134,11,0.15)] ring-1 ring-[var(--brass)]/20" : "border-[var(--glass-border-subtle)] hover:border-[var(--brass)]/30"
    )}
  >
    <div className="flex flex-col lg:flex-row gap-12">
      {/* Visual Identity */}
      <div className="lg:w-1/3 flex flex-col items-center lg:items-start text-center lg:text-left gap-6 border-b lg:border-b-0 lg:border-r border-[var(--glass-border-subtle)] pb-8 lg:pb-0 lg:pr-12">
        <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[var(--brass)]/20 to-transparent border border-[var(--brass)]/30 flex items-center justify-center shadow-2xl backdrop-blur-md mb-2">
          <horizon.icon className="w-12 h-12 text-[var(--brass)]" />
        </div>
        <div>
          <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none mb-3">
            {horizon.label}
          </h3>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
             <div className="flex items-center gap-2 px-3 py-1 bg-black/40 border border-[var(--brass)]/20 rounded-full">
                <Clock className="w-3 h-3 text-[var(--brass)]" />
                <span className="text-[10px] font-black text-[var(--brass)] uppercase tracking-widest">{horizon.range}</span>
             </div>
             <span className={cn(
               "text-[9px] font-black uppercase px-3 py-1 rounded-full border tracking-widest shadow-sm",
               horizon.status === 'Expanding' ? "text-blue-400 border-blue-400/20 bg-blue-400/5 shadow-[0_0_15px_rgba(96,165,250,0.3)]" : "text-[var(--brass)] border-[var(--brass)]/20 bg-[var(--brass)]/5"
             )}>
               {horizon.status}
             </span>
          </div>
        </div>
      </div>

      {/* Strategic Content */}
      <div className="flex-1 space-y-8">
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest italic flex items-center gap-2">
            <Search className="w-3.5 h-3.5 opacity-40 text-[var(--brass)]" /> Horizon Strategic Focus
          </h4>
          <p className="text-sm text-white italic leading-relaxed font-medium">
            "{horizon.focus}"
          </p>
          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed italic opacity-80">
            {horizon.context}
          </p>
        </div>

        <div className="pt-4">
          <div className="flex justify-between items-end mb-3">
            <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest">Vision Progression Score</span>
            <span className="text-xl font-black italic text-white tracking-tighter" style={{ textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
              {horizon.progress}%
            </span>
          </div>
          <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/10 p-[1px] relative shadow-inner">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${horizon.progress}%` }}
               transition={{ duration: 2, delay: delay + 0.3, ease: [0.16, 1, 0.3, 1] }}
               className="h-full bg-gradient-to-r from-[var(--brass)]/20 via-[var(--brass)]/60 to-[var(--brass)] rounded-full shadow-[0_0_20px_rgba(184,134,11,0.5)]" 
            />
          </div>
        </div>

        {/* Resource Allocation Sub-Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {horizon.allocation.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors group">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest group-hover:text-white transition-colors">{item.label}</span>
                <span className="text-[10px] font-mono font-bold text-white opacity-40 group-hover:opacity-100">{item.value}%</span>
              </div>
              <div className="h-1 w-full bg-black/20 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Metrics */}
      <div className="lg:w-1/4 flex flex-col gap-8 lg:border-l border-[var(--glass-border-subtle)] lg:pl-10">
        <div>
          <h4 className="text-[10px] font-black text-white uppercase tracking-[.2em] mb-6 flex items-center gap-2">
            <Target className="w-4 h-4 text-[var(--brass)]" /> Horizon Milestones
          </h4>
          <div className="space-y-4">
            {horizon.priorities.map((item, i) => (
              <div key={i} className="flex items-start gap-3 group/item cursor-pointer">
                <div className="mt-1 w-1.5 h-1.5 rounded-sm bg-[var(--brass)] opacity-20 group-hover/item:opacity-100 group-hover/item:rotate-45 transition-all duration-300" />
                <span className="text-[10px] text-[var(--text-secondary)] group-hover:text-white transition-colors leading-snug italic">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-white/5">
           <div className="flex items-center gap-3 mb-2">
              <Activity className="w-4 h-4 text-[var(--brass)] opacity-40" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest">Protocol Sync</span>
           </div>
           <div className="text-[9px] text-[var(--text-muted)] font-mono uppercase tracking-tighter">
              DR-V2.1::{horizon.id.toUpperCase()}_ALIGNED
           </div>
        </div>
      </div>
    </div>
  </motion.div>
);

interface IkigaiHorizonsProps {
  activeSubItem: string | null;
}

const IkigaiHorizons: React.FC<IkigaiHorizonsProps> = ({ activeSubItem }) => {
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const isOverview = !activeSubItem || activeSubItem === 'SEP:Horizons (Vision)';
  const activeHorizon = HORIZONS_DATA[activeSubItem || ''] || HORIZONS_DATA['H1 Observer'];
  const manager = ARMADA_FOLDERS.find(f => f.id === 'orville-a2');

  return (
    <div className="h-full flex flex-col p-8 lg:p-12 overflow-y-auto custom-scrollbar relative">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Infinity className="w-[30rem] h-[30rem] text-[var(--brass)]" />
      </div>

      <header className="mb-16 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="flex items-center gap-8 mb-8"
        >
          <div className="relative group/icon-container">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--brass)]/30 via-transparent to-black border border-[var(--brass)]/30 flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all group-hover/icon-container:border-[var(--brass)]/50">
              {activeHorizon ? <activeHorizon.icon className="w-10 h-10 text-[var(--brass)]" /> : <Layers className="w-10 h-10 text-[var(--brass)]" />}
            </div>

            {/* A2 Access Button */}
            <motion.button
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsChatOpen(true)}
              className="absolute -top-2 -right-12 p-2 rounded-xl glass border border-[var(--brass)]/40 text-[var(--brass)] shadow-lg hover:bg-[var(--brass)]/10 hover:border-[var(--brass)] transition-all group/btn"
              title="A2 Manager Uplink"
            >
              <MessageSquare className="w-4 h-4 group-hover/btn:animate-pulse" />
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-[var(--brass)] text-black text-[8px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap tracking-widest uppercase">
                A2 Access
              </div>
            </motion.button>
          </div>
          <div>
            <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none mb-3">
              {isOverview ? "Horizon Chronology" : activeSubItem}
            </h1>
            <div className="flex items-center gap-4">
              <span className="h-0.5 w-16 bg-gradient-to-r from-[var(--brass)] to-transparent opacity-60" />
              <p className="text-[11px] font-black text-[var(--brass)] uppercase tracking-[0.4em] opacity-90 italic">
                {isOverview ? "Total Strategic Oversite of Future Assets" : "Deep-Scale Strategic Telemetry"}
              </p>
            </div>
          </div>
        </motion.div>
        
        <p className="max-w-3xl text-[12px] text-[var(--text-secondary)] leading-relaxed italic border-l-2 border-[var(--brass)]/20 pl-8 opacity-80">
           The Ikigai Vision Architecture spans five temporal windows. By synchronizing the immediate 90-day Observer cycle with the generational 90-year Keeper legacy, we maintain perfect equilibrium between tactical survival and architectural eternity.
        </p>
      </header>

      <div className="space-y-10 relative z-10 pb-20">
        {isOverview ? (
          Object.values(HORIZONS_DATA).map((horizon, i) => (
            <HorizonCard key={horizon.id} horizon={horizon} delay={0.1 * i} />
          ))
        ) : (
          <div className="space-y-12">
            <HorizonCard horizon={activeHorizon} isActive />
            
            {/* Horizon Connection Map */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               <div className="lg:col-span-2 glass-card p-10 border border-[var(--glass-border-subtle)] relative overflow-hidden bg-black/20">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                     <Globe className="w-48 h-48 text-white" />
                  </div>
                  <h4 className="text-xs font-black text-white uppercase tracking-[.3em] mb-10 flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-[var(--brass)]" /> Temporal Scale Telemetry
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 h-full flex flex-col justify-center">
                        <span className="text-[10px] font-black text-[var(--brass)] uppercase tracking-widest mb-4 block">Strategic Focus Balance</span>
                        <div className="h-40 flex items-end gap-3 justify-center">
                          {[60, 40, 80, 50, 90].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                              <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                className="w-full rounded-t-lg bg-[var(--brass)]/20 border-t border-[var(--brass)]/40 relative group"
                              >
                                 <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                              </motion.div>
                              <span className="text-[8px] font-bold text-[var(--text-muted)]">H{i === 0 ? '1' : i === 1 ? '3' : i === 2 ? '10' : i === 3 ? '30' : '90'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                        <h5 className="text-[9px] font-black text-white uppercase tracking-widest mb-4">Drift Analysis</h5>
                        <p className="text-[11px] text-[var(--text-muted)] italic leading-relaxed mb-6">
                          Structural integrity remains within nominal parameters (±0.04% deviance). Cross-horizon synchronization efficiency: 98.2%.
                        </p>
                        <div className="flex items-center gap-4 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Protocol: SAFE_EXIT_ARCH</span>
                        </div>
                      </div>

                      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                        <h5 className="text-[9px] font-black text-white uppercase tracking-widest mb-4">Inter-Horizon Bridge</h5>
                        <div className="flex items-center justify-between text-[10px]">
                           <span className="text-[var(--text-muted)] italic">H{activeHorizon.id.slice(1)} Feed Source</span>
                           <span className="text-white font-bold uppercase tracking-tighter">Passive</span>
                        </div>
                        <div className="h-px bg-white/5 my-3" />
                        <div className="flex items-center justify-between text-[10px]">
                           <span className="text-[var(--text-muted)] italic">Strategic Overflow</span>
                           <span className="text-[var(--brass)] font-black uppercase tracking-tighter">Active - 12WY</span>
                        </div>
                      </div>
                    </div>
                  </div>
               </div>

               <div className="glass-card p-10 border border-[var(--glass-border-subtle)] bg-[var(--brass)]/5 flex flex-col justify-center items-center text-center gap-8 group">
                  <div className="w-20 h-20 rounded-full bg-black/40 border-2 border-[var(--brass)]/20 flex items-center justify-center relative shadow-2xl">
                     <div className="absolute inset-0 rounded-full border border-[var(--brass)]/40 animate-ping opacity-20" />
                     <Zap className="w-10 h-10 text-[var(--brass)] animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-[.2em] mb-4 group-hover:text-[var(--brass)] transition-colors">Vision Drift Watcher</h4>
                    <p className="text-[10px] text-[var(--text-muted)] italic leading-relaxed max-w-xs mx-auto">
                      "Automated detection of strategic drift in {activeSubItem}. The system is currently neutralizing tactical noise to protect long-term architectural goals."
                    </p>
                  </div>
                  <button className="px-6 py-2 bg-[var(--brass)]/10 border border-[var(--brass)]/30 rounded-xl text-[9px] font-black text-[var(--brass)] uppercase tracking-[.3em] hover:bg-[var(--brass)]/20 transition-all">
                    Calibrate Horizon
                  </button>
               </div>
            </div>
          </div>
        )}
      </div>
      {/* Agent Chatbot Overlay */}
      <AgentChatbot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        manager={manager}
      />
    </div>
  );
};

const CheckCircle2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
);

export default IkigaiHorizons;



