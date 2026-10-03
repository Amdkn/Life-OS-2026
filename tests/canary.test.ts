import assert from 'node:assert/strict';
import { runCanary, type CanaryAdapter } from '../scripts/run-canary.ts';

class MemoryAdapter implements CanaryAdapter {
  row: Record<string, any> | null = null;
  constructor(private readonly userId: string | null = 'user-1') {}

  async currentUserId() {
    return this.userId;
  }

  async insertOwned(row: Record<string, unknown>) {
    this.row = { ...row };
    return { ...this.row };
  }

  async read(id: string) {
    return this.row?.id === id ? { ...this.row } : null;
  }

  async conditionalUpdate(id: string, expectedVersion: number, patch: Record<string, unknown>) {
    if (!this.row || this.row.id !== id || Number(this.row.version) !== expectedVersion) {
      return null;
    }
    this.row = { ...this.row, ...patch };
    return { ...this.row };
  }

  async deleteOwned(id: string) {
    if (!this.row || this.row.id !== id) return false;
    this.row = null;
    return true;
  }
}


async function main() {
  process.env.GWS_CAPABILITY_ENABLED = 'true';
  process.env.NODE_ENV = 'test';

  {
    const packet = await runCanary(new MemoryAdapter(), 'test-pass');
    assert.equal(packet.status, 'PASS');
    assert.deepEqual(packet.versions, [0, 1, 2]);
    assert.equal(packet.readback, true);
    assert.equal(packet.stale_update_blocked, true);
    assert.equal(packet.tombstone_readback, true);
    assert.equal(packet.stale_resurrection_blocked, true);
    assert.equal(packet.cleanup, 'DELETED');
    assert.ok(packet.user_id_sha256);
    assert.equal(packet.user_id_sha256?.includes('user-1'), false);
  }

  {
    const packet = await runCanary(new MemoryAdapter(null), 'test-auth');
    assert.equal(packet.status, 'AUTH_REQUIRED');
    assert.equal(packet.error, 'LOCAL_AUTH_SESSION_REQUIRED');
    assert.equal(packet.record_id, null);
  }

  console.log('Terra #90 canary control-flow tests: PASS');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
