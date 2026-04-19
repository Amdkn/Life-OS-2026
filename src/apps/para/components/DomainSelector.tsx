/** PARA Domain Selector — LD01-LD08 Filter (P5.4) */
import React from 'react';
import { useParaStore } from '../../../stores/fw-para.store';
import { LDId } from '../../../lib/ld-router';

const DOMAINS: { id: LDId | 'all', label: string }[] = [
  { id: 'all',  label: 'All Domains' },
  { id: 'ld01', label: 'Business' },
  { id: 'ld02', label: 'Finance' },
  { id: 'ld03', label: 'Health' },
  { id: 'ld04', label: 'Cognition' },
  { id: 'ld05', label: 'Relations' },
  { id: 'ld06', label: 'Habitat' },
  { id: 'ld07', label: 'Creativity' },
  { id: 'ld08', label: 'Impact' },
];

export function DomainSelector() {
  const { activeLdFilter, setActiveLdFilter } = useParaStore();

  return (
    <div className="flex gap-1 p-1 bg-white/5 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar max-w-sm">
      {DOMAINS.map(domain => (
        <button
          key={domain.id}
          onClick={() => setActiveLdFilter(domain.id)}
          className={`px-3 py-1 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
            activeLdFilter === domain.id 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
              : 'text-[var(--theme-text)]/30 hover:bg-white/5 hover:text-[var(--theme-text)]/60'
          }`}
        >
          {domain.label}
        </button>
      ))}
    </div>
  );
}

