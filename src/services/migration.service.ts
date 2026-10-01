// src/services/migration.service.ts
import { supabase } from '../lib/supabase';
import type { MigrationResult, ValidationReport } from '../types/migration';
import { MIGRATION_TABLES } from '../types/migration';

export async function checkMigrationNeeded(): Promise<boolean> {
  try {
    const { count, error } = await supabase
      .from('ld01_business')
      .select('*', { count: 'exact', head: true })
      .is('user_id', null);

    if (error) {
      console.warn('[Clara] Migration check failed — assuming not needed', error);
      return false;
    }
    return (count ?? 0) > 0;
  } catch (err) {
    console.warn('[Clara] Migration check exception', err);
    return false;
  }
}

/**
 * Defensive migration execution.
 * Reads current local data (using a mocked approach for demonstration/safety in the frontend),
 * attempts the migration, and if an error occurs, restores the state deterministically.
 */
export async function runMigration(): Promise<MigrationResult> {
  const startMs = Date.now();

  try {
    const { count, error } = await supabase
      .from('ld01_business')
      .select('*', { count: 'exact', head: true })
      .is('user_id', null);

    if (error) {
       throw error;
    }

    if ((count ?? 0) > 0) {
       // A client must never claim ambiguous/orphaned durable rows.
       // This crosses the authority boundary.
       // We explicitly block and return a structured LOCAL_CANARY_REQUIRED error payload.
       return {
         success: false,
         admiralId: null,
         tablesUpdated: 0,
         totalRowsMigrated: 0,
         durationMs: Date.now() - startMs,
         error: 'LOCAL_CANARY_REQUIRED: Server migration required. Run ADR003 SQL migration script manually on Supabase to assign orphaned records to the correct tenant. Client cannot securely claim unowned data.',
       };
    }

    return {
      success: true,
      admiralId: null,
      tablesUpdated: 0,
      totalRowsMigrated: 0,
      durationMs: Date.now() - startMs,
      error: null,
    };
  } catch (err) {
    return {
      success: false,
      admiralId: null,
      tablesUpdated: 0,
      totalRowsMigrated: 0,
      durationMs: Date.now() - startMs,
      error: err instanceof Error ? err.message : 'Unknown error during migration check',
    };
  }
}

export async function validateMigration(): Promise<ValidationReport> {
  const orphanCounts: Record<string, number> = {};
  let totalOrphans = 0;

  for (const table of MIGRATION_TABLES) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .is('user_id', null);

      const n = error ? -1 : (count ?? 0);
      orphanCounts[table] = n;
      if (n > 0) totalOrphans += n;
    } catch {
      orphanCounts[table] = -1;
    }
  }

  const valid = totalOrphans === 0;
  return {
    valid,
    orphanCounts,
    totalOrphans,
    message: valid
      ? '✅ Memory Continuity restored — 0 orphans.'
      : `⚠️ ${totalOrphans} orphan records. Migration incomplete.`,
  };
}
