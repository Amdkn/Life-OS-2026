import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { useParaStore, type Project } from '../../../stores/fw-para.store';
import { writeToLD } from '../../../lib/ld-router';
import { DOMAIN_TO_LD } from '../../../utils/paraAdapter';

export function ResourceLinker({ project, onClose }: { project: Project, onClose: () => void }) {
  const [search, setSearch] = useState('');
  const allResources = useParaStore(s => s.resources);
  const updateProject = useParaStore(s => s.updateProject);
  
  // Exclure les ressources déjà liées par projectId ou incluses dans le tableau
  const available = allResources.filter(r => 
    r.projectId !== project.id && 
    !(project.linkedResources || []).includes(r.id) &&
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleLink = async (resId: string) => {
    const freshLinked = [...(project.linkedResources || []), resId];
    // Sync Store & IDB via updateProject
    await updateProject(project.id, { linkedResources: freshLinked });
  };

  return (
    <div className="mt-4 p-4 rounded-2xl bg-black/40 border border-white/5 animate-in slide-in-from-top-2">
      <div className="relative mb-3">
        <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[var(--theme-text)]/30" />
        <input 
          autoFocus value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search global repository..." 
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-[var(--theme-text)] focus:border-[var(--theme-accent)]/50 outline-none"
        />
      </div>
      <div className="space-y-1 max-h-40 overflow-auto custom-scrollbar pr-1">
        {available.length === 0 ? (
          <p className="text-[10px] text-center italic text-white/20 py-2">No unlinked resources found.</p>
        ) : available.slice(0, 10).map(r => (
           <div key={r.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 group">
              <span className="text-[10px] text-[var(--theme-text)]/60 truncate mr-2 group-hover:text-[var(--theme-text)]">{r.title}</span>
              <button onClick={() => handleLink(r.id)} className="p-1 rounded bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/20 transition-all">
                 <Plus className="w-3 h-3" />
              </button>
           </div>
        ))}
      </div>
      <button onClick={onClose} className="mt-3 w-full py-1.5 text-[9px] uppercase tracking-widest text-[var(--theme-text)]/30 hover:text-[var(--theme-text)]/60 transition-colors">Close Search</button>
    </div>
  );
}
