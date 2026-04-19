# DDD-V0.4.8 — Le Workflow de la Forge

> **ADR** : ADR-V0.4.8 · **Dossier** : `the-bridge-__-life-os/src/`

---

## Phase A : Typage

### Étape A.1 : `fw-para.store.ts`
```typescript
export interface Resource extends ParaItem {
  url: string;
  type: 'article' | 'video' | 'book' | 'tool' | 'other';
  projectId?: string; // V0.4.8 Auto-Injection
}
```

## Phase B : La Modale de Forge Silencieuse

### Étape B.1 : `ForgeModal.tsx`
**NEW** `src/apps/para/components/ForgeModal.tsx`
```typescript
import React, { useState } from 'react';
import { X, Link as LinkIcon, Save, Type } from 'lucide-react';
import { useParaStore, type Project } from '../../../stores/fw-para.store';
import { writeToLD, DOMAIN_TO_LD } from '../../../utils/paraAdapter';

interface Props {
  project: Project;
  onClose: () => void;
}

export function ForgeModal({ project, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<'article'|'video'|'book'|'tool'|'other'>('article');

  const addResource = useParaStore(s => s.addResource); // Assurez-vous que cette fonction merge l'état

  const handleSave = async () => {
    if (!title.trim()) return;
    
    // Auto-Injection
    const fullResource = {
      id: crypto.randomUUID(),
      title,
      url,
      type,
      domain: project.domain,
      pillars: [], // Implicite via domaine ou projet parent
      status: 'active' as const,
      createdAt: Date.now(),
      projectId: project.id // La pépite de The Forge
    };

    // Store local
    addResource(fullResource);

    // IndexedDB persistance
    const ldId = DOMAIN_TO_LD[project.domain];
    if (ldId) {
      try {
        await writeToLD(ldId, 'resources', 'put', fullResource, 'para');
      } catch(e) { console.error('Forge save failed', e); }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b border-white/5 bg-white/[0.02]">
          <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> The Forge (Injected)
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg text-white/40"><X className="w-4 h-4" /></button>
        </div>
        
        <div className="p-6 space-y-4">
          <p className="text-[9px] text-[var(--theme-text)]/40 uppercase tracking-widest text-center mb-2">
            Targeting Project: <span className="text-amber-400">{project.title}</span>
          </p>
          
          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--theme-text)]/40 ml-1 flex items-center gap-1.5"><Type className="w-3 h-3" /> Title</label>
            <input autoFocus value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-amber-500/50 outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--theme-text)]/40 ml-1 flex items-center gap-1.5"><LinkIcon className="w-3 h-3" /> URL / Source</label>
            <input value={url} onChange={e => setUrl(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-amber-500/50 outline-none" />
          </div>
          
          <div className="grid grid-cols-5 gap-2 pt-2">
            {['article','video','book','tool','other'].map(t => (
              <button key={t} onClick={() => setType(t as any)} className={`py-2 rounded-lg text-[8px] font-black uppercase tracking-wider ${type === t ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/5 text-[var(--theme-text)]/40 border border-transparent'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t border-white/5 bg-white/[0.01] flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-[var(--theme-text)]/40 uppercase">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-amber-500/30">
            <Save className="w-4 h-4" /> Forge It
          </button>
        </div>
      </div>
    </div>
  );
}
```

## Phase C : Injection dans la Command Card

### Étape C.1 : `ProjectCommandCard.tsx`
```typescript
import { ForgeModal } from './ForgeModal';

// Dans le composant
const [isForgeOpen, setIsForgeOpen] = useState(false);

// Dans le render (section Geordi/Resources)
<div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
    <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--theme-text)]/60">Resources</h4>
        <button onClick={() => setIsForgeOpen(true)} className="px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-amber-500/20">
            + Forge
        </button>
    </div>
    {/* Rendu des ressources du projet = voir V0.4.9 */}
</div>

{isForgeOpen && <ForgeModal project={project} onClose={() => setIsForgeOpen(false)} />}
```
