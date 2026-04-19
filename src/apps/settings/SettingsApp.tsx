import React, { useState } from 'react';
import { 
  Palette, 
  User, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Monitor,
  Search,
  CircleDot,
  Globe,
  Target,
  Settings as SettingsIcon,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WallpaperUploader } from './components/WallpaperUploader';
import { WallpaperGrid } from './components/WallpaperGrid';
import { ThemeSelector } from './components/ThemeSelector';
import { ProfileEditor } from './components/ProfileEditor';
import { DomainConfigurator } from './components/DomainConfigurator';
import { ConnectorCard } from './components/ConnectorCard';
import { ModelRouter } from './components/ModelRouter';
import { StateManagerPanel } from './components/StateManagerPanel';
import { VetoRuleEditor } from './components/VetoRuleEditor';
import { PermissionMatrix } from './components/PermissionMatrix';
import { useFleetGatewayStore } from '../../stores/fleet-gateway.store';

type Section = 'environment' | 'identity' | 'fleet' | 'storage' | 'permissions';

export const SettingsApp: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('environment');
  const { connectors } = useFleetGatewayStore();

  const SECTIONS = [
    { id: 'environment', label: 'Environment', icon: Monitor, color: 'text-[var(--theme-accent)]' },
    { id: 'identity', label: 'Zora Core', icon: User, color: 'text-[var(--theme-accent)]' },
    { id: 'fleet', label: 'Fleet Gateway', icon: Cpu, color: 'text-[var(--theme-accent)]' },
    { id: 'storage', label: 'Memory State', icon: Database, color: 'text-[var(--theme-accent)]' },
    { id: 'permissions', label: 'Doctrine Beth', icon: ShieldCheck, color: 'text-[var(--theme-accent)]' },
  ];

  return (
    <div className="flex h-full bg-[var(--theme-bg)]/40 backdrop-blur-xl text-[var(--theme-text)] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-4 gap-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--theme-accent)]/20 flex items-center justify-center border border-[var(--theme-accent)]/30">
            <SettingsIcon className="w-4 h-4 text-[var(--theme-accent)]" />
          </div>
          <span className="font-bold tracking-tight text-[var(--theme-text)]/90">SETTINGS</span>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {SECTIONS.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as Section)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group
                ${activeSection === section.id ? 'bg-white/10 text-[var(--theme-text)] shadow-lg' : 'text-[var(--theme-text)]/40 hover:text-[var(--theme-text)]/60 hover:bg-white/5'}
              `}
            >
              <section.icon className={`w-4 h-4 ${activeSection === section.id ? section.color : ''}`} />
              <span className="text-sm font-medium flex-1 text-left">{section.label}</span>
              {activeSection === section.id && (
                <motion.div layoutId="active-indicator">
                   <ChevronRight className="w-3 h-3 text-[var(--theme-text)]/20" />
                </motion.div>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-4xl"
          >
            {activeSection === 'environment' && (
              <div className="space-y-10">
                <header>
                  <h1 className="text-2xl font-bold text-[var(--theme-text)] mb-2">Environment & VFS</h1>
                  <p className="text-sm text-[var(--theme-text)]/40">Customize your desktop appearance and Solarpunk aesthetic.</p>
                </header>

                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[var(--theme-text)]/30 uppercase tracking-widest">
                    <Palette className="w-3 h-3" />
                    Visual Theme
                  </div>
                  <ThemeSelector />
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[var(--theme-text)]/30 uppercase tracking-widest">
                    <Monitor className="w-3 h-3" />
                    Wallpapers
                  </div>
                  <WallpaperUploader />
                  <WallpaperGrid />
                </section>
              </div>
            )}

            {activeSection === 'identity' && (
              <div className="space-y-10">
                <header>
                  <h1 className="text-2xl font-bold text-[var(--theme-text)] mb-2">Zora Core Identity</h1>
                  <p className="text-sm text-[var(--theme-text)]/40">Manage ship commander credentials and domain configuration.</p>
                </header>

                <section className="space-y-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest">
                    <User className="w-3 h-3" />
                    User Profile
                  </div>
                  <ProfileEditor />
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest">
                    <CircleDot className="w-3 h-3" />
                    Life Wheel Domains
                  </div>
                  <DomainConfigurator />
                </section>
              </div>
            )}

            {activeSection === 'fleet' && (
              <div className="space-y-10">
                <header>
                  <h1 className="text-2xl font-bold text-[var(--theme-text)] mb-2">Fleet Gateway & Routing</h1>
                  <p className="text-sm text-[var(--theme-text)]/40">Configure AI connectors and model allocation per agent strata.</p>
                </header>

                <section className="space-y-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-widest">
                    <Globe className="w-3 h-3" />
                    AI Connectors
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {connectors.map(c => <ConnectorCard key={c.id} connector={c} />)}
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-widest">
                    <Target className="w-3 h-3" />
                    Model Allocation Table
                  </div>
                  <ModelRouter />
                </section>
              </div>
            )}

            {activeSection === 'storage' && (
              <div className="space-y-10">
                <header>
                  <h1 className="text-2xl font-bold text-[var(--theme-text)] mb-2">Memory State & Sovereignty</h1>
                  <p className="text-sm text-[var(--theme-text)]/40">Manage local data persistence, backups, and system diagnostics.</p>
                </header>

                <section className="space-y-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
                    <Database className="w-3 h-3" />
                    Storage Overview & Backups
                  </div>
                  <StateManagerPanel />
                </section>
              </div>
            )}

            {activeSection === 'permissions' && (
              <div className="space-y-10">
                <header>
                  <h1 className="text-2xl font-bold text-[var(--theme-text)] mb-2">Doctrine Beth & Permissions</h1>
                  <p className="text-sm text-[var(--theme-text)]/40">Configure action vetoes and agent permission levels.</p>
                </header>

                <section className="space-y-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-widest">
                    <ShieldCheck className="w-3 h-3" />
                    Veto Protocols
                  </div>
                  <VetoRuleEditor />
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-widest">
                    <ShieldCheck className="w-3 h-3" />
                    Agent Permission Matrix
                  </div>
                  <PermissionMatrix />
                </section>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

