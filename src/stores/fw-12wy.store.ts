import { create } from 'zustand';
import type { ParaItem } from './ld01.store';
import { readFromLD, writeToLD } from '../lib/ld-router';

/**
 * 12 Week Year Framework Store — V0.6.1 Destruction du Mirage
 * Migrated from localStorage to IndexedDB (LD01/resources)
 * The Trinity: WyVision, WyGoal, WyTactic
 * Integrated with Sovereign Ikigai Constitution 2026
 */

export interface WyVision extends ParaItem {
  meaningHorizon?: string; // H1, H3, H10, H25, H30, H90
  operationalCadence?: string; // weekly, cycle
  provenance?: string;
  conflict?: string;
  visionStatus?: string;
  type: 'wy-vision';
  domainId: string;
  ikigaiVisionId?: string;
}

export interface WyGoal extends Omit<ParaItem, 'status'> {
  type: 'wy-goal';
  visionId: string;
  targetWeek: number; // 1-12
  status: 'pending' | 'in-progress' | 'achieved';
  projectId?: string;
}

export interface TacticStatusTransition {
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
  cycleId?: string;
  week: number;
}

export interface WyTactic extends Omit<ParaItem, 'status'> {
  type: 'wy-tactic';
  goalId: string;
  week: number;
  status: 'pending' | 'completed' | 'failed';
  cycleId?: string;
  projectId?: string;
  statusHistory?: TacticStatusTransition[];
}

export type TimeBlockType = 'strategic' | 'buffer' | 'breakout';

export interface WyTimeBlock extends ParaItem {
  type: 'wy-timeblock';
  week: number;
  blockType: TimeBlockType;
  completed: boolean;
  startTime?: number;
  endTime?: number;
  duration?: number;
  ianaTimezone?: string;
  cycleId?: string;
}

interface TwelveWeekState {
  visions: WyVision[];
  goals: WyGoal[];
  tactics: WyTactic[];
  timeBlocks: WyTimeBlock[];
  activeTab: 'overview' | 'vision' | 'planning' | 'process' | 'measurement' | 'accountability';
  activeWeek: number | 'all';
  activeVisionId: string | null;
  activeGoalId: string | null;
  activeCycleId: string | null;
  isHydrated: boolean;

  // Actions
  hydrate: () => Promise<void>;
  setActiveTab: (tab: TwelveWeekState['activeTab']) => void;
  setActiveWeek: (week: number | 'all') => void;
  setActiveVisionId: (id: string | null) => void;
  setActiveGoalId: (id: string | null) => void;
  setActiveCycleId: (id: string | null) => void;
  addVision: (v: WyVision) => Promise<void>;
  updateVision: (v: WyVision) => Promise<void>;
  addGoal: (g: WyGoal) => Promise<void>;
  addTactic: (t: WyTactic) => Promise<void>;
  updateTacticStatus: (id: string, status: WyTactic['status']) => Promise<void>;
  toggleTimeBlock: (id: string) => Promise<void>;
  addTimeBlock: (b: WyTimeBlock) => Promise<void>;
  updateTimeBlock: (b: WyTimeBlock) => Promise<void>;
}

// 20 Visions canoniques issues de la Constitution IKIGAI 2026 d'Amadou Kone
export const CANONICAL_WY_VISIONS: WyVision[] = [
  // CRAFT
  {
    id: 'wy-vis-craft-h1',
    title: 'Life-OS-2026 Initiative ALPHA V1.0',
    description: 'Architecture et delivery du noyau souverain Life-OS-2026 en phase ALPHA V1.0.',
    content: 'Life-OS-2026 Initiative ALPHA V1.0 : convergence des 10 categories, execution deterministe et interface reactive.',
    type: 'wy-vision',
    meaningHorizon: 'H1',
    operationalCadence: 'cycle',
    provenance: 'Constitution IKIGAI 2026 (Craft)',
    domainId: 'cognition',
    ikigaiVisionId: 'iki-craft-h1',
    status: 'active',
    updatedAt: Date.now(),
    createdAt: Date.now() - 86400000 * 30
  },
  {
    id: 'wy-vis-craft-h3',
    title: 'Architecture A1 Gatekeepers Beth+Morty',
    description: 'Systeme immunitaire et garde-fous deterministes Beth (Veto) + Morty (Circuit Breaker).',
    content: 'Architecture A1 Gatekeepers Beth+Morty : interception des derives, protection PII et controle des boucles d execution.',
    type: 'wy-vision',
    meaningHorizon: 'H3',
    operationalCadence: 'weekly',
    provenance: 'Constitution IKIGAI 2026 (Craft)',
    domainId: 'cognition',
    ikigaiVisionId: 'iki-craft-h3',
    status: 'active',
    updatedAt: Date.now(),
    createdAt: Date.now() - 86400000 * 30
  },
  {
    id: 'wy-vis-craft-h10',
    title: 'Solarpunk Kardashev Type 3 biomimicry',
    description: 'Infrastructure biomimetique et modeles systemiques orientes Solarpunk Type 3.',
    content: 'Solarpunk Kardashev Type 3 biomimicry : symbiose technologique, circularite thermodynamique et elevation energetique.',
    type: 'wy-vision',
    meaningHorizon: 'H10',
    operationalCadence: 'cycle',
    provenance: 'Constitution IKIGAI 2026 (Craft)',
    domainId: 'habitat',
    ikigaiVisionId: 'iki-craft-h10',
    status: 'active',
    updatedAt: Date.now(),
    createdAt: Date.now() - 86400000 * 30
  },
  {
    id: 'wy-vis-craft-h30',
    title: 'Multi-tenancy 1000T agents autonomes',
    description: 'Essaims d agents autonomes a tres grande echelle (1000 Tenants) coordonnes par le Hivemind.',
    content: 'Multi-tenancy 1000T agents autonomes : hyper-orchestration, isolation des contextes et autonomie operationnelle.',
    type: 'wy-vision',
    meaningHorizon: 'H30',
    operationalCadence: 'cycle',
    provenance: 'Constitution IKIGAI 2026 (Craft)',
    domainId: 'business',
    ikigaiVisionId: 'iki-craft-h30',
    status: 'active',
    updatedAt: Date.now(),
    createdAt: Date.now() - 86400000 * 30
  },
  {
    id: 'wy-vis-craft-h90',
    title: 'Kardashev legacy civilizationnel',
    description: 'Heritage civilisationnel perenne et transmission intergenerationnelle de l intelligence souveraine.',
    content: 'Kardashev legacy civilizationnel : ancrage 7D, transmission de la sagesse et perennite civilisationnelle.',
    type: 'wy-vision',
    meaningHorizon: 'H90',
    operationalCadence: 'cycle',
    provenance: 'Constitution IKIGAI 2026 (Craft)',
    domainId: 'impact',
    ikigaiVisionId: 'iki-craft-h90',
    status: 'active',
    updatedAt: Date.now(),
    createdAt: Date.now() - 86400000 * 30
  },

  // MISSION
  {
    id: 'wy-vis-mission-h1',
    title: 'Cycle Q3 2026 - 12 items verbatim',
    description: 'Cloture et atteinte des 12 engagements trimestriels verbatim Q3 2026.',
    content: 'Cycle Q3 2026 - 12 items verbatim : execution rigoureuse 12WY des priorites immediates sans compromis.',
    type: 'wy-vision',
    meaningHorizon: 'H1',
    operationalCadence: 'weekly',
    provenance: 'Constitution IKIGAI 2026 (Mission)',
    domainId: 'business',
    ikigaiVisionId: 'iki-mission-h1',
    status: 'active',
    updatedAt: Date.now(),
    createdAt: Date.now() - 86400000 * 30
  },
  {
    id: 'wy-vis-mission-h3',
    title: 'Independance financiere Saru H3',
    description: 'Pole souverain LD02 Finance et tresorerie automatisee sous la supervision de Saru.',
    content: 'Independance financiere Saru H3 : cash-flow recurrent, liberte d arbitrage et autonomie financiere complete.',
    type: 'wy-vision',
    meaningHorizon: 'H3',
    operationalCadence: 'weekly',
    provenance: 'Constitution IKIGAI 2026 (Mission)',
    domainId: 'finance',
    ikigaiVisionId: 'iki-mission-h3',
    status: 'active',
    updatedAt: Date.now(),
    createdAt: Date.now() - 86400000 * 30
  },
  {
    id: 'wy-vis-mission-h10',
    title: 'SOB a Abdaty avec OMK + ABC',
    description: 'Deploiement des systemes operatoires business (SOB) a Abdaty avec les franchises OMK et ABC.',
    content: 'SOB a Abdaty avec OMK + ABC : impact economique territorial, creation de valeur reelle et maillage d entreprises.',
    type: 'wy-vision',
    meaningHorizon: 'H10',
    operationalCadence: 'cycle',
    provenance: 'Constitution IKIGAI 2026 (Mission)',
    domainId: 'business',
    ikigaiVisionId: 'iki-mission-h10',
    status: 'active',
    updatedAt: Date.now(),
    createdAt: Date.now() - 86400000 * 30
  },
  {
    id: 'wy-vis-mission-h30',
    title: 'Discovery ZORA Life Wheel LD01-LD08',
    description: 'Orchestration holistique de la Life Wheel a travers les 8 Life Domains unifies par ZORA.',
    content: 'Discovery ZORA Life Wheel LD01-LD08 : harmonie systemique des 8 domaines de vie et conscience operationnelle.',
    type: 'wy-vision',
    meaningHorizon: 'H30',
    operationalCadence: 'cycle',
    provenance: 'Constitution IKIGAI 2026 (Mission)',
    domainId: 'impact',
    ikigaiVisionId: 'iki-mission-h30',
    status: 'active',
    updatedAt: Date.now(),
    createdAt: Date.now() - 86400000 * 30
  },
  {
    id: 'wy-vis-mission-h90',
    title: 'Legacy Solarpunk Klyden H90',
    description: 'Transmission de l ecosysteme Solarpunk Klyden a travers les cycles seculaires.',
    content: 'Legacy Solarpunk Klyden H90 : fondation regeneratrice, prosperite durable et transmission d heritage.',
    type: 'wy-vision',
    meaningHorizon: 'H90',
    operationalCadence: 'cycle',
    provenance: 'Constitution IKIGAI 2026 (Mission)',
    domainId: 'impact',
    ikigaiVisionId: 'iki-mission-h90',
    status: 'active',
    updatedAt: Date.now(),
    createdAt: Date.now() - 86400000 * 30
  },

  // PASSION
  {
    id: 'wy-vis-passion-h1',
    title: 'Karpathy loop + agentic swarm',
    description: 'Boucle d experimentation rapide Karpathy et developpement de l essaim agentique.',
    content: 'Karpathy loop + agentic swarm : vitesse d iteration, autonomie d apprentissage et creativite technique brute.',
    type: 'wy-vision',
    meaningHorizon: 'H1',
    operationalCadence: 'weekly',
    provenance: 'Constitution IKIGAI 2026 (Passion)',
    domainId: 'creativity',
    ikigaiVisionId: 'iki-passion-h1',
    status: 'active',
    updatedAt: Date.now(),
    createdAt: Date.now() - 86400000 * 30
  },
  {
    id: 'wy-vis-passion-h3',
    title: '4H Workweek DEAL Muse Liberation',
    description: 'Matrice DEAL de Tim Ferriss, incubation de Muses autonomes et liberation du temps CEO.',
    content: '4H Workweek DEAL Muse Liberation : automatisation des flux operationnels et sanctuarisation de la liberte creative.',
    type: 'wy-vision',
    meaningHorizon: 'H3',
    operationalCadence: 'weekly',
    provenance: 'Constitution IKIGAI 2026 (Passion)',
    domainId: 'business',
    ikigaiVisionId: 'iki-passion-h3',
    status: 'active',
    updatedAt: Date.now(),
    createdAt: Date.now() - 86400000 * 30
  },
  {
    id: 'wy-vis-passion-h10',
    title: 'Multi-A0 jumeaux Claude+Codex+Hermes',
    description: 'Ecosysteme de jumeaux cognitifs A0 complementaires (Claude, Codex, Hermes) en harmonie.',
    content: 'Multi-A0 jumeaux Claude+Codex+Hermes : replication de l intelligence, synergie multimodale et resonance cognitive.',
    type: 'wy-vision',
    meaningHorizon: 'H10',
    operationalCadence: 'cycle',
    provenance: 'Constitution IKIGAI 2026 (Passion)',
    domainId: 'cognition',
    ikigaiVisionId: 'iki-passion-h10',
    status: 'active',
    updatedAt: Date.now(),
    createdAt: Date.now() - 86400000 * 30
  },
  {
    id: 'wy-vis-passion-h30',
    title: 'Solarpunk cooling passif',
    description: 'Recherche et habitat Solarpunk a refroidissement passif et thermodynamique propre.',
    content: 'Solarpunk cooling passif : architecture vernaculaire, ingenierie thermique naturelle et autonomie physique.',
    type: 'wy-vision',
    meaningHorizon: 'H30',
    operationalCadence: 'cycle',
    provenance: 'Constitution IKIGAI 2026 (Passion)',
    domainId: 'habitat',
    ikigaiVisionId: 'iki-passion-h30',
    status: 'active',
    updatedAt: Date.now(),
    createdAt: Date.now() - 86400000 * 30
  },
  {
    id: 'wy-vis-passion-h90',
    title: 'AaaS 3 variants Solaris+Nexus+Orbiter',
    description: 'Architecture Agent-as-a-Service declinee en 3 variantes fondamentales Solaris, Nexus et Orbiter.',
    content: 'AaaS 3 variants Solaris+Nexus+Orbiter : universalite de l agentique, infrastructure autonome perenne.',
    type: 'wy-vision',
    meaningHorizon: 'H90',
    operationalCadence: 'cycle',
    provenance: 'Constitution IKIGAI 2026 (Passion)',
    domainId: 'impact',
    ikigaiVisionId: 'iki-passion-h90',
    status: 'active',
    updatedAt: Date.now(),
    createdAt: Date.now() - 86400000 * 30
  },

  // VOCATION
  {
    id: 'wy-vis-vocation-h1',
    title: '12WY cadence hebdo - 5 disciplines Curie',
    description: 'Discipline hebdomadaire 12 Week Year et rigueur d execution scientifique Marie Curie.',
    content: '12WY cadence hebdo - 5 disciplines Curie : mesure continue, scores d execution >85% et constance d effort.',
    type: 'wy-vision',
    meaningHorizon: 'H1',
    operationalCadence: 'weekly',
    provenance: 'Constitution IKIGAI 2026 (Vocation)',
    domainId: 'cognition',
    ikigaiVisionId: 'iki-vocation-h1',
    status: 'active',
    updatedAt: Date.now(),
    createdAt: Date.now() - 86400000 * 30
  },
  {
    id: 'wy-vis-vocation-h3',
    title: 'GTD bus horizontal - 5 stages Cerritos',
    description: 'Pipeline GTD fluide horizontal en 5 etapes inspire de la polyvalence pragmatique de l USS Cerritos.',
    content: 'GTD bus horizontal - 5 stages Cerritos : Capture, Clarify, Organize, Reflect, Engage sans aucune friction.',
    type: 'wy-vision',
    meaningHorizon: 'H3',
    operationalCadence: 'weekly',
    provenance: 'Constitution IKIGAI 2026 (Vocation)',
    domainId: 'cognition',
    ikigaiVisionId: 'iki-vocation-h3',
    status: 'active',
    updatedAt: Date.now(),
    createdAt: Date.now() - 86400000 * 30
  },
  {
    id: 'wy-vis-vocation-h10',
    title: 'PARA 4 lettres Enterprise',
    description: 'Organisation de la memoire et des structures d entreprise via la taxonomie stricte PARA.',
    content: 'PARA 4 lettres Enterprise : Projects, Areas, Resources, Archives appliques a l echelle industrielle.',
    type: 'wy-vision',
    meaningHorizon: 'H10',
    operationalCadence: 'cycle',
    provenance: 'Constitution IKIGAI 2026 (Vocation)',
    domainId: 'business',
    ikigaiVisionId: 'iki-vocation-h10',
    status: 'active',
    updatedAt: Date.now(),
    createdAt: Date.now() - 86400000 * 30
  },
  {
    id: 'wy-vis-vocation-h30',
    title: 'A3 twins Life OS canon (35)',
    description: 'Deploiement des 35 jumeaux numeriques canoniques de l armada A3 dans Life OS.',
    content: 'A3 twins Life OS canon (35) : division du travail cognitif, couverture des 8 domaines et fiabilite deterministe.',
    type: 'wy-vision',
    meaningHorizon: 'H30',
    operationalCadence: 'cycle',
    provenance: 'Constitution IKIGAI 2026 (Vocation)',
    domainId: 'impact',
    ikigaiVisionId: 'iki-vocation-h30',
    status: 'active',
    updatedAt: Date.now(),
    createdAt: Date.now() - 86400000 * 30
  },
  {
    id: 'wy-vis-vocation-h90',
    title: 'Protostar Holo Janeway DEAL 4H Workweek',
    description: 'Hologramme Janeway (USS Protostar) et DEAL ultime : automatisation totale de la survie operationnelle.',
    content: 'Protostar Holo Janeway DEAL 4H Workweek : mentorat autonome et liberation absolue de l etre.',
    type: 'wy-vision',
    meaningHorizon: 'H90',
    operationalCadence: 'cycle',
    provenance: 'Constitution IKIGAI 2026 (Vocation)',
    domainId: 'impact',
    ikigaiVisionId: 'iki-vocation-h90',
    status: 'active',
    updatedAt: Date.now(),
    createdAt: Date.now() - 86400000 * 30
  }
];

export const CANONICAL_WY_GOALS: WyGoal[] = [
  {
    id: 'wy-goal-01',
    title: 'Deploiement Life-OS-2026 ALPHA V1.0 (Core Shell & 10 Categories)',
    description: 'Stabilisation du shell, validation de l ecran d accueil et des routeurs.',
    type: 'wy-goal',
    visionId: 'wy-vis-craft-h1',
    targetWeek: 4,
    status: 'achieved',
    progress: 100,
    updatedAt: Date.now(),
    createdAt: Date.now() - 86400000 * 14
  },
  {
    id: 'wy-goal-02',
    title: 'Cloture des 12 Engagements Verbatim Q3 2026',
    description: 'Execution binaire des livrables trimestriels sans deviation de cap.',
    type: 'wy-goal',
    visionId: 'wy-vis-mission-h1',
    targetWeek: 8,
    status: 'in-progress',
    progress: 75,
    updatedAt: Date.now(),
    createdAt: Date.now() - 86400000 * 10
  },
  {
    id: 'wy-goal-03',
    title: 'Boucle d Iteration Rapide Karpathy & Swarm Multi-Agents',
    description: 'Harnais de test local, orchestration Jules et delegation fluide.',
    type: 'wy-goal',
    visionId: 'wy-vis-passion-h1',
    targetWeek: 6,
    status: 'in-progress',
    progress: 60,
    updatedAt: Date.now(),
    createdAt: Date.now() - 86400000 * 7
  },
  {
    id: 'wy-goal-04',
    title: 'Discipline Hebdo 12WY Curie (>85% Score d Execution)',
    description: 'Mesure continue, tenue des blocs strategiques et scorecards sans illusion.',
    type: 'wy-goal',
    visionId: 'wy-vis-vocation-h1',
    targetWeek: 12,
    status: 'in-progress',
    progress: 85,
    updatedAt: Date.now(),
    createdAt: Date.now() - 86400000 * 5
  }
];

export const CANONICAL_WY_TACTICS: WyTactic[] = [
  {
    id: 'wy-tac-01',
    title: 'Executer la synchronisation canonique Ikigai vers 12WY',
    description: 'Passerelle formelle entre la Constitution d existence et le moteur temporel.',
    type: 'wy-tactic',
    goalId: 'wy-goal-01',
    week: 1,
    status: 'completed',
    cycleId: 'Q3-2026',
    updatedAt: Date.now(),
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'wy-tac-02',
    title: 'Valider les scores d execution de la semaine courante',
    description: 'Verification des 5 disciplines Curie et audit du temps libere.',
    type: 'wy-tactic',
    goalId: 'wy-goal-04',
    week: 1,
    status: 'completed',
    cycleId: 'Q3-2026',
    updatedAt: Date.now(),
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'wy-tac-03',
    title: 'Aligner les 12 items verbatim sur le backlog actif',
    description: 'Consolidation avec le tableau de bord d execution et baux SQLite.',
    type: 'wy-tactic',
    goalId: 'wy-goal-02',
    week: 2,
    status: 'pending',
    cycleId: 'Q3-2026',
    updatedAt: Date.now(),
    createdAt: Date.now()
  },
  {
    id: 'wy-tac-04',
    title: 'Experimenter l essaim multi-agents sur une tache de build',
    description: 'Validation de l autonomie des subagents sans intervention humaine.',
    type: 'wy-tactic',
    goalId: 'wy-goal-03',
    week: 2,
    status: 'pending',
    cycleId: 'Q3-2026',
    updatedAt: Date.now(),
    createdAt: Date.now()
  }
];

export const useTwelveWeekStore = create<TwelveWeekState>((set, get) => ({
  visions: [...CANONICAL_WY_VISIONS],
  goals: [...CANONICAL_WY_GOALS],
  tactics: [...CANONICAL_WY_TACTICS],
  timeBlocks: [],
  activeTab: 'overview',
  activeWeek: 'all',
  activeVisionId: null,
  activeGoalId: null,
  activeCycleId: 'Q3-2026',
  isHydrated: false,

  hydrate: async () => {
    try {
      const data = await readFromLD<ParaItem>('ld01', 'resources');
      const loadedVisions = data.filter(d => (d as any).type === 'wy-vision') as any as WyVision[];
      const loadedGoals = data.filter(d => (d as any).type === 'wy-goal') as any as WyGoal[];
      const loadedTactics = data.filter(d => (d as any).type === 'wy-tactic') as any as WyTactic[];
      const loadedTimeBlocks = data.filter(d => (d as any).type === 'wy-timeblock') as any as WyTimeBlock[];

      if (loadedVisions.length > 0) {
        set({
          visions: loadedVisions,
          goals: loadedGoals.length > 0 ? loadedGoals : [...CANONICAL_WY_GOALS],
          tactics: loadedTactics.length > 0 ? loadedTactics : [...CANONICAL_WY_TACTICS],
          timeBlocks: loadedTimeBlocks,
          isHydrated: true
        });
      } else {
        // Ensemencer la base persistee avec les 20 visions canoniques
        set({
          visions: [...CANONICAL_WY_VISIONS],
          goals: [...CANONICAL_WY_GOALS],
          tactics: [...CANONICAL_WY_TACTICS],
          timeBlocks: loadedTimeBlocks,
          isHydrated: true
        });
        for (const v of CANONICAL_WY_VISIONS) {
          await writeToLD('ld01', 'resources', 'add', v, '12wy');
        }
        for (const g of CANONICAL_WY_GOALS) {
          await writeToLD('ld01', 'resources', 'add', g, '12wy');
        }
        for (const t of CANONICAL_WY_TACTICS) {
          await writeToLD('ld01', 'resources', 'add', t, '12wy');
        }
      }
    } catch(e) {
      console.error('[12WY Store] Hydration fallback to canonical visions', e);
      set({
        visions: [...CANONICAL_WY_VISIONS],
        goals: [...CANONICAL_WY_GOALS],
        tactics: [...CANONICAL_WY_TACTICS],
        isHydrated: true
      });
    }
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setActiveWeek: (week) => set({ activeWeek: week }),
  setActiveVisionId: (id) => set({ activeVisionId: id }),
  setActiveGoalId: (id) => set({ activeGoalId: id }),
  setActiveCycleId: (id) => set({ activeCycleId: id }),

  addVision: async (v) => {
    set(s => ({ visions: [...s.visions, v] }));
    await writeToLD('ld01', 'resources', 'add', v, '12wy');
  },
  updateVision: async (v) => {
    set(s => ({ visions: s.visions.map(vision => vision.id === v.id ? v : vision) }));
    await writeToLD('ld01', 'resources', 'update', v, '12wy');
  },
  addGoal: async (g) => {
    set(s => ({ goals: [...s.goals, g] }));
    await writeToLD('ld01', 'resources', 'add', g, '12wy');
  },
  addTactic: async (t) => {
    const exists = get().tactics.some(existing =>
      existing.title === t.title &&
      existing.goalId === t.goalId &&
      existing.week === t.week &&
      (existing.cycleId || null) === (t.cycleId || null)
    );
    if (exists) {
      console.warn(`[12WY Store] Tactic "${t.title}" already exists for week ${t.week} in cycle ${t.cycleId || 'default'}. Ignoring duplicate.`);
      return;
    }

    const tacticToInsert = { ...t };
    if (!tacticToInsert.statusHistory) {
      tacticToInsert.statusHistory = [{
        status: tacticToInsert.status,
        timestamp: tacticToInsert.createdAt || Date.now(),
        cycleId: tacticToInsert.cycleId,
        week: tacticToInsert.week
      }];
    }

    set(s => ({ tactics: [...s.tactics, tacticToInsert] }));
    await writeToLD('ld01', 'resources', 'add', tacticToInsert, '12wy');
  },
  updateTacticStatus: async (id, status) => {
    const tactic = get().tactics.find(t => t.id === id);
    if (!tactic) return;

    const now = Date.now();
    const history = tactic.statusHistory ? [...tactic.statusHistory] : [];

    if (tactic.status !== status || history.length === 0) {
      history.push({
        status,
        timestamp: now,
        cycleId: tactic.cycleId,
        week: tactic.week
      });
    }

    const updated = { ...tactic, status, statusHistory: history, updatedAt: now };
    set(s => ({ tactics: s.tactics.map(t => t.id === id ? updated : t) }));
    await writeToLD('ld01', 'resources', 'update', updated, '12wy');
  },
  toggleTimeBlock: async (id) => {
    const block = get().timeBlocks.find(b => b.id === id);
    if (!block) return;
    const updated = { ...block, completed: !block.completed, updatedAt: Date.now() };
    set(s => ({ timeBlocks: s.timeBlocks.map(b => b.id === id ? updated : b) }));
    await writeToLD('ld01', 'resources', 'update', updated, '12wy');
  },
  addTimeBlock: async (b) => {
    set(s => ({ timeBlocks: [...s.timeBlocks, b] }));
    await writeToLD('ld01', 'resources', 'add', b, '12wy');
  },
  updateTimeBlock: async (b) => {
    set(s => ({ timeBlocks: s.timeBlocks.map(block => block.id === b.id ? b : block) }));
    await writeToLD('ld01', 'resources', 'update', b, '12wy');
  }
}));
