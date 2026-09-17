const SCHEMA_VERSION = '0.1.1';

export interface VersionedEnvelope<T> {
  version: string;
  data: T;
  timestamp: number;
}

export function encodeVersionedEnvelope<T>(data: T): string {
  const envelope: VersionedEnvelope<T> = {
    version: SCHEMA_VERSION,
    data,
    timestamp: Date.now()
  };
  return JSON.stringify(envelope);
}

export function decodeVersionedEnvelope<T>(raw: string | null): T | null {
  if (!raw) return null;

  try {
    const envelope = JSON.parse(raw) as VersionedEnvelope<T>;
    if (!envelope || typeof envelope !== 'object' || envelope.version !== SCHEMA_VERSION) {
      return null;
    }
    return envelope.data;
  } catch (err) {
    return null;
  }
}

export function createScopedStorage(scope: string) {
  return {
    getItem: (key: string) => {
      if (typeof localStorage === 'undefined') return null;
      const scopedKey = `${scope}:${key}`;
      const val = localStorage.getItem(scopedKey);

      // If scoped value exists, decode and return it
      if (val !== null) {
         const decoded = decodeVersionedEnvelope<any>(val);
         if (decoded === null) {
            // Corrupted or schema mismatch -> purge scoped key
            localStorage.removeItem(scopedKey);
            return null; // Silent reset (return null to prevent crash)
         }
         return typeof decoded === 'string' ? decoded : JSON.stringify(decoded);
      }

      // Fallback: If scoped value does NOT exist, check legacy unscoped key
      return localStorage.getItem(key);
    },
    setItem: (key: string, value: string) => {
      if (typeof localStorage === 'undefined') return;
      const scopedKey = `${scope}:${key}`;

      let parsedVal = value;
      try {
         parsedVal = JSON.parse(value);
      } catch(e) {}

      const enveloped = encodeVersionedEnvelope(parsedVal);
      localStorage.setItem(scopedKey, enveloped);
      // Keep legacy backup in case of rollback
      localStorage.setItem(key, value);
    },
    removeItem: (key: string) => {
      if (typeof localStorage === 'undefined') return;
      const scopedKey = `${scope}:${key}`;
      localStorage.removeItem(scopedKey);
      // Also remove legacy backup
      localStorage.removeItem(key);
    }
  };
}

export function getScopedIdbKey(scope: string, dbName: string): string {
  if (!dbName.startsWith(`${scope}_`)) {
    return `${scope}_${dbName}`;
  }
  return dbName;
}
