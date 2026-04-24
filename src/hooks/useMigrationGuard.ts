// src/hooks/useMigrationGuard.ts
import { useState, useCallback } from 'react';
import type { MigrationStatus, MigrationResult, ValidationReport, MigrationState } from '../types/migration';
import { checkMigrationNeeded, runMigration, validateMigration } from '../services/migration.service';

export function useMigrationGuard() {
  const [state, setState] = useState<MigrationState>({
    status: 'idle', result: null, validation: null, error: null,
  });

  const check = useCallback(async () => {
    setState((s) => ({ ...s, status: 'checking' }));
    const needed = await checkMigrationNeeded();
    setState((s) => ({ ...s, status: needed ? 'needed' : 'not-needed' }));
    return needed;
  }, []);

  const run = useCallback(async () => {
    setState((s) => ({ ...s, status: 'running' }));
    const result = await runMigration();

    if (!result.success) {
      setState((s) => ({ ...s, status: 'failed', result, error: result.error }));
      return result;
    }

    setState((s) => ({ ...s, status: 'validating', result }));
    const validation = await validateMigration();

    setState((s) => ({
      ...s,
      status: validation.valid ? 'complete' : 'failed',
      validation,
      error: validation.valid ? null : validation.message,
    }));

    return result;
  }, []);

  return { ...state, check, run };
}
