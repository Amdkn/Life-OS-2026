import React from 'react';
import { motion } from 'motion/react';
import { 
  Eye, 
  Calendar, 
  Activity, 
  BarChart, 
  Clock,
  CheckCircle2, 
  TrendingUp, 
  Zap,
  Activity as ActivityIcon,
  BarChart as BarChartIcon,
  Shield,
  MessageSquare,
  type LucideIcon
} from 'lucide-react';
import { ARMADA_FOLDERS } from '../../../../constants';
import AgentChatbot from '../AgentChatbot';

interface TwelveWeekYearData {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  description: string;
  execution: number;
  status: string;
  priorities: string[];
  metrics: { label: string, value: string, trend: 'up' | 'down' | 'stable' }[];
  deepInsight: string;
  agentName: string;
}

const TWELVE_WY_DATA: Record<string, TwelveWeekYearData> = {
  'Vision': {
    id: 'vision',
    label: 'Vision',
    icon: Eye,
    color: '#8b5cf6', // Violet
    description: 'The starting point. Defining a clear, emotionally compelling future that drives daily action.',
    execution: 88,
    status: 'Aligned',
    priorities: ['3-Year Aspiration Mapping', 'Daily Vision Reinforcement', 'Emotional Resonance Audit'],
    metrics: [
      { label: 'Vision Clarity', value: '92%', trend: 'up' },
      { label: 'Horizon Connection', value: 'H1:H10 Link', trend: 'stable' },
      { label: 'Resonance Score', value: 'High', trend: 'up' }
    ],
    deepInsight: 'Vision is strong, but connection to weekly tactical plans needs tighter integration (Una-Pike Link).',
    agentName: 'Christopher Pike'
  },
  'Planning': {
    id: 'planning',
    label: 'Planning',
    icon: Calendar,
    color: '#3b82f6', // Blue
    description: 'Weekly tactical plans. Breaking down the vision into actionable 12-week sprints.',
    execution: 82,
    status: 'Tactical',
    priorities: ['Weekly Plan Discipline (WPD)', 'Strategic Buffer Blocks', 'Tactical Pivot Assessment'],
    metrics: [
      { label: 'Plan Compliance', value: '85%', trend: 'up' },
      { label: 'Strategic Depth', value: '72%', trend: 'down' },
      { label: 'Task Velocity', value: 'Fast', trend: 'stable' }
    ],
    deepInsight: 'Weekly compliance is high, but strategic depth is suffering from operational overhead.',
    agentName: 'Una Chin-Riley'
  },
  'Process Control': {
    id: 'process_control',
    label: 'Process Control',
    icon: Activity,
    color: '#f59e0b', // Amber
    description: 'Structures and systems for execution. Environment optimization and routine discipline.',
    execution: 75,
    status: 'Operational',
    priorities: ['Focus Environment Lockdown', 'Routine Consistency Scan', 'Performance Rituals'],
    metrics: [
      { label: 'Focus Score', value: '78%', trend: 'up' },
      { label: 'Routine Sync', value: '92%', trend: 'stable' },
      { label: 'Distraction Delta', value: '-12%', trend: 'up' }
    ],
    deepInsight: 'Process control is the current bottleneck for execution velocity. M\'Benga focus required.',
    agentName: 'M\'Benga'
  },
  'Measurement': {
    id: 'measurement',
    label: 'Measurement',
    icon: BarChart,
    color: '#ef4444', // Red
    description: 'Lead and Lag indicators. Measuring the process of execution, not just the results.',
    execution: 94,
    status: 'Precision',
    priorities: ['Lead Indicator Tracking', 'Weekly Scorecard Audit', 'Execution Delta Analysis'],
    metrics: [
      { label: 'Avg Weekly Score', value: '84%', trend: 'up' },
      { label: 'Lead Velocity', value: 'High', trend: 'up' },
      { label: 'Lag Target Delta', value: '+4%', trend: 'stable' }
    ],
    deepInsight: 'Measurement precision is optimal. Chapel monitoring indicates high predictive reliability.',
    agentName: 'Christine Chapel'
  },
  'Time Use': {
    id: 'time_use',
    label: 'Time Use',
    icon: Clock,
    color: '#10b981', // Emerald
    description: 'Intentional time blocking. Strategic, Buffer, and Breakout blocks for maximum output.',
    execution: 80,
    status: 'Flow',
    priorities: ['Strategic Block Integrity', 'Breakout Block Quality', 'Calendar Flow Audit'],
    metrics: [
      { label: 'Block Integrity', value: '88%', trend: 'up' },
      { label: 'Overhead Ratio', value: '15%', trend: 'down' },
      { label: 'Peak Flow Hours', value: '4.5h', trend: 'stable' }
    ],
    deepInsight: 'Time blocking is effective. Strategic blocks are currently the highest ROI activity.',
    agentName: 'Nyota Uhura'
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

interface TwelveWeekYearProps {
  activeSubItem: string | null;
}

const TwelveWeekYear: React.FC<TwelveWeekYearProps> = ({ activeSubItem }) => {
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const activeItem = TWELVE_WY_DATA[activeSubItem || ''] || TWELVE_WY_DATA['Vision'];
  const manager = ARMADA_FOLDERS.find(f => f.id === 'snw-a2');

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
                Execution Framework: 12 Week Year
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
              <Zap className="w-4 h-4 text-[var(--brass)]" /> Execution Performance
            </h3>
            
            <div className="space-y-4">
              {activeItem.metrics.map((m) => (
                <MetricRow key={m.label} {...m} color={activeItem.color} />
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-white/[0.05]">
              <div className="flex justify-between items-end mb-3">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Global Execution Score</span>
                <span className="text-xl font-black italic text-white" style={{ textShadow: `0 0 10px ${activeItem.color}44` }}>{activeItem.execution}%</span>
              </div>
              <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden p-[1px]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${activeItem.execution}%` }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full shadow-[0_0_15px_currentColor]"
                  style={{ backgroundColor: activeItem.color, color: activeItem.color }}
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-8 border-[var(--glass-border-subtle)] bg-[var(--brass)]/5">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <BarChartIcon className="w-4 h-4 text-[var(--brass)]" /> Tactical Variance
            </h3>
            <div className="h-32 flex items-end gap-1.5 pt-4">
              {[80, 85, 78, 92, 89, 85, 94, 88, 86, 92, 80].map((h, i) => (
                <motion.div 
                  key={i} 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.05 * i }}
                  className="flex-1 rounded-sm opacity-20 hover:opacity-100 transition-all cursor-crosshair group relative" 
                  style={{ backgroundColor: activeItem.color }}
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
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-8">Tactical Items ({activeItem.agentName})</h3>
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
                    <span className="text-[8px] text-[var(--text-muted)] uppercase font-black tracking-widest">Active Sprint_{i+1}</span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-8 border-[var(--glass-border-subtle)] relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--brass)] to-transparent" />
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[var(--brass)]" /> SNW Execution Insight
            </h3>
            <p className="text-[12px] text-[var(--text-muted)] leading-relaxed italic pr-4">
              "{activeItem.deepInsight}"
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="text-[9px] font-black text-[var(--brass)] uppercase tracking-widest">Board Sync: snw-a2</span>
              <div className="h-px bg-[var(--brass)]/20 flex-1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 border-white/5 text-center hover:bg-white/[0.02] transition-colors">
               <div className="text-[10px] text-[var(--text-muted)] uppercase font-black mb-1">Execution Horizon</div>
               <div className="text-sm font-black text-white italic tracking-tighter uppercase">12WY Cycle Alpha</div>
            </div>
            <div className="glass-card p-4 border-white/5 text-center hover:bg-white/[0.02] transition-colors">
               <div className="text-[10px] text-[var(--text-muted)] uppercase font-black mb-1">Captain's Seat</div>
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

export default TwelveWeekYear;



