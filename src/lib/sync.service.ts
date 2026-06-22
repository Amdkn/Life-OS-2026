/**
 * Sync Service — Supabase ↔ IndexedDB bidirectional sync for Ikigai visions.
 *
 * D6 root cause fix (2026-06-22): UI Ikigai reads from IndexedDB (ld01/resources).
 * Without sync layer, user-created visions live only in browser local storage.
 * This service mirrors them to Supabase public.ikigai_visions for cross-device
 * durability and multi-A0 jumeau support.
 *
 * Caller: 'ikigai-sync' (must have W on ld01 in ld-router PERMISSIONS).
 *
 * Pattern: pull at hydrate, push at addVision/updateVision/deleteVision.
 * Conflict resolution: last-write-wins by updated_at timestamp.
 */

import { supabase, getCurrentUserId } from './supabase';
import { readFromLD, writeToLD } from './ld-router';

export type IkigaiPillar = 'craft' | 'mission' | 'passion' | 'vocation';
export type IkigaiHorizon = 'H1' | 'H3' | 'H10' | 'H30' | 'H90';

/**
 * Vision as stored in IndexedDB (matches store IkigaiVision shape + sync fields).
 * Note: ld-router enforces type='vision' for this caller on ld01/resources.
 */
export interface SyncedVision {
  id: string;
  type: 'vision';
  pillar: IkigaiPillar;
  horizon: IkigaiHorizon;
  title: string;
  content: string;
  alignmentLevel: number; // 0-100
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface SyncResult {
  pulled: number;
  pushed: number;
  errors: string[];
  duration_ms: number;
  /** Visions fetched from Supabase (added 2026-06-22 to bypass IDB re-read race). */
  visions?: SyncedVision[];
}

/**
 * Pull all remote visions for current user into IndexedDB ld01/resources.
 * Used at app boot (hydrate) and on demand.
 */
export async function pullIkigaiVisions(): Promise<SyncResult> {
  const t0 = performance.now();
  const result: SyncResult = { pulled: 0, pushed: 0, errors: [], duration_ms: 0 };
  const userId = await getCurrentUserId();
  if (import.meta.env.DEV) {
    console.debug('[SYNC] pullIkigaiVisions start', {
      userId: userId ?? 'NULL',
      hasAnonKey: !!(import.meta.env.VITE_SUPABASE_ANON_KEY),
    });
  }
  if (!userId) {
    result.errors.push('No authenticated user (skip pull)');
    result.duration_ms = performance.now() - t0;
    return result;
  }

  try {
    const { data: remote, error } = await supabase
      .from('ikigai_visions')
      .select('id, pillar, horizon, title, content, alignment_level, tags, created_at, updated_at')
      .eq('user_id', userId);

    if (error) throw new Error(`Supabase pull failed: ${error.message}`);
    if (!remote || remote.length === 0) {
      result.duration_ms = performance.now() - t0;
      return result;
    }

    // Read local for conflict resolution
    const localItems = await readFromLD<SyncedVision>('ld01', 'resources');
    const localVisions = localItems.filter(v => v.type === 'vision');
    const localById = new Map(localVisions.map(v => [v.id, v]));

    const syncedVisions: SyncedVision[] = [];

    for (const r of remote) {
      const local = localById.get(r.id);
      const remoteTs = r.updated_at ? new Date(r.updated_at).getTime() : 0;
      const localTs = local?.updated_at ? new Date(local.updated_at).getTime() : 0;

      // Last-write-wins: remote wins on tie (canonical source on cloud)
      if (!local || remoteTs >= localTs) {
        const vision: SyncedVision = {
          id: r.id,
          type: 'vision',
          pillar: r.pillar as IkigaiPillar,
          horizon: r.horizon as IkigaiHorizon,
          title: r.title,
          content: r.content || '',
          alignmentLevel: r.alignment_level ?? 0,
          tags: Array.isArray(r.tags) ? r.tags : [],
          created_at: r.created_at,
          updated_at: r.updated_at,
        };
        await writeToLD('ld01', 'resources', 'add', vision, 'ikigai-sync');
        syncedVisions.push(vision);
        result.pulled++;
      } else {
        // Local wins — still include in result for store merge
        syncedVisions.push(local);
      }
    }

    // Expose visions directly so caller can update store without IDB re-read race
    result.visions = syncedVisions;
  } catch (e: any) {
    result.errors.push(e.message ?? String(e));
    console.error('[SYNC] pullIkigaiVisions exception', e);
  }

  result.duration_ms = performance.now() - t0;
  if (import.meta.env.DEV) {
    console.debug('[SYNC] pullIkigaiVisions end', {
      pulled: result.pulled,
      errors: result.errors,
      duration_ms: Math.round(result.duration_ms),
    });
  }
  return result;
}

/**
 * Push a single vision to Supabase.
 * Call after writeToLD('ld01', 'resources', 'add', v, 'ikigai-sync').
 */
export async function pushVision(vision: SyncedVision): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('No authenticated user (cannot push)');

  const now = new Date().toISOString();
  const { error } = await supabase
    .from('ikigai_visions')
    .upsert({
      id: vision.id,
      user_id: userId,
      pillar: vision.pillar,
      horizon: vision.horizon,
      title: vision.title,
      content: vision.content,
      alignment_level: vision.alignmentLevel,
      tags: vision.tags ?? [],
      updated_at: now,
    }, { onConflict: 'id' });

  if (error) throw new Error(`Supabase push failed: ${error.message}`);
}

/**
 * Push delete to Supabase (mirror local deletion).
 */
export async function pushVisionDelete(visionId: string): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('No authenticated user (cannot delete)');

  const { error } = await supabase
    .from('ikigai_visions')
    .delete()
    .eq('id', visionId)
    .eq('user_id', userId);

  if (error) throw new Error(`Supabase delete failed: ${error.message}`);
}

/**
 * Full bidirectional sync: pull remote → IDB, then return result.
 * Push happens in addVision() for low-latency local writes.
 */
export async function syncIkigaiVisions(): Promise<SyncResult> {
  return await pullIkigaiVisions();
}

// ============================================================================
// Life Wheel Ambitions (mirror of Ikigai pattern, 2026-06-22)
// ============================================================================

/** Ambition shape as stored in IndexedDB (matches WheelAmbition in fw-wheel.store). */
export interface SyncedAmbition {
  id: string;
  type: 'ambition';
  domainId: string;       // 'd1'..'d8'
  title: string;
  content: string;
  status: 'active' | 'achieved' | 'archived';
  description?: string;
  twin?: string;
  horizon?: 'H1' | 'H3' | 'H10' | 'H30' | 'H90';
  kpi?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SyncAmbitionResult extends SyncResult {
  ambitions?: SyncedAmbition[];
}

/**
 * Pull all remote ambitions for current user into IndexedDB ld01/resources.
 * Last-write-wins by updated_at.
 */
export async function pullLifeWheelAmbitions(): Promise<SyncAmbitionResult> {
  const t0 = performance.now();
  const result: SyncAmbitionResult = { pulled: 0, pushed: 0, errors: [], duration_ms: 0 };
  const userId = await getCurrentUserId();
  if (!userId) {
    result.errors.push('No authenticated user (skip pull)');
    result.duration_ms = performance.now() - t0;
    return result;
  }

  try {
    const { data: remote, error } = await supabase
      .from('life_wheel_ambitions')
      .select('id, domain_id, title, content, status, description, twin, horizon, kpi, created_at, updated_at')
      .eq('user_id', userId);

    if (error) throw new Error(`Supabase pull failed: ${error.message}`);
    if (!remote || remote.length === 0) {
      result.duration_ms = performance.now() - t0;
      return result;
    }

    const localItems = await readFromLD<SyncedAmbition>('ld01', 'resources');
    const localAmbitions = localItems.filter(d => (d as any).type === 'ambition');
    const localById = new Map(localAmbitions.map(a => [a.id, a]));

    const synced: SyncedAmbition[] = [];

    for (const r of remote) {
      const local = localById.get(r.id);
      const remoteTs = r.updated_at ? new Date(r.updated_at).getTime() : 0;
      const localTs = local?.updated_at ? new Date(local.updated_at).getTime() : 0;

      if (!local || remoteTs >= localTs) {
        const ambition: SyncedAmbition = {
          id: r.id,
          type: 'ambition',
          domainId: r.domain_id,
          title: r.title,
          content: r.content || '',
          status: (r.status as any) ?? 'active',
          description: r.description ?? '',
          twin: r.twin ?? undefined,
          horizon: (r.horizon as any) ?? undefined,
          kpi: r.kpi ?? undefined,
          created_at: r.created_at,
          updated_at: r.updated_at,
        };
        await writeToLD('ld01', 'resources', 'add', ambition, 'wheel-sync');
        synced.push(ambition);
        result.pulled++;
      } else {
        synced.push(local);
      }
    }

    result.ambitions = synced;
  } catch (e: any) {
    result.errors.push(e.message ?? String(e));
    console.error('[SYNC] pullLifeWheelAmbitions exception', e);
  }

  result.duration_ms = performance.now() - t0;
  if (import.meta.env.DEV) {
    console.debug('[SYNC] pullLifeWheelAmbitions end', {
      pulled: result.pulled,
      errors: result.errors,
      duration_ms: Math.round(result.duration_ms),
    });
  }
  return result;
}

/** Push a single ambition to Supabase. */
export async function pushAmbition(ambition: SyncedAmbition): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('No authenticated user (cannot push)');

  const now = new Date().toISOString();
  const { error } = await supabase
    .from('life_wheel_ambitions')
    .upsert({
      id: ambition.id,
      user_id: userId,
      domain_id: ambition.domainId,
      title: ambition.title,
      content: ambition.content,
      status: ambition.status,
      description: ambition.description ?? '',
      twin: ambition.twin ?? null,
      horizon: ambition.horizon ?? null,
      kpi: ambition.kpi ?? null,
      updated_at: now,
    }, { onConflict: 'id' });

  if (error) throw new Error(`Supabase push failed: ${error.message}`);
}

/** Push delete to Supabase. */
export async function pushAmbitionDelete(ambitionId: string): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('No authenticated user (cannot delete)');

  const { error } = await supabase
    .from('life_wheel_ambitions')
    .delete()
    .eq('id', ambitionId)
    .eq('user_id', userId);

  if (error) throw new Error(`Supabase delete failed: ${error.message}`);
}
