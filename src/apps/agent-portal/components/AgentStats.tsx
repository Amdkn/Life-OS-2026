import React, { useState } from 'react';
import { ARMADA_FOLDERS, type ArmadaFolder, type Agent } from '../../../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  PanelRightClose, 
  PanelRightOpen, 
  Cpu, 
  ShieldCheck, 
  ChevronDown, 
  ChevronRight, 
  ArrowLeft,
  Bot,
  Send,
  User,
  Zap,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAgentsStore } from '../../../stores/agents.store';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const AgentCard: React.FC<{ 
  agent: any, 
  isCollapsed: boolean, 
  compact?: boolean,
  onSelect?: (agent: any) => void 
}> = ({ agent, isCollapsed, compact, onSelect }) => {
  const isOnline = agent.status === 'online' || agent.status === 'Active';
  
  return (
    <div 
      onClick={() => onSelect?.(agent)}
      className={cn(
        "glass-card p-3 flex flex-col gap-1 hover:bg-[var(--glass-bg-hover)] transition-all cursor-pointer group mb-1",
        isCollapsed ? "items-center px-1" : "px-3",
        compact && "py-2 bg-white/[0.02]"
      )}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          {!isCollapsed && (
            <span className={cn(
              "text-xs font-bold text-white group-hover:text-[var(--brass)] transition-colors",
              compact && "text-[10px]"
            )}>
              {agent.name}
            </span>
          )}
          {isCollapsed && (
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center bg-[#020617] text-[10px] border border-[var(--glass-border)]",
              isOnline ? "border-[var(--accent-primary)] text-[var(--accent-primary)]" : "border-[var(--text-muted)] text-[var(--text-muted)]"
            )}>
              {agent.name.charAt(0)}
            </div>
          )}
        </div>
        {!isCollapsed && (
          <div className={cn(
            "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
            isOnline ? "bg-[var(--accent-primary-glow)] text-[var(--accent-primary)]" : "bg-white/5 text-[var(--text-muted)]"
          )}>
            {agent.status}
          </div>
        )}
      </div>
      {!isCollapsed && agent.role && (
        <div className={cn(
          "text-[9px] text-[var(--text-muted)] font-medium leading-tight",
          compact && "text-[8px] opacity-70"
        )}>
          {agent.role}
        </div>
      )}
    </div>
  );
};

const ArmadaFolderAccordion: React.FC<{ 
  folder: ArmadaFolder, 
  isCollapsed: boolean,
  onSelectAgent: (agent: any) => void,
  realAgents: any[]
}> = ({ folder, isCollapsed, onSelectAgent, realAgents }) => {
  const [isOpen, setIsOpen] = useState(folder.id === 'a0');
  const Icon = folder.icon;

  if (isCollapsed) {
    return (
      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#020617] border border-[var(--glass-border)] text-[var(--brass)] mx-auto mb-2 group relative">
        <Icon className="w-4 h-4" />
        <div className="absolute left-full ml-2 px-2 py-1 bg-black text-[8px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-[var(--glass-border)]">
          {folder.label}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full glass-card p-3 flex items-center justify-between hover:bg-[var(--glass-bg-hover)] transition-all group border-[var(--brass)]/10 shadow-lg",
          folder.id.startsWith('a0') && "border-[var(--brass)]/40 shadow-[0_0_20px_rgba(184,134,11,0.2)] bg-[var(--brass)]/5",
          folder.id.includes('a1') && "border-[var(--brass)]/20 shadow-md",
          folder.id.includes('a2') && "border-[var(--glass-border)] opacity-80"
        )}
      >
        <div className="flex-1 flex items-center gap-2">
          {isOpen ? <ChevronDown className="w-3 h-3 text-[var(--brass)]" /> : <ChevronRight className="w-3 h-3 text-[var(--text-muted)]" />}
          <Icon className={cn("w-4 h-4", folder.status === 'Active' ? "text-[var(--accent-primary)]" : "text-[var(--brass)]")} />
          <span className={cn(
            "text-xs font-black uppercase tracking-tighter group-hover:text-[var(--brass)] leading-none",
            folder.id === 'a0' && "text-[var(--accent-primary)]"
          )}>
            {folder.label}
          </span>
        </div>
        <div className={cn(
          "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
          folder.status === 'Active' ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)]"
        )}>
          {folder.status}
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-4 space-y-1 border-l border-[var(--glass-border-subtle)] ml-2 mb-2"
          >
            {folder.agents.map((agent) => (
              <AgentCard 
                key={agent.name} 
                agent={agent} 
                isCollapsed={isCollapsed} 
                compact 
                onSelect={onSelectAgent}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AgentChatView: React.FC<{ agent: any, onBack: () => void }> = ({ agent, onBack }) => {
  const { logs } = useAgentsStore();
  const agentLogs = logs.filter(l => l.agentName.includes(agent.name.split(' ')[0]));

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col h-full overflow-hidden"
    >
      {/* Agent Info Header in Chat */}
      <div className="px-4 py-3 bg-[var(--glass-l2-bg)] border-b border-[var(--glass-border-subtle)] flex items-center gap-3">
        <div className="w-10 h-10 rounded-full border border-[var(--brass)]/30 bg-[var(--brass)]/5 flex items-center justify-center relative">
          <User className="w-5 h-5 text-[var(--brass)]" />
          <div className={cn(
            "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[var(--surface-desktop)] shadow-[0_0_5px_var(--accent-primary)]",
            agent.status === 'online' || agent.status === 'Active' ? "bg-[var(--accent-primary)]" : "bg-gray-500"
          )} />
        </div>
        <div>
          <h4 className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">{agent.name}</h4>
          <p className="text-[8px] text-[var(--text-muted)] italic leading-none">{agent.role}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {agentLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-30 gap-2">
            <Bot className="w-8 h-8 text-[var(--brass)]" />
            <p className="text-[8px] font-black uppercase tracking-widest">No active telemetry logs</p>
          </div>
        ) : (
          agentLogs.map((log) => (
            <div key={log.id} className="flex gap-2 max-w-[95%] group">
              <div className="w-6 h-6 rounded bg-[var(--brass)]/10 border border-[var(--brass)]/30 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 text-[var(--brass)]" />
              </div>
              <div className="glass-card bg-[var(--glass-l2-bg)] px-3 py-2 rounded-xl rounded-tl-none border border-[var(--glass-border-subtle)] group-hover:border-[var(--brass)]/20 transition-colors">
                <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed italic">
                  {log.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Field */}
      <div className="p-4 border-t border-[var(--glass-border-subtle)] bg-[var(--glass-l2-bg)]">
        <div className="relative group">
          <input 
            type="text" 
            placeholder={`Instruct ${agent.name.split(' ')[0]}...`} 
            className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border-subtle)] rounded-lg px-3 py-2 text-[10px] text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--brass)]/40 transition-all group-hover:bg-[var(--glass-bg-hover)]"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded bg-[var(--brass)]/10 text-[var(--brass)] hover:bg-[var(--brass)]/20 transition-colors border border-[var(--brass)]/20">
            <Send className="w-3 h-3" />
          </button>
        </div>
        <div className="flex items-center gap-3 mt-3 px-1 opacity-50">
          <div className="flex items-center gap-1">
            <Shield className="w-2.5 h-2.5 text-[var(--brass)]" />
            <span className="text-[7px] font-black text-white uppercase tracking-widest">Secured</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-2.5 h-2.5 text-[var(--accent-primary)]" />
            <span className="text-[7px] font-black text-white uppercase tracking-widest">Real-time</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AgentStats: React.FC<{ isCollapsed: boolean, onToggle: () => void }> = ({ isCollapsed, onToggle }) => {
  const [activeAgent, setActiveAgent] = useState<any | null>(null);
  const { agents: realAgents } = useAgentsStore();

  const handleSelectAgent = (agent: any) => {
    if (isCollapsed) return;
    setActiveAgent(agent);
  };

  return (
    <aside 
      className={cn(
        "h-full glass border-l border-[var(--glass-border)] flex flex-col transition-all duration-300 relative z-20",
        isCollapsed ? "w-[72px]" : "w-[300px]"
      )}
    >
      <div className="h-16 flex items-center px-4 border-b border-[var(--glass-border-subtle)] gap-2">
        <button 
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-[var(--glass-bg-hover)] text-[var(--text-muted)] hover:text-white transition-colors shrink-0"
        >
          {isCollapsed ? <PanelRightOpen className="w-5 h-5" /> : <PanelRightClose className="w-5 h-5" />}
        </button>
        
        {!isCollapsed && (
          <div className="flex-1 flex items-center justify-between overflow-hidden">
            {activeAgent ? (
              <button 
                onClick={() => setActiveAgent(null)}
                className="flex items-center gap-2 group hover:text-[var(--brass)] transition-colors"
              >
                <ArrowLeft className="w-3 h-3 text-[var(--brass)] group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-[10px] font-black tracking-widest text-[var(--brass)] uppercase truncate">Back to Armada</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 overflow-hidden truncate">
                <span className="text-[10px] font-black tracking-[.2em] text-[var(--accent-primary)] uppercase">Armada Telemetry</span>
                <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse shadow-[0_0_5px_var(--accent-primary)] shrink-0" />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeAgent && !isCollapsed ? (
            <AgentChatView 
              key="chat"
              agent={activeAgent} 
              onBack={() => setActiveAgent(null)} 
            />
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full p-4 space-y-2 overflow-y-auto custom-scrollbar"
            >
              {/* V0.9 — NATIVE FLAT ROOT ARMADA */}
              {ARMADA_FOLDERS.map((folder) => (
                <ArmadaFolderAccordion 
                  key={folder.id} 
                  folder={folder} 
                  isCollapsed={isCollapsed} 
                  onSelectAgent={handleSelectAgent}
                  realAgents={realAgents}
                />
              ))}

              {!isCollapsed && (
                <div className="pt-6 border-t border-[var(--glass-border-subtle)] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[var(--brass)]" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Nexus Core Node</span>
                    </div>
                    <span className="text-[10px] font-mono text-[var(--brass)]">0xV0.9.NXS</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="glass-card p-2 text-center border-[var(--brass)]/10 shadow-lg bg-black/40">
                      <div className="text-[10px] text-[var(--text-muted)] uppercase mb-1">Load</div>
                      <div className="text-sm font-black text-white">09%</div>
                    </div>
                    <div className="glass-card p-2 text-center border-[var(--brass)]/10 shadow-lg bg-black/40">
                      <div className="text-[10px] text-[var(--text-muted)] uppercase mb-1">Status</div>
                      <div className="text-sm font-black text-[var(--accent-primary)] font-mono">OK</div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 border-t border-[var(--glass-border-subtle)] bg-[var(--glass-l2-bg)] text-center">
        {!isCollapsed ? (
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[var(--brass)]" />
            <span className="text-[9px] font-bold text-white uppercase tracking-widest">Beth Veto Active</span>
          </div>
        ) : (
          <ShieldCheck className="w-4 h-4 text-[var(--brass)] mx-auto" />
        )}
      </div>
    </aside>
  );
};

export default AgentStats;





