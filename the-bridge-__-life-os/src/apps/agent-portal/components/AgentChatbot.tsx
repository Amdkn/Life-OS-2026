import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { X, Send, Bot, Shield, Zap, User } from 'lucide-react';
import type { ArmadaFolder } from '../../../constants';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AgentChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  manager: ArmadaFolder | undefined;
}

const AgentChatbot: React.FC<AgentChatbotProps> = ({ isOpen, onClose, manager }) => {
  if (!manager) return null;

  const mockMessages = [
    { id: 1, role: 'system', content: `Uplink established with ${manager.label}.` },
    { id: 2, role: 'agent', content: `Greetings, AO Overseer. ${manager.label} systems are online and synchronized with the current framework protocols.` },
    { id: 3, role: 'agent', content: `I have ${manager.agents.length} specialized units ready for deployment. How shall we proceed?` },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-[400px] glass-card border-l border-[var(--glass-border)] z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-[var(--glass-border-subtle)] bg-[var(--glass-l2-bg)] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--brass)]/20 to-transparent border border-[var(--brass)]/30 flex items-center justify-center shadow-inner">
                  <manager.icon className="w-6 h-6 text-[var(--brass)]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none mb-1">{manager.label}</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                    <span className="text-[10px] text-[var(--accent-primary)] font-black uppercase tracking-wider">Operational</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-[var(--glass-bg-hover)] text-[var(--text-muted)] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Crew Status */}
            <div className="px-6 py-4 bg-[var(--glass-l2-bg)]/50 border-b border-[var(--glass-border-subtle)]">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Active Crew</span>
                <span className="text-[9px] font-black text-[var(--brass)] uppercase tracking-widest bg-[var(--brass)]/10 px-2 py-0.5 rounded-full border border-[var(--brass)]/20">{manager.agents.length} units</span>
              </div>
              <div className="flex gap-2 custom-scrollbar overflow-x-auto pb-2 no-scrollbar">
                {manager.agents.map((agent, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 min-w-[50px]">
                    <div className="w-10 h-10 rounded-full border border-[var(--glass-border-subtle)] bg-[var(--glass-l2-bg)] flex items-center justify-center relative shadow-sm group cursor-pointer hover:border-[var(--brass)]/50 transition-colors">
                      <User className="w-4 h-4 text-[var(--text-muted)] group-hover:text-white transition-colors" />
                      {agent.status === 'Active' && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[var(--accent-primary)] border-2 border-[var(--surface-desktop)]" />
                      )}
                    </div>
                    <span className="text-[8px] font-bold text-white uppercase tracking-tighter truncate w-12 text-center opacity-60">{agent.name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {mockMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={cn(
                    "flex flex-col gap-2",
                    msg.role === 'system' ? "items-center" : "items-start"
                  )}
                >
                  {msg.role === 'system' ? (
                    <div className="px-3 py-1 rounded-full bg-[var(--glass-l2-bg)] border border-[var(--glass-border-subtle)] text-[8px] font-black uppercase text-[var(--text-muted)] tracking-widest">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="flex gap-3 max-w-[90%] group">
                      <div className="w-8 h-8 rounded-lg bg-[var(--brass)]/10 border border-[var(--brass)]/30 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-[var(--brass)]" />
                      </div>
                      <div className="glass-card bg-[var(--glass-l2-bg)] px-4 py-3 rounded-2xl rounded-tl-none border border-[var(--glass-border-subtle)] group-hover:border-[var(--brass)]/20 transition-colors">
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed italic">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-[var(--glass-border-subtle)] bg-[var(--glass-l2-bg)]">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Enter command for A2 Manager..." 
                  className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border-subtle)] rounded-xl px-4 py-3 text-xs text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--brass)]/50 transition-all group-hover:bg-[var(--glass-bg-hover)]"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[var(--brass)]/10 text-[var(--brass)] hover:bg-[var(--brass)]/20 transition-colors border border-[var(--brass)]/20">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-4 mt-4 px-2">
                <div className="flex items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
                  <Shield className="w-3 h-3 text-[var(--brass)]" />
                  <span className="text-[8px] font-black text-white uppercase tracking-widest">Encrypted</span>
                </div>
                <div className="flex items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
                  <Zap className="w-3 h-3 text-[var(--brass)]" />
                  <span className="text-[8px] font-black text-white uppercase tracking-widest">Priority H1</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AgentChatbot;





