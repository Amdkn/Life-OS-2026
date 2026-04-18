# DDD-V0.5.1 — La Forge des Principes (CRUD Constitutionnel)

> **ADR** : ADR-V0.5.1 · **Dossiers cibles** : `the-bridge-__-life-os/src/stores/`, `apps/ikigai/`, `apps/life-wheel/`

---

## Phase A : Migration IndexedDB IKIGAI

### Étape A.1 : `fw-ikigai.store.ts`
*(Suppression du middleware `persist` de localstorage, intégration de LD-Router)*

```typescript
import { create } from 'zustand';
import type { ParaItem } from './fw-para.store';
import { writeToLD, readFromLD } from '../utils/paraAdapter'; // Utilise l'adaptateur existant ou router direct

export type IkigaiPillar = 'craft' | 'mission' | 'passion' | 'vocation';
export type IkigaiHorizon = 'H1' | 'H3' | 'H10' | 'H30' | 'H90';

export interface IkigaiVision extends ParaItem {
  type: 'vision';
  pillar: IkigaiPillar;
  horizon: IkigaiHorizon;
  content: string; // La "Constitution" elle-même
}

interface IkigaiState {
  visions: IkigaiVision[];
  activePillar: IkigaiPillar | 'all';
  activeHorizon: IkigaiHorizon | 'all';
  isHydrated: boolean;
  
  // Actions
  hydrate: () => Promise<void>;
  setActivePillar: (p: IkigaiPillar | 'all') => void;
  setActiveHorizon: (h: IkigaiHorizon | 'all') => void;
  addVision: (v: IkigaiVision) => Promise<void>;
}

export const useIkigaiStore = create<IkigaiState>((set, get) => ({
  visions: [],
  activePillar: 'all',
  activeHorizon: 'all',
  isHydrated: false,

  hydrate: async () => {
    try {
      // Lit les visions depuis LD01 (ou base system ikigai si existante)
      // ASTUCE A3: Si pas de base dédiée, on l'installe dans ld01 ou on crée une table logistique.
      // Par simplicité, assumons qu'elles sont lues via readFromLD('system', 'ikigai') ou simulé.
      const data = await readFromLD('ld01', 'resources'); 
      const ikigaiNodes = data.filter(d => d.type === 'vision') as IkigaiVision[];
      set({ visions: ikigaiNodes, isHydrated: true });
    } catch (e) { console.error('Ikigai DB hydration failed', e); set({ isHydrated: true });}
  },

  setActivePillar: (activePillar) => set({ activePillar }),
  setActiveHorizon: (activeHorizon) => set({ activeHorizon }),
  addVision: async (v) => {
    set(s => ({ visions: [...s.visions, v] }));
    await writeToLD('ld01', 'resources', 'put', v, 'ikigai');
  }
}));
```

## Phase B : Migration IndexedDB LIFE WHEEL

### Étape B.1 : `fw-wheel.store.ts`
*(Extension de Life Wheel vers IndexedDB pour sauver les Ambitions)*
```typescript
import { create } from 'zustand';
import type { ParaItem } from './fw-para.store';
import { writeToLD, readFromLD } from '../utils/paraAdapter';

export interface WheelAmbition extends ParaItem {
  type: 'ambition';
  domainId: string; // ex: 'd1' pour Business
  content: string;
}

// Conserver DEFAULT_DOMAINS en hardcodé dans le fichier (immutabilité)

interface WheelState {
  // Les domaines statiques restent
  activeTab: 'overview' | 'domains' | 'analytics' | 'growth';
  ambitions: WheelAmbition[]; // <- NOUVEAU
  isHydrated: boolean;

  hydrateAmbitions: () => Promise<void>;
  addAmbition: (a: WheelAmbition) => Promise<void>;
  setActiveTab: (tab: WheelState['activeTab']) => void;
}

export const useLifeWheelStore = create<WheelState>((set, get) => ({
  activeTab: 'overview',
  ambitions: [],
  isHydrated: false,

  hydrateAmbitions: async () => {
     try {
       const data = await readFromLD('ld01', 'resources'); // Ou via toutes les DBs si réparti
       const nodes = data.filter(d => d.type === 'ambition') as WheelAmbition[];
       set({ ambitions: nodes, isHydrated: true });
     } catch (e) { set({ isHydrated: true }); }
  },

  addAmbition: async (a) => {
    set(s => ({ ambitions: [...s.ambitions, a] }));
    await writeToLD('ld01', 'resources', 'put', a, 'wheel');
  },
  setActiveTab: (tab) => set({ activeTab: tab })
}));
```

## Phase C : Création des Vision Nodes (Ikigai)

### Étape C.1 : `VisionModal.tsx`
**NOUVEAU** `src/apps/ikigai/components/VisionModal.tsx`
*(Modale "Typewriter" sombre sans friction)*
```typescript
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
      id: crypto.randomUUID(), type: 'vision', status: 'active',
      title, content, pillar, horizon, createdAt: Date.now()
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
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded"><X className="w-5 h-5" /></button>
        </div>
        
        <input 
          autoFocus value={title} onChange={e => setTitle(e.target.value)} 
          placeholder="Title of this Principle" 
          className="w-full bg-transparent text-3xl font-black placeholder-white/10 outline-none mb-6" 
        />
        
        <textarea 
          value={content} onChange={e => setContent(e.target.value)}
          placeholder="Write your constitution here..."
          className="w-full h-64 bg-transparent text-sm leading-relaxed placeholder-white/10 outline-none resize-none custom-scrollbar"
        />

        <div className="flex justify-end mt-8">
          <button onClick={handleSave} className="px-8 py-3 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-xs font-black uppercase tracking-widest hover:bg-amber-500/20">
            Anchor into Reality
          </button>
        </div>
      </div>
    </div>
  );
}
```
*(NOTE GRAVITY: A3, intègre ensuite le bouton de cette modale dans la grille Ikigai là où une intersection n'a pas encore de texte)*
