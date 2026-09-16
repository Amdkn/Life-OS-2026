import React, { useState, useMemo } from 'react';
import { useParaStore, type ResourceType } from '../../../stores/fw-para.store';
import { ResourceCard } from './ResourceCard';
import { Search, Filter, Anchor } from 'lucide-react';

const RESOURCE_TYPES: { id: ResourceType | 'all', label: string }[] = [
  { id: 'all', label: 'All Types' },
  { id: 'book', label: 'Books' },
  { id: 'tool', label: 'Tools' },
  { id: 'contact', label: 'Contacts' },
  { id: 'template', label: 'Templates' },
  { id: 'course', label: 'Courses' },
  { id: 'article', label: 'Articles' },
  { id: 'video', label: 'Videos' },
  { id: 'sop', label: 'SOPs' },
  { id: 'blueprint', label: 'Blueprints' },
  { id: 'guide', label: 'Guides' },
  { id: 'legal', label: 'Legal' },
  { id: 'fiscal', label: 'Fiscal' },
  { id: 'archive', label: 'Archives' },
  { id: 'other', label: 'Other' },
];

export function ResourcesView() {
  const { resources } = useParaStore();
  const resourceSearchQuery = useParaStore(s => s.resourceSearchQuery);
  const setResourceSearchQuery = useParaStore(s => s.setResourceSearchQuery);
  const resourceActiveType = useParaStore(s => s.resourceActiveType);
  const setResourceActiveType = useParaStore(s => s.setResourceActiveType);
  const getFilteredResources = useParaStore(s => s.getFilteredResources);

  const filteredResources = getFilteredResources();

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-text)]/40" />
          <input
            type="text"
            placeholder="Search resources by title or tag..."
            value={resourceSearchQuery}
            onChange={(e) => setResourceSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-[var(--theme-text)] outline-none focus:border-emerald-500/40 transition-all placeholder-[var(--theme-text)]/20"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-auto">
          {RESOURCE_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => setResourceActiveType(type.id)}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${
                resourceActiveType === type.id
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-white/5 text-[var(--theme-text)]/40 border-white/10 hover:bg-white/10 hover:text-[var(--theme-text)]/60'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {filteredResources.map(r => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-20 gap-4">
            <Anchor className="w-12 h-12" />
            <p className="text-[11px] uppercase tracking-[0.5em] font-bold">No resources found</p>
          </div>
        )}
      </div>
    </div>
  );
}
