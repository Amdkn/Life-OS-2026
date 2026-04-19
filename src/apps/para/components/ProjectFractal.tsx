import React, { useState, useEffect } from 'react';
import { useParaStore, type Project, type BusinessPillar } from '../../../stores/fw-para.store';
import { useOsSettingsStore } from '../../../stores/os-settings.store';

const PILLARS: BusinessPillar[] = ['growth', 'operations', 'product', 'finance', 'people', 'it', 'legal', 'meta'];

export function ProjectFractal({ project }: { project: Project }) {
  const [activePillar, setActivePillar] = useState<BusinessPillar | null>(null);
  const [localContent, setLocalContent] = useState<string>('');
  const updateProject = useParaStore(s => s.updateProject);

  const config = useOsSettingsStore(s => s.domainConfigs?.find(c => c.domain === 'business'));
  const accentColor = config?.color || '#3b82f6';

  // Sync content quand on change d'onglet
  useEffect(() => {
    if (activePillar) {
      setLocalContent(project.pillarsContent?.[activePillar] || '');
    }
  }, [activePillar, project.id, project.pillarsContent]);

  const handleSave = async (content: string) => {
    if (!activePillar) return;
    
    // Garantir un spread propre même si pillarsContent est undefined
    const currentContent = project.pillarsContent || {};
    const newContent = { ...currentContent, [activePillar]: content };
    
    // Mise à jour via le store (qui gère déjà la sauvegarde IDB via writeToLD et updatedAt)
    await updateProject(project.id, { pillarsContent: newContent });
  };

  if (project.domain !== 'business') return null;

  return (
    <div className="mt-6 pt-6 border-t border-white/5">
      <h4 className="text-[10px] font-bold text-[var(--theme-text)]/40 uppercase tracking-[0.3em] mb-4">Summers Fractal (Pillars)</h4>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {PILLARS.map(pillar => {
          const isActive = activePillar === pillar;
          const hasContent = !!project.pillarsContent?.[pillar];
          return (
            <button
              key={pillar}
              onClick={() => setActivePillar(isActive ? null : pillar)}
              className={`p-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                isActive 
                  ? 'text-white shadow-lg shadow-black/20' 
                  : hasContent 
                    ? 'bg-white/5 text-[var(--theme-text)]/60 hover:bg-white/10' 
                    : 'bg-transparent border border-white/5 text-[var(--theme-text)]/20 hover:border-white/10 hover:text-[var(--theme-text)]/40'
              }`}
              style={isActive ? { backgroundColor: `${accentColor}cc`, border: `1px solid ${accentColor}`, color: '#fff' } : {}}
            >
              {pillar}
              {hasContent && !isActive && <div className="w-1.5 h-1.5 rounded-full mx-auto mt-1" style={{ backgroundColor: accentColor }} />}
            </button>
          );
        })}
      </div>
      
      {activePillar && (
        <div className="animate-in slide-in-from-top-2 duration-300">
          <textarea
            value={localContent}
            onChange={(e) => setLocalContent(e.target.value)}
            onBlur={() => handleSave(localContent)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleSave(localContent);
                e.currentTarget.blur();
              }
            }}
            placeholder={`Context for ${activePillar}...`}
            className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-xs text-[var(--theme-text)] placeholder-[var(--theme-text)]/20 focus:border-white/20 outline-none resize-none custom-scrollbar"
            style={{ borderLeft: `2px solid ${accentColor}` }}
          />
          <p className="text-[8px] text-[var(--theme-text)]/30 uppercase tracking-widest mt-2 ml-1 text-right italic">
            Auto-saves on blur • Press ⌘/Ctrl + Enter to commit
          </p>
        </div>
      )}
    </div>
  );
}
