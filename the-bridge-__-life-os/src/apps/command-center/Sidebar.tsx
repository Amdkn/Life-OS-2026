/** CC Sidebar — Navigation Hub with internal pages + framework links */
import { 
  LayoutDashboard, Compass, CircleDot, CalendarCheck, 
  FolderKanban, CheckSquare, Unlock, Users, ExternalLink 
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  onOpenApp: (appId: string, label: string) => void;
}

const internalPages = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
];

const frameworkLinks = [
  { id: 'ikigai',     icon: Compass,      label: 'Ikigai',     appId: 'ikigai' },
  { id: 'life-wheel', icon: CircleDot,    label: 'Life Wheel', appId: 'life-wheel' },
  { id: '12wy',       icon: CalendarCheck, label: '12WY',      appId: 'twelve-week' },
  { id: 'para',       icon: FolderKanban,  label: 'PARA',      appId: 'para' },
  { id: 'gtd',        icon: CheckSquare,   label: 'GTD',       appId: 'gtd' },
  { id: 'deal',       icon: Unlock,        label: 'DEAL',      appId: 'deal' },
];

const systemPages = [
  { id: 'agents', icon: Users, label: 'Agents' },
];

export function Sidebar({ activePage, onNavigate, onOpenApp }: SidebarProps) {
  return (
    <div className="w-full h-full flex flex-col gap-1 p-3">
      <h3 className="text-[10px] font-bold text-[var(--theme-text)]/30 uppercase tracking-[0.2em] px-3 mb-2">Navigation Hub</h3>
      
      {/* Internal CC pages */}
      {internalPages.map(item => (
        <SidebarButton key={item.id} item={item} isActive={activePage === item.id} onClick={() => onNavigate(item.id)} />
      ))}
      
      <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent my-2 mx-3" />
      
      {/* Framework app links — these open separate windows */}
      {frameworkLinks.map(item => (
        <SidebarButton key={item.id} item={item} isActive={false} onClick={() => onOpenApp(item.appId, item.label)} isExternal />
      ))}
      
      <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent my-2 mx-3" />
      
      {/* System pages */}
      {systemPages.map(item => (
        <SidebarButton key={item.id} item={item} isActive={activePage === item.id} onClick={() => onNavigate(item.id)} />
      ))}
    </div>
  );
}

function SidebarButton({ item, isActive, onClick, isExternal = false }: { 
  item: { icon: any; label: string }; isActive: boolean; onClick: () => void; isExternal?: boolean 
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 border w-full text-left ${
        isActive
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
          : 'border-transparent text-[var(--theme-text)]/40 hover:bg-white/5 hover:text-[var(--theme-text)]/60'
      }`}
    >
      <item.icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-inherit'}`} />
      <span className="text-xs font-bold font-outfit uppercase tracking-wider flex-1">{item.label}</span>
      {isExternal && <ExternalLink className="w-3 h-3 text-[var(--theme-text)]/15" />}
    </button>
  );
}

