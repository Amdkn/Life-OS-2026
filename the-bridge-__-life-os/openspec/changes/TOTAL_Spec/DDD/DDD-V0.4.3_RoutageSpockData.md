# DDD-V0.4.3 — Routage Spock & Data (The Enterprise Computer)

> **ADR** : ADR-V0.4.3 · **Dossier** : `the-bridge-__-life-os/src/`

---

## Phase A : Areas (Officier Scientifique Spock)

### Étapes A.1 à A.3 : `DomainCard.tsx`
**MODIFY** `src/apps/para/components/DomainCard.tsx`
```typescript
import { useState } from 'react';
import { ChevronDown, ChevronUp, Layers, Compass, Activity, Zap, Cpu, Shield, Users, Briefcase, Globe } from 'lucide-react';
import { clsx } from 'clsx';
import type { LifeWheelDomain, BusinessPillar, Project } from '../../../stores/fw-para.store';
import { useOsSettingsStore } from '../../../stores/os-settings.store';
import { useShellStore } from '../../../stores/shell.store';

interface DomainCardProps {
  domain: LifeWheelDomain;
  activeProjects: Project[];
  selectedPillar: string | null;
  onPillarSelect: (pillar: BusinessPillar | null) => void;
}

const PILLARS: { id: BusinessPillar; icon: any; label: string }[] = [ /* ... unchanged ... */ ];

export function DomainCard({ domain, activeProjects, selectedPillar, onPillarSelect }: DomainCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { domainConfigs } = useOsSettingsStore();
  const openApp = useShellStore(s => s.openApp);
  
  const config = domainConfigs?.find(c => c.domain === domain);
  const color = config?.color || '#10b981'; // Fallback
  const count = activeProjects.length;

  return (
    <div className={clsx("glass-card rounded-[2.5rem] border overflow-hidden transition-all duration-500",
      isExpanded ? "shadow-2xl" : "hover:bg-white/[0.03]",
      isExpanded ? "border-opacity-30" : "border-white/5"
    )} style={{ borderColor: isExpanded ? color : undefined }}>
      <div className="w-full p-8 flex items-center justify-between group">
        <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-6 flex-1 text-left">
          {/* ... ICON CONTAINER (apply style={{ backgroundColor: color + '1a', borderColor: color + '33', color: color }}) ... */}
          <div className="text-left">
            <h3 className="text-lg font-bold uppercase tracking-wider transition-colors" style={{ color: isExpanded ? color : 'var(--theme-text)' }}>{config?.label || domain}</h3>
            <p className="text-[10px] font-bold text-[var(--theme-text)]/20 uppercase tracking-[0.3em]">{count} Active Projects</p>
          </div>
        </button>
        <div className="flex items-center gap-4">
          <button onClick={(e) => { e.stopPropagation(); openApp('ikigai', 'Ikigai Engine'); }} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest border border-white/5">
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
              const isSelected = selectedPillar === p.id;
              return (
                <div key={p.id} onClick={() => onPillarSelect(isSelected ? null : p.id)}
                  className={clsx("p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center relative",
                    isSelected ? "bg-white/10" : "bg-white/[0.02] border-white/5 hover:border-white/20"
                  )} style={{ borderColor: isSelected ? color : undefined }}>
                  <p.icon className="w-5 h-5 mb-3 transition-colors" style={{ color: isSelected || pCount>0 ? color : 'rgba(255,255,255,0.1)' }} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--theme-text)]/80 mb-1">{p.label}</h4>
                  <span className="text-[8px] font-bold uppercase text-[var(--theme-text)]/30 tracking-widest bg-black/20 px-2 rounded-full">{pCount} prj</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Étape A.4 : `ParaApp.tsx` (Filtres croisés)
**MODIFY** `src/apps/para/ParaApp.tsx`
```typescript
// Ajouter State
const [activePillarFilter, setActivePillarFilter] = useState<string | null>(null);

// Mettre à jour `filteredProjects` (Areas)
const areasFilteredProjects = useMemo(() => {
  return projects.filter(p => p.status !== 'archived').filter(p => activePillarFilter ? p.pillars.includes(activePillarFilter) : true);
}, [projects, activePillarFilter]);

// Dans le render Tab === 'areas' :
{domainFilters.filter(f => f.id !== 'all' && (activeLdFilter === 'all' || f.id === activeLdFilter)).map(domain => {
  const dProjects = areasFilteredProjects.filter(p => p.domain === (domain.label.toLowerCase() as any));
  return <DomainCard key={domain.id} domain={domain.label.toLowerCase() as any} activeProjects={dProjects} selectedPillar={activePillarFilter} onPillarSelect={setActivePillarFilter} />;
})}
```

## Phase B : Archives (Commandeur Data)

### Étapes B.1 à B.3 : Archive Card & Extractor
**MODIFY** `src/apps/para/components/ProjectCard.tsx`
```typescript
import { formatDistanceToNow } from 'date-fns'; // ou helper local si non dispo

// Dans le render de Progress (afficher Date si archivé)
{project.status === 'archived' ? (
  <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-emerald-500/50">
    <Archive className="w-3.5 h-3.5" />
    Archived {project.archivedAt ? new Date(project.archivedAt).toLocaleDateString() : 'N/A'}
  </div>
) : (
  <div className="flex-1 max-w-[120px]">
    {/* progressBar existing... */}
  </div>
)}
```

**NEW/MODIFY** `src/stores/fw-deal.store.ts` (Ajout import direct)
```typescript
// Si fw-deal.store existe, s'assurer d'avoir :
interface DealState {
  // ...
  createDefinitionFromText: (text: string) => void;
}
```

**MODIFY** `src/apps/para/ParaApp.tsx` (Bouton DEAL)
```typescript
import { useDealStore } from '../../stores/fw-deal.store';
// ...
const createDefinitionFromText = useDealStore(s => s.createDefinitionFromText); // Si existant

// Dans Tab === 'archives', le bouton:
<button 
  onClick={(e) => { 
    e.stopPropagation(); 
    if(createDefinitionFromText) createDefinitionFromText(`[ARCHIVE-PARA] ${project.title}`);
    openApp('deal', 'D.E.A.L'); 
  }}
  className="absolute bottom-4 right-4 p-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[8px] font-black uppercase opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5"
>
  <Zap className="w-3 h-3" /> Transform via DEAL
</button>
```
