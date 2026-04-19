/** Deep Linker — parses aspace:// protocols and routes them to OS actions */
import { useShellStore } from '../../stores/shell.store';
import { getApp } from '../app-registry';

/**
 * Supported protocols:
 * - aspace://app/[app-id]
 * - aspace://app/[app-id]?view=[view-id]
 */
export function useDeepLink() {
  const openApp = useShellStore(s => s.openApp);
  const addToast = useShellStore(s => s.addToast);

  const handleDeepLink = (url: string) => {
    try {
      if (!url.startsWith('aspace://')) return;

      const uri = new URL(url.replace('aspace://', 'http://')); // Mock for parsing
      const pathParts = uri.pathname.split('/').filter(Boolean);

      if (pathParts[0] === 'app' && pathParts[1]) {
        const appId = pathParts[1];
        const app = getApp(appId);

        if (app) {
          openApp(appId, app.name);
          
          // Future: pass searchParams to the app via a temporary deep-link store or props
          const view = uri.searchParams.get('view');
          if (view) {
            console.info(`A'Space: Deep link routing to app ${appId} with view ${view}`);
          }
        } else {
          addToast({
            source: 'Kernel Router',
            message: `Unrecognized application: ${appId}`,
            type: 'error'
          });
        }
      }
    } catch (err) {
      console.error("A'Space: Malformed deep link", err);
    }
  };

  return { handleDeepLink };
}
