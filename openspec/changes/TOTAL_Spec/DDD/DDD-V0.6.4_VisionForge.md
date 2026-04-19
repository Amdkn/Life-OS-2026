# DDD-V0.6.4 — La Forge de Vision (Pike's Console)

> **ADR** : ADR-V0.6.4 · **Dossier** : `the-bridge-__-life-os/src/apps/twelve-week/`

---

## Phase A : Création de la Modale

### Étape A.1 : `VisionForgeModal.tsx`
**NOUVEAU FICHIER** : `src/apps/twelve-week/components/VisionForgeModal.tsx`

```tsx
import React, { useState } from 'react';
import { X, Compass } from 'lucide-react';
import { useTwelveWeekStore } from '../../../stores/fw-12wy.store';
import { useIkigaiStore } from '../../../stores/fw-ikigai.store';

interface VisionForgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VisionForgeModal({ isOpen, onClose }: VisionForgeModalProps) {
  const [title, setTitle] = useState('');
  const [ikigaiVisionId, setIkigaiVisionId] = useState<string>('');
  
  const addVision = useTwelveWeekStore(s => s.addVision);
  const ikigaiVisions = useIkigaiStore(s => s.visions); // Le pont Nexus

  if (!isOpen) return null;

  const handleForge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await addVision({
      id: crypto.randomUUID(),
      type: 'wy-vision',
      title,
      ikigaiVisionId: ikigaiVisionId || undefined,
      status: 'active',
      domain: 'life', // Default
      pillars: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    setTitle('');
    setIkigaiVisionId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-[500px] bg-black/80 border border-white/10 rounded-[2rem] p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Compass className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-white font-bold tracking-wide">Forge Strategic Vision</h2>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-black">12WY - 3 Year Horizon</p>
          </div>
        </div>

        <form onSubmit={handleForge} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/60 font-bold ml-1">Vision Directive</label>
            <input 
              autoFocus
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Build an Autonomous Fleet"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/60 font-bold ml-1 flex justify-between">
              <span>Ikigai Nexus (Optional)</span>
              <span className="text-white/20">The Why</span>
            </label>
            <select 
              value={ikigaiVisionId} 
              onChange={e => setIkigaiVisionId(e.target.value)}
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400/50 font-medium appearance-none"
            >
              <option value="">-- Independent Tactical Vision --</option>
              {ikigaiVisions.map(v => (
                <option key={v.id} value={v.id}>{v.title}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            disabled={!title.trim()}
            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Initiate Vision
          </button>
        </form>
      </div>
    </div>
  );
}
```

## Phase B : Intégration App

### Étape B.1 : Hooks dans `TwelveWeekApp.tsx`
*(Remplace l'ancien `const title = prompt('Enter Vision Title:');`)*
Ajouter la modale à la racine de l'app ou dans la Vue Vision :
```tsx
import { VisionForgeModal } from './components/VisionForgeModal';
// ... dans le render :
const [isVisionModalOpen, setIsVisionModalOpen] = useState(false);

// ... sur le bouton d'ajout de vision :
<button onClick={() => setIsVisionModalOpen(true)}>+ New Vision</button>

// ... tout en bas du composant (avant de fermer le parent div)
<VisionForgeModal isOpen={isVisionModalOpen} onClose={() => setIsVisionModalOpen(false)} />
```
*(Idem pour GoalTable et TacticsBoard selon où IronClaw a logé ses prompts !)*
