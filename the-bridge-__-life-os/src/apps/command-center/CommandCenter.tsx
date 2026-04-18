/** CommandCenter — Main Hub for A Space OS (3-column layout) */
import { useState, useContext, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { AIPanel } from './AIPanel';
import { DashboardPage } from './pages/DashboardPage';
import { AgentsPage } from './pages/AgentsPage';
import { useShellStore } from '../../stores/shell.store';
import { WindowContext } from '../../contexts/WindowContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CommandCenter() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aiPanelOpen, setAiPanelOpen] = useState(true);
  const { setActivePage: setBreadcrumb } = useContext(WindowContext);
  const openApp = useShellStore(s => s.openApp);

  useEffect(() => {
    const label = activePage === 'dashboard' ? 'Dashboard' : activePage.charAt(0).toUpperCase() + activePage.slice(1);
    setBreadcrumb(label);
  }, [activePage, setBreadcrumb]);
  
  // Internal page router
  const renderPage = () => {
    switch(activePage) {
      case 'dashboard': return <DashboardPage />;
      case 'agents':    return <AgentsPage />;
      default: return (
        <div className="flex flex-col items-center justify-center h-full gap-6 p-8 text-center">
          <div className="w-20 h-20 rounded-3xl glass-card flex items-center justify-center text-3xl shadow-2xl border-white/10">🚧</div>
          <div className="max-w-md">
            <h2 className="text-xl font-bold text-[var(--theme-text)] uppercase tracking-[0.2em] font-outfit mb-2">{activePage} Protocol</h2>
            <p className="text-sm text-[var(--theme-text)]/40 leading-relaxed mb-6">This area is currently synchronizing with A2 ship databases.</p>
            <button 
              onClick={() => openApp(activePage, activePage.toUpperCase())}
              className="px-6 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest hover:bg-emerald-500/30 transition-all"
            >
              Open in App Window →
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex h-full bg-black/20 backdrop-blur-md overflow-hidden min-h-[500px]">
      {/* Column 1: Navigation Sidebar */}
      <aside className={`border-r border-white/5 shrink-0 bg-black/10 relative transition-all duration-300 ${sidebarOpen ? 'w-[200px]' : 'w-0 overflow-hidden'}`}>
        {sidebarOpen && (
          <Sidebar 
            activePage={activePage} 
            onNavigate={setActivePage} 
            onOpenApp={(appId, label) => openApp(appId, label)}
          />
        )}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-[var(--theme-text)]/40 hover:text-[var(--theme-text)]/80 hover:bg-black/80 transition-all shadow-xl"
        >
          {sidebarOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>
      </aside>

      {/* Column 2: Main Content Area */}
      <main className="flex-1 overflow-auto custom-scrollbar relative bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="h-full min-h-[500px]">
          {renderPage()}
        </div>
      </main>

      {/* Column 3: AI Context Panel */}
      <aside className={`border-l border-white/5 p-3 shrink-0 bg-black/30 relative transition-all duration-300 ${aiPanelOpen ? 'w-[320px]' : 'w-0 overflow-hidden p-0'}`}>
        <button 
          onClick={() => setAiPanelOpen(!aiPanelOpen)}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-[var(--theme-text)]/40 hover:text-[var(--theme-text)]/80 hover:bg-black/80 transition-all shadow-xl"
        >
          {aiPanelOpen ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
        {aiPanelOpen && <AIPanel activePage={activePage} />}
      </aside>
    </div>
  );
}

