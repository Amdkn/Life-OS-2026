import { appendEvent, getEventsByWorkspace } from '../../../server/blackboard/repository.js';

export interface LedgerEntry {
  idempotencyKey: string;
  franchiseId: string;
  amount: number;
  currency: string;
  description: string;
  type: 'debit' | 'credit';
  category: string;
  timestamp: number;
}

export function recordLedgerEntry(entry: LedgerEntry): boolean {
  // Use blackboard event as the underlying store
  try {
    appendEvent({
      id: entry.idempotencyKey,
      workspace_id: entry.franchiseId,
      actor_id: 'treasury_engine',
      actor_layer: 'B1',
      event_type: 'treasury_transaction',
      payload_json: JSON.stringify(entry),
      timestamp: entry.timestamp
    });
    return true;
  } catch (error: any) {
    // If it's a unique constraint violation on ID, it's an idempotency hit
    if (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY' || error.message?.includes('UNIQUE')) {
      return false; // Already processed
    }
    throw error;
  }
}

export function calculateBalance(franchiseId: string): number {
  const events = getEventsByWorkspace(franchiseId);
  let balance = 0;

  for (const event of events) {
    if (event.event_type === 'treasury_transaction') {
      const entry = JSON.parse(event.payload_json) as LedgerEntry;
      if (entry.type === 'credit') {
        balance += entry.amount;
      } else if (entry.type === 'debit') {
        balance -= entry.amount;
      }
    }
  }

  return balance;
}

export function reverseLedgerEntry(originalIdempotencyKey: string, newIdempotencyKey: string, franchiseId: string): boolean {
  const events = getEventsByWorkspace(franchiseId);
  const originalEvent = events.find(e => e.id === originalIdempotencyKey && e.event_type === 'treasury_transaction');

  if (!originalEvent) {
    throw new Error('Original entry not found');
  }

  const originalEntry = JSON.parse(originalEvent.payload_json) as LedgerEntry;

  const reversalEntry: LedgerEntry = {
    ...originalEntry,
    idempotencyKey: newIdempotencyKey,
    type: originalEntry.type === 'credit' ? 'debit' : 'credit',
    description: `Reversal of: ${originalEntry.description}`,
    timestamp: Date.now()
  };

  return recordLedgerEntry(reversalEntry);
}
