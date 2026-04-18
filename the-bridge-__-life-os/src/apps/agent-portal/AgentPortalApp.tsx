/** Agent Portal App — Unified Framework & Fleet Command (V0.2.0) */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAgentsStore } from '../../stores/agents.store';
import { FRAMEWORKS, PEPITES, SIDEBAR_FOOTER } from '../../constants';

// Internal Components
import SideNav from './components/SideNav';
import AgentStats from './components/AgentStats';
import Header from './components/Header';
import RelationDiagram from './components/RelationDiagram';
import CronsView from './components/CronsView';
import SkillsView from './components/SkillsView';
import ScoreCard from './components/dashboards/ScoreCard';
import FrameworkOverview from './components/dashboards/FrameworkOverview';

// Framework Dashboards
import IkigaiPillars from './components/dashboards/IkigaiPillars';
import IkigaiHorizons from './components/dashboards/IkigaiHorizons';
import LifeWheelDomains from './components/dashboards/LifeWheelDomains';
import TwelveWeekYear from './components/dashboards/TwelveWeekYear';
import ParaFramework from './components/dashboards/ParaFramework';
import GtdFramework from './components/dashboards/GtdFramework';
import DealFramework from './components/dashboards/DealFramework';

export default function AgentPortalApp() {
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('scorecard');
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null);

  const onNavigate = (id: string, subItem?: string) => {
    setActiveTab(id);
    setActiveSubItem(subItem || null);
  };

  const activeItem = [...FRAMEWORKS, ...PEPITES, ...SIDEBAR_FOOTER].find(item => item.id === activeTab);
  
  // SANITIZATION: If tab is invalid (e.g. 'agent-portal' or empty), force default dashboard
  const effectiveTab = (activeTab === 'scorecard' || activeItem) ? activeTab : 'scorecard';

  const renderContent = () => {
    switch (effectiveTab) {
      case 'relation':
        return <RelationDiagram />;
      case 'crons':
        return <CronsView />;
      case 'skills':
        return <SkillsView />;
      case 'scorecard':
      default:
        return <ScoreCard />;
    }

    if (activeItem && FRAMEWORKS.some(fw => fw.id === activeTab)) {
      if (activeSubItem) {
        if (activeTab === 'ikigai') {
          const pillarsList = ['Passion', 'Vocation', 'Mission', 'Profession'];
          if (pillarsList.includes(activeSubItem)) {
            return <IkigaiPillars activeSubItem={activeSubItem} />;
          }
          
          const horizonsList = ['SEP:Horizons (Vision)', 'H1 Observer', 'H3 Explorer', 'H10 Guardian', 'H30 Multi-Horizon', 'H90 Cycle Keeper'];
          if (horizonsList.includes(activeSubItem)) {
            return <IkigaiHorizons activeSubItem={activeSubItem} />;
          }
        }

        if (activeTab === 'life-wheel') {
          const domainsList = ['Carrière', 'Finance', 'Santé', 'Croissance', 'Relation', 'Famille', 'Loisir', 'Environnement'];
          if (domainsList.includes(activeSubItem)) {
            return <LifeWheelDomains activeSubItem={activeSubItem} />;
          }
        }

        if (activeTab === '12wy') {
          const twelyList = ['Vision', 'Planning', 'Process Control', 'Measurement', 'Time Use'];
          if (twelyList.includes(activeSubItem)) {
            return <TwelveWeekYear activeSubItem={activeSubItem} />;
          }
        }

        if (activeTab === 'para') {
          const paraList = ['Projects', 'Areas', 'Resources', 'Archive'];
          if (paraList.includes(activeSubItem)) {
            return <ParaFramework activeSubItem={activeSubItem} />;
          }
        }

        if (activeTab === 'gtd') {
          const gtdList = ['Capture', 'Clarify', 'Organize', 'Reflect', 'Engage'];
          if (gtdList.includes(activeSubItem)) {
            return <GtdFramework activeSubItem={activeSubItem} />;
          }
        }

        if (activeTab === 'deal') {
          const dealList = ['Definition', 'Elimination', 'Automation', 'Liberation'];
          if (dealList.includes(activeSubItem)) {
            return <DealFramework activeSubItem={activeSubItem} />;
          }
        }

        return (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-12 max-w-lg border-[var(--brass)] shadow-2xl"
            >
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4 opacity-10">
                {activeSubItem}
              </h2>
              <div className="w-24 h-24 rounded-3xl bg-[var(--glass-l2-bg)] border border-[var(--glass-border)] border-dashed mx-auto mb-8 flex items-center justify-center opacity-40">
                <span className="text-4xl font-bold">🚧</span>
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-4">Autonomous Vault Initializing</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed italic">
                Scanning IndexedDB / ASpace_OS_V2 for {activeSubItem} telemetry...
                <br/>
                <span className="text-[10px] uppercase font-black text-[var(--accent-warning)] tracking-widest mt-4 block">
                  Integration pending under "The Watcher" protocols.
                </span>
              </p>
            </motion.div>
          </div>
        );
      }
      return <FrameworkOverview data={activeItem as any} />;
    }

    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-12 max-w-lg border-[var(--brass)] shadow-2xl"
            >
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4 opacity-10">
                {activeItem?.label}
              </h2>
              <div className="w-24 h-24 rounded-3xl bg-[var(--glass-l2-bg)] border border-[var(--glass-border)] border-dashed mx-auto mb-8 flex items-center justify-center opacity-40">
                <span className="text-4xl font-bold">🚧</span>
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-4">Autonomous Vault Initializing</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed italic">
                Scanning IndexedDB / ASpace_OS_V2 for {activeItem?.label} telemetry...
                <br/>
                <span className="text-[10px] uppercase font-black text-[var(--accent-warning)] tracking-widest mt-4 block">
                  Integration pending under "The Watcher" protocols.
                </span>
              </p>
            </motion.div>
          </div>
        );
  };

  return (
    <div className="flex h-full bg-[#020617] overflow-hidden selection:bg-[var(--brass)] selection:text-black rounded-b-2xl">
      {/* Left Sidebar: Frameworks */}
      <SideNav 
        isCollapsed={isLeftCollapsed} 
        onToggle={() => setIsLeftCollapsed(!isLeftCollapsed)} 
        activeId={activeTab}
        onNavigate={onNavigate}
      />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <Header activeId={activeTab} onNavigate={onNavigate} />
        
        <div className="flex-1 overflow-hidden relative bg-black/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--glass-bg-hover)_0%,_transparent_70%)] pointer-events-none" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${activeSubItem || 'overview'}`}
              initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
              transition={{ duration: 0.1, ease: 'linear' }}
              className="h-full relative z-0 custom-scrollbar overflow-y-auto"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Right IA Panel: Armada */}
      <AgentStats 
        isCollapsed={isRightCollapsed} 
        onToggle={() => setIsRightCollapsed(!isRightCollapsed)} 
      />
    </div>
  );
}


