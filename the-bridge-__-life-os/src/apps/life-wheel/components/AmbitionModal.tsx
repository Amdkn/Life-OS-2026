import React, { useState } from 'react';
import { X, Flame } from 'lucide-react';
import { useLifeWheelStore } from '../../../stores/fw-wheel.store';

export function AmbitionModal({ onClose }: { onClose: () => void }) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const { domains, addAmbition } = useLifeWheelStore();
  const [selectedDomain, setSelectedDomain] = useState(domains[0]?.id || '');

  const handleSave = async () => {
    if (!title || !selectedDomain) return;
    await addAmbition({
      id: crypto.randomUUID(), 
      type: 'ambition', 
      status: 'active',
      title, 
      content, 
      domainId: selectedDomain,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      description: content.slice(0, 100)
    } as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-8 animate-in fade-in duration-300">
      <div className="w-full max-w-2xl text-[var(--theme-text)]">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xs uppercase tracking-[0.4em] font-bold text-amber-500 flex items-center gap-3">
             <Flame className="w-4 h-4" /> Forge Ambition
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-white/40"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="flex gap-4 mb-6">
          {domains.map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedDomain(d.id)}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border
                ${selectedDomain === d.id ? 'border-amber-500/50 bg-amber-500/10 text-amber-500' : 'border-white/5 bg-white/5 text-white/20 hover:bg-white/10'}
              `}
            >
              {d.name}
            </button>
          ))}
        </div>

        <input 
          autoFocus 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="Title of this Ambition" 
          className="w-full bg-transparent text-3xl font-black placeholder-white/10 outline-none mb-6 text-[var(--theme-text)]" 
        />
        
        <textarea 
          value={content} 
          onChange={e => setContent(e.target.value)}
          placeholder="Describe your sovereign goal..."
          className="w-full h-64 bg-transparent text-sm leading-relaxed placeholder-white/10 outline-none resize-none custom-scrollbar text-[var(--theme-text)]/80"
        />

        <div className="flex justify-end mt-8">
          <button 
            onClick={handleSave} 
            className="px-8 py-3 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-xs font-black uppercase tracking-widest hover:bg-amber-500/20 transition-all shadow-lg"
          >
            Commit to Protocol
          </button>
        </div>
      </div>
    </div>
  );
}
