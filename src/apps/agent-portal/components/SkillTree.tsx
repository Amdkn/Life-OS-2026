import React from 'react';
import { a3SkillsRegistry } from '../../../config/a3-skills-registry';
import { A3SkillManifest } from '../../../types/a3-skills';
import { CheckCircle2, CircleDashed } from 'lucide-react';

const SkillNode: React.FC<{
  manifest: A3SkillManifest;
  level: number;
}> = ({ manifest, level }) => {
  return (
    <div
      className="flex flex-col gap-2 p-4 rounded-xl border glass-card shadow-sm mb-4"
      style={{ marginLeft: `${level * 24}px` }}
    >
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-black text-white uppercase tracking-wider">
          {manifest.id}
        </h4>
        <span className="text-xs font-mono px-2 py-1 bg-[var(--glass-l2-bg)] rounded-md border border-[var(--glass-border)] text-[var(--text-muted)]">
          Agent: {manifest.agentId}
        </span>
      </div>

      <div className="text-sm text-[var(--text-secondary)] font-medium">
        Skills: {manifest.skills.join(', ')}
      </div>

      <div className="flex flex-col gap-1 mt-2">
        <h5 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">
          Tools
        </h5>
        {manifest.tools.map((tool, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-black/20"
          >
            <span className="text-white font-medium">{tool.name}</span>
            <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider">
              {tool.capability === 'verified' ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-[var(--accent-primary)]" />
                  <span className="text-[var(--accent-primary)]">Verified</span>
                </>
              ) : (
                <>
                  <CircleDashed className="w-3 h-3 text-[var(--text-muted)]" />
                  <span className="text-[var(--text-muted)]">Unverified</span>
                </>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SkillTree: React.FC = () => {
  const manifests = Object.values(a3SkillsRegistry);

  // Group by dependencies
  const independentManifests = manifests.filter(
    (m) => !m.dependencies || m.dependencies.length === 0
  );

  const getDependents = (id: string) =>
    manifests.filter((m) => m.dependencies?.includes(id));

  const renderTree = (manifest: A3SkillManifest, level: number = 0) => {
    const dependents = getDependents(manifest.id);
    return (
      <div key={manifest.id} className="relative">
        <SkillNode manifest={manifest} level={level} />
        {dependents.length > 0 && (
          <div className="relative">
            {dependents.map((dep) => renderTree(dep, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar flex flex-col gap-6 w-full max-w-4xl mx-auto">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-black text-white uppercase tracking-[.2em]">
          A3 Skills Compiler Engine
        </h2>
        <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest">
          Dependency Tree & Tool Validation
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {independentManifests.map((manifest) => renderTree(manifest, 0))}
      </div>
    </div>
  );
};

export default SkillTree;
