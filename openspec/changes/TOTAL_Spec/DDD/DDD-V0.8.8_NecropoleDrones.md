# DDD-V0.8.8 — La Nécropole des Drones (Graveyard)

> **ADR** : ADR-V0.8.8 · **Cible** : `fw-deal.store.ts` et `Muses.tsx` UI

---

## Phase A : L'Action Decommission

### Étape A.1 : Coder l'action de mort honorifique
Dans `fw-deal.store.ts` (ou directement patchable via le classique `updateMuse`) :
```typescript
interface DealState {
  // ...
  decommissionMuse: (id: string) => Promise<void>;
}

export const useDealStore = create<DealState>((set) => ({
  // ...
  decommissionMuse: async (id: string) => {
    let targetMuse: Muse | undefined;
    
    set(s => {
      const newMuses = s.muses.map(m => {
        if (m.id === id) {
          targetMuse = { ...m, status: 'deprecated', updatedAt: Date.now() };
          return targetMuse;
        }
        return m;
      });
      return { muses: newMuses };
    });

    if (targetMuse) {
      await ldRouter.upsertItem('muses', targetMuse, 'ld06');
    }
  }
}));
```

---

## Phase B : L'Archive View

### Étape B.1 : Le Switch UI dans le Dashboard
Dans `src/apps/deal/pages/Muses.tsx` (Le composant principal qui liste) :
```tsx
import { useState } from 'react';
import { useDealStore } from '../../../stores/fw-deal.store';
import { ArchiveRestore, Trash } from 'lucide-react';

export function MusesDashboard() {
  const muses = useDealStore(s => s.muses);
  const decommissionMuse = useDealStore(s => s.decommissionMuse);
  const [showGraveyard, setShowGraveyard] = useState(false);

  const activeMuses = muses.filter(m => m.status !== 'deprecated');
  const deprecatedMuses = muses.filter(m => m.status === 'deprecated');

  const musesToDisplay = showGraveyard ? deprecatedMuses : activeMuses;

  return (
    <div>
      {/* Header avec Toggle */}
      <div className="flex justify-between items-center mb-8">
         <h2 className="text-2xl font-black text-white">Muse Fleet</h2>
         <button 
           onClick={() => setShowGraveyard(!showGraveyard)}
           className="text-white/40 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
         >
           <ArchiveRestore className="w-4 h-4" />
           {showGraveyard ? 'View Active Fleet' : 'View Graveyard'}
         </button>
      </div>

      {/* Rendu des cartes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {musesToDisplay.map(muse => (
           <div key={muse.id} className={`glass-card p-6 rounded-3xl ${muse.status === 'deprecated' ? 'opacity-50 grayscale' : ''}`}>
               {/* Contenu de la Muse... Titre, Break-Even, ExecutionTrigger */}

               {/* Bouton Decommission (Uniquement si actif) */}
               {muse.status !== 'deprecated' && (
                 <button 
                    onClick={() => {
                      if (window.confirm('Retire this drone from the active fleet?')) {
                        decommissionMuse(muse.id);
                      }
                    }}
                    className="mt-6 flex items-center justify-center gap-2 w-full py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-[10px] uppercase font-bold tracking-[0.2em] transition-colors"
                 >
                   <Trash className="w-3 h-3" /> Decommission Drone
                 </button>
               )}
               {muse.status === 'deprecated' && (
                  <div className="mt-6 text-center text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] border border-dashed border-white/10 py-2 rounded-xl">
                     Honorably Discharged
                  </div>
               )}
           </div>
         ))}
      </div>
    </div>
  );
}
```
*(Gate: npx tsc --noEmit)*
