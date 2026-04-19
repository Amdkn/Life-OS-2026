/** DomainCard — expandable domain view with business pillars (V0.4.3) */
import { useState } from 'react';
import { ChevronDown, ChevronUp, Layers, Activity, Zap, Cpu, Shield, Users, Briefcase, Globe, Compass } from 'lucide-react';
import { clsx } from 'clsx';
import type { LifeWheelDomain, BusinessPillar, Project } from '../../../stores/fw-para.store';
import { useOsSettingsStore } from '../../../stores/os-settings.store';
import { useShellStore } from '../../../stores/shell.store';

import { PillarDashboard } from './PillarDashboard';

interface DomainCardProps {
  domain: LifeWheelDomain;
  activeProjects: Project[];
  selectedPillar?: string | null;
  onPillarSelect?: (pillar: BusinessPillar | null) => void;
}

const PILLARS: { id: BusinessPillar; icon: any; label: string }[] = [
  { id: 'growth',     icon: Activity,  label: 'Growth' },
  { id: 'operations', icon: Zap,       label: 'Ops' },
  { id: 'product',    icon: Layers,    label: 'Product' },
  { id: 'finance',    icon: Briefcase, label: 'Finance' },
  { id: 'people',     icon: Users,     label: 'People' },
  { id: 'it',         icon: Cpu,       label: 'IT' },
  { id: 'legal',      icon: Shield,    label: 'Legal' },
  { id: 'meta',       icon: Globe,     label: 'Meta' },
];

export function DomainCard({ domain, activeProjects, selectedPillar, onPillarSelect }: DomainCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activePillar, setActivePillar] = useState<BusinessPillar | null>(null);
  const { domainConfigs } = useOsSettingsStore();
  const openApp = useShellStore(s => s.openApp);
  
  const config = domainConfigs?.find(c => c.domain === domain);
  const color = config?.color || '#10b981'; 
  const count = activeProjects.length;

  return (
    <div className={clsx("glass-card rounded-[2.5rem] border overflow-hidden transition-all duration-500",
      isExpanded ? "shadow-2xl" : "hover:bg-white/[0.03]",
      isExpanded ? "border-opacity-30" : "border-white/5"
    )} style={{ borderColor: isExpanded ? color : undefined }}>
      <div className="w-full p-8 flex items-center justify-between group">
        <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-6 flex-1 text-left">
          <div 
            className="w-14 h-14 rounded-2xl border flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
            style={{ 
              backgroundColor: color + '1a', 
              borderColor: color + '33', 
              color: color 
            }}
          >
            <Layers className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold uppercase tracking-wider transition-colors" style={{ color: isExpanded ? color : 'var(--theme-text)' }}>{config?.label || domain}</h3>
            <p className="text-[10px] font-bold text-[var(--theme-text)]/20 uppercase tracking-[0.3em]">{count} Active Projects</p>
          </div>
        </button>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={(e) => { e.stopPropagation(); openApp('ikigai', 'Ikigai Engine'); }} 
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--theme-text)]/40 hover:text-[var(--theme-text)] transition-all flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest border border-white/5"
          >
            <Compass className="w-4 h-4" /> Ikigai
          </button>
          <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 rounded-full bg-white/5 text-[var(--theme-text)]/20 hover:text-[var(--theme-text)]/60 transition-colors">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-8 pb-8 animate-in slide-in-from-top-4 duration-500">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PILLARS.map(p => {
              const pCount = activeProjects.filter(prj => prj.pillars.includes(p.id)).length;
              const isSelected = activePillar === p.id;
              return (
                <div key={p.id} onClick={() => {
                  setActivePillar(isSelected ? null : p.id);
                  if (onPillarSelect) onPillarSelect(isSelected ? null : p.id); 
                }}
                  className={clsx("p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center relative",
                    isSelected ? "bg-white/10" : "bg-white/[0.02] border-white/5 hover:border-white/20"
                  )} style={{ borderColor: isSelected ? color : undefined }}>
                  <p.icon className="w-5 h-5 mb-3 transition-colors" style={{ color: isSelected || pCount > 0 ? color : 'rgba(255,255,255,0.1)' }} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--theme-text)]/80 mb-1">{p.label}</h4>
                  <span className="text-[8px] font-bold uppercase text-[var(--theme-text)]/30 tracking-widest bg-black/20 px-2 rounded-full">{pCount} prj</span>
                </div>
              );
            })}
          </div>
          
          {activePillar && (
            <PillarDashboard domain={domain} pillar={activePillar} onClose={() => setActivePillar(null)} />
          )}
        </div>
      )}
    </div>
  );
}
