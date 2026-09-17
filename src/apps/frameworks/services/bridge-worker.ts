import { vesselConfigs } from '../../../config/vessels.config';
import { syncFrameworkStateToBlackboard } from './frameworks-blackboard-bridge';

// Background worker to periodically sync framework state
export function startBridgeWorker(intervalMs: number = 30000) {
  let isSyncing = false;

  const sync = async () => {
    if (isSyncing) return;
    isSyncing = true;

    try {
      for (const vessel of vesselConfigs) {
        await syncFrameworkStateToBlackboard(vessel);
      }
    } catch (e) {
      console.error('[Bridge Worker] Sync failed', e);
    } finally {
      isSyncing = false;
    }
  };

  // Initial sync
  sync();

  // Setup interval
  const interval = setInterval(sync, intervalMs);
  return () => clearInterval(interval);
}
