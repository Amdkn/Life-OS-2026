/** Desktop — main canvas with wallpaper, window rendering, and layout persistence */
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TopBar } from './TopBar';
import { Dock } from './Dock';
import { WindowFrame } from './WindowFrame';
import { ToastContainer } from './Toast';
import { AppDrawer } from './AppDrawer';
import { ViewportGuard } from './ViewportGuard';
import { ErrorBoundary } from './ErrorBoundary';
import { useShellStore } from '../stores/shell.store';
import { useOsSettingsStore } from '../stores/os-settings.store';
import { getApp, getAllApps } from '../lib/app-registry';
import { useWallpaper } from '../hooks/useWallpaper';
import { useSyncLD } from '../hooks/useSyncLD';

/* ═══ ABSOLUTE ZENITH — BYPASS ═══ */
import AgentPortalApp from '../apps/agent-portal/AgentPortalApp';

/* 
   REGISTRY GUARD (Apex Nexus Line)
   Apps are now automatically discovered via import.meta.glob in app-registry.ts 
*/

export function Desktop() {
  const windows = useShellStore(s => s.windows);
  const restoreLayout = useShellStore(s => s.restoreLayout);
  const saveLayout = useShellStore(s => s.saveLayout);
  const openApp = useShellStore(s => s.openApp);
  const activeWallpaperId = useOsSettingsStore(s => s.activeWallpaperId);
  const wallpaper = useWallpaper();

  /* Global Data Synchronization (PARA x 8 Life Domains) */
  useSyncLD();

  // Debugging log for RCA
  console.log("[Desktop] Current Wallpaper ID:", activeWallpaperId);
  console.log("[Desktop] Resolved Wallpaper URL:", wallpaper);

  /* Restore layout on boot & Registry Diagnostic */
  useEffect(() => {
    // 🧿 APEX ZENITH — SESSION PURGE (One-time fix for Placeholder Loops)
    const PURGE_KEY = 'aspace-v11-purge';
    if (!localStorage.getItem(PURGE_KEY)) {
      console.warn("[Apex Zenith] LEGACY SESSION DETECTED. Purging stale state...");
      localStorage.removeItem('aspace-shell-v1');
      localStorage.setItem(PURGE_KEY, 'done');
      window.location.reload();
      return;
    }

    restoreLayout();
    
    // V0.11.0 Diagnostic Table
    const apps = getAllApps();
    console.log(`[Apex Zenith] Registry Active: ${apps.length} apps available.`);
    if (apps.length > 0) {
      console.table(apps.map(a => ({ id: a.id, name: a.name, version: a.version })));
    } else {
      console.error("[Apex Zenith] CRITICAL: Registry is empty. Static boot failed.");
    }
  }, [restoreLayout]);

  /* Deep-Link Listener (Nexus Fuzzy Routing — ADR-FWK-025) */
  useEffect(() => {
    try {
      const path = window.location.pathname;
      if (path.startsWith('/App/')) {
        const appIdRaw = path.split('/App/')[1];
        if (!appIdRaw) return;

        const cleanRequestId = appIdRaw.split('/')[0].split('?')[0].toLowerCase().replace(/-/g, '');
        
        // Fetch all apps and find fuzzy match
        const allApps = getAllApps();
        const matchedApp = allApps.find(app => 
          app.id.toLowerCase().replace(/-/g, '') === cleanRequestId
        );

        if (matchedApp) {
          console.info(`[Nexus Router] Fuzzy match found: ${matchedApp.name} (${matchedApp.id})`);
          // Delaying slightly to ensure shell is ready and prevent mount-clash
          const timer = setTimeout(() => {
            openApp(matchedApp.id, matchedApp.name);
          }, 100);
          return () => clearTimeout(timer);
        } else {
          console.warn(`[Nexus Router] No registry match for request: ${cleanRequestId}`);
        }
      }
    } catch (err) {
      console.error("[Nexus Router] Routing engine failure:", err);
    }
  }, [openApp]);


  /* Save layout on unload */
  useEffect(() => {
    const handleUnload = () => saveLayout();
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [saveLayout]);


  return (
    <ViewportGuard>
      {/* 
        LAYER -10: DYNAMIC WALLPAPER SOCLE 
        Fixed to cover entire viewport, independent of UI flow.
      */}
      <div 
        key={activeWallpaperId}
        className="fixed inset-0 z-[-10] bg-cover bg-center bg-no-repeat transition-all duration-700 ease-in-out" 
        style={{ backgroundImage: `url(${wallpaper})` }}
      />

      {/* 
        LAYER -9: AMBIENT OVERLAY 
        Slight darkening for glassmorphism readability.
      */}
      <div className="fixed inset-0 z-[-9] bg-black/40 pointer-events-none" />

      {/* 
        LAYER 0: INTERFACE & WINDOWS 
        Transparent container allowing background to shine through.
      */}
      <div className="w-full h-screen overflow-hidden relative text-[var(--theme-text)] font-sans bg-transparent">
        <TopBar />

        {/* Window layer */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <AnimatePresence>
            {windows.map(win => {
              if (win.id === 'drawer' || !win.isOpen) return null;
              
              // 1. Precise lookup
              let app = getApp(win.id);
              
              // 2. Fuzzy fallback (Antifragile ID check & Auto-Healing)
              if (!app) {
                const cleanWinId = win.id.toLowerCase().replace(/-/g, '');
                const allApps = getAllApps();
                const matchedApp = allApps.find(a => a.id.toLowerCase().replace(/-/g, '') === cleanWinId);
                
                if (matchedApp) {
                  app = matchedApp;
                  // Auto-Healing: Silently update the window ID in the store to the canonical ID
                  setTimeout(() => {
                    useShellStore.getState().closeApp(win.id);
                    useShellStore.getState().openApp(matchedApp.id, matchedApp.id);
                    console.info(`[Apex Healing] Repaired window ID: ${win.id} -> ${matchedApp.id}`);
                  }, 0);
                }
              }

              // 🧿 ABSOLUTE ZENITH V2 — DOUBLE-BLIND BYPASS OVERRIDE
              // We check both Window ID and Window Title. 
              // If either matches 'Agent Portal', we FORCIBLY inject the direct import as a failsafe.
              const cleanId = win.id.toLowerCase().replace(/-/g, '');
              const cleanTitle = win.title.toLowerCase().replace(/-/g, '').replace(/\s/g, '');
              const isAgentPortal = cleanId.includes('agentportal') || cleanTitle.includes('agentportal');
              
              if (isAgentPortal && !app) {
                console.info(`[Apex Zenith V2] Forced Bypass Active (ID: ${win.id}, Title: ${win.title})`);
              }

              const ComponentType = app?.component || (isAgentPortal ? AgentPortalApp : null);

              return (
                <div key={win.id} className="pointer-events-auto">
                  <WindowFrame id={win.id} title={win.title}>
                    <ErrorBoundary>
                      {ComponentType ? (
                        <ComponentType />
                      ) : (
                        <PlaceholderApp id={win.id} title={win.title} />
                      )}
                    </ErrorBoundary>
                  </WindowFrame>
                </div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Global Overlays */}
        <ToastContainer />
        <AppDrawer />
        <Dock />
      </div>
    </ViewportGuard>
  );
}

/* ═══ Placeholder for unregistered apps ═══ */

function PlaceholderApp({ id, title }: { id?: string, title: string }) {
  const handleNuclearReset = () => {
    if (confirm("🚨 NUCLEAR SYSTEM RESET\n\nThis will clear your local session and reload the application. All windows will be closed. Continue?")) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-12">
      <div className="w-20 h-20 rounded-[32px] glass-card flex items-center justify-center text-3xl shadow-2xl border-white/10">🚧</div>
      <div>
        <h3 className="text-lg font-bold text-[var(--theme-text)] uppercase tracking-widest font-outfit mb-2">{title} Module</h3>
        <p className="text-[10px] opacity-30 font-mono mb-4">Internal ID: {id || 'unknown'}</p>
        <p className="text-sm text-[var(--theme-text)]/30 max-w-xs mx-auto mb-8">This area is currently being synthesized by A2 ship protocols. Deployment scheduled for Phase 2+.</p>
        
        <button 
          onClick={handleNuclearReset}
          className="px-8 py-3 rounded-xl bg-red-500 text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-red-500/20 hover:scale-105 active:scale-95 transition-all"
        >
          Nuclear System Reset
        </button>
      </div>
    </div>
  );
}

