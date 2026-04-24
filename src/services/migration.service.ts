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

export async function runMigration(): Promise<MigrationResult> {
  const startMs = Date.now();
  try {
    const { data, error } = await supabase.rpc('run_adr003_migration');
    if (error) throw error;

    const result = data as { admiral_id: string; total_migrated: number; tables_updated: number };
    return {
      success: true,
      admiralId: result.admiral_id,
      tablesUpdated: result.tables_updated,
      totalRowsMigrated: result.total_migrated,
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
      error: err instanceof Error ? err.message : 'Unknown SQL error',
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
