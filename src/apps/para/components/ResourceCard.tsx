/** ResourceCard — grid item for PARA resources (V0.2.6) */
import { Box, Book, Wrench, Users, FileText, Video, PlayCircle } from 'lucide-react';
import type { Resource } from '../../../stores/fw-para.store';

const typeIcons: Record<string, any> = {
  book: Book,
  tool: Wrench,
  contact: Users,
  template: FileText,
  course: PlayCircle,
  article: FileText,
  video: Video,
  other: Box
};

export function ResourceCard({ resource }: { resource: Resource }) {
  const Icon = typeIcons[resource.type] || Box;

  return (
    <div className="glass-card rounded-3xl p-6 bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-all group hover:border-emerald-500/20 shadow-xl flex flex-col h-full">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all">
          <Icon className="w-5 h-5 text-[var(--theme-text)]/20 group-hover:text-emerald-400 transition-colors" />
        </div>
        <div>
          <h4 className="text-[11px] font-bold text-[var(--theme-text)]/80 uppercase tracking-widest leading-tight">{resource.title}</h4>
          <span className="text-[8px] font-black text-[var(--theme-text)]/20 uppercase tracking-widest">{resource.category}</span>
        </div>
      </div>
      
      <div className="mt-auto flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {resource.linkedProjects.map(p => (
            <span key={p} className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[7px] font-bold text-[var(--theme-text)]/30 uppercase">prj:{p}</span>
          ))}
        </div>
        <div className="h-px bg-white/5" />
        <span className="text-[8px] font-bold text-emerald-400/40 uppercase tracking-widest text-right">{resource.type}</span>
      </div>
    </div>
  );
}

