import React from 'react';
import { motion } from 'motion/react';
import type { AgentCrewMember } from '../../types/frameworks';

interface AgentTileProps {
  agent: AgentCrewMember;
  isActive: boolean;
  onClick: () => void;
}

export const AgentTile: React.FC<AgentTileProps> = ({ agent, isActive, onClick }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-colors duration-200 w-16 h-20 ${
        isActive
          ? 'bg-[var(--theme-accent)]/20 border-2 border-[var(--theme-accent)] shadow-[0_0_15px_rgba(var(--theme-accent-rgb),0.3)]'
          : 'bg-black/40 border border-white/10 hover:bg-black/60 hover:border-white/20'
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
          isActive ? 'bg-[var(--theme-accent)] text-black' : 'bg-white/10 text-white'
        }`}
      >
        <span className="text-xs font-bold">{getInitials(agent.name)}</span>
      </div>
      <div className="flex flex-col items-center w-full overflow-hidden">
        <span
          className={`text-[9px] font-bold truncate w-full text-center ${
            isActive ? 'text-[var(--theme-accent)]' : 'text-white/80'
          }`}
          title={agent.name}
        >
          {agent.name}
        </span>
        <span className="text-[8px] text-white/50 truncate w-full text-center" title={agent.role}>
          {agent.layer || 'Agent'}
        </span>
      </div>
    </motion.button>
  );
};
