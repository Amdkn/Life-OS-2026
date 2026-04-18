# DDD-V0.7.3 — OmniCapture (La Modale de Chaos)

> **ADR** : ADR-V0.7.3 · **Dossier Cible** : `src/components/OmniCaptureModal.tsx` et Root (App.tsx)

---

## Phase A : Création de la Modale

### Étape A.1 : `OmniCaptureModal.tsx`
Créer ce composant haut niveau (pas dans le dossier `gtd`, mais dans les composants globaux) :
```tsx
import React, { useState, useEffect } from 'react';
import { Send, Zap, X } from 'lucide-react';
import { useGtdStore } from '../stores/fw-gtd.store';

export function OmniCaptureModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  
  // N'importe QUE l'action addItem pour éviter les re-renders
  const addItem = useGtdStore(s => s.addItem);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Shortcut: Ctrl + Space
      if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    addItem(content); // Default: inbox
    setContent('');
    setIsOpen(false);
    
    // Feedback minimaliste (toast) pourrait être ajouté ici 
    console.log("[A'Space] OmniCaptured to GTD Inbox :", content);
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-150">
      <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
      
      <div className="w-[600px] relative">
         <form onSubmit={handleSubmit} className="flex items-center gap-4 bg-[#0A0A0A] border-2 border-blue-500/30 rounded-3xl p-3 shadow-[0_0_50px_rgba(59,130,246,0.15)] focus-within:border-blue-500/80 transition-all">
           <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
             <Zap className="w-6 h-6 text-blue-400" />
           </div>
           
           <input 
             type="text"
             autoFocus
             value={content}
             onChange={e => setContent(e.target.value)}
             placeholder="OmniCapture: What's on your mind? (Press Enter)"
             className="flex-1 bg-transparent border-none text-xl text-white placeholder-white/20 focus:outline-none"
           />
           
           <button type="submit" disabled={!content.trim()} className="w-12 h-12 rounded-2xl bg-blue-500 hover:bg-blue-400 flex items-center justify-center text-black shrink-0 transition-colors disabled:opacity-50">
             <Send className="w-5 h-5" />
           </button>
         </form>
         
         <div className="mt-4 text-center">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/30 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/5">
              Press <kbd className="font-mono text-white/70 mx-1">ESC</kbd> to abort
            </span>
         </div>
      </div>
    </div>
  );
}
```

### Étape A.2 : Montage au sommet
Dans `src/App.tsx` (ou le layout de `CommandCenter`), importer et monter `<OmniCaptureModal />` juste avant la fermeture de la div principale pour garantir qu'elle est toujours présente.
