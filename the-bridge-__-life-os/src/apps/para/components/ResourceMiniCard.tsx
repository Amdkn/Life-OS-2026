import React from 'react';
import type { Resource } from '../../../stores/fw-para.store';
import { ExternalLink, FileText, Video, Book, PenTool, Link as LinkIcon, X } from 'lucide-react';

export function ResourceMiniCard({ resource, onUnlink }: { resource: Resource, onUnlink?: () => void }) {
  const Icon = resource.type === 'video' ? Video : resource.type === 'book' ? Book : resource.type === 'tool' ? PenTool : resource.type === 'article' ? FileText : LinkIcon;
  
  return (
    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between group hover:border-[var(--theme-accent)]/30 transition-all">
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2 bg-[var(--theme-accent)]/10 rounded-lg text-[var(--theme-accent)] shrink-0">
          <Icon className="w-3.5 h-3.5" />
        </div>
        <div className="truncate pr-4">
          <p className="text-xs font-bold text-[var(--theme-text)]/80 truncate">{resource.title}</p>
          <span className="text-[9px] uppercase tracking-widest text-[var(--theme-text)]/30">{resource.type}</span>
        </div>
      </div>
      <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {resource.url && (
            <a href={resource.url} target="_blank" rel="noreferrer" className="p-1.5 hover:bg-white/10 rounded-md text-[var(--theme-text)]/40 hover:text-[var(--theme-accent)]">
              <ExternalLink className="w-3 h-3" />
            </a>
        )}
        {onUnlink && (
            <button onClick={onUnlink} className="p-1.5 hover:bg-rose-500/10 rounded-md text-[var(--theme-text)]/40 hover:text-rose-400">
               <X className="w-3 h-3" />
            </button>
        )}
      </div>
    </div>
  );
}
