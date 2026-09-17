import React, { useState, useRef, useCallback, useEffect } from 'react';

import { ZoomIn, ZoomOut, Maximize2, CheckCircle2, CircleDashed } from 'lucide-react';
import { vesselConfigs } from '../../../config/vessels.config';
import { a3SkillsRegistry } from '../../../config/a3-skills-registry';
import { useAgentsStore } from '../../../stores/agents.store';

const FW_COLORS: Record<string, string> = {
  FW01: 'var(--brass)',
  FW02: 'var(--copper)',
  FW03: '#fbbf24',
  FW04: '#f43f5e',
  FW05: '#f59e0b',
  FW06: '#38bdf8',
};

const SkillTreeNexus: React.FC = () => {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 0.5 });
  const [isPanning, setIsPanning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const { agents } = useAgentsStore();

  const VIRTUAL_CANVAS_SIZE = 4000;
  const CENTER_X = VIRTUAL_CANVAS_SIZE / 2;
  const CENTER_Y = VIRTUAL_CANVAS_SIZE / 2;
  const FW_RADIUS = 600;

  const centerOnNexus = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const targetScale = 0.45;
      setTransform({
        x: (rect.width / 2) - (CENTER_X * targetScale),
        y: (rect.height / 2) - (CENTER_Y * targetScale),
        scale: targetScale
      });
    }
  }, []);

  useEffect(() => {
    centerOnNexus();
  }, [centerOnNexus]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    const zoomSpeed = 0.0015;
    setTransform(prev => {
      const delta = -e.deltaY;
      const newScale = Math.min(Math.max(prev.scale + delta * zoomSpeed, 0.1), 4);
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return { ...prev, scale: newScale };

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const xs = (mouseX - prev.x) / prev.scale;
      const ys = (mouseY - prev.y) / prev.scale;

      return {
        x: mouseX - xs * newScale,
        y: mouseY - ys * newScale,
        scale: newScale
      };
    });
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    const handleMouseMove = (me: MouseEvent) => {
      setTransform(prev => ({
        ...prev,
        x: prev.x + (me.clientX - lastMousePos.current.x),
        y: prev.y + (me.clientY - lastMousePos.current.y)
      }));
      lastMousePos.current = { x: me.clientX, y: me.clientY };
    };
    const handleMouseUp = () => {
      setIsPanning(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const getAgentStatus = (id: string) => {
    const agent = agents.find(a => a.id === id || a.name === id);
    return agent ? agent.status : 'offline';
  };

  const getSkillManifest = (id: string) => {
    return a3SkillsRegistry[id] || a3SkillsRegistry[id.toLowerCase()];
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      className={`h-full w-full bg-[#020617] overflow-hidden relative select-none ${isPanning ? "cursor-grabbing" : "cursor-grab"}`}
    >
      <div className="absolute inset-0 opacity-40 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_transparent_70%)] opacity-30" />
      </div>

      <div
        className="absolute top-0 left-0 will-change-transform"
        style={{
          width: VIRTUAL_CANVAS_SIZE,
          height: VIRTUAL_CANVAS_SIZE,
          transformOrigin: '0 0',
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`
        }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          {vesselConfigs.map((fw, idx) => {
            const angle = (idx * (360 / vesselConfigs.length) * Math.PI) / 180;
            const x = CENTER_X + Math.cos(angle) * FW_RADIUS;
            const y = CENTER_Y + Math.sin(angle) * FW_RADIUS;
            const color = FW_COLORS[fw.id] || 'var(--brass)';

            return (
              <g key={`line-${fw.id}`}>
                <line
                  x1={CENTER_X} y1={CENTER_Y}
                  x2={x} y2={y}
                  stroke={color}
                  strokeWidth="5"
                  strokeDasharray="15 10"
                  opacity={0.35}
                />
                {fw.crew.map((member, mIdx) => {
                    const memberAngle = angle + (mIdx - (fw.crew.length - 1) / 2) * 0.2;
                    const mx = x + Math.cos(memberAngle) * 350;
                    const my = y + Math.sin(memberAngle) * 350;
                    return (
                        <path
                            key={`path-${member.id}`}
                            d={`M ${x} ${y} L ${mx} ${my}`}
                            fill="none"
                            stroke={color}
                            strokeWidth="2"
                            opacity={0.2}
                        />
                    );
                })}
              </g>
            );
          })}
        </svg>

        <div className="absolute z-50 pointer-events-auto" style={{ left: CENTER_X, top: CENTER_Y, transform: 'translate(-50%, -50%)' }}>
          <div className="w-64 h-64 rounded-full glass border-[3px] border-brass shadow-[0_0_120px_rgba(196,160,82,0.4)] flex flex-col items-center justify-center bg-[var(--glass-l2-bg)] backdrop-blur-3xl">
             <div className="flex flex-col items-center gap-2">
                <span className="text-2xl font-black uppercase tracking-[0.5em] text-white">NEXUS</span>
                <span className="text-xs font-black text-brass uppercase tracking-widest px-4 py-1 rounded-full bg-brass/10 border border-brass/20">Agent Skill Tree</span>
             </div>
          </div>
        </div>

        {vesselConfigs.map((fw, idx) => {
          const angle = (idx * (360 / vesselConfigs.length) * Math.PI) / 180;
          const x = CENTER_X + Math.cos(angle) * FW_RADIUS;
          const y = CENTER_Y + Math.sin(angle) * FW_RADIUS;
          const color = FW_COLORS[fw.id] || 'var(--brass)';

          return (
            <React.Fragment key={fw.id}>
              <div className="absolute z-40 pointer-events-auto" style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}>
                <div className="w-48 h-48 rounded-[2rem] glass-card flex flex-col items-center justify-center cursor-pointer border-[3px] bg-black/50" style={{ borderColor: color }}>
                  <span className="text-[14px] font-black uppercase tracking-widest text-white text-center leading-tight mb-2">{fw.frameworkName}</span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">{fw.vesselName}</span>
                </div>
              </div>

              {fw.crew.map((member, mIdx) => {
                const memberAngle = angle + (mIdx - (fw.crew.length - 1) / 2) * 0.2;
                const mx = x + Math.cos(memberAngle) * 350;
                const my = y + Math.sin(memberAngle) * 350;
                const manifest = getSkillManifest(member.id);
                const status = getAgentStatus(member.id);

                return (
                  <div key={member.id} className="absolute z-30 pointer-events-auto" style={{ left: mx, top: my, transform: 'translate(-50%, -50%)' }}>
                    <div className="p-4 rounded-xl glass-card border border-white/20 shadow-lg min-w-[200px] bg-black/60">
                      <div className="flex flex-col mb-2">
                          <span className="text-sm font-black text-white uppercase tracking-wider">{member.name}</span>
                          <span className="text-[10px] text-[var(--text-muted)] font-mono">{member.role} ({member.layer})</span>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-green-500' : status === 'busy' ? 'bg-amber-500' : 'bg-gray-500'}`} />
                        <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">{status}</span>
                      </div>

                      {manifest && manifest.tools && manifest.tools.length > 0 ? (
                         <div className="flex flex-col gap-1 mt-2">
                            {manifest.tools.map((tool, tIdx) => (
                                <div key={tIdx} className="flex items-center justify-between text-[10px] py-1 px-2 rounded bg-white/5">
                                    <span className="text-white/80 truncate max-w-[100px]" title={tool.name}>{tool.name}</span>
                                    {tool.capability === 'verified' ? (
                                        <CheckCircle2 className="w-3 h-3 text-[var(--accent-primary)] shrink-0" />
                                    ) : (
                                        <CircleDashed className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
                                    )}
                                </div>
                            ))}
                         </div>
                      ) : (
                          <div className="text-[10px] text-white/30 italic mt-2">No skills registered</div>
                      )}

                      {manifest && manifest.dependencies && manifest.dependencies.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-white/10">
                          <span className="text-[9px] font-black uppercase text-white/40 mb-1 block">Dependencies</span>
                          <div className="flex flex-wrap gap-1">
                            {manifest.dependencies.map((dep, dIdx) => (
                              <span key={dIdx} className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-[var(--accent-primary)] font-mono border border-[var(--accent-primary)]/20">
                                {dep}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>

      <div className="absolute bottom-10 right-10 flex flex-col gap-4 z-[60]">
        <div className="glass flex flex-col rounded-3xl overflow-hidden border-2 border-brass/20 shadow-[-20px_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
          <button onClick={() => setTransform(p => ({ ...p, scale: Math.min(p.scale + 0.2, 4) }))} className="p-5 hover:bg-white/10 transition-all border-b border-white/5 text-brass">
            <ZoomIn className="w-7 h-7" />
          </button>
          <button onClick={() => setTransform(p => ({ ...p, scale: Math.max(p.scale - 0.2, 0.1) }))} className="p-5 hover:bg-white/10 transition-all border-b border-white/5 text-brass">
            <ZoomOut className="w-7 h-7" />
          </button>
          <button onClick={centerOnNexus} className="p-5 hover:bg-white/10 transition-all text-brass">
            <Maximize2 className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillTreeNexus;
