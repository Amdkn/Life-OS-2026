// src/types/migration.ts
export interface MigrationResult {
  success: boolean;
  admiralId: string | null;
  tablesUpdated: number;
  totalRowsMigrated: number;
  durationMs: number;
  error: string | null;
}

export interface ValidationReport {
  valid: boolean;
  orphanCounts: Record<string, number>;
  totalOrphans: number;
  message: string;
}

export type MigrationStatus =
  | 'idle'
  | 'checking'
  | 'needed'
  | 'running'
  | 'validating'
  | 'complete'
  | 'failed'
  | 'not-needed';

export interface MigrationState {
  status: MigrationStatus;
  result: MigrationResult | null;
  validation: ValidationReport | null;
  error: string | null;
}

export const MIGRATION_TABLES = [
  'ld01_business', 'ld02_finance', 'ld03_health', 'ld04_cognition',
  'ld05_environment', 'ld06_relationships', 'ld07_emotions', 'ld08_purpose',
  'fw_para', 'fw_ikigai', 'fw_life_wheel', 'fw_12wy', 'fw_gtd', 'fw_deal',
  'sys_agent_veto', 'sys_shell_routing',
] as const;
