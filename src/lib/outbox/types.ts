export type OperationType = 'put' | 'delete';
export type SyncStatus = 'pending' | 'syncing' | 'error' | 'conflict';

export interface OutboxEntry<T = any> {
  idempotencyKey: string;
  storeName: string;
  operation: OperationType;
  payload: T;
  userId: string;
  version: number;
  status: SyncStatus;
  retryCount: number;
  lastAttemptAt?: number;
  createdAt: number;
}

export interface SyncResult {
  success: boolean;
  error?: string;
  conflict?: boolean;
}
