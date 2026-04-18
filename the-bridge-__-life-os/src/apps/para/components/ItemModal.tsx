/** PARA Item Modal — Shared Editor (P4.4) */
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ParaItem } from '../../../stores/ld01.store';
import { LDId } from '../../../lib/ld-router';

interface ItemModalProps {
  item: ParaItem | null;
  type: 'Project' | 'Resource'; // ← strictly typed
  onSave: (ldId: LDId, data: Partial<ParaItem>) => void;
  onClose: () => void;
}

const DOMAINS: { id: LDId, label: string }[] = [
  { id: 'ld01', label: 'Business' },
  { id: 'ld02', label: 'Finance' },
  { id: 'ld03', label: 'Health' },
  { id: 'ld04', label: 'Cognition' },
  { id: 'ld05', label: 'Relations' },
  { id: 'ld06', label: 'Habitat' },
  { id: 'ld07', label: 'Creativity' },
  { id: 'ld08', label: 'Impact' },
];

export function ItemModal({ item, type, onSave, onClose }: ItemModalProps) {
  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [selectedLd, setSelectedLd] = useState<LDId>('ld01');

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md glass-card rounded-3xl p-6 border-white/10 bg-[#0a0f0d] shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold text-[var(--theme-text)] uppercase tracking-[0.2em] font-outfit">
            {item ? `Edit ${type}` : `Add New ${type}`}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-[var(--theme-text)]/40 hover:text-[var(--theme-text)] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {!item && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--theme-text)]/30 uppercase tracking-widest px-1">Target Life Domain</label>
              <select 
                value={selectedLd}
                onChange={e => setSelectedLd(e.target.value as LDId)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[var(--theme-text)]/60 outline-none focus:border-emerald-500/40 transition-all appearance-none"
              >
                {DOMAINS.map(d => <option key={d.id} value={d.id} className="bg-[#0a0f0d]">{d.label}</option>)}
              </select>
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[var(--theme-text)]/30 uppercase tracking-widest px-1">Title</label>
            <input 
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={`Enter ${type} title...`}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[var(--theme-text)] outline-none focus:border-emerald-500/40 transition-all"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[var(--theme-text)]/30 uppercase tracking-widest px-1">Description</label>
            <textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={`Describe this ${type}...`}
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[var(--theme-text)] outline-none focus:border-emerald-500/40 transition-all resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button 
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-white/5 text-[var(--theme-text)]/60 font-bold uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSave(selectedLd, { title, description })}
            disabled={!title.trim()}
            className="flex-1 py-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase tracking-widest text-[10px] hover:bg-emerald-500/30 transition-all disabled:opacity-20 disabled:hover:bg-emerald-500/20"
          >
            Save Protocol
          </button>
        </div>
      </div>
    </div>
  );
}

