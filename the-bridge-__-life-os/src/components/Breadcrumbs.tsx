/** Breadcrumbs — dynamic path trail for OS windows */
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface BreadcrumbsProps {
  appTitle: string;
  activePage?: string;
  onNavigate?: (index: number) => void;
  onBack?: () => void;
}

export function Breadcrumbs({ 
  appTitle,
  activePage = 'Dashboard',
  onNavigate = () => {},
  onBack = () => {} 
}: BreadcrumbsProps) {
  const path = [appTitle, activePage];
  
  return (
    <div className="flex items-center gap-2 h-full select-none overflow-hidden">
      <button
        onClick={onBack}
        className="p-1 rounded-md text-[var(--theme-text)]/30 hover:bg-white/5 hover:text-[var(--theme-text)]/80 transition-all active:scale-90"
        title="Go Back"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-3 bg-white/10 mx-1 shrink-0" />

      <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar whitespace-nowrap">
        {path.map((segment, i) => {
          const isLast = i === path.length - 1;
          return (
            <div key={i} className="flex items-center gap-1.5 shrink-0">
              {i > 0 && <ChevronRight className="w-3 h-3 text-[var(--theme-text)]/15" />}
              <button
                onClick={() => onNavigate(i)}
                disabled={isLast}
                className={`text-[10px] font-bold uppercase tracking-[0.15em] font-outfit transition-all duration-200 ${
                  isLast
                    ? 'text-emerald-400 cursor-default'
                    : 'text-[var(--theme-text)]/30 hover:text-[var(--theme-text)]/70 cursor-pointer hover:bg-white/5 px-1.5 py-0.5 rounded-md'
                }`}
              >
                {segment}
              </button>
            </div>
          );
        })}
      </nav>
    </div>
  );
}

