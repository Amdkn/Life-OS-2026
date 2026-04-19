import React, { useState } from 'react';
import { X, Link as LinkIcon, Save, Type, Zap } from 'lucide-react';
import { useParaStore, type Project, type Resource } from '../../../stores/fw-para.store';
import { writeToLD } from '../../../lib/ld-router';
import { DOMAIN_TO_LD } from '../../../utils/paraAdapter';

interface Props {
  project: Project;
  onClose: () => void;
}

export function ForgeModal({ project, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<'article'|'video'|'book'|'tool'|'other'>('article');

  const addResource = useParaStore(s => s.addResource);

  const handleSave = async () => {
    if (!title.trim()) return;
    
    // Auto-Injection
    const fullResource: Resource = {
      id: crypto.randomUUID(),
      title,
      url,
      type: type as any,
      category: 'General',
      domain: project.domain as any,
      linkedProjects: [project.id],
      linkedPillars: [],
      projectId: project.id // The Forge Inject
    };

    // Store local
    await addResource(fullResource);

    // IndexedDB persistance
    const ldId = DOMAIN_TO_LD[project.domain];
    if (ldId) {
      try {
        await writeToLD(ldId, 'resources', 'add', {
          id: fullResource.id,
          title: fullResource.title,
          description: url,
          status: 'active',
          updatedAt: Date.now()
        }, 'para');
      } catch(e) { console.error('Forge save failed', e); }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b border-white/5 bg-white/[0.02]">
          <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-[var(--theme-text)]">
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
            <input 
              autoFocus 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Resource name..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[var(--theme-text)] focus:border-amber-500/50 outline-none" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--theme-text)]/40 ml-1 flex items-center gap-1.5"><LinkIcon className="w-3 h-3" /> URL / Source</label>
            <input 
              value={url} 
              onChange={e => setUrl(e.target.value)} 
              placeholder="https://..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[var(--theme-text)] focus:border-amber-500/50 outline-none" 
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2 pt-2">
            {['article','video','book','tool','other'].map(t => (
              <button 
                key={t} 
                onClick={() => setType(t as any)} 
                className={`py-2 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all ${type === t ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/5 text-[var(--theme-text)]/40 border border-transparent'}`}
              >
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
