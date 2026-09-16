/**
 * Defensive migration and envelope decoder
 */

const SCHEMA_VERSION = '0.1.1';

export interface VersionedEnvelope<T> {
  version: string;
  data: T;
  timestamp: number;
}

/**
 * Encodes data into a versioned envelope
 */
export function encodeVersionedEnvelope<T>(data: T): string {
  const envelope: VersionedEnvelope<T> = {
    version: SCHEMA_VERSION,
    data,
    timestamp: Date.now()
  };
  return JSON.stringify(envelope);
}

/**
 * Decodes a versioned envelope. Returns null if corrupted or schema mismatch.
 * This ensures a silent fallback instead of crashing with a White Screen of Death.
 */
export function decodeVersionedEnvelope<T>(raw: string | null): T | null {
  if (!raw) return null;

  try {
    const envelope = JSON.parse(raw) as VersionedEnvelope<T>;

    // Check for valid envelope structure
    if (!envelope || typeof envelope !== 'object') {
      console.warn('[MigrationDefensive] Corrupted envelope structure detected. Returning null.');
      return null;
    }

    // Schema version check
    if (envelope.version !== SCHEMA_VERSION) {
      console.warn(`[MigrationDefensive] Schema mismatch (found ${envelope.version || 'none'}, expected ${SCHEMA_VERSION}). Returning null.`);
      return null;
    }

    return envelope.data;
  } catch (err) {
    console.warn('[MigrationDefensive] Failed to parse envelope. Returning null to avoid crash.', err);
    return null;
  }
}
