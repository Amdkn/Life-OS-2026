/** LD-Router — Unified entry point for cross-LD operations (ADR-FWK-020) */
import { 
  ld01DB, ld02DB, ld03DB, ld04DB, 
  ld05DB, ld06DB, ld07DB, ld08DB,
  DomainDB
} from './idb';

export type LDId = 'ld01' | 'ld02' | 'ld03' | 'ld04' | 'ld05' | 'ld06' | 'ld07' | 'ld08';
export type LDStore = 'projects' | 'areas' | 'resources' | 'archives' | 'items' | 'metrics' | 'metadata';
export type LDAction = 'add' | 'update' | 'delete';

const domainMap: Record<LDId, DomainDB> = {
  ld01: ld01DB,
  ld02: ld02DB,
  ld03: ld03DB,
  ld04: ld04DB,
  ld05: ld05DB,
  ld06: ld06DB,
  ld07: ld07DB,
  ld08: ld08DB
};

// Permissions Matrix (ADR-FWK-020)
// R = Read, W = Write
type Permission = 'R' | 'W';
const PERMISSIONS: Record<string, Partial<Record<LDId, Permission[]>>> = {
  para: { 
    ld01: ['R', 'W'], ld02: ['R', 'W'], ld03: ['R', 'W'], ld04: ['R', 'W'],
    ld05: ['R', 'W'], ld06: ['R', 'W'], ld07: ['R', 'W'], ld08: ['R', 'W'] 
  },
  ikigai: { 
    ld01: ['R'], ld02: ['R'], ld03: ['R'], ld04: ['R'],
    ld05: ['R'], ld06: ['R'], ld07: ['R'], ld08: ['R'] 
  },
  gtd: { 
    ld01: ['R', 'W'], ld03: ['R', 'W'], ld04: ['R', 'W'], ld05: ['R', 'W'], ld06: ['R', 'W'] 
  },
  '12wy': { 
    ld01: ['R', 'W'], ld02: ['R'], ld03: ['R'], ld04: ['R'],
    ld05: ['R'], ld06: ['R'], ld07: ['R'], ld08: ['R']
  },
  wheel: { 
    ld01: ['R'], ld02: ['R'], ld03: ['R'], ld04: ['R'],
    ld05: ['R'], ld06: ['R'], ld07: ['R'], ld08: ['R']
  },
  deal: { 
    ld01: ['R'], ld02: ['R'], ld03: ['R'], ld04: ['R'],
    ld05: ['R'], ld06: ['R'], ld07: ['R'], ld08: ['R']
  }
};

/** Unified write operation with permission check */
export async function writeToLD(
  ldId: LDId, 
  store: LDStore, 
  action: LDAction, 
  data: any, 
  caller: string
): Promise<void> {
  const perms = PERMISSIONS[caller]?.[ldId];
  
  if (!perms?.includes('W')) {
    throw new Error(`[LD-Router] Permission Denied: ${caller} cannot write to ${ldId}`);
  }

  const db = domainMap[ldId];
  if (!db) throw new Error(`[LD-Router] Unknown Life Domain: ${ldId}`);

  switch (action) {
    case 'add':
    case 'update':
      await db.put(store, data);
      break;
    case 'delete':
      await db.delete(store, data.id || data); // data can be the id itself
      break;
  }

  console.info(`[LD-Router] ${caller} performed ${action} on ${ldId}/${store}`);
}

/** Unified read operation */
export async function readFromLD<T>(
  ldId: LDId, 
  store: LDStore
): Promise<T[]> {
  const db = domainMap[ldId];
  if (!db) throw new Error(`[LD-Router] Unknown Life Domain: ${ldId}`);
  
  return await db.getAll<T>(store);
}
