import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Briefcase } from 'lucide-react';
import type { Project, BusinessPillar } from '../../../stores/fw-para.store';
import { useOsSettingsStore } from '../../../stores/os-settings.store';

export function FractalReadView({ project }: { project: Project }) {
  const [expandedPillar, setExpandedPillar] = useState<BusinessPillar | null>(null);
  
  const config = useOsSettingsStore(s => s.domainConfigs?.find(c => c.domain === 'business'));
  const accentColor = config?.color || '#3b82f6';

  if (project.domain !== 'business') return null;

  // Filtrer les piliers qui ont du contenu
  const activePillars = Object.entries(project.pillarsContent || {})
    .filter(([_, content]) => !!content?.trim())
    .map(([pillar]) => pillar as BusinessPillar);

  if (activePillars.length === 0) {
    return (
      <div className="mt-8 p-8 rounded-3xl border border-dashed border-white/5 text-center bg-white/[0.01]">
        <p className="text-[10px] text-[var(--theme-text)]/20 uppercase tracking-widest">No Fractal Insights recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-3">
      <h4 className="text-[10px] font-bold text-[var(--theme-text)]/30 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Briefcase className="w-3.5 h-3.5" /> Fractal Insights (Reading Mode)
      </h4>
      
      {activePillars.map(pillar => {
        const isExpanded = expandedPillar === pillar;
        const content = project.pillarsContent?.[pillar];

        return (
          <div key={pillar} className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden transition-all">
            <button
              onClick={() => setExpandedPillar(isExpanded ? null : pillar)}
              className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }} />
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--theme-text)]/60 group-hover:text-[var(--theme-text)]">
                  {pillar}
                </span>
              </div>
              {isExpanded ? <ChevronUp className="w-4 h-4 text-white/20" /> : <ChevronDown className="w-4 h-4 text-white/20" />}
            </button>
            
            {isExpanded && (
              <div className="px-10 pb-6 pt-2 animate-in slide-in-from-top-2 duration-300">
                <div 
                  className="text-xs leading-relaxed text-[var(--theme-text)]/80 whitespace-pre-wrap border-l-2 pl-4 py-1"
                  style={{ borderColor: `${accentColor}40` }}
                >
                  {content}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
