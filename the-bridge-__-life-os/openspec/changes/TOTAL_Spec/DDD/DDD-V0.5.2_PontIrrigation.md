# DDD-V0.5.2 — Le Pont d'Irrigation (Ikigai ↔ PARA)

> **ADR** : ADR-V0.5.2 · **Dossiers cibles** : `the-bridge-__-life-os/src/apps/para/`, `apps/ikigai/`

---

## Phase A : Typage et Store (fw-para.store.ts)

### Étape A.1 : Extension Contrat
```typescript
export interface Project extends ParaItem {
  // ...
  ikigaiVisionId?: string; // V0.5.2
  wheelAmbitionId?: string; // V0.5.2
}
```

## Phase B : Alignement Top-Down (Dans la Carte Piccard)

### Étape B.1 : `VisionAligner.tsx`
**NOUVEAU** `src/apps/para/components/VisionAligner.tsx`
```typescript
import React, { useState } from 'react';
import { Eye, ChevronDown } from 'lucide-react';
import { useParaStore, type Project } from '../../../stores/fw-para.store';
import { useIkigaiStore } from '../../../stores/fw-ikigai.store';
import { writeToLD, DOMAIN_TO_LD } from '../../../utils/paraAdapter';

export function VisionAligner({ project }: { project: Project }) {
  const [isOpen, setIsOpen] = useState(false);
  const allVisions = useIkigaiStore(s => s.visions);
  const currentVision = allVisions.find(v => v.id === project.ikigaiVisionId);

  const handleAlign = async (visionId: string) => {
    // Si clique sur celui déjà actif, on annule
    const newId = visionId === project.ikigaiVisionId ? undefined : visionId;
    useParaStore.setState(s => ({
      projects: s.projects.map(p => p.id === project.id ? { ...p, ikigaiVisionId: newId } : p)
    }));
    const ldId = DOMAIN_TO_LD[project.domain];
    if (ldId) await writeToLD(ldId, 'projects', 'put', { ...project, ikigaiVisionId: newId }, 'para');
    setIsOpen(false);
  };

  return (
    <div className="relative mt-2">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-amber-500 transition-colors"
      >
        <Eye className="w-3 h-3" />
        {currentVision ? `Aligned: ${currentVision.title}` : 'Align to Ikigai'}
        <ChevronDown className="w-3 h-3 opacity-50 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl p-2 z-50">
           <h5 className="text-[8px] uppercase tracking-widest text-white/30 px-2 py-1 mb-1">Select Vision Node</h5>
           <div className="max-h-40 overflow-auto custom-scrollbar">
             {allVisions.map(v => (
               <button 
                 key={v.id} 
                 onClick={() => handleAlign(v.id)}
                 className={`w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-white/5 truncate ${v.id === currentVision?.id ? 'text-amber-500 font-bold' : 'text-white/60'}`}
               >
                 [{v.horizon}] {v.title}
               </button>
             ))}
             {allVisions.length === 0 && <span className="text-[10px] text-white/20 italic px-2">No visions yet.</span>}
           </div>
        </div>
      )}
    </div>
  );
}
```

*(A3 : Intègre `<VisionAligner project={project} />` sous le titre de la `ProjectCommandCard.tsx`)*

## Phase C : Rendu Bottom-Up (Dans la Plateforme Ikigai)

### Étape C.1 : `ExecutionProofs.tsx`
**NOUVEAU** `src/apps/ikigai/components/ExecutionProofs.tsx`
```typescript
import React from 'react';
import { useParaStore } from '../../../stores/fw-para.store';
import { Activity, Target } from 'lucide-react';
import { useShellStore } from '../../../stores/shell.store';

export function ExecutionProofs({ visionId }: { visionId: string }) {
  const allProjects = useParaStore(s => s.projects);
  // Selector conditionnel asynchrone sécurisé (pas de infinite loop)
  const linkedProjects = allProjects.filter(p => p.ikigaiVisionId === visionId && p.status !== 'archived');
  const openApp = useShellStore(s => s.openApp);

  if (linkedProjects.length === 0) return (
     <div className="mt-6 p-4 rounded-xl border border-dashed border-white/10 text-center">
       <p className="text-[9px] uppercase tracking-widest text-white/20 italic">No execution proofs. This vision is a dream.</p>
     </div>
  );

  return (
    <div className="mt-8">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-4 flex items-center gap-2">
         <Activity className="w-3.5 h-3.5 text-emerald-500" /> Execution Proofs (PARA)
      </h3>
      <div className="space-y-2">
        {linkedProjects.map(p => (
           <div key={p.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group">
              <div>
                <span className="text-xs font-bold text-white/70 block">{p.title}</span>
                <span className="text-[8px] uppercase tracking-widest text-white/20">Progress: {p.progress}%</span>
              </div>
              <button onClick={() => openApp('para', 'P.A.R.A')} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-emerald-500/10 text-emerald-500/50 hover:text-emerald-400 rounded-lg transition-all">
                <Target className="w-4 h-4" />
              </button>
           </div>
        ))}
      </div>
    </div>
  );
}
```
*(A3: Insère `<ExecutionProofs visionId={vision.id} />` à la fin de la vue détaillée d'une Vision dans `IkigaiDetailPanel.tsx`)*
