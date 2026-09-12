import { create } from 'zustand';
import type { ParaItem } from './ld01.store';
import { writeToLD, readFromLD } from '../lib/ld-router';

/** 
 * Ikigai Framework Store — V0.5.1 Sovereign Constitution
 * Matrix: 4 Pillars x 5 Horizons
 * Migrated from localStorage to IndexedDB (LD01/resources)
 */

export type IkigaiPillar = 'craft' | 'mission' | 'passion' | 'vocation';
export type IkigaiHorizon = 'H1' | 'H3' | 'H10' | 'H30' | 'H90';

export interface IkigaiVision extends ParaItem {
  type: 'vision';
  pillar: IkigaiPillar;
  horizon: IkigaiHorizon;
  content: string; // La "Constitution" elle-même
  alignmentLevel: number; // 0-100
}

// Alias for backward compatibility
export type IkigaiItem = IkigaiVision;

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

export const CANONICAL_IKIGAI_SEEDS: IkigaiVision[] = [
  // CRAFT (Profession)
  { id: 'ikigai-craft-h1', type: 'vision', pillar: 'craft', horizon: 'H1', title: 'Life-OS-2026 Initiative ALPHA V1.0', description: 'Initiative Alpha V1.0 de Life OS pour la souveraineté personnelle', content: 'Life-OS-2026 Initiative ALPHA V1.0', alignmentLevel: 50, status: 'active', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'ikigai-craft-h3', type: 'vision', pillar: 'craft', horizon: 'H3', title: 'Architecture A1 Gatekeepers Beth+Morty', description: 'Dual gatekeeper A1 pour arbitrage et focus déterministe', content: 'Architecture A1 Gatekeepers Beth+Morty', alignmentLevel: 40, status: 'active', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'ikigai-craft-h10', type: 'vision', pillar: 'craft', horizon: 'H10', title: 'Solarpunk Kardashev Type 3 biomimicry', description: 'Biomimétisme et civilisation Solarpunk Type 3', content: 'Solarpunk Kardashev Type 3 biomimicry', alignmentLevel: 30, status: 'active', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'ikigai-craft-h30', type: 'vision', pillar: 'craft', horizon: 'H30', title: 'Multi-tenancy 1000T agents autonomes', description: 'Réseau d’agents autonomes 1000T résilient', content: 'Multi-tenancy 1000T agents autonomes', alignmentLevel: 20, status: 'active', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'ikigai-craft-h90', type: 'vision', pillar: 'craft', horizon: 'H90', title: 'Kardashev legacy civilizationnel', description: 'Transmission civilisationnelle H90 Kardashev', content: 'Kardashev legacy civilizationnel', alignmentLevel: 10, status: 'active', createdAt: Date.now(), updatedAt: Date.now() },

  // MISSION
  { id: 'ikigai-mission-h1', type: 'vision', pillar: 'mission', horizon: 'H1', title: 'Cycle Q3 2026 - 12 items verbatim', description: 'Exécution stricte des 12 items verbatim de Q3', content: 'Cycle Q3 2026 - 12 items verbatim', alignmentLevel: 60, status: 'active', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'ikigai-mission-h3', type: 'vision', pillar: 'mission', horizon: 'H3', title: 'Independance financiere Saru H3', description: 'Runway et indépendance souveraine sous Saru LD02', content: 'Independance financiere Saru H3', alignmentLevel: 40, status: 'active', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'ikigai-mission-h10', type: 'vision', pillar: 'mission', horizon: 'H10', title: 'SOB a Abdaty avec OMK + ABC', description: 'Self-Operating Business à Abdaty avec OMK Services BOS et ABC OS', content: 'SOB a Abdaty avec OMK + ABC', alignmentLevel: 30, status: 'active', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'ikigai-mission-h30', type: 'vision', pillar: 'mission', horizon: 'H30', title: 'Discovery ZORA Life Wheel LD01-LD08', description: 'Équilibre homéostatique des 8 jauges ZORA Discovery', content: 'Discovery ZORA Life Wheel LD01-LD08', alignmentLevel: 35, status: 'active', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'ikigai-mission-h90', type: 'vision', pillar: 'mission', horizon: 'H90', title: 'Legacy Solarpunk Klyden H90', description: 'Héritage durable Solarpunk Klyden', content: 'Legacy Solarpunk Klyden H90', alignmentLevel: 15, status: 'active', createdAt: Date.now(), updatedAt: Date.now() },

  // PASSION
  { id: 'ikigai-passion-h1', type: 'vision', pillar: 'passion', horizon: 'H1', title: 'Karpathy loop + agentic swarm', description: 'Boucle d’agentic swarm autonome style Karpathy', content: 'Karpathy loop + agentic swarm', alignmentLevel: 70, status: 'active', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'ikigai-passion-h3', type: 'vision', pillar: 'passion', horizon: 'H3', title: '4H Workweek DEAL Muse Liberation', description: 'Protocole DEAL Muse 4H Workweek et libération de temps', content: '4H Workweek DEAL Muse Liberation', alignmentLevel: 50, status: 'active', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'ikigai-passion-h10', type: 'vision', pillar: 'passion', horizon: 'H10', title: 'Multi-A0 jumeaux Claude+Codex+Hermes', description: 'Triumvirat de jumeaux d’action Claude, Codex et Hermes', content: 'Multi-A0 jumeaux Claude+Codex+Hermes', alignmentLevel: 35, status: 'active', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'ikigai-passion-h30', type: 'vision', pillar: 'passion', horizon: 'H30', title: 'Solarpunk cooling passif', description: 'Ingénierie de cooling passif et résilience énergétique Solarpunk', content: 'Solarpunk cooling passif', alignmentLevel: 25, status: 'active', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'ikigai-passion-h90', type: 'vision', pillar: 'passion', horizon: 'H90', title: 'AaaS 3 variants Solaris+Nexus+Orbiter', description: 'Architecture AaaS trifractale Solaris, Nexus et Orbiter', content: 'AaaS 3 variants Solaris+Nexus+Orbiter', alignmentLevel: 20, status: 'active', createdAt: Date.now(), updatedAt: Date.now() },

  // VOCATION
  { id: 'ikigai-vocation-h1', type: 'vision', pillar: 'vocation', horizon: 'H1', title: '12WY cadence hebdo - 5 disciplines Curie', description: 'Exécution cadencée hebdomadaire des 5 disciplines Curie 12WY', content: '12WY cadence hebdo - 5 disciplines Curie', alignmentLevel: 55, status: 'active', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'ikigai-vocation-h3', type: 'vision', pillar: 'vocation', horizon: 'H3', title: 'GTD bus horizontal - 5 stages Cerritos', description: 'Bus horizontal 5 étapes GTD Cerritos', content: 'GTD bus horizontal - 5 stages Cerritos', alignmentLevel: 45, status: 'active', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'ikigai-vocation-h10', type: 'vision', pillar: 'vocation', horizon: 'H10', title: 'PARA 4 lettres Enterprise', description: 'Structure spatiale PARA 4 lettres sous Enterprise', content: 'PARA 4 lettres Enterprise', alignmentLevel: 50, status: 'active', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'ikigai-vocation-h30', type: 'vision', pillar: 'vocation', horizon: 'H30', title: 'A3 twins Life OS canon (35)', description: '35 compagnons et jumeaux A3 du canon Life OS', content: 'A3 twins Life OS canon (35)', alignmentLevel: 40, status: 'active', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'ikigai-vocation-h90', type: 'vision', pillar: 'vocation', horizon: 'H90', title: 'Protostar Holo Janeway DEAL 4H Workweek', description: 'Holo Janeway Protostar DEAL 4H Workweek', content: 'Protostar Holo Janeway DEAL 4H Workweek', alignmentLevel: 30, status: 'active', createdAt: Date.now(), updatedAt: Date.now() },
];

export const useIkigaiStore = create<IkigaiState>((set, get) => ({
  visions: CANONICAL_IKIGAI_SEEDS,
  activePillar: 'all',
  activeHorizon: 'all',
  isHydrated: false,

  hydrate: async () => {
    try {
      const data = await readFromLD<ParaItem>('ld01', 'resources'); 
      const ikigaiNodes = data.filter(d => (d as any).type === 'vision') as IkigaiVision[];
      if (ikigaiNodes.length > 0) {
        set({ visions: ikigaiNodes, isHydrated: true });
      } else {
        // Ensemencement automatique d'IDB avec le canon si vide
        set({ visions: CANONICAL_IKIGAI_SEEDS, isHydrated: true });
        for (const seed of CANONICAL_IKIGAI_SEEDS) {
          writeToLD('ld01', 'resources', 'add', seed, 'ikigai').catch(() => {});
        }
      }
    } catch (e) { 
      console.error('Ikigai DB hydration failed, falling back to canon seeds', e); 
      set({ visions: CANONICAL_IKIGAI_SEEDS, isHydrated: true });
    }
  },

  setActivePillar: (activePillar) => set({ activePillar }),
  setActiveHorizon: (activeHorizon) => set({ activeHorizon }),
  addVision: async (v) => {
    set(s => ({ visions: [...s.visions, v] }));
    await writeToLD('ld01', 'resources', 'add', v, 'ikigai');
  }
}));

