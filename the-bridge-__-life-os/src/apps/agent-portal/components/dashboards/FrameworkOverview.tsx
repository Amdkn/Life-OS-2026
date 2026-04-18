import React from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Shield, Activity, Zap, Cpu, Network, Database, MessageSquare } from 'lucide-react';
import { ARMADA_FOLDERS } from '../../../../constants';
import AgentChatbot from '../AgentChatbot';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FrameworkOverviewProps {
  data: {
    id: string;
    label: string;
    icon: any;
    description: string;
    subItems?: string[];
  };
}

const FrameworkOverview: React.FC<FrameworkOverviewProps> = ({ data }) => {
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const Icon = data.icon;
  
  // Map Framework to A2 Manager
  const managerMap: Record<string, string> = {
    'ikigai': 'orville-a2',
    'life-wheel': 'discovery-a2',
    '12wy': 'snw-a2',
    'para': 'enterprise-a2',
    'gtd': 'cerritos-a2',
    'deal': 'protostar-a2'
  };

  const manager = ARMADA_FOLDERS.find(f => f.id === managerMap[data.id]);

  // Filtering out 'SEP:' items for the pillars grid
  const pillars = data.subItems?.filter(item => !item.startsWith('SEP:') && item !== '---') || [];

  return (
    <div className="h-full flex flex-col p-8 overflow-y-auto custom-scrollbar relative">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Icon className="w-64 h-64 text-[var(--brass)]" />
      </div>

      {/* Hero Section */}
      <section className="mb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6 mb-6"
        >
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--brass)]/20 to-transparent border border-[var(--brass)]/30 flex items-center justify-center shadow-xl backdrop-blur-md transition-all group-hover:scale-105 group-hover:border-[var(--brass)]/50">
              <Icon className="w-10 h-10 text-[var(--brass)]" />
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
              {data.label}
            </h1>
            <div className="flex items-center gap-3">
              <span className="h-px w-12 bg-[var(--brass)] opacity-40" />
              <p className="text-[10px] font-black text-[var(--brass)] uppercase tracking-[0.4em] opacity-80">
                {data.description}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl text-sm text-[var(--text-secondary)] leading-relaxed italic border-l-2 border-[var(--glass-border)] pl-6"
        >
          Strategic oversight of the {data.label} lifecycle within the A'Space OS ecosystem. 
          Synchronizing agentic behavior with domain-specific protocols for maximum outcome alignment.
        </motion.p>
      </section>

      {/* Pillars Grid */}
      <section className="mb-12 relative z-10">
        <h2 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-6 opacity-40">Core Composition</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={pillar}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass-card p-5 border border-[var(--glass-border-subtle)] hover:border-[var(--brass)]/40 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[8px] font-black text-[var(--brass)]/60 uppercase tracking-widest leading-none">Pillar {String(idx + 1).padStart(2, '0')}</span>
                <Zap className="w-3 h-3 text-[var(--text-muted)] group-hover:text-[var(--brass)] transition-colors opacity-40" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider group-hover:text-[var(--brass)] transition-colors mb-2">
                {pillar}
              </h3>
              <div className="h-1 w-full bg-[var(--glass-l2-bg)] rounded-full overflow-hidden mt-auto">
                <div 
                  className="h-full bg-[var(--brass)]/40 shadow-[0_0_8px_var(--brass)]" 
                  style={{ width: `${Math.floor(Math.random() * 40) + 40}%` }} 
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Integration Status Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10 mb-8">
        <div className="lg:col-span-2 glass-card p-6 border-[var(--glass-border-subtle)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Activity className="w-32 h-32" />
          </div>
          <h2 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-6 opacity-40">Domain Intelligence</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3 text-[var(--accent-primary)]" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Stability</span>
              </div>
              <div className="text-2xl font-black italic text-white tracking-widest">98.4%</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-3 h-3 text-[var(--brass)]" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Latency</span>
              </div>
              <div className="text-2xl font-black italic text-white tracking-widest">12ms</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Network className="w-3 h-3 text-blue-500" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Sync Load</span>
              </div>
              <div className="text-2xl font-black italic text-white tracking-widest">42%</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 border-[var(--glass-border-subtle)] bg-gradient-to-br from-transparent to-[var(--brass)]/5 flex flex-col items-center justify-center text-center">
          <Database className="w-8 h-8 text-[var(--brass)] mb-4 animate-pulse" />
          <h3 className="text-xs font-black text-white uppercase tracking-widest mb-2">Oversight Active</h3>
          <p className="text-[9px] text-[var(--text-muted)] italic leading-relaxed">
            Continuously mapping {data.label} vectors to current active projects and area architectural decisions.
          </p>
          <div className="mt-4 px-3 py-1 rounded-full border border-[var(--brass)]/20 bg-[var(--brass)]/5 text-[8px] font-black text-[var(--brass)] uppercase tracking-widest">
            A0 Verified
          </div>
        </div>
      </section>

      {/* Agent Chatbot Overlay */}
      <AgentChatbot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        manager={manager}
      />
    </div>
  );
};

export default FrameworkOverview;



