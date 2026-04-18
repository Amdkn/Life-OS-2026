import React from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  DollarSign, 
  Activity, 
  TrendingUp, 
  Users, 
  Home, 
  Coffee, 
  Mountain,
  CheckCircle2, 
  Zap,
  Activity as ActivityIcon,
  BarChart,
  Shield,
  MessageSquare,
  type LucideIcon
} from 'lucide-react';
import { ARMADA_FOLDERS } from '../../../../constants';
import AgentChatbot from '../AgentChatbot';

interface DomainData {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  description: string;
  balance: number;
  status: string;
  priorities: string[];
  metrics: { label: string, value: string, trend: 'up' | 'down' | 'stable' }[];
  deepInsight: string;
  agentName: string;
}

const DOMAINS_DATA: Record<string, DomainData> = {
  'Carrière': {
    id: 'career',
    label: 'Carrière',
    icon: Briefcase,
    color: '#3b82f6', // Blue
    description: 'Work, business strategy, professional growth, and contribution to the world.',
    balance: 82,
    status: 'High',
    priorities: ['Refining GTM Strategy', 'Internal Process Audit', 'Skill Acquisition'],
    metrics: [
      { label: 'Business Velocity', value: '85%', trend: 'up' },
      { label: 'Strategic Depth', value: 'High', trend: 'stable' },
      { label: 'Market Resonance', value: '72%', trend: 'up' }
    ],
    deepInsight: 'Professional momentum is strong. Aligning with H10 Guardian needs to build systemic moats.',
    agentName: 'Book'
  },
  'Finance': {
    id: 'finance',
    label: 'Finance',
    icon: DollarSign,
    color: '#10b981', // Emerald
    description: 'Wealth management, fiscal discipline, budget alignment, and resource shielding.',
    balance: 78,
    status: 'Stable',
    priorities: ['Asset Shielding Architecture', 'Budget Efficiency Scan', 'Passive Income Scaling'],
    metrics: [
      { label: 'Burn Rate', value: 'Low', trend: 'down' },
      { label: 'Wealth Delta', value: '+15%', trend: 'up' },
      { label: 'Fiscal Shield', value: 'Active', trend: 'stable' }
    ],
    deepInsight: 'Financial shields are operational. Transitioning resources to H30 generational assets.',
    agentName: 'Saru'
  },
  'Santé': {
    id: 'health',
    label: 'Santé',
    icon: Activity,
    color: '#ef4444', // Red
    description: 'Physical vitality, mental health, bio-metric stability, and endurance.',
    balance: 90,
    status: 'Vibrant',
    priorities: ['Sleep Optimization Cycle', 'HRV Stability Protocol', 'Nutrition Depth Review'],
    metrics: [
      { label: 'Vitality Score', value: '94%', trend: 'up' },
      { label: 'Sleep Quality', value: '8.2h', trend: 'up' },
      { label: 'Recovery Delta', value: 'Fast', trend: 'stable' }
    ],
    deepInsight: 'Bio-rhythms are optimized for high-intensity execution. Maintaining current H1 metrics.',
    agentName: 'Culber'
  },
  'Croissance': {
    id: 'growth',
    label: 'Croissance',
    icon: TrendingUp,
    color: '#8b5cf6', // Violet
    description: 'Intellectual expansion, mindset shifts, learning velocity, and wisdom.',
    balance: 85,
    status: 'Expanding',
    priorities: ['Neural Network Scaling', 'Skill Tree Expansion', 'Deep Learning Sprints'],
    metrics: [
      { label: 'Knowledge Depth', value: '92%', trend: 'up' },
      { label: 'Learning Velocity', value: 'Fast', trend: 'up' },
      { label: 'Mindset Shift', value: '+2.4%', trend: 'up' }
    ],
    deepInsight: 'Intellectual growth is accelerating. Mapping new skills to H3 Explorer initiatives.',
    agentName: 'Tilly'
  },
  'Relation': {
    id: 'relation',
    label: 'Relation',
    icon: Users,
    color: '#f59e0b', // Amber
    description: 'Social networking, social resonance, deep connections, and alignment.',
    balance: 70,
    status: 'Active',
    priorities: ['Network Effect Mapping', 'Social Resonance Audit', 'Communication Flow'],
    metrics: [
      { label: 'Tribe Cohesion', value: '88%', trend: 'up' },
      { label: 'External Resonance', value: 'Mid', trend: 'stable' },
      { label: 'Social Velocity', value: '+12%', trend: 'up' }
    ],
    deepInsight: 'Social network density is increasing. Strengthening core tribe for collective resilience.',
    agentName: 'Stamets'
  },
  'Famille': {
    id: 'family',
    label: 'Famille',
    icon: Home,
    color: '#ec4899', // Pink
    description: 'Core tribe, ancestral alignment, responsibility, and foundational duty.',
    balance: 95,
    status: 'Ideal',
    priorities: ['Tribe Maintenance', 'Ancestral Mapping', 'Quality Time Protocol'],
    metrics: [
      { label: 'Duty Alignment', value: '100%', trend: 'stable' },
      { label: 'Emotional Support', value: 'High', trend: 'stable' },
      { label: 'Time Quality', value: '+8%', trend: 'up' }
    ],
    deepInsight: 'Foundational support is impeccable. Tribe stability is the bedrock for H90 legacy.',
    agentName: 'Burnham'
  },
  'Loisir': {
    id: 'leisure',
    label: 'Loisir',
    icon: Coffee,
    color: '#6366f1', // Indigo
    description: 'Creative downtime, playful rejuvenation, joy, and rest.',
    balance: 65,
    status: 'Needs Care',
    priorities: ['Play Frequency Reset', 'Creative Spark Sprints', 'Rejuvenation Cycle'],
    metrics: [
      { label: 'Play Delta', value: 'Low', trend: 'down' },
      { label: 'Creativity Flow', value: 'Mid', trend: 'stable' },
      { label: 'Rest Efficiency', value: 'High', trend: 'up' }
    ],
    deepInsight: 'Downtime metrics are lagging. Integrating scheduled creative play into H1 sprints.',
    agentName: 'Reno'
  },
  'Environnement': {
    id: 'environment',
    label: 'Environnement',
    icon: Mountain,
    color: '#4ade80', // Light Green
    description: 'Physical surroundings, space optimization, ecosystem impact, and home base.',
    balance: 80,
    status: 'Refined',
    priorities: ['Space Optimization Audit', 'Eco-Impact Review', 'Energy Alignment'],
    metrics: [
      { label: 'Space Aesthetic', value: '92%', trend: 'stable' },
      { label: 'Energy Efficiency', value: 'High', trend: 'up' },
      { label: 'Systemic Peace', value: 'Tranquil', trend: 'stable' }
    ],
    deepInsight: 'Immediate surroundings are optimized for focus. Protecting the home base is a Guardian priority.',
    agentName: 'Georgiou'
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

interface LifeWheelDomainsProps {
  activeSubItem: string | null;
}

const LifeWheelDomains: React.FC<LifeWheelDomainsProps> = ({ activeSubItem }) => {
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const activeDomain = DOMAINS_DATA[activeSubItem || ''] || DOMAINS_DATA['Carrière'];
  const manager = ARMADA_FOLDERS.find(f => f.id === 'discovery-a2');

  return (
    <div className="h-full flex flex-col p-8 overflow-y-auto custom-scrollbar relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <activeDomain.icon className="w-64 h-64" style={{ color: activeDomain.color }} />
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
              <activeDomain.icon className="w-10 h-10" style={{ color: activeDomain.color }} />
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
              {activeDomain.label}
            </h1>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[var(--brass)] opacity-40" />
              <p className="text-[10px] font-black text-[var(--brass)] uppercase tracking-[0.4em] opacity-80 italic">
                Domain Balance & Life Observation
              </p>
            </div>
          </div>
        </motion.div>
        
        <p className="max-w-2xl text-[11px] text-[var(--text-secondary)] leading-relaxed italic border-l-2 pl-6" style={{ borderColor: activeDomain.color }}>
          {activeDomain.description}
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
              <Zap className="w-4 h-4 text-[var(--brass)]" /> Real-time Performance
            </h3>
            
            <div className="space-y-4">
              {activeDomain.metrics.map((m) => (
                <MetricRow key={m.label} {...m} color={activeDomain.color} />
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-white/[0.05]">
              <div className="flex justify-between items-end mb-3">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Global Balance Score</span>
                <span className="text-xl font-black italic text-white" style={{ textShadow: `0 0 10px ${activeDomain.color}44` }}>{activeDomain.balance}%</span>
              </div>
              <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden p-[1px]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${activeDomain.balance}%` }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full shadow-[0_0_15px_currentColor]"
                  style={{ backgroundColor: activeDomain.color, color: activeDomain.color }}
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-8 border-[var(--glass-border-subtle)] bg-[var(--brass)]/5">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <BarChart className="w-4 h-4 text-[var(--brass)]" /> Historical Variance
            </h3>
            <div className="h-32 flex items-end gap-1.5 pt-4">
              {[70, 75, 68, 82, 79, 85, 88, 85, 84, 88, 82].map((h, i) => (
                <motion.div 
                  key={i} 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.05 * i }}
                  className="flex-1 rounded-sm opacity-20 hover:opacity-100 transition-all cursor-crosshair group relative" 
                  style={{ backgroundColor: activeDomain.color }}
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
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-8">Domain Priorities ({activeDomain.agentName})</h3>
            <ul className="space-y-6">
              {activeDomain.priorities.map((item, i) => (
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
                    <span className="text-[8px] text-[var(--text-muted)] uppercase font-black tracking-widest">Active Protocol_{i+1}</span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-8 border-[var(--glass-border-subtle)] relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--brass)] to-transparent" />
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[var(--brass)]" /> Discovery Insight Engine
            </h3>
            <p className="text-[12px] text-[var(--text-muted)] leading-relaxed italic pr-4">
              "{activeDomain.deepInsight}"
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="text-[9px] font-black text-[var(--brass)] uppercase tracking-widest">Board Sync: discovery-a2</span>
              <div className="h-px bg-[var(--brass)]/20 flex-1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 border-white/5 text-center hover:bg-white/[0.02] transition-colors">
               <div className="text-[10px] text-[var(--text-muted)] uppercase font-black mb-1">Horizon Alpha</div>
               <div className="text-sm font-black text-white italic tracking-tighter uppercase">H1 Operations</div>
            </div>
            <div className="glass-card p-4 border-white/5 text-center hover:bg-white/[0.02] transition-colors">
               <div className="text-[10px] text-[var(--text-muted)] uppercase font-black mb-1">Sector Lead</div>
               <div className="text-sm font-black text-[var(--brass)] italic tracking-tighter uppercase">{activeDomain.agentName}</div>
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

export default LifeWheelDomains;



