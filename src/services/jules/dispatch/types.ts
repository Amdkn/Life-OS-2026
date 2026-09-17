export type JobState =
  | 'requested'
  | 'ready'
  | 'reserved'
  | 'submitted'
  | 'running'
  | 'pr_ready'
  | 'verified'
  | 'integrated'
  | 'blocked'
  | 'failed'
  | 'uncertain';

export interface DispatchJob {
  id: string;             // logical id (e.g. repo/category/tranche)
  categoryId: string;     // e.g. "C0", "C1", etc.
  repository: string;
  tranche: string;        // specific PRD chunk
  briefHash: string;      // Hash of the payload/text to prevent exact duplicates
  state: JobState;
  writeScopes: string[];  // To prevent overlapping files
  dependencies: string[]; // Job IDs that must be 'integrated'
  createdAt: number;
  updatedAt: number;
  sessionId?: string;     // Jules session ID if submitted
}

export interface DispatchResult {
  success: boolean;
  jobId?: string;
  error?: string;
  state?: JobState;
  quotaRemaining?: number | null;
}
