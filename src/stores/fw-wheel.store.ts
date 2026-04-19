import { create } from 'zustand';
import { LDId, writeToLD, readFromLD } from '../lib/ld-router';
import type { ParaItem } from './ld01.store';

/** 
 * Life Wheel Framework Store — V0.5.1 Sovereign Constitution
 * Migrated from localStorage to IndexedDB (LD01/resources)
 */

export interface WheelDomain {
  id: string;
  name: string;
  ldId: LDId;
  score: number;       // 0-100 (Ambition level)
  weight: number;      // Weight (0.5 to 2.0)
  color: string;
}

export interface WheelAmbition extends ParaItem {
  type: 'ambition';
  domainId: string; // ex: 'd1' pour Business
  content: string;
}

export interface WheelHistoryEntry {
  id: string;
  date: number;
  globalScore: number;
  domainScores: Record<string, number>;
}

interface LifeWheelState {
  domains: WheelDomain[];
  ambitions: WheelAmbition[];
  history: WheelHistoryEntry[];
  activeTab: 'overview' | 'domains' | 'analytics' | 'growth';
  isHydrated: boolean;
  globalScore: number;

  // Actions
  hydrate: () => Promise<void>;
  addAmbition: (a: WheelAmbition) => Promise<void>;
  updateDomainWeight: (id: string, weight: number) => void;
  updateDomainScore: (id: string, score: number) => void;
  addHistoryEntry: (entry: WheelHistoryEntry) => void;
  setActiveTab: (tab: LifeWheelState['activeTab']) => void;
  calculateGlobalScore: () => void;
}

const DEFAULT_DOMAINS: WheelDomain[] = [
  { id: 'd1', name: 'Business', ldId: 'ld01', score: 0, weight: 1.0, color: '#10b981' },
  { id: 'd2', name: 'Finance', ldId: 'ld02', score: 0, weight: 1.0, color: '#f59e0b' },
  { id: 'd3', name: 'Health', ldId: 'ld03', score: 0, weight: 1.0, color: '#ef4444' },
  { id: 'd4', name: 'Cognition', ldId: 'ld04', score: 0, weight: 1.0, color: '#3b82f6' },
  { id: 'd5', name: 'Relations', ldId: 'ld05', score: 0, weight: 1.0, color: '#8b5cf6' },
  { id: 'd6', name: 'Habitat', ldId: 'ld06', score: 0, weight: 1.0, color: '#f97316' },
  { id: 'd7', name: 'Creativity', ldId: 'ld07', score: 0, weight: 1.0, color: '#ec4899' },
  { id: 'd8', name: 'Impact', ldId: 'ld08', score: 0, weight: 1.0, color: '#14b8a6' },
];

export const useLifeWheelStore = create<LifeWheelState>((set, get) => ({
  domains: DEFAULT_DOMAINS,
  ambitions: [],
  history: [],
  activeTab: 'overview',
  isHydrated: false,
  globalScore: 0,

  hydrate: async () => {
    try {
      const data = await readFromLD<ParaItem>('ld01', 'resources');
      const nodes = data.filter(d => (d as any).type === 'ambition') as WheelAmbition[];
      set({ ambitions: nodes, isHydrated: true });
    } catch (e) { 
      console.error('LifeWheel hydration failed', e);
      set({ isHydrated: true }); 
    }
  },

  addAmbition: async (a) => {
    set(s => ({ ambitions: [...s.ambitions, a] }));
    await writeToLD('ld01', 'resources', 'add', a, 'wheel');
  },

  updateDomainWeight: (id, weight) => {
    set((state) => ({
      domains: state.domains.map((d) => (d.id === id ? { ...d, weight } : d)),
    }));
    get().calculateGlobalScore();
  },

  updateDomainScore: (id, score) => {
    set((state) => ({
      domains: state.domains.map((d) => (d.id === id ? { ...d, score } : d)),
    }));
    get().calculateGlobalScore();
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  addHistoryEntry: (entry) => set((state) => ({
    history: [entry, ...state.history].slice(0, 30), // Keep last 30 days
  })),

  calculateGlobalScore: () => {

    const { domains } = get();
    if (domains.length === 0) return;
    const totalWeight = domains.reduce((acc, d) => acc + d.weight, 0);
    const weightedSum = domains.reduce((acc, d) => acc + (d.score * d.weight), 0);
    set({ globalScore: Math.round(weightedSum / totalWeight) });
  },
}));
