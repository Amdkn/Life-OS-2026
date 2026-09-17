import React, { useMemo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Activity } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useAssistantStore } from '../../stores/assistant.store';
import { useWindowManager } from '../../hooks/useWindowManager';
import { vesselConfigs } from '../../config/vessels.config';
import { AgentTile } from './AgentTile';
import { generateFrameworkHealthMetrics, FrameworkHealthMetrics } from '../../apps/frameworks/services/frameworks-blackboard-bridge';

// We assign a consistent window ID so that useWindowManager can manage state via shell.store.ts
const OVERLAY_WINDOW_ID = 'assistant-overlay';

export const AssistantOverlay: React.FC = () => {
  const { activeFrameworkId, activeAgentId, chatOpen, setActiveAgent, toggleChat } = useAssistantStore(
    useShallow((state) => ({
      activeFrameworkId: state.activeFrameworkId,
      activeAgentId: state.activeAgentId,
      chatOpen: state.chatOpen,
      setActiveAgent: state.setActiveAgent,
      toggleChat: state.toggleChat,
    }))
  );

  const { windowPosition, handleTitleBarMouseDown } = useWindowManager(OVERLAY_WINDOW_ID);

  const [healthMetrics, setHealthMetrics] = useState<FrameworkHealthMetrics | null>(null);

  const activeVessel = useMemo(() => {
    if (!activeFrameworkId) return null;
    return vesselConfigs.find((v) => v.id === activeFrameworkId) || null;
  }, [activeFrameworkId]);

  const activeAgent = useMemo(() => {
    if (!activeVessel || !activeAgentId) return null;
    return activeVessel.crew.find((a) => a.id === activeAgentId) || null;
  }, [activeVessel, activeAgentId]);

  useEffect(() => {
    if (activeFrameworkId) {
      // Setup polling for health metrics based on PRD requirements
      const updateMetrics = () => {
        const metricsList = generateFrameworkHealthMetrics();
        const frameworkMetrics = metricsList.find(m => m.frameworkId === activeFrameworkId);
        setHealthMetrics(frameworkMetrics || null);
      };

      updateMetrics();
      const interval = setInterval(updateMetrics, 5000); // Poll every 5s
      return () => clearInterval(interval);
    } else {
      setHealthMetrics(null);
    }
  }, [activeFrameworkId]);

  // If no framework is active, we don't show the overlay
  if (!activeFrameworkId || !activeVessel) {
    return null;
  }

  return (
    <motion.div
      className="fixed z-[9000] flex flex-col gap-2 pointer-events-auto"
      style={{ left: windowPosition.x, top: windowPosition.y }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      {/* Agent Roster Bar */}
      <div className="glass rounded-[20px] p-2 flex items-center gap-2 border border-white/10 shadow-2xl backdrop-blur-xl bg-black/40">
        {/* Drag Handle */}
        <div
          className="w-6 flex items-center justify-center cursor-grab active:cursor-grabbing text-white/30 hover:text-white/80 self-stretch"
          onMouseDown={handleTitleBarMouseDown}
        >
          <div className="flex flex-col gap-1">
            <div className="w-1 h-1 rounded-full bg-current" />
            <div className="w-1 h-1 rounded-full bg-current" />
            <div className="w-1 h-1 rounded-full bg-current" />
          </div>
        </div>

        {/* Separator */}
        <div className="w-px h-12 bg-white/10 mx-1" />

        {/* Framework Health Metrics (PRD-045 requirement) */}
        {healthMetrics && (
          <div className="flex flex-col items-center justify-center px-3 py-1 bg-black/40 rounded-lg border border-white/5 mr-2">
            <div className="flex items-center gap-1.5 mb-1">
               <Activity className={`w-3.5 h-3.5 ${healthMetrics.nexusStatus === 'OK' ? 'text-green-400' : healthMetrics.nexusStatus === 'WARN' ? 'text-amber-400' : 'text-gray-400'}`} />
               <span className="text-[10px] font-bold text-white tracking-wider">{healthMetrics.healthScore}%</span>
            </div>
            <span className={`text-[8px] uppercase tracking-widest font-black ${healthMetrics.nexusStatus === 'OK' ? 'text-green-400/80' : healthMetrics.nexusStatus === 'WARN' ? 'text-amber-400/80' : 'text-gray-400/80'}`}>
              {healthMetrics.nexusStatus}
            </span>
          </div>
        )}

        {/* Agents */}
        <div className="flex gap-2">
          {activeVessel.crew.map((agent) => (
            <AgentTile
              key={agent.id}
              agent={agent}
              isActive={activeAgentId === agent.id}
              onClick={() => setActiveAgent(activeAgentId === agent.id ? null : agent.id)}
            />
          ))}
        </div>

        {/* Chat Toggle Button */}
        <AnimatePresence>
          {activeAgentId && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="overflow-hidden flex items-center ml-2"
            >
              <button
                onClick={() => toggleChat()}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  chatOpen
                    ? 'bg-[var(--theme-accent)] text-black shadow-lg shadow-[var(--theme-accent)]/30'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Bubble */}
      <AnimatePresence>
        {chatOpen && activeAgent && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="glass w-[320px] rounded-2xl border border-white/10 shadow-2xl overflow-hidden bg-black/60 backdrop-blur-2xl flex flex-col"
          >
            {/* Chat Header */}
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--theme-accent)] animate-pulse" />
                <span className="text-sm font-bold text-white font-outfit">{activeAgent.name}</span>
              </div>
              <button
                onClick={() => toggleChat(false)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 h-48 overflow-y-auto flex flex-col gap-3">
              <div className="bg-white/5 rounded-lg p-3 text-sm text-white/80 border border-white/5">
                Connecting to {activeAgent.name} stream...
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-white/10 bg-black/40">
              <input
                type="text"
                placeholder="Message command context..."
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[var(--theme-accent)]/50 transition-colors placeholder:text-white/30"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
