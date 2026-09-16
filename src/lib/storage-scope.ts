import { encodeVersionedEnvelope, decodeVersionedEnvelope } from './migrationDefensive';

const LAYOUT_KEY = 'aspace-shell-layout-v1';

export function createScopedStorage(scope: string) {
  return {
    getItem: (key: string) => localStorage.getItem(`${scope}:${key}`),
    setItem: (key: string, value: string) => localStorage.setItem(`${scope}:${key}`, value),
    removeItem: (key: string) => localStorage.removeItem(`${scope}:${key}`)
  };
}

let isInstalled = false;

export function installScopedStorage(scope: string) {
  if (isInstalled) return;
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;

  isInstalled = true;

  const originalGetItem = Storage.prototype.getItem;
  const originalSetItem = Storage.prototype.setItem;
  const originalRemoveItem = Storage.prototype.removeItem;

  Storage.prototype.getItem = function(key: string) {
    if (key === LAYOUT_KEY) {
      const scopedKey = `${scope}:${key}`;
      const scopedRaw = originalGetItem.call(this, scopedKey);

      if (scopedRaw !== null) {
        // Try decoding
        const decoded = decodeVersionedEnvelope<any>(scopedRaw);

        if (decoded === null) {
          // If null, it's corrupted or schema mismatch.
          // Clean it up silently.
          originalRemoveItem.call(this, scopedKey);
          return null; // Return null so store resets cleanly
        }

        // Return raw JSON payload to trick store.
        // shell.store.ts expects { version, state: { windows, vetoEngaged } }
        // BUT wait, shell.store.ts parse it again.
        // Our encodeVersionedEnvelope actually wraps the WHOLE thing in our envelope.
        // So decoded here is the JSON string that shell.store.ts stringified.
        return decoded;
      } else {
        // Fallback to raw key for legacy
        const legacyRaw = originalGetItem.call(this, key);
        return legacyRaw;
      }
    }
    return originalGetItem.call(this, key);
  };

  Storage.prototype.setItem = function(key: string, value: string) {
    if (key === LAYOUT_KEY) {
      const scopedKey = `${scope}:${key}`;
      // Wrap it in defensive envelope
      const enveloped = encodeVersionedEnvelope(value);
      originalSetItem.call(this, scopedKey, enveloped);
      // Keep legacy raw for rollback
      originalSetItem.call(this, key, value);
      return;
    }
    originalSetItem.call(this, key, value);
  };

  Storage.prototype.removeItem = function(key: string) {
    if (key === LAYOUT_KEY) {
      const scopedKey = `${scope}:${key}`;
      originalRemoveItem.call(this, scopedKey);
      // Also remove fallback
      originalRemoveItem.call(this, key);
      return;
    }
    originalRemoveItem.call(this, key);
  };
}
