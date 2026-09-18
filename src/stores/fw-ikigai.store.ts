import { create } from 'zustand';
import type { ParaItem } from './ld01.store';
import { writeToLD, readFromLD } from '../lib/ld-router';

/**
 * Ikigai Framework Store — V0.5.1 Sovereign Constitution
 * Matrix: 4 Pillars x 5 Horizons
 * Migrated from localStorage to IndexedDB (LD01/resources)
 */

export type IkigaiPillar = 'craft' | 'mission' | 'passion' | 'vocation';
export type IkigaiHorizon = 'H1' | 'H3' | 'H10' | 'H25' | 'H30' | 'H90';

export interface IkigaiVision extends ParaItem {
  type: 'vision';
  pillar: IkigaiPillar;
  horizon: IkigaiHorizon;
  content: string; // La "Constitution" elle-meme
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
  updateVision: (id: string, updates: Partial<IkigaiVision>) => Promise<void>;
  deleteVision: (id: string) => Promise<void>;
}

export const CANONICAL_IKIGAI_VISIONS: IkigaiVision[] = [
  // CRAFT
  {
    id: 'iki-craft-h1',
    type: 'vision',
    pillar: 'craft',
    horizon: 'H1',
    title: 'Life-OS-2026 Initiative ALPHA V1.0',
    description: 'Architecture et delivery du noyau souverain Life-OS-2026 en phase ALPHA V1.0.',
    content: 'Life-OS-2026 Initiative ALPHA V1.0 : convergence des 10 categories, execution deterministe et interface reactive.',
    alignmentLevel: 0,
    status: 'active',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now()
  },
  {
    id: 'iki-craft-h3',
    type: 'vision',
    pillar: 'craft',
    horizon: 'H3',
    title: 'Architecture A1 Gatekeepers Beth+Morty',
    description: 'Systeme immunitaire et garde-fous deterministes Beth (Veto) + Morty (Circuit Breaker).',
    content: 'Architecture A1 Gatekeepers Beth+Morty : interception des derives, protection PII et controle des boucles d execution.',
    alignmentLevel: 0,
    status: 'active',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now()
  },
  {
    id: 'iki-craft-h10',
    type: 'vision',
    pillar: 'craft',
    horizon: 'H10',
    title: 'Solarpunk Kardashev Type 3 biomimicry',
    description: 'Infrastructure biomimetique et modeles systemiques orientes Solarpunk Type 3.',
    content: 'Solarpunk Kardashev Type 3 biomimicry : symbiose technologique, circularite thermodynamique et elevation energetique.',
    alignmentLevel: 0,
    status: 'active',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now()
  },
  {
    id: 'iki-craft-h30',
    type: 'vision',
    pillar: 'craft',
    horizon: 'H30',
    title: 'Multi-tenancy 1000T agents autonomes',
    description: 'Essaims d agents autonomes a tres grande echelle (1000 Tenants) coordonnes par le Hivemind.',
    content: 'Multi-tenancy 1000T agents autonomes : hyper-orchestration, isolation des contextes et autonomie operationnelle.',
    alignmentLevel: 0,
    status: 'active',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now()
  },
  {
    id: 'iki-craft-h90',
    type: 'vision',
    pillar: 'craft',
    horizon: 'H90',
    title: 'Kardashev legacy civilizationnel',
    description: 'Heritage civilisationnel perenne et transmission intergenerationnelle de l intelligence souveraine.',
    content: 'Kardashev legacy civilizationnel : ancrage 7D, transmission de la sagesse et perennite civilisationnelle.',
    alignmentLevel: 0,
    status: 'active',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now()
  },

  // MISSION
  {
    id: 'iki-mission-h1',
    type: 'vision',
    pillar: 'mission',
    horizon: 'H1',
    title: 'Cycle Q3 2026 - 12 items verbatim',
    description: 'Cloture et atteinte des 12 engagements trimestriels verbatim Q3 2026.',
    content: 'Cycle Q3 2026 - 12 items verbatim : execution rigoureuse 12WY des priorites immediates sans compromis.',
    alignmentLevel: 0,
    status: 'active',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now()
  },
  {
    id: 'iki-mission-h3',
    type: 'vision',
    pillar: 'mission',
    horizon: 'H3',
    title: 'Independance financiere Saru H3',
    description: 'Pole souverain LD02 Finance et tresorerie automatisee sous la supervision de Saru.',
    content: 'Independance financiere Saru H3 : cash-flow recurrent, liberte d arbitrage et autonomie financiere complete.',
    alignmentLevel: 0,
    status: 'active',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now()
  },
  {
    id: 'iki-mission-h10',
    type: 'vision',
    pillar: 'mission',
    horizon: 'H10',
    title: 'SOB a Abdaty avec OMK + ABC',
    description: 'Deploiement des systemes operatoires business (SOB) a Abdaty avec les franchises OMK et ABC.',
    content: 'SOB a Abdaty avec OMK + ABC : impact economique territorial, creation de valeur reelle et maillage d entreprises.',
    alignmentLevel: 0,
    status: 'active',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now()
  },
  {
    id: 'iki-mission-h30',
    type: 'vision',
    pillar: 'mission',
    horizon: 'H30',
    title: 'Discovery ZORA Life Wheel LD01-LD08',
    description: 'Orchestration holistique de la Life Wheel a travers les 8 Life Domains unifies par ZORA.',
    content: 'Discovery ZORA Life Wheel LD01-LD08 : harmonie systemique des 8 domaines de vie et conscience operationnelle.',
    alignmentLevel: 0,
    status: 'active',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now()
  },
  {
    id: 'iki-mission-h90',
    type: 'vision',
    pillar: 'mission',
    horizon: 'H90',
    title: 'Legacy Solarpunk Klyden H90',
    description: 'Transmission de l ecosysteme Solarpunk Klyden a travers les cycles seculaires.',
    content: 'Legacy Solarpunk Klyden H90 : fondation regeneratrice, prosperite durable et transmission d heritage.',
    alignmentLevel: 0,
    status: 'active',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now()
  },

  // PASSION
  {
    id: 'iki-passion-h1',
    type: 'vision',
    pillar: 'passion',
    horizon: 'H1',
    title: 'Karpathy loop + agentic swarm',
    description: 'Boucle d experimentation rapide Karpathy et developpement de l essaim agentique.',
    content: 'Karpathy loop + agentic swarm : vitesse d iteration, autonomie d apprentissage et creativite technique brute.',
    alignmentLevel: 0,
    status: 'active',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now()
  },
  {
    id: 'iki-passion-h3',
    type: 'vision',
    pillar: 'passion',
    horizon: 'H3',
    title: '4H Workweek DEAL Muse Liberation',
    description: 'Matrice DEAL de Tim Ferriss, incubation de Muses autonomes et liberation du temps CEO.',
    content: '4H Workweek DEAL Muse Liberation : automatisation des flux operationnels et sanctuarisation de la liberte creative.',
    alignmentLevel: 0,
    status: 'active',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now()
  },
  {
    id: 'iki-passion-h10',
    type: 'vision',
    pillar: 'passion',
    horizon: 'H10',
    title: 'Multi-A0 jumeaux Claude+Codex+Hermes',
    description: 'Ecosysteme de jumeaux cognitifs A0 complementaires (Claude, Codex, Hermes) en harmonie.',
    content: 'Multi-A0 jumeaux Claude+Codex+Hermes : replication de l intelligence, synergie multimodale et resonance cognitive.',
    alignmentLevel: 0,
    status: 'active',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now()
  },
  {
    id: 'iki-passion-h30',
    type: 'vision',
    pillar: 'passion',
    horizon: 'H30',
    title: 'Solarpunk cooling passif',
    description: 'Recherche et habitat Solarpunk a refroidissement passif et thermodynamique propre.',
    content: 'Solarpunk cooling passif : architecture vernaculaire, ingenierie thermique naturelle et autonomie physique.',
    alignmentLevel: 0,
    status: 'active',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now()
  },
  {
    id: 'iki-passion-h90',
    type: 'vision',
    pillar: 'passion',
    horizon: 'H90',
    title: 'AaaS 3 variants Solaris+Nexus+Orbiter',
    description: 'Architecture Agent-as-a-Service declinee en 3 variantes fondamentales Solaris, Nexus et Orbiter.',
    content: 'AaaS 3 variants Solaris+Nexus+Orbiter : universalite de l agentique, infrastructure autonome perenne.',
    alignmentLevel: 0,
    status: 'active',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now()
  },

  // VOCATION
  {
    id: 'iki-vocation-h1',
    type: 'vision',
    pillar: 'vocation',
    horizon: 'H1',
    title: '12WY cadence hebdo - 5 disciplines Curie',
    description: 'Discipline hebdomadaire 12 Week Year et rigueur d execution scientifique Marie Curie.',
    content: '12WY cadence hebdo - 5 disciplines Curie : mesure continue, scores d execution >85% et constance d effort.',
    alignmentLevel: 0,
    status: 'active',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now()
  },
  {
    id: 'iki-vocation-h3',
    type: 'vision',
    pillar: 'vocation',
    horizon: 'H3',
    title: 'GTD bus horizontal - 5 stages Cerritos',
    description: 'Pipeline GTD fluide horizontal en 5 etapes inspire de la polyvalence pragmatique de l USS Cerritos.',
    content: 'GTD bus horizontal - 5 stages Cerritos : Capture, Clarify, Organize, Reflect, Engage sans aucune friction.',
    alignmentLevel: 0,
    status: 'active',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now()
  },
  {
    id: 'iki-vocation-h10',
    type: 'vision',
    pillar: 'vocation',
    horizon: 'H10',
    title: 'PARA 4 lettres Enterprise',
    description: 'Organisation de la memoire et des structures d entreprise via la taxonomie stricte PARA.',
    content: 'PARA 4 lettres Enterprise : Projects, Areas, Resources, Archives appliques a l echelle industrielle.',
    alignmentLevel: 0,
    status: 'active',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now()
  },
  {
    id: 'iki-vocation-h30',
    type: 'vision',
    pillar: 'vocation',
    horizon: 'H30',
    title: 'A3 twins Life OS canon (35)',
    description: 'Deploiement des 35 jumeaux numeriques canoniques de l armada A3 dans Life OS.',
    content: 'A3 twins Life OS canon (35) : division du travail cognitif, couverture des 8 domaines et fiabilite deterministe.',
    alignmentLevel: 0,
    status: 'active',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now()
  },
  {
    id: 'iki-vocation-h90',
    type: 'vision',
    pillar: 'vocation',
    horizon: 'H90',
    title: 'Protostar Holo Janeway DEAL 4H Workweek',
    description: 'Hologramme Janeway (USS Protostar) et DEAL ultime : automatisation totale de la survie operationnelle.',
    content: 'Protostar Holo Janeway DEAL 4H Workweek : mentorat autonome et liberation absolue de l etre.',
    alignmentLevel: 0,
    status: 'active',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now()
  }
];

export const useIkigaiStore = create<IkigaiState>((set, get) => ({
  visions: [...CANONICAL_IKIGAI_VISIONS],
  activePillar: 'all',
  activeHorizon: 'all',
  isHydrated: false,

  hydrate: async () => {
    try {
      const data = await readFromLD<ParaItem>('ld01', 'resources');
      const ikigaiNodes = data.filter(d => (d as any).type === 'vision') as IkigaiVision[];
      if (ikigaiNodes.length > 0) {
        const resetVisions = ikigaiNodes.map(node => ({ ...node, alignmentLevel: 0 }));
        set({ visions: resetVisions, isHydrated: true });
        for (const v of resetVisions) {
          await writeToLD('ld01', 'resources', 'update', v, 'ikigai');
        }
      } else {
        // Ensemencer la base persistee avec les 20 visions canoniques
        set({ visions: [...CANONICAL_IKIGAI_VISIONS], isHydrated: true });
        for (const vision of CANONICAL_IKIGAI_VISIONS) {
          await writeToLD('ld01', 'resources', 'add', vision, 'ikigai');
        }
      }
    } catch (e) {
      console.error('Ikigai DB hydration fallback to canonical visions', e);
      set({ visions: [...CANONICAL_IKIGAI_VISIONS], isHydrated: true });
    }
  },

  setActivePillar: (activePillar) => set({ activePillar }),
  setActiveHorizon: (activeHorizon) => set({ activeHorizon }),
  addVision: async (v) => {
    set(s => ({ visions: [...s.visions, v] }));
    await writeToLD('ld01', 'resources', 'add', v, 'ikigai');
  },
  updateVision: async (id, updates) => {
    const v = get().visions.find(v => v.id === id);
    if (!v) return;
    const updated = { ...v, ...updates, updatedAt: Date.now() } as IkigaiVision;
    set(s => ({ visions: s.visions.map(vi => vi.id === id ? updated : vi) }));
    await writeToLD('ld01', 'resources', 'update', updated, 'ikigai');
  },
  deleteVision: async (id) => {
    set(s => ({ visions: s.visions.filter(v => v.id !== id) }));
    await writeToLD('ld01', 'resources', 'delete', id, 'ikigai');
  }
}));
