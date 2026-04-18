/** PARA App — Unified Multi-Domain container (V0.4.1) */
import React, { useState, useMemo, useContext, useEffect } from 'react';
import { useParaStore, type Project } from '../../stores/fw-para.store';
import { useShellStore } from '../../stores/shell.store';
import { LD_TO_DOMAIN } from '../../utils/paraAdapter';
import ParaDashboard from './pages/Dashboard';
import { WindowContext } from '../../contexts/WindowContext';
import { AppNavBar, type NavItem } from '../../components/AppNavBar';
import { SidebarSearch } from '../../components/SidebarSearch';
import { HeaderFilterBar } from '../../components/HeaderFilterBar';
import { ProjectCard } from './components/ProjectCard';
import { ProjectCommandCard } from './components/ProjectCommandCard';
import { DomainCard } from './components/DomainCard';
import { ResourceCard } from './components/ResourceCard';
import { ItemModal } from './components/ItemModal';
import { useDealStore } from '../../stores/fw-deal.store';
import { 
  Plus, LayoutDashboard, Box, 
  Layers, Briefcase, Archive, Anchor, Zap, Wrench
} from 'lucide-react';

const paraNavItems: NavItem[] = [
  { id: 'overview',  label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects',  label: 'Projects',  icon: Layers },
  { id: 'areas',     label: 'Areas',     icon: Briefcase },
  { id: 'resources', label: 'Resources', icon: Box },
  { id: 'archives',  label: 'Archives',  icon: Archive },
];

const domainFilters = [
  { id: 'all', label: 'All Domains' },
  { id: 'ld01', label: 'Business' },
  { id: 'ld02', label: 'Finance' },
  { id: 'ld03', label: 'Health' },
  { id: 'ld04', label: 'Cognition' },
  { id: 'ld05', label: 'Relations' },
  { id: 'ld06', label: 'Habitat' },
  { id: 'ld07', label: 'Creativity' },
  { id: 'ld08', label: 'Impact' },
];

export default function ParaApp() {
  const { activeTab, setActiveTab, activeLdFilter, setActiveLdFilter, projects, resources, addProject, addResource } = useParaStore();
  const { absorbProjectAsFriction } = useDealStore();
  const openApp = useShellStore(s => s.openApp);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePillarFilter, setActivePillarFilter] = useState<string | null>(null);
  const { setActivePage } = useContext(WindowContext);


  useEffect(() => {
    const domainLabel = domainFilters.find(f => f.id === activeLdFilter)?.label || 'All';
    const tabLabel = activeTab === 'overview' ? 'Dashboard' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
    setActivePage(`${domainLabel} > ${tabLabel}`);
  }, [activeLdFilter, activeTab, setActivePage]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      // Improved domain matching for V0.4.1
      const domainMatch = activeLdFilter === 'all' || p.domain === LD_TO_DOMAIN[activeLdFilter];
      const statusMatch = activeTab === 'archives' ? p.status === 'archived' : p.status !== 'archived';
      const searchMatch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
      return domainMatch && statusMatch && searchMatch;
    });
  }, [projects, activeLdFilter, activeTab, searchQuery]);

  const areasFilteredProjects = useMemo(() => {
    return projects
      .filter(p => p.status !== 'archived')
      .filter(p => activePillarFilter ? p.pillars.includes(activePillarFilter) : true);
  }, [projects, activePillarFilter]);

  return (
    <div className="flex h-full bg-black/40 backdrop-blur-3xl font-outfit text-[var(--theme-text)] overflow-hidden selection:bg-emerald-500/30 relative">
      <aside className="w-64 border-r border-white/5 shrink-0 bg-black/40 flex flex-col">
        <AppNavBar items={paraNavItems} activeTab={activeTab} onTabChange={setActiveTab as any} accentColor="emerald" title="PARA" subtitle="Framework" titleIcon={Box} />
        <div className="mt-auto pb-6">
          <SidebarSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search PARA..." />
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-8 min-w-0">
            <h2 className="text-xl font-bold uppercase tracking-[0.4em] text-[var(--theme-text)]/80 shrink-0">{activeTab}</h2>
            <HeaderFilterBar items={domainFilters} activeFilter={activeLdFilter} onFilterChange={setActiveLdFilter as any} accentColor="emerald" scrollable />
          </div>
          {!['areas', 'archives', 'overview'].includes(activeTab) && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[var(--theme-accent)] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-emerald-500/20 transition-all active:scale-95 shadow-lg"
              style={{ color: 'var(--theme-accent)', backgroundColor: 'rgba(var(--theme-accent-rgb), 0.1)', borderColor: 'rgba(var(--theme-accent-rgb), 0.2)' }}
            >
              <Plus className="w-3.5 h-3.5" /> New {activeTab === 'resources' ? 'Resource' : 'Project'}
            </button>
          )}
        </header>

        <div className="flex-1 overflow-auto p-10 custom-scrollbar">
          {activeTab === 'overview' ? (
            <ParaDashboard embedded={false} />
          ) : activeTab === 'areas' ? (
            <div className="flex flex-col gap-8">
              {domainFilters.filter(f => f.id !== 'all' && (activeLdFilter === 'all' || f.id === activeLdFilter)).map(domain => {
                const domainLabel = domain.label.toLowerCase() as any;
                const dProjects = areasFilteredProjects.filter(p => p.domain === domainLabel);
                return (
                  <DomainCard 
                    key={domain.id} 
                    domain={domainLabel} 
                    activeProjects={dProjects} 
                    selectedPillar={activePillarFilter} 
                    onPillarSelect={setActivePillarFilter as any} 
                  />
                );
              })}
            </div>
          ) : activeTab === 'resources' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {resources.map(r => <ResourceCard key={r.id} resource={r} />)}
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map(project => (
                  <div key={project.id} className="relative group">
                    <ProjectCard project={project} onClick={setSelectedProject} />
                    {activeTab === 'archives' && (
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          absorbProjectAsFriction(project.id, project.title);
                          openApp('deal', 'DEAL'); 
                        }}
                        className="absolute bottom-4 right-4 p-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[8px] font-black uppercase opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5"
                      >
                        <Wrench className="w-3 h-3" /> Transfer to Spacedock
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {filteredProjects.length === 0 && (
                <div className="py-40 text-center opacity-20 flex flex-col items-center gap-4">
                  <Anchor className="w-12 h-12" />
                  <p className="text-[11px] uppercase tracking-[0.5em] font-bold">No items identified</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <ProjectCommandCard project={selectedProject} onClose={() => setSelectedProject(null)} />

      {isModalOpen && (
        <ItemModal 
          item={null} 
          type={activeTab === 'resources' ? 'Resource' : 'Project'}
          onClose={() => setIsModalOpen(false)}
          onSave={(ldId, data) => {
            if (activeTab === 'resources') {
              addResource({
                id: `res-${Date.now()}`,
                title: data.title || 'New Resource',
                type: 'other',
                category: 'General',
                domain: LD_TO_DOMAIN[ldId],
                linkedProjects: [],
                linkedPillars: []
              });
            } else {
              addProject({
                id: `prj-${Date.now()}`,
                title: data.title || 'New Project',
                status: 'active',
                domain: LD_TO_DOMAIN[ldId],
                pillars: [],
                resources: [],
                progress: 0
              });
            }
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
