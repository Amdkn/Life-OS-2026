import React from 'react';
import { motion } from 'motion/react';
import { 
  Rocket, 
  Shield, 
  Database, 
  Archive, 
  CheckCircle2, 
  TrendingUp, 
  Zap,
  Activity as ActivityIcon,
  BarChart as BarChartIcon,
  Shield as ShieldIcon,
  MessageSquare,
  Search,
  Settings,
  type LucideIcon
} from 'lucide-react';
import { ARMADA_FOLDERS } from '../../../../constants';
import AgentChatbot from '../AgentChatbot';

interface ParaData {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  description: string;
  organization: number;
  status: string;
  priorities: string[];
  metrics: { label: string, value: string, trend: 'up' | 'down' | 'stable' }[];
  deepInsight: string;
  agentName: string;
}

const PARA_DATA: Record<string, ParaData> = {
  'Projects': {
    id: 'projects',
    label: 'Projects',
    icon: Rocket,
    color: '#3b82f6', // Blue
    description: 'Active initiatives with a concrete goal and a deadline. The focused missions of the Enterprise.',
    organization: 88,
    status: 'In Flight',
    priorities: ['Project Picard (AI Agent)', 'Macro-Sovereign Frameworks', 'ASpace_OS_V2 Migration'],
    metrics: [
      { label: 'Mission Velocity', value: '82%', trend: 'up' },
      { label: 'Active Sprints', value: '4', trend: 'stable' },
      { label: 'Success Probability', value: '94%', trend: 'up' }
    ],
    deepInsight: 'Project Picard has high momentum. Current mission is reaching a stable orbit around H1.',
    agentName: 'Jean-Luc Picard'
  },
  'Areas': {
    id: 'areas',
    label: 'Areas',
    icon: Shield,
    color: '#10b981', // Emerald
    description: 'Ongoing responsibilities that require a consistently high standard over time.',
    organization: 92,
    status: 'Logical',
    priorities: ['System Maintenance', 'Quality Assurance', 'Personal Infrastructure'],
    metrics: [
      { label: 'Logic Consistency', value: '100%', trend: 'stable' },
      { label: 'Stability Index', value: '96%', trend: 'up' },
      { label: 'Drift Warning', value: '0.001%', trend: 'down' }
    ],
    deepInsight: 'Systemic stability is at its peak. Maintaining these areas is logical for long-term survival.',
    agentName: 'Spock'
  },
  'Resources': {
    id: 'resources',
    label: 'Resources',
    icon: Settings,
    color: '#f59e0b', // Amber
    description: 'Topics of interest and reference materials. The library and tools of the crew.',
    organization: 75,
    status: 'Accumulating',
    priorities: ['Internal Knowledge Base', 'Toolchain Refinement', 'Market Research Docs'],
    metrics: [
      { label: 'Retrieval Speed', value: 'Fast', trend: 'up' },
      { label: 'Entropy Delta', value: '-4%', trend: 'up' },
      { label: 'Knowledge Depth', value: 'Mid', trend: 'stable' }
    ],
    deepInsight: 'Knowledge entropy is falling. Engineering new retrieval protocols for faster access.',
    agentName: 'Geordi La Forge'
  },
  'Archive': {
    id: 'archive',
    label: 'Archive',
    icon: Archive,
    color: '#64748b', // Slate
    description: 'Historical records, completed projects, and inactive resources. Permanent storage.',
    organization: 85,
    status: 'Indexed',
    priorities: ['Mission Log Cleanup', 'Data Compression', 'Cold Storage Audit'],
    metrics: [
      { label: 'Memory Retention', value: 'Perfect', trend: 'stable' },
      { label: 'Search Efficiency', value: '98%', trend: 'up' },
      { label: 'Compression Ratio', value: '4:1', trend: 'up' }
    ],
    deepInsight: 'The archives are vast but perfectly indexed. All historical missions are accessible via neural-link.',
    agentName: 'Data'
  }
};

const MetricRow: React.FC<{ label: string, value: string, trend: string, color: string }> = ({ label, value, trend, color }) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all">
    <div className="flex items-center gap-3">
      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></div>
      <span className="text-[10px] font-black text-white uppercase tracking-widest">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-mono text-white font-bold">{value}</span>
      <TrendingUp className={`w-3 h-3 ${trend === 'up' ? 'text-green-400 rotate-0' : trend === 'down' ? 'text-red-400 rotate-180' : 'text-yellow-400 rotate-90'} opacity-60`} />
    </div>
  </div>
);

interface ParaFrameworkProps {
  activeSubItem: string | null;
}

const ParaFramework: React.FC<ParaFrameworkProps> = ({ activeSubItem }) => {
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const activeItem = PARA_DATA[activeSubItem || ''] || PARA_DATA['Projects'];
  const manager = ARMADA_FOLDERS.find(f => f.id === 'enterprise-a2');

  return (
    <div className="h-full flex flex-col p-8 overflow-y-auto custom-scrollbar relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <activeItem.icon className="w-64 h-64" style={{ color: activeItem.color }} />
      </div>

      {/* Header Section */}
      <section className="mb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6 mb-6"
        >
          <div className="relative group/icon-container">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--brass)]/20 to-transparent border border-[var(--brass)]/30 flex items-center justify-center shadow-2xl backdrop-blur-md transition-all group-hover/icon-container:border-[var(--brass)]/50">
              <activeItem.icon className="w-10 h-10" style={{ color: activeItem.color }} />
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
            <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none mb-2">
              {activeItem.label}
            </h1>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[var(--brass)] opacity-40" />
              <p className="text-[10px] font-black text-[var(--brass)] uppercase tracking-[0.4em] opacity-80 italic">
                Organizational Standard: PARA Framework
              </p>
            </div>
          </div>
        </motion.div>
        
        <p className="max-w-2xl text-[11px] text-[var(--text-secondary)] leading-relaxed italic border-l-2 pl-6" style={{ borderColor: activeItem.color }}>
          {activeItem.description}
        </p>
      </section>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Left Column: Metrics & Progress */}
        <div className="space-y-8">
          <div className="glass-card p-8 border-[var(--glass-border-subtle)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ActivityIcon className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[var(--brass)]" /> Structural Performance
            </h3>
            
            <div className="space-y-4">
              {activeItem.metrics.map((m) => (
                <MetricRow key={m.label} {...m} color={activeItem.color} />
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-white/[0.05]">
              <div className="flex justify-between items-end mb-3">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Organization Health Score</span>
                <span className="text-xl font-black italic text-white" style={{ textShadow: `0 0 10px ${activeItem.color}44` }}>{activeItem.organization}%</span>
              </div>
              <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden p-[1px]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${activeItem.organization}%` }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full shadow-[0_0_15px_currentColor]"
                  style={{ backgroundColor: activeItem.color, color: activeItem.color }}
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-8 border-[var(--glass-border-subtle)] bg-[var(--brass)]/5">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <BarChartIcon className="w-4 h-4 text-[var(--brass)]" /> System Historicals
            </h3>
            <div className="h-32 flex items-end gap-1.5 pt-4">
              {[88, 92, 85, 94, 80, 85, 92, 88, 86, 94, 88].map((h, i) => (
                <motion.div 
                  key={i} 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.05 * i }}
                  className="flex-1 rounded-sm opacity-20 hover:opacity-100 transition-all cursor-crosshair group relative" 
                  style={{ backgroundColor: activeItem.color }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-[8px] font-black text-white rounded hidden group-hover:block whitespace-nowrap z-50 border border-white/10 uppercase italic">
                    Levelings {i+1}: {h}%
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Priorities & Context */}
        <div className="space-y-8">
          <div className="glass-card p-8 border-[var(--glass-border-subtle)] bg-[var(--glass-l2-bg)] shadow-inner">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-8">Active Files ({activeItem.agentName})</h3>
            <ul className="space-y-6">
              {activeItem.priorities.map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.01] border border-white/5 hover:border-[var(--brass)]/20 transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[var(--brass)]/5 border border-[var(--brass)]/20 flex items-center justify-center shrink-0 group-hover:bg-[var(--brass)]/10 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-[var(--brass)] opacity-40 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[var(--text-secondary)] italic leading-none block mb-1 group-hover:text-white transition-colors">
                      {item}
                    </span>
                    <span className="text-[8px] text-[var(--text-muted)] uppercase font-black tracking-widest">Active File_{i+1}</span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-8 border-[var(--glass-border-subtle)] relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--brass)] to-transparent" />
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldIcon className="w-4 h-4 text-[var(--brass)]" /> Enterprise Arch-Protocol
            </h3>
            <p className="text-[12px] text-[var(--text-muted)] leading-relaxed italic pr-4">
              "{activeItem.deepInsight}"
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="text-[9px] font-black text-[var(--brass)] uppercase tracking-widest">Board Sync: enterprise-a2</span>
              <div className="h-px bg-[var(--brass)]/20 flex-1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 border-white/5 text-center hover:bg-white/[0.02] transition-colors">
               <div className="text-[10px] text-[var(--text-muted)] uppercase font-black mb-1">Structure Type</div>
               <div className="text-sm font-black text-white italic tracking-tighter uppercase">PARA Universal</div>
            </div>
            <div className="glass-card p-4 border-white/5 text-center hover:bg-white/[0.02] transition-colors">
               <div className="text-[10px] text-[var(--text-muted)] uppercase font-black mb-1">Bridge Lead</div>
               <div className="text-sm font-black text-[var(--brass)] italic tracking-tighter uppercase">{activeItem.agentName}</div>
            </div>
          </div>
        </div>
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

export default ParaFramework;



