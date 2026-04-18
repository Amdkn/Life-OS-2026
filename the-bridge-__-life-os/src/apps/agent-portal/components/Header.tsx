import React, { useState } from 'react';
import { PEPITES } from '../../../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Bell, User, Eye, ChevronDown } from 'lucide-react';
import { useOsSettingsStore } from '../../../stores/os-settings.store';
import { motion, AnimatePresence } from 'motion/react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const LD_DOMAINS = [
  { id: 'all', label: 'Universal (All)', color: 'var(--brass)' },
  { id: 'ld01', label: 'LD01 Business', color: '#fbbf24' },
  { id: 'ld02', label: 'LD02 Finance', color: '#10b981' },
  { id: 'ld03', label: 'LD03 Health', color: '#ef4444' },
  { id: 'ld04', label: 'LD04 Growth', color: '#8b5cf6' },
  { id: 'ld05', label: 'LD05 Social', color: '#3b82f6' },
  { id: 'ld06', label: 'LD06 Family', color: '#f43f5e' },
  { id: 'ld07', label: 'LD07 Play', color: '#64748b' },
  { id: 'ld08', label: 'LD08 Impact', color: '#14b8a6' },
];

interface HeaderProps {
  activeId: string;
  onNavigate: (id: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeId, onNavigate }) => {
  const { activeLdFilter, setActiveLdFilter } = useOsSettingsStore();
  const [isLdMenuOpen, setIsLdMenuOpen] = useState(false);

  const selectedLd = LD_DOMAINS.find(ld => ld.id === activeLdFilter) || LD_DOMAINS[0];

  return (
    <header className="h-[var(--header-height)] glass border-b border-[var(--glass-border)] flex items-center justify-between px-6 z-30 sticky top-0 shadow-lg">
      <div className="flex items-center gap-6 overflow-hidden max-w-[75%]">
        <div className="flex items-center gap-2 group cursor-pointer">
          <Eye className="w-5 h-5 text-[var(--brass)] group-hover:animate-pulse" />
        </div>
        
        <div className="h-6 w-[1px] bg-[var(--glass-border)] shrink-0" />
        
        <nav className="flex items-center gap-1 overflow-x-auto custom-scrollbar no-scrollbar scroll-smooth">
          {PEPITES.map((pepite) => {
            const Icon = pepite.icon;
            const isActive = activeId === pepite.id;
            
            return (
              <button
                key={pepite.id}
                onClick={() => onNavigate(pepite.id)}
                className={cn(
                  "px-4 py-1.5 rounded-full flex items-center gap-2 transition-all duration-300 relative group overflow-hidden shrink-0",
                  isActive ? "bg-[var(--glass-bg-active)]" : "hover:bg-[var(--glass-bg-hover)]"
                )}
              >
                <Icon className={cn(
                  "w-3.5 h-3.5 transition-colors",
                  isActive ? "text-[var(--brass)]" : "text-[var(--text-muted)] group-hover:text-white"
                )} />
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest whitespace-nowrap",
                  isActive ? "text-white" : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"
                )}>
                  {pepite.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--brass)] to-transparent" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="h-6 w-[1px] bg-[var(--glass-border)] shrink-0 mx-2" />
        
        {/* Universal LD Filter (V0.9 Nexus) */}
        <div className="relative shrink-0">
          <button 
            onClick={() => setIsLdMenuOpen(!isLdMenuOpen)}
            className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-1.5 hover:bg-white/10 transition-all group"
          >
            <div 
              className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]" 
              style={{ backgroundColor: selectedLd.color, color: selectedLd.color }} 
            />
            <span className="text-[10px] font-black text-white uppercase tracking-widest group-hover:text-[var(--brass)] transition-colors">
              {selectedLd.label}
            </span>
            <ChevronDown className={cn("w-3 h-3 text-white/30 transition-transform", isLdMenuOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {isLdMenuOpen && (
              <>
                {/* Backdrop to close menu */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsLdMenuOpen(false)} 
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full mt-2 left-0 w-56 glass-l3 border border-white/10 p-2 shadow-2xl z-50 rounded-2xl"
                >
                  <div className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30 px-3 py-2 mb-1">
                    Select Transversal Domain
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {LD_DOMAINS.map((ld) => (
                      <button
                        key={ld.id}
                        onClick={() => {
                          setActiveLdFilter(ld.id);
                          setIsLdMenuOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left group",
                          activeLdFilter === ld.id ? "bg-white/10" : "hover:bg-white/5"
                        )}
                      >
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: ld.color }} 
                        />
                        <span className={cn(
                          "text-[10px] font-bold uppercase tracking-widest transition-colors",
                          activeLdFilter === ld.id ? "text-white" : "text-white/40 group-hover:text-white/80"
                        )}>
                          {ld.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-[var(--glass-bg-hover)] text-[var(--text-muted)] hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[var(--accent-danger)] rounded-full shadow-[0_0_5px_var(--accent-danger)]" />
          </button>
          
          <div className="h-6 w-[1px] bg-[var(--glass-border)]" />
          
          <div className="flex items-center gap-3 pl-1">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] font-black text-white tracking-[.1em] uppercase leading-tight">Amadeus</div>
              <div className="text-[9px] text-[var(--brass)] font-black uppercase tracking-widest opacity-80 italic leading-none">A0 Overseer</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--brass)] to-[var(--copper)] p-[1px] shadow-lg">
              <div className="w-full h-full rounded-[10px] bg-[#020617] flex items-center justify-center">
                <User className="w-5 h-5 text-[var(--brass)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
