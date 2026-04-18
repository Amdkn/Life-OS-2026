/** SidebarSearch — shared search input for app sidebars */
import { Search } from 'lucide-react';

interface SidebarSearchProps {
  placeholder?: string;
  value: string;
  onChange: (query: string) => void;
}

export function SidebarSearch({ placeholder = 'Search...', value, onChange }: SidebarSearchProps) {
  return (
    <div className="px-4 py-2 mt-2">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--theme-text)]/20 group-focus-within:text-emerald-400 transition-colors" />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-[11px] text-[var(--theme-text)]/80 focus:outline-none focus:border-emerald-500/30 transition-all placeholder:text-[var(--theme-text)]/20"
        />
      </div>
    </div>
  );
}

