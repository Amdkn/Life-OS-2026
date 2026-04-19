/** PARA Sidebar — navigation between Projects, Areas, Resources, Archives */
import { FolderKanban, Globe, Database, Archive } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
}

const tabs = [
  { id: 'projects',  icon: FolderKanban, label: 'Projects' },
  { id: 'areas',     icon: Globe,        label: 'Areas' },
  { id: 'resources', icon: Database,     label: 'Resources' },
  { id: 'archives',  icon: Archive,      label: 'Archives' },
];

export function Sidebar({ activeTab, onNavigate }: SidebarProps) {
  return (
    <div className="w-full h-full flex flex-col gap-1 p-3">
      <h3 className="text-[10px] font-bold text-[var(--theme-text)]/30 uppercase tracking-[0.2em] px-3 mb-2">PARA Structure</h3>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onNavigate(tab.id)}
          className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 border ${
            activeTab === tab.id
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'border-transparent text-[var(--theme-text)]/40 hover:bg-white/5 hover:text-[var(--theme-text)]/60'
          }`}
        >
          <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-emerald-400' : 'text-inherit'}`} />
          <span className="text-xs font-bold font-outfit uppercase tracking-widest">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

