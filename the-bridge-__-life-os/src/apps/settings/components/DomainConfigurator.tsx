import React from 'react';
import { 
  Heart, 
  Briefcase, 
  Wallet, 
  Zap, 
  Smile, 
  Globe, 
  Home, 
  Users,
  Palette
} from 'lucide-react';
import { motion } from 'motion/react';
import { useOsSettingsStore, DomainConfig } from '../../../stores/os-settings.store';

const ICON_MAP: Record<string, any> = {
  Heart, Briefcase, Wallet, Zap, Smile, Globe, Home, Users
};

export const DomainConfigurator: React.FC = () => {
  const { domainConfigs, updateDomainConfig } = useOsSettingsStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {domainConfigs.map(config => (
        <DomainCard 
          key={config.domain}
          config={config}
          onUpdate={(partial) => updateDomainConfig(config.domain, partial)}
        />
      ))}
    </div>
  );
};

interface CardProps {
  config: DomainConfig;
  onUpdate: (partial: Partial<DomainConfig>) => void;
}

const DomainCard: React.FC<CardProps> = ({ config, onUpdate }) => {
  const Icon = ICON_MAP[config.icon] || Globe;

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex items-center gap-4">
      <div 
        className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors"
        style={{ backgroundColor: `${config.color}20`, color: config.color, border: `1px solid ${config.color}40` }}
      >
        <Icon className="w-6 h-6" />
      </div>

      <div className="flex-1 space-y-2">
        <input 
          type="text" 
          value={config.label}
          onChange={e => onUpdate({ label: e.target.value })}
          className="bg-transparent text-sm font-bold text-[var(--theme-text)] outline-none focus:text-emerald-400 transition-colors w-full"
        />
        <div className="flex items-center gap-2">
          <input 
            type="color" 
            value={config.color}
            onChange={e => onUpdate({ color: e.target.value })}
            className="w-4 h-4 rounded-full border-none cursor-pointer bg-transparent"
          />
          <span className="text-[10px] text-[var(--theme-text)]/20 font-mono uppercase tracking-tighter">{config.color}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-[10px] font-bold text-[var(--theme-text)]/20 uppercase tracking-widest text-right">Domain</div>
        <div className="text-[10px] font-mono text-[var(--theme-text)]/40 uppercase text-right">{config.domain}</div>
      </div>
    </div>
  );
};

