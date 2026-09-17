const fs = require('fs');
let content = fs.readFileSync('src/apps/para/components/ArchiveRadar.tsx', 'utf8');

const itemRendering = `
          <div key={p.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col group gap-2">
            <div className="flex justify-between items-start">
              <div className="min-w-0">
                <span className="text-xs text-[var(--theme-text)]/80 truncate block uppercase font-bold tracking-tight">{p.title}</span>
                {p.archivedAt && <span className="text-[8px] text-[var(--theme-text)]/40 uppercase font-black">{new Date(p.archivedAt).toLocaleDateString()}</span>}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => unarchiveProject(p.id)}
                  className="px-2 py-1 rounded bg-[var(--theme-text)]/5 hover:bg-[var(--theme-text)]/10 border border-[var(--theme-text)]/10 text-[var(--theme-text)]/60 hover:text-[var(--theme-text)] text-[8px] font-black uppercase transition-colors"
                  title="Unarchive"
                >
                  Active
                </button>
                <button
                  onClick={() => { createDef(\`[PARA] \${p.title}\`); openApp('deal', 'D.E.A.L'); }}
                  className="px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-[8px] font-black uppercase transition-colors flex items-center gap-1 shrink-0"
                  title="Distill to OKF"
                >
                  <Zap className="w-3 h-3" /> DEAL
                </button>
              </div>
            </div>

            {(p.archiveReason || p.lessonsLearned) && (
              <div className="mt-1 pl-2 border-l border-white/10 space-y-1">
                {p.archiveReason && (
                  <div className="text-[9px] text-[var(--theme-text)]/60">
                    <span className="font-bold uppercase text-[var(--theme-text)]/40 text-[8px] mr-1">Reason:</span>
                    {p.archiveReason}
                  </div>
                )}
                {p.lessonsLearned && (
                  <div className="text-[9px] text-[var(--theme-text)]/60">
                    <span className="font-bold uppercase text-[var(--theme-text)]/40 text-[8px] mr-1">Lessons:</span>
                    {p.lessonsLearned}
                  </div>
                )}
              </div>
            )}
          </div>
`;

// It didn't match the regex earlier because of newlines perhaps, so we replace from "<div key={p.id}" to the closing div of the map.
const mapStartIdx = content.indexOf('{archived.map(p => (');
if (mapStartIdx !== -1) {
  const mapEndIdx = content.lastIndexOf('))}');
  if (mapEndIdx !== -1) {
     const newContent = content.substring(0, mapStartIdx) + '{archived.map(p => (' + itemRendering + '        ))}' + content.substring(mapEndIdx + 3);
     fs.writeFileSync('src/apps/para/components/ArchiveRadar.tsx', newContent, 'utf8');
  }
}
