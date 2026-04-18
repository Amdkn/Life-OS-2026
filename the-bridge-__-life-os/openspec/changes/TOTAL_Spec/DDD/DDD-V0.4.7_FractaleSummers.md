# DDD-V0.4.7 — La Fractale de Summers

> **ADR** : ADR-V0.4.7 · **Dossier** : `the-bridge-__-life-os/src/`

---

## Phase A : Typage et Store (fw-para.store.ts)

### Étape A.1 : Extension du type Project
```typescript
export interface Project extends ParaItem {
  domain: LifeWheelDomain;
  pillars: BusinessPillar[];
  progress: number;
  pillarsContent?: Partial<Record<BusinessPillar, string>>; // V0.4.7 Fractal
}
```

### Étape A.2 : Extension des Paramètres de saveProject
Vérifier que `writeToLD` ou le système de mise à jour de projet accepte déjà la fusion d'objet complet. Si la méthode `updateProject` existe, s'assurer t'utilser Partial<Project>.

## Phase B : UI de la Fractale

### Étape B.1 : `ProjectFractal.tsx`
**NEW** `src/apps/para/components/ProjectFractal.tsx`
```typescript
import React, { useState, useEffect } from 'react';
import { useParaStore, type Project, type BusinessPillar } from '../../../stores/fw-para.store';
import { useOsSettingsStore } from '../../../stores/os-settings.store';
import { writeToLD, DOMAIN_TO_LD } from '../../../utils/paraAdapter';

const PILLARS: BusinessPillar[] = ['growth', 'ops', 'product', 'finance', 'people', 'it', 'legal', 'meta'];

export function ProjectFractal({ project }: { project: Project }) {
  const [activePillar, setActivePillar] = useState<BusinessPillar | null>(null);
  const [localContent, setLocalContent] = useState<string>('');

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
    const newContent = { ...project.pillarsContent, [activePillar]: content };
    // Mise à jour locale (Zustand)
    useParaStore.setState(s => ({
      projects: s.projects.map(p => p.id === project.id ? { ...p, pillarsContent: newContent } : p)
    }));
    // Sauvegarde DB
    const ldId = DOMAIN_TO_LD[project.domain];
    if (ldId) {
      try {
        await writeToLD(ldId, 'projects', 'put', { ...project, pillarsContent: newContent }, 'para');
      } catch (err) { console.error('Failed to save pillar content', err); }
    }
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
                  ? 'bg-opacity-20 text-white' 
                  : hasContent 
                    ? 'bg-white/5 text-[var(--theme-text)]/60 hover:bg-white/10' 
                    : 'bg-transparent border border-white/5 text-[var(--theme-text)]/20 hover:border-white/10 hover:text-[var(--theme-text)]/40'
              }`}
              style={isActive ? { backgroundColor: `${accentColor}40`, border: `1px solid ${accentColor}80`, color: accentColor } : {}}
            >
              {pillar}
              {hasContent && !isActive && <div className="w-1 h-1 rounded-full mx-auto mt-1" style={{ backgroundColor: accentColor }} />}
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
            placeholder={`Context for ${activePillar}...`}
            className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-xs text-[var(--theme-text)] placeholder-white/20 focus:border-white/20 outline-none resize-none custom-scrollbar"
            style={{ borderLeft: `2px solid ${accentColor}` }}
          />
        </div>
      )}
    </div>
  );
}
```

## Phase C : Intégration dans ProjectCommandCard

### Étape C.1 : `ProjectCommandCard.tsx`
```typescript
import { ProjectFractal } from './ProjectFractal';

// Dans le render return, sous la section d'en-tête (progress, status) ou avant la division Bridge :
<ProjectFractal project={project} />
```
