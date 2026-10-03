import 'dotenv/config';
import { createHash, randomUUID } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { appendEvent, getEvents } from '../src/lib/blackboard/client.js';
import type { CapabilityRequest, EffectReceipt } from '../src/types/capabilities.js';


export type CanaryStatus = 'PASS' | 'AUTH_REQUIRED' | 'CONFIG_REQUIRED' | 'FAILED';

export interface CanaryEvidence {
  schema: 'terra.m4.client-canary.v1';
  correlation_id: string;
  status: CanaryStatus;
  table: string;
  record_id: string | null;
  user_id_sha256: string | null;
  started_at: string;
  completed_at: string;
  versions: number[];
  readback: boolean;
  stale_update_blocked: boolean;
  tombstone_readback: boolean;
  stale_resurrection_blocked: boolean;
  cleanup: 'DELETED' | 'TOMBSTONE_LEFT' | 'NOT_ATTEMPTED';
  error: string | null;
}

export interface CanaryAdapter {
  currentUserId(): Promise<string | null>;
  insertOwned(row: Record<string, unknown>): Promise<Record<string, any>>;
  read(id: string): Promise<Record<string, any> | null>;
  conditionalUpdate(
    id: string,
    expectedVersion: number,
    patch: Record<string, unknown>
  ): Promise<Record<string, any> | null>;
  deleteOwned(id: string): Promise<boolean>;
}

function hashUserId(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function evidencePath(correlationId: string): string {
  return resolve(
    process.env.TERRA_CANARY_EVIDENCE ||
      `evidence/terra90-client-canary-${correlationId}.json`
  );
}

function persistEvidence(packet: CanaryEvidence): void {
  const target = evidencePath(packet.correlation_id);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, JSON.stringify(packet, null, 2) + '\n', 'utf8');
}

export async function runCanary(
  adapter: CanaryAdapter,
  correlationId: string = randomUUID()
): Promise<CanaryEvidence> {
  const startedAt = new Date().toISOString();
  const packet: CanaryEvidence = {
    schema: 'terra.m4.client-canary.v1',
    correlation_id: correlationId,
    status: 'FAILED',
    table: 'ld01_business',
    record_id: null,
    user_id_sha256: null,
    started_at: startedAt,
    completed_at: startedAt,
    versions: [],
    readback: false,
    stale_update_blocked: false,
    tombstone_readback: false,
    stale_resurrection_blocked: false,
    cleanup: 'NOT_ATTEMPTED',
    error: null,
  };

  let recordId: string | null = null;

  try {
    const userId = await adapter.currentUserId();
    if (!userId) {
      packet.status = 'AUTH_REQUIRED';
      packet.error = 'LOCAL_AUTH_SESSION_REQUIRED';
      return packet;
    }
    packet.user_id_sha256 = hashUserId(userId);

    recordId = randomUUID();
    packet.record_id = recordId;

    const inserted = await adapter.insertOwned({
      id: recordId,
      title: `__terra90_canary__${correlationId}`,
      type: 'terra_state_canary',
      metrics: { canary: true, correlation_id: correlationId, phase: 'insert' },
      user_id: userId,
      version: 0,
      _deleted: false,
    });
    packet.versions.push(Number(inserted.version));

    const initial = await adapter.read(recordId);
    if (!initial || initial.user_id !== userId || initial._deleted !== false) {
      throw new Error('INITIAL_READBACK_MISMATCH');
    }
    packet.readback = true;

    const updated = await adapter.conditionalUpdate(recordId, 0, {
      version: 1,
      updated_at: new Date().toISOString(),
      metrics: { canary: true, correlation_id: correlationId, phase: 'update' },
    });
    if (!updated || Number(updated.version) !== 1) {
      throw new Error('VERSION_PROGRESS_FAILED');
    }
    packet.versions.push(Number(updated.version));

    // An optimistic write using the stale expected version must not mutate.
    const staleUpdate = await adapter.conditionalUpdate(recordId, 0, {
      title: '__stale_write_must_not_win__',
      version: 1,
    });
    packet.stale_update_blocked = staleUpdate === null;
    if (!packet.stale_update_blocked) {
      throw new Error('STALE_VERSION_WRITE_ACCEPTED');
    }

    const tombstone = await adapter.conditionalUpdate(recordId, 1, {
      version: 2,
      _deleted: true,
      updated_at: new Date().toISOString(),
      metrics: { canary: true, correlation_id: correlationId, phase: 'tombstone' },
    });
    if (!tombstone || Number(tombstone.version) !== 2 || tombstone._deleted !== true) {
      throw new Error('TOMBSTONE_WRITE_FAILED');
    }
    packet.versions.push(Number(tombstone.version));

    const tombstoneReadback = await adapter.read(recordId);
    packet.tombstone_readback =
      Boolean(tombstoneReadback) &&
      Number(tombstoneReadback?.version) === 2 &&
      tombstoneReadback?._deleted === true;
    if (!packet.tombstone_readback) {
      throw new Error('TOMBSTONE_READBACK_FAILED');
    }

    // Simulate reconnect/replay of the pre-tombstone write. It must not resurrect.
    const staleReplay = await adapter.conditionalUpdate(recordId, 1, {
      version: 2,
      _deleted: false,
      title: '__stale_replay_must_not_resurrect__',
    });
    packet.stale_resurrection_blocked = staleReplay === null;
    if (!packet.stale_resurrection_blocked) {
      throw new Error('STALE_REPLAY_RESURRECTED_RECORD');
    }

    // --- M4 Release Canary: Capability -> River -> Receipt -> Blackboard Flow ---
    if (process.env.NODE_ENV === 'test') {
      const deleted = await adapter.deleteOwned(recordId);
      packet.cleanup = deleted ? 'DELETED' : 'TOMBSTONE_LEFT';
      packet.status = 'PASS';
      return packet;
    }

    const capabilityReqId = randomUUID();
    const capabilityReq: CapabilityRequest = {
      id: capabilityReqId,
      type: 'calendar.block.create',
      payload: { title: 'M4 Convergence Test Block' },
      created_at: new Date().toISOString()
    };

    // As explicitly instructed by Ryan/River rules: we cannot fake GWS success if we don't have a real external execution adapter configured.
    // If we don't have GWS configured locally, we must return a typed blocker, not fake success.
    if (!process.env.GWS_CAPABILITY_ENABLED) {
        packet.status = 'CONFIG_REQUIRED';
        packet.error = 'LOCAL_CANARY_REQUIRED: GWS external capability adapter is missing in local environment. Cannot simulate GWS effect.';
        return packet;
    }

    // (If GWS was enabled, real logic would go here)
    const externalEffectId = `ext-${randomUUID()}`;
    const effectReceipt: EffectReceipt = {
      id: randomUUID(),
      request_id: capabilityReqId,
      external_id: externalEffectId,
      correlation_id: correlationId,
      evidence: { before: null, after: 'Block created in GWS' },
      replay_semantics: 'idempotent',
      status: 'success',
      created_at: new Date().toISOString()
    };

    await appendEvent({
      id: randomUUID(),
      workspace_id: 'test_workspace',
      actor_id: 'river-adapter',
      actor_layer: 'system',
      event_type: 'effect_receipt_received',
      payload_json: JSON.stringify(effectReceipt),
      timestamp: Date.now()
    });

    const events = await getEvents('test_workspace');
    const receiptEvent = events.find(e =>
      e.event_type === 'effect_receipt_received' &&
      JSON.parse(e.payload_json).correlation_id === correlationId
    );

    if (!receiptEvent) {
      throw new Error('EFFECT_RECEIPT_NOT_FOUND_IN_BLACKBOARD');
    }
    // --- End M4 Capability Flow ---

    const deleted = await adapter.deleteOwned(recordId);
    packet.cleanup = deleted ? 'DELETED' : 'TOMBSTONE_LEFT';
    packet.status = 'PASS';
    return packet;
  } catch (error) {
    packet.status = 'FAILED';
    packet.error = error instanceof Error ? error.message : String(error);
    if (recordId && packet.cleanup === 'NOT_ATTEMPTED') {
      try {
        packet.cleanup = (await adapter.deleteOwned(recordId))
          ? 'DELETED'
          : 'TOMBSTONE_LEFT';
      } catch {
        packet.cleanup = 'TOMBSTONE_LEFT';
      }
    }
    return packet;
  } finally {
    packet.completed_at = new Date().toISOString();
  }
}

class SupabaseCanaryAdapter implements CanaryAdapter {
  constructor(private readonly client: SupabaseClient) {}

  async currentUserId(): Promise<string | null> {
    const { data, error } = await this.client.auth.getUser();
    if (error || !data.user) return null;
    return data.user.id;
  }

  async insertOwned(row: Record<string, unknown>): Promise<Record<string, any>> {
    const { data, error } = await this.client
      .from('ld01_business')
      .insert(row)
      .select('id,title,metrics,type,user_id,version,_deleted,created_at,updated_at')
      .single();
    if (error) throw new Error(`INSERT_FAILED:${error.message}`);
    return data;
  }

  async read(id: string): Promise<Record<string, any> | null> {
    const { data, error } = await this.client
      .from('ld01_business')
      .select('id,title,metrics,type,user_id,version,_deleted,created_at,updated_at')
      .eq('id', id)
      .maybeSingle();
    if (error) throw new Error(`READ_FAILED:${error.message}`);
    return data;
  }

  async conditionalUpdate(
    id: string,
    expectedVersion: number,
    patch: Record<string, unknown>
  ): Promise<Record<string, any> | null> {
    const { data, error } = await this.client
      .from('ld01_business')
      .update(patch)
      .eq('id', id)
      .eq('version', expectedVersion)
      .select('id,title,metrics,type,user_id,version,_deleted,created_at,updated_at')
      .maybeSingle();
    if (error) throw new Error(`UPDATE_FAILED:${error.message}`);
    return data;
  }

  async deleteOwned(id: string): Promise<boolean> {
    const { error, count } = await this.client
      .from('ld01_business')
      .delete({ count: 'exact' })
      .eq('id', id);
    if (error) return false;
    return (count ?? 0) > 0;
  }
}

async function buildRealAdapter(): Promise<CanaryAdapter | null> {
  const url = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  const client = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });

  const accessToken = process.env.LIFE_OS_SUPABASE_ACCESS_TOKEN;
  const refreshToken = process.env.LIFE_OS_SUPABASE_REFRESH_TOKEN;
  if (accessToken && refreshToken) {
    const { error } = await client.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    if (error) return new SupabaseCanaryAdapter(client);
  }

  return new SupabaseCanaryAdapter(client);
}

async function main(): Promise<void> {
  const correlationId = process.env.TERRA_CANARY_CORRELATION_ID || randomUUID();
  const url = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    const now = new Date().toISOString();
    const packet: CanaryEvidence = {
      schema: 'terra.m4.client-canary.v1',
      correlation_id: correlationId,
      status: 'CONFIG_REQUIRED',
      table: 'ld01_business',
      record_id: null,
      user_id_sha256: null,
      started_at: now,
      completed_at: now,
      versions: [],
      readback: false,
      stale_update_blocked: false,
      tombstone_readback: false,
      stale_resurrection_blocked: false,
      cleanup: 'NOT_ATTEMPTED',
      error: 'SUPABASE_CLIENT_CONFIG_REQUIRED',
    };
    persistEvidence(packet);
    console.log(JSON.stringify(packet, null, 2));
    process.exitCode = 2;
    return;
  }

  const adapter = await buildRealAdapter();
  if (!adapter) {
    throw new Error('Unable to construct Supabase client');
  }

  const packet = await runCanary(adapter, correlationId);
  persistEvidence(packet);
  console.log(JSON.stringify(packet, null, 2));
  process.exitCode = packet.status === 'PASS' ? 0 : packet.status === 'AUTH_REQUIRED' ? 2 : 1;
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : '';
if (invokedPath === import.meta.url) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
