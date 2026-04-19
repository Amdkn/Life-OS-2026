import React from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  Globe, 
  Briefcase, 
  GraduationCap, 
  CheckCircle2, 
  TrendingUp,
  type LucideIcon,
  Zap,
  Activity,
  BarChart,
  Shield,
  MessageSquare
} from 'lucide-react';
import { ARMADA_FOLDERS } from '../../../../constants';
import AgentChatbot from '../AgentChatbot';

interface PillarData {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  description: string;
  alignment: number;
  status: string;
  priorities: string[];
  metrics: { label: string, value: string, trend: 'up' | 'down' | 'stable' }[];
  deepInsight: string;
}

const PILLARS_DATA: Record<string, PillarData> = {
  'Passion': {
    id: 'passion',
    label: 'Passion',
    icon: Heart,
    color: '#ec4899', // Pink
    description: 'What you love and what sets your soul on fire. The reservoir of creative energy.',
    alignment: 92,
    status: 'Optimal',
    priorities: ['Creative Deep Work (4h/day)', 'Daily Curiosity Rituals', 'Project Flow Optimization'],
    metrics: [
      { label: 'Flow Consistency', value: '88%', trend: 'up' },
      { label: 'Creative Burnout', value: 'Low', trend: 'stable' },
      { label: 'Dopamine Delta', value: '+12%', trend: 'up' }
    ],
    deepInsight: 'Current high alignment in Passion is driving H1 stability. Unit is primed for H3 Explorer pivots.'
  },
  'Mission': {
    id: 'mission',
    label: 'Mission',
    icon: Globe,
    color: '#10b981', // Emerald
    description: 'What the world needs and how you contribute. Your impact on the ecosystem.',
    alignment: 85,
    status: 'High',
    priorities: ['Philanthropic Mapping', 'Open Source Contribution', 'Community Mentorship'],
    metrics: [
      { label: 'Network Effect', value: '1.2M', trend: 'up' },
      { label: 'Service Velocity', value: 'Fast', trend: 'up' },
      { label: 'Altruism Index', value: '0.82', trend: 'stable' }
    ],
    deepInsight: 'Mission resonance is lagging H10 Guardian needs. Increasing service bandwidth recommended.'
  },
  'Vocation': {
    id: 'vocation',
    label: 'Vocation',
    icon: GraduationCap,
    color: '#8b5cf6', // Violet
    description: 'What you are good at and your natural talents. The craft and technical mastery.',
    alignment: 88,
    status: 'Active',
    priorities: ['Rust Systems Mastery', 'AI Orchestration Patterns', 'Architecture Design Sprints'],
    metrics: [
      { label: 'Technique Mastery', value: '94%', trend: 'up' },
      { label: 'Learning Debt', value: '30h', trend: 'down' },
      { label: 'Specialization Depth', value: 'High', trend: 'stable' }
    ],
    deepInsight: 'Technical debt is falling. Transitioning from "Maker" to "Architect" profile in H3.'
  },
  'Profession': {
    id: 'profession',
    label: 'Profession',
    icon: Briefcase,
    color: '#3b82f6', // Blue
    description: 'What you can be paid for and market viability. The value capture engine.',
    alignment: 78,
    status: 'Vibrant',
    priorities: ['SaaS Revenue Scaling', 'Equity Shield Architecture', 'Fiscal Efficiency Audits'],
    metrics: [
      { label: 'MRR Growth', value: '22%', trend: 'up' },
      { label: 'CAC Efficiency', value: '3.4x', trend: 'stable' },
      { label: 'Runway Delta', value: '+5m', trend: 'up' }
    ],
    deepInsight: 'Market resonance is strong, but fiscal shields need reinforcing for H30 long-term assets.'
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
      <TrendingUp className={`w-3 h-3 ${trend === 'up' ? 'text-green-400 rotate-0' : 'text-yellow-400 rotate-90'} opacity-60`} />
    </div>
  </div>
);

interface IkigaiPillarsProps {
  activeSubItem: string | null;
}

const IkigaiPillars: React.FC<IkigaiPillarsProps> = ({ activeSubItem }) => {
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const activePillar = PILLARS_DATA[activeSubItem || ''] || PILLARS_DATA['Passion'];
  const manager = ARMADA_FOLDERS.find(f => f.id === 'orville-a2');

  return (
    <div className="h-full flex flex-col p-8 overflow-y-auto custom-scrollbar relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <activePillar.icon className="w-64 h-64" style={{ color: activePillar.color }} />
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
              <activePillar.icon className="w-10 h-10" style={{ color: activePillar.color }} />
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
              {activePillar.label}
            </h1>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[var(--brass)] opacity-40" />
              <p className="text-[10px] font-black text-[var(--brass)] uppercase tracking-[0.4em] opacity-80 italic">
                Pillar Telemetry & Strategic Alignment
              </p>
            </div>
          </div>
        </motion.div>
        
        <p className="max-w-2xl text-[11px] text-[var(--text-secondary)] leading-relaxed italic border-l-2 pl-6" style={{ borderColor: activePillar.color }}>
          {activePillar.description}
        </p>
      </section>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Left Column: Metrics & Progress */}
        <div className="space-y-8">
          <div className="glass-card p-8 border-[var(--glass-border-subtle)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Activity className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[var(--brass)]" /> Real-time Performance
            </h3>
            
            <div className="space-y-4">
              {activePillar.metrics.map((m) => (
                <MetricRow key={m.label} {...m} color={activePillar.color} />
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-white/[0.05]">
              <div className="flex justify-between items-end mb-3">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Global Alignment Score</span>
                <span className="text-xl font-black italic text-white" style={{ textShadow: `0 0 10px ${activePillar.color}44` }}>{activePillar.alignment}%</span>
              </div>
              <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden p-[1px]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${activePillar.alignment}%` }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full shadow-[0_0_15px_currentColor]"
                  style={{ backgroundColor: activePillar.color, color: activePillar.color }}
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-8 border-[var(--glass-border-subtle)] bg-[var(--brass)]/5">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <BarChart className="w-4 h-4 text-[var(--brass)]" /> Historical Data
            </h3>
            <div className="h-32 flex items-end gap-1.5 pt-4">
              {[45, 67, 43, 89, 76, 92, 85, 92, 78, 94, 88].map((h, i) => (
                <motion.div 
                  key={i} 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.05 * i }}
                  className="flex-1 rounded-sm opacity-20 hover:opacity-100 transition-all cursor-crosshair group relative" 
                  style={{ backgroundColor: activePillar.color }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-[8px] font-black text-white rounded hidden group-hover:block whitespace-nowrap z-50 border border-white/10 uppercase italic">
                    Week {i+1}: {h}%
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Priorities & Context */}
        <div className="space-y-8">
          <div className="glass-card p-8 border-[var(--glass-border-subtle)] bg-[var(--glass-l2-bg)] shadow-inner">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-8">Active Strategic Priorities</h3>
            <ul className="space-y-6">
              {activePillar.priorities.map((item, i) => (
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
                    <span className="text-[8px] text-[var(--text-muted)] uppercase font-black tracking-widest">Priority Alpha-{i+1}</span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-8 border-[var(--glass-border-subtle)] relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--brass)] to-transparent" />
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[var(--brass)]" /> Deep Insight Engine
            </h3>
            <p className="text-[12px] text-[var(--text-muted)] leading-relaxed italic pr-4">
              "{activePillar.deepInsight}"
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="text-[9px] font-black text-[var(--brass)] uppercase tracking-widest">Protocol Alignment: 0xBMAD</span>
              <div className="h-px bg-[var(--brass)]/20 flex-1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 border-white/5 text-center hover:bg-white/[0.02] transition-colors">
               <div className="text-[10px] text-[var(--text-muted)] uppercase font-black mb-1">Horizon Delta</div>
               <div className="text-sm font-black text-white italic tracking-tighter uppercase">H1 Optimized</div>
            </div>
            <div className="glass-card p-4 border-white/5 text-center hover:bg-white/[0.02] transition-colors">
               <div className="text-[10px] text-[var(--text-muted)] uppercase font-black mb-1">Drift Risk</div>
               <div className="text-sm font-black text-red-400 italic tracking-tighter uppercase">0.02% Minimal</div>
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

export default IkigaiPillars;



