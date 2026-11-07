// src/services/migration.service.ts
import { supabase } from '../lib/supabase';
import type { MigrationResult, ValidationReport } from '../types/migration';
import { MIGRATION_TABLES } from '../types/migration';

const LD_TABLES = [
  'ld01_business', 'ld02_finance', 'ld03_health', 'ld04_cognition',
  'ld05_relations', 'ld06_habitat', 'ld07_creativity', 'ld08_impact'
];

export async function checkMigrationNeeded(): Promise<boolean> {
  try {
    for (const table of LD_TABLES) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .is('user_id', null);

      if (error) {
        console.warn(`[Clara] Migration check failed for ${table} — assuming not needed`, error);
        continue;
      }
      if ((count ?? 0) > 0) return true;
    }
    return false;
  } catch (err) {
    console.warn('[Clara] Migration check exception', err);
    return false;
  }
}

/**
 * Runs the ADR003 migration via the server RPC function.
 * This replaces the manual SQL script with a versioned, callable server function.
 */
export async function runMigration(): Promise<MigrationResult> {
  const startMs = Date.now();

  try {
    // Call the server-side RPC function
    const { data, error } = await supabase.rpc('run_adr003_migration');

    if (error) {
      throw new Error(`RPC error: ${error.message}`);
    }

    const result = data as {
      success: boolean;
      admiral_id: string | null;
      tables_updated: number;
      total_rows_migrated: number;
      error: string | null;
    };

    return {
      success: result.success,
      admiralId: result.admiral_id,
      tablesUpdated: result.tables_updated,
      totalRowsMigrated: result.total_rows_migrated,
      durationMs: Date.now() - startMs,
      error: result.error,
    };
  } catch (err) {
    return {
      success: false,
      admiralId: null,
      tablesUpdated: 0,
      totalRowsMigrated: 0,
      durationMs: Date.now() - startMs,
      error: err instanceof Error ? err.message : 'Unknown error during migration',
    };
  }
}

export async function validateMigration(): Promise<ValidationReport> {
  try {
    // Call the server-side validation RPC
    const { data, error } = await supabase.rpc('validate_adr003_migration');

    if (error) {
      throw new Error(`RPC error: ${error.message}`);
    }

    const result = data as {
      valid: boolean;
      orphan_counts: Record<string, number>;
      total_orphans: number;
      message: string;
    };

    return {
      valid: result.valid,
      orphanCounts: result.orphan_counts,
      totalOrphans: result.total_orphans,
      message: result.message,
    };
  } catch (err) {
    // Fallback to client-side check if RPC unavailable
    console.warn('[Clara] Server validation unavailable, falling back to client check', err);
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
}
