import React, { useState } from 'react';
import { X, Feather } from 'lucide-react';
import { useIkigaiStore, type IkigaiPillar, type IkigaiHorizon } from '../../../stores/fw-ikigai.store';

export function VisionModal({ pillar, horizon, onClose }: { pillar: IkigaiPillar, horizon: IkigaiHorizon, onClose: () => void }) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const addVision = useIkigaiStore(s => s.addVision);

  const handleSave = async () => {
    if (!title) return;
    await addVision({
      id: crypto.randomUUID(), 
      type: 'vision', 
      status: 'active',
      title, 
      content, 
      pillar, 
      horizon, 
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
             <Feather className="w-4 h-4" /> Forge Vision · {horizon} x {pillar}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-white/40"><X className="w-5 h-5" /></button>
        </div>
        
        <input 
          autoFocus 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="Title of this Principle" 
          className="w-full bg-transparent text-3xl font-black placeholder-white/10 outline-none mb-6 text-[var(--theme-text)]" 
        />
        
        <textarea 
          value={content} 
          onChange={e => setContent(e.target.value)}
          placeholder="Write your constitution here..."
          className="w-full h-64 bg-transparent text-sm leading-relaxed placeholder-white/10 outline-none resize-none custom-scrollbar text-[var(--theme-text)]/80"
        />

        <div className="flex justify-end mt-8">
          <button 
            onClick={handleSave} 
            className="px-8 py-3 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-xs font-black uppercase tracking-widest hover:bg-amber-500/20 transition-all shadow-lg"
          >
            Anchor into Reality
          </button>
        </div>
      </div>
    </div>
  );
}
