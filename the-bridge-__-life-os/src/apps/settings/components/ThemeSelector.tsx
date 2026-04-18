import React from 'react';
import { motion } from 'motion/react';
import { useOsSettingsStore, OSTheme } from '../../../stores/os-settings.store';
import { THEME_TOKENS } from '../../../themes/theme-tokens';

const THEMES: { id: OSTheme; name: string }[] = [
  { id: 'solarpunk', name: 'Solarpunk Dawn' },
  { id: 'cyberpunk', name: 'Night City' },
  { id: 'minimal', name: 'Void Minimal' },
  { id: 'glass-dark', name: 'Glass Obsidian' },
  { id: 'glass-light', name: 'Glass Frost' },
];

export const ThemeSelector: React.FC = () => {
  const { theme: activeTheme, setTheme } = useOsSettingsStore();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {THEMES.map(theme => (
        <ThemeCard 
          key={theme.id}
          name={theme.name}
          isActive={activeTheme === theme.id}
          colors={THEME_TOKENS[theme.id]}
          onClick={() => setTheme(theme.id)}
        />
      ))}
    </div>
  );
};

interface CardProps {
  name: string;
  isActive: boolean;
  colors: Record<string, string>;
  onClick: () => void;
}

const ThemeCard: React.FC<CardProps> = ({ name, isActive, colors, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative p-3 rounded-xl border-2 text-left transition-all
      ${isActive ? 'border-[var(--theme-accent)] bg-[var(--theme-accent)]/5' : 'border-white/5 bg-white/5 hover:border-white/10'}
    `}
  >
    <div 
      className="h-12 rounded-lg mb-2 flex overflow-hidden border border-white/10"
      style={{ backgroundColor: colors['--theme-bg'] }}
    >
      <div className="w-1/3 h-full" style={{ backgroundColor: colors['--theme-bg'] }} />
      <div className="w-1/3 h-full" style={{ backgroundColor: colors['--theme-accent'] }} />
      <div className="w-1/3 h-full" style={{ backgroundColor: colors['--theme-text'] }} />
    </div>
    
    <span className={`text-[11px] font-medium tracking-wide uppercase ${isActive ? 'text-[var(--theme-accent)]' : 'text-[var(--theme-text)]/60'}`}>
      {name}
    </span>

    {isActive && (
      <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[var(--theme-accent)] rounded-full" />
    )}
  </motion.button>
);

