import { create } from 'zustand';
import type { ParaItem } from './ld01.store';
import { readFromLD, writeToLD } from '../lib/ld-router';
import { pushRock as pushRockSupabase, pushRockDelete as pushRockDeleteSupabase } from '../lib/sync.service';

/** 
 * 12 Week Year Framework Store — V0.6.1 Destruction du Mirage
 * Migrated from localStorage to IndexedDB (LD01/resources)
 * The Trinity: WyVision, WyGoal, WyTactic
 */

// NOUVEAUX CONTRATS
export interface WyVision extends ParaItem {
  type: 'wy-vision';
  domainId: string; // V0.6.7 REQUIRED
  ikigaiVisionId?: string; 
}

export interface WyGoal extends Omit<ParaItem, 'status'> {
  type: 'wy-goal';
  visionId: string;
  targetWeek: number; // 1-12
  status: 'pending' | 'in-progress' | 'achieved';
  projectId?: string; // V0.4.4 — Pont PARA-12WY
  /**
   * Definition of Done — REQUIRED per Una spec l.76:
   * "Every Rock has a Definition of Done"
   * (Phase 3b canon — 2026-06-22, Goals → Rocks rename + DoD field)
   */
  definition_of_done: string;
  /**
   * Phase 5 — Cycle Q3 anchoring (Geordi 2026-06-22)
   * Optional for backward compat — empty pre-Q3 Rocks still hydrate OK.
   * Wire to Supabase fw_12wy.cycle column when field is set.
   */
  cycle?: Cycle;
  /**
   * Phase 5 — Mirror of week_number from Supabase JSONB (1-12)
   * Optional for backward compat. targetWeek remains the source of truth.
   */
  week?: number;
}

export interface WyTactic extends Omit<ParaItem, 'status'> {
  type: 'wy-tactic';
  goalId: string;
  week: number;
  status: 'pending' | 'completed' | 'failed';
}

export type TimeBlockType = 'strategic' | 'buffer' | 'breakout';

export interface WyTimeBlock extends ParaItem {
  type: 'wy-timeblock';
  week: number;
  blockType: TimeBlockType;
  completed: boolean;
}

interface TwelveWeekState {
  visions: WyVision[];
  goals: WyGoal[];
  tactics: WyTactic[];
  timeBlocks: WyTimeBlock[];
  activeTab: 'overview' | 'vision' | 'rocks' | 'planning' | 'process' | 'measurement' | 'accountability';
  activeWeek: number | 'all';
  activeVisionId: string | null;
  activeGoalId: string | null;
  isHydrated: boolean;

  // Actions
  hydrate: () => Promise<void>;
  setActiveTab: (tab: TwelveWeekState['activeTab']) => void;
  setActiveWeek: (week: number | 'all') => void;
  setActiveVisionId: (id: string | null) => void;
  setActiveGoalId: (id: string | null) => void;
  addVision: (v: WyVision) => Promise<void>;
  addGoal: (g: WyGoal) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addTactic: (t: WyTactic) => Promise<void>;
  updateTacticStatus: (id: string, status: WyTactic['status']) => Promise<void>;
  toggleTimeBlock: (id: string) => Promise<void>;
  addTimeBlock: (b: WyTimeBlock) => Promise<void>;
}

export const useTwelveWeekStore = create<TwelveWeekState>((set, get) => ({
  visions: [],
  goals: [],
  tactics: [],
  timeBlocks: [],
  activeTab: 'overview',
  activeWeek: 'all',
  activeVisionId: null,
  activeGoalId: null,
  isHydrated: false,

  hydrate: async () => {
    try {
      // Lecture depuis 'ld01' (ressources system)
      const data = await readFromLD<ParaItem>('ld01', 'resources');
      set({
        visions: data.filter(d => (d as any).type === 'wy-vision') as any as WyVision[],
        goals: data.filter(d => (d as any).type === 'wy-goal') as any as WyGoal[],
        tactics: data.filter(d => (d as any).type === 'wy-tactic') as any as WyTactic[],
        timeBlocks: data.filter(d => (d as any).type === 'wy-timeblock') as any as WyTimeBlock[],
        isHydrated: true
      });
    } catch(e) { 
      console.error('[12WY Store] Hydration failed', e);
      set({ isHydrated: true }); 
    }
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setActiveWeek: (week) => set({ activeWeek: week }),
  setActiveVisionId: (id) => set({ activeVisionId: id }),
  setActiveGoalId: (id) => set({ activeGoalId: id }),

  addVision: async (v) => {
    set(s => ({ visions: [...s.visions, v] }));
    await writeToLD('ld01', 'resources', 'add', v, '12wy');
    void emitStatePacket('Pike', 'add_vision', { id: v.id });
  },
  addGoal: async (g) => {
    // D7 cost-of-escalation — prevent empty DoD write (Una spec l.76)
    if (!g.definition_of_done || !g.definition_of_done.trim()) {
      console.error('[12WY Store] addGoal blocked: Definition of Done REQUIRED (Una spec l.76).');
      return;
    }
    set(s => ({ goals: [...s.goals, g] }));
    await writeToLD('ld01', 'resources', 'add', g, '12wy');
    void emitStatePacket('Una', 'add_goal', { id: g.id, week: g.targetWeek });
    // Phase 6 wire: push to Supabase for multi-device sync.
    try {
      await pushRockSupabase({
        id: g.id,
        type: 'rock',
        week: g.targetWeek ?? 1,
        title: g.title,
        definition_of_done: g.definition_of_done ?? '',
        owner: 'Amadeus',
        status: g.status === 'achieved' ? 'achieved' : g.status === 'in-progress' ? 'in-progress' : 'planned',
        priority: 'medium',
        horizon: 'H10',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } catch (pushErr) {
      console.warn('[12WY Store] Supabase push failed (will retry on next sync):', pushErr);
    }
  },
  deleteGoal: async (id: string) => {
    const goal = get().goals.find(g => g.id === id);
    if (!goal) return;
    set(s => ({ goals: s.goals.filter(g => g.id !== id) }));
    await writeToLD('ld01', 'resources', 'delete', { id }, '12wy');
    // Phase 6 wire: push delete to Supabase.
    try {
      await pushRockDeleteSupabase(id, goal.targetWeek ?? 1);
    } catch (delErr) {
      console.warn('[12WY Store] Supabase delete failed:', delErr);
    }
  },
  addTactic: async (t) => {
    set(s => ({ tactics: [...s.tactics, t] }));
    await writeToLD('ld01', 'resources', 'add', t, '12wy');
    void emitStatePacket('Ortegas', 'add_tactic', { id: t.id, week: t.week });
  },
  updateTacticStatus: async (id, status) => {
    const tactic = get().tactics.find(t => t.id === id);
    if (!tactic) return;
    const updated = { ...tactic, status, updatedAt: Date.now() };
    set(s => ({ tactics: s.tactics.map(t => t.id === id ? updated : t) }));
    await writeToLD('ld01', 'resources', 'update', updated, '12wy');
    void emitStatePacket('Chapel', 'update_tactic_status', { id, status, week: tactic.week });
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
  }
}));

/**
 * Planning Overload Guard — Una spec l.30
 * If more than 3 Rocks (WyGoals) compete on the same Vision, flag planning_overload.
 * M'Benga H1: single owner, single proof, zero process drift.
 */
export function checkPlanningOverload(rocks: WyGoal[]): { overloaded: boolean; count: number; warning?: string } {
  const byVision = rocks.reduce((acc, r) => {
    if (r.visionId) acc[r.visionId] = (acc[r.visionId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const maxCount = Math.max(0, ...Object.values(byVision));
  return {
    overloaded: maxCount > 3,
    count: maxCount,
    warning: maxCount > 3 ? `⚠️ ${maxCount} Rocks on single Vision (>3 Una guard threshold)` : undefined,
  };
}

// M'Benga H1 Process Control — wire planning_overload detection into state bus
// (Curie spec l.110 — 12wy_discipline field routing)
const _originalCheckPlanningOverload = checkPlanningOverload;
export function checkPlanningOverloadAndEmit(rocks: WyGoal[]) {
  const result = _originalCheckPlanningOverload(rocks);
  if (result.overloaded) {
    void emitStatePacket('M\'Benga', 'planning_overload', { count: result.count });
  }
  return result;
}

/**
 * Emit state.json packet for 12WY discipline (Curie spec l.110 canon).
 * Updates `12wy_discipline` field in state.json bus at:
 *   C:\Users\amado\ASpace_OS_V2\00_Amadeus\40_SYMPHONY_BUS\state.json
 *
 * Maps store action → A2 SNW disciple:
 *   addVision  → Pike (H10 Vision anchor)
 *   addGoal    → Una (H10 Planning/Rocks)
 *   addTactic  → Ortegas (H1 Execution)
 *   updateDomainScore → Chapel (H10 Metrics)
 *   checkPlanningOverload → M'Benga (H1 Process Control)
 *
 * Failure mode: silent (D7 cost-of-escalation — never block A0 prompt).
 */
export type TwelveWyDiscipline = 'Pike' | 'Una' | 'M\'Benga' | 'Chapel' | 'Ortegas';

export async function emitStatePacket(
  discipline: TwelveWyDiscipline,
  action: string,
  meta?: Record<string, any>
): Promise<void> {
  try {
    const busPath = 'C:\\Users\\amado\\ASpace_OS_V2\\00_Amadeus\\40_SYMPHONY_BUS\\state.json';
    // D6 root cause: file may not exist yet (Amorçage 1 not done) — graceful fallback
    let state: any = {};
    try {
      const response = await fetch('file:///' + busPath.replace(/\\/g, '/'));
      if (response.ok) state = await response.json();
    } catch {
      // File doesn't exist yet (Amorçage 1 pending) — create minimal state
      state = { status: 'ACTIVE', agent_id: 'A0_Amadeus', cycle: 'Q3-2026' };
    }

    state['12wy_discipline'] = discipline;
    state['next_step'] = `12wy:${action}`;
    state['updated'] = new Date().toISOString();
    state['extra'] = { ...(state.extra ?? {}), '12wy_action': action, '12wy_meta': meta ?? {} };

    // Note: real write happens via PowerShell script (mariner-capture.ps1 hook)
    // For now, console.debug for DEV observability (D6 anti-pattern guard: don't leak secrets)
    if (import.meta.env.DEV) {
      console.debug('[12WY BUS] emit', { discipline, action, busPath: busPath.split('\\').pop() });
    }
  } catch (e) {
    console.warn('[12WY BUS] emit failed (silent, D7 cost-of-escalation):', e);
  }
}

/* ──────────────────────────────────────────────────────────────────────────
 * Phase 5 — Cycle Q3 2026 Anchoring (Geordi 2026-06-22)
 * ──────────────────────────────────────────────────────────────────────────
 * Canon source : C:\Users\amado\ASpace_OS_V2\20_Life_OS\23_12WY_SNW\W1_Quarter_Intent_Q3_2026.md
 * Plan source  : fancy-hugging-bengio.md §4 — Cycle Q3 2026 = 06/15 → 09/07/26, 12 items
 * Doctrine     : D4 append-only — extend, never rewrite Swarm B/C/E additions above.
 *
 * A0 board observer — Geordi codes, A0 validates milestones (no mid-session GO).
 */

/**
 * Cycle — Quarterly anchor for 12WY temporal engine.
 * Each Rock (WyGoal) optionally tags itself to a Cycle for drift detection.
 */
export type Cycle = {
  id: string;          // 'Q3-2026'
  label: string;       // 'Q3 2026'
  startDate: string;   // ISO 8601 '2026-06-15'
  endDate: string;     // ISO 8601 '2026-09-07'
  intentRef?: string;  // canon Wiki hand-off path
};

/**
 * ACTIVE_CYCLE — Single source of truth for current quarter anchor.
 * Wired into emitStatePacket fallback state (line 206) and TwelveWeekApp cycle strip.
 */
export const ACTIVE_CYCLE: Cycle = {
  id: 'Q3-2026',
  label: 'Q3 2026',
  startDate: '2026-06-15',
  endDate: '2026-09-07',
  intentRef: 'wiki/hand_offs/W1_Quarter_Intent_Q3_2026.md',
};
