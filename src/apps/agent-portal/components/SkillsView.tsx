import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FRAMEWORKS } from '../../../constants';
import { ShieldCheck, ZoomIn, ZoomOut, Maximize2, Move, Sparkles } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useOsSettingsStore } from '../../../stores/os-settings.store';
import { LD_TO_DOMAIN } from '../../../utils/paraAdapter';
import { LDId } from '../../../lib/ld-router';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FrameworksTree: React.FC = () => {
  const { activeLdFilter } = useOsSettingsStore();
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 0.5 });
  const [isPanning, setIsPanning] = useState(false);
  const [hoveredFw, setHoveredFw] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<{ fw: any, item: string } | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const VIRTUAL_CANVAS_SIZE = 4000;
  const CENTER_X = VIRTUAL_CANVAS_SIZE / 2;
  const CENTER_Y = VIRTUAL_CANVAS_SIZE / 2;
  
  const FW_RADIUS = 500; 
  const INNER_ITEM_RADIUS = 750;
  const OUTER_ITEM_RADIUS = 1000;

  const FW_COLORS: Record<string, string> = {
    ikigai: 'var(--brass)',
    'life-wheel': 'var(--copper)',
    '12wy': '#f43f5e',
    para: 'var(--copper)',
    gtd: '#fbbf24',
    deal: '#38bdf8',
  };

  const activeDomain = activeLdFilter === 'all' ? null : LD_TO_DOMAIN[activeLdFilter as LDId];

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (selectedItem) return;
    const zoomSpeed = 0.0015;
    setTransform(prev => {
      const delta = -e.deltaY;
      const newScale = Math.min(Math.max(prev.scale + delta * zoomSpeed, 0.1), 4);
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return prev;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const ratio = newScale / prev.scale;
      return { 
        x: mouseX - (mouseX - prev.x) * ratio, 
        y: mouseY - (mouseY - prev.y) * ratio, 
        scale: newScale 
      };
    });
  }, [selectedItem]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (selectedItem) return;
    setIsPanning(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanning) return;
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseUp = () => setIsPanning(false);
    if (isPanning) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPanning]);

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
  }, [CENTER_X, CENTER_Y]);

  useEffect(() => {
    centerOnNexus();
  }, [centerOnNexus]);

  const fwsWithPos = useMemo(() => {
    return FRAMEWORKS.map((fw, idx) => {
      const angle = (idx * (360 / FRAMEWORKS.length) * Math.PI) / 180;
      const x = CENTER_X + Math.cos(angle) * FW_RADIUS;
      const y = CENTER_Y + Math.sin(angle) * FW_RADIUS;
      const color = FW_COLORS[fw.id] || 'var(--brass)';
      
      const actualItems = fw.subItems.filter(i => !i.startsWith('SEP:') && i !== '---');
      const itemsWithPos = actualItems.map((item, itemIdx) => {
        const arcSpread = actualItems.length > 5 ? 70 : 50; 
        const startAngle = (idx * (360 / FRAMEWORKS.length)) - (arcSpread / 2);
        const itemAngle = ((startAngle + (itemIdx * (arcSpread / (actualItems.length - 1 || 1)))) * Math.PI) / 180;
        const radius = itemIdx % 2 === 0 ? OUTER_ITEM_RADIUS : INNER_ITEM_RADIUS;
        
        // Logical Alignment: Check if this item relates to the active domain
        const isRelatedToFilter = activeDomain 
          ? (fw.id === 'life-wheel' && item.toLowerCase() === activeDomain.toLowerCase()) ||
            (fw.id === 'para' && item === 'Projects') || // Projects are always filtered
            (fw.id === 'deal' && item === 'Liberation')
          : true;

        return {
          name: item,
          x: CENTER_X + Math.cos(itemAngle) * radius,
          y: CENTER_Y + Math.sin(itemAngle) * radius,
          angle: itemAngle,
          orbit: itemIdx % 2 === 0 ? 'outer' : 'inner',
          isDimmed: activeDomain && !isRelatedToFilter
        };
      });

      return { ...fw, x, y, angle, color, items: itemsWithPos };
    });
  }, [CENTER_X, CENTER_Y, FW_RADIUS, INNER_ITEM_RADIUS, OUTER_ITEM_RADIUS, activeDomain]);

  return (
    <div 
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      className={cn(
        "h-full w-full bg-[#020617] overflow-hidden relative select-none",
        isPanning ? "cursor-grabbing" : "cursor-grab"
      )}
    >
      <div className="absolute inset-0 opacity-40 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_transparent_70%)] opacity-30" />
        <motion.div 
          animate={{ x: transform.x * 0.03, y: transform.y * 0.03 }}
          className="h-[400%] w-[400%] -left-[150%] -top-[150%]" 
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff06 1.5px, transparent 0)', backgroundSize: '80px 80px' }} 
        />
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
          <defs>
            <filter id="macro-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {fwsWithPos.map(fw => (
            <motion.line
              key={`line-${fw.id}`}
              x1={CENTER_X} y1={CENTER_Y}
              x2={fw.x} y2={fw.y}
              stroke={fw.color}
              strokeWidth="5"
              strokeDasharray="15 10"
              animate={{ 
                opacity: hoveredFw === fw.id || !hoveredFw ? (activeDomain ? 0.1 : 0.35) : 0.05 
              }}
            />
          ))}

          {fwsWithPos.map(fw => 
            fw.items.map((item, i) => (
              <motion.path
                key={`path-${fw.id}-${i}`}
                d={`M ${fw.x} ${fw.y} C ${(fw.x + item.x)/2} ${fw.y}, ${fw.x} ${(fw.y + item.y)/2}, ${item.x} ${item.y}`}
                fill="none"
                stroke={fw.color}
                strokeWidth={item.orbit === 'outer' ? "3" : "2"}
                animate={{ 
                  opacity: item.isDimmed ? 0.02 : (hoveredFw === fw.id ? 0.6 : (hoveredFw ? 0.02 : 0.15)),
                  strokeWidth: hoveredFw === fw.id ? 4 : (item.orbit === 'outer' ? 3 : 2)
                }}
                className="transition-opacity duration-700"
                filter="url(#macro-glow)"
              />
            ))
          )}
        </svg>

        <div 
          className="absolute z-50 pointer-events-auto"
          style={{ left: CENTER_X, top: CENTER_Y, transform: 'translate(-50%, -50%)' }}
        >
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="w-56 h-56 rounded-[3.5rem] glass border-[3px] border-brass shadow-[0_0_120px_rgba(196,160,82,0.4)] flex flex-col items-center justify-center bg-[var(--glass-l2-bg)] backdrop-blur-3xl"
          >
             <div className="absolute inset-0 rounded-[3.5rem] border-[4px] border-brass/20 animate-ping-slow opacity-10" />
             <div className="w-24 h-24 rounded-3xl bg-[var(--copper)] border-2 border-brass flex items-center justify-center mb-4 shadow-3xl">
                <span className="text-white font-black text-4xl tracking-tighter italic">P.1</span>
             </div>
             <div className="flex flex-col items-center gap-1">
                <span className="text-[18px] font-black uppercase tracking-[0.5em] text-white">A'Space OS</span>
                <span className="text-[11px] font-black text-brass uppercase tracking-widest px-4 py-1 rounded-full bg-brass/10 border border-brass/20">Canonical Origin</span>
             </div>
          </motion.div>
        </div>

        {fwsWithPos.map((fw) => {
          const Icon = fw.icon;
          const isActive = hoveredFw === fw.id;
          return (
            <div 
              key={fw.id} 
              className="absolute z-40 pointer-events-auto" 
              style={{ left: fw.x, top: fw.y, transform: 'translate(-50%, -50%)' }}
            >
              <motion.div
                onMouseEnter={() => setHoveredFw(fw.id)}
                onMouseLeave={() => setHoveredFw(null)}
                animate={{ 
                  scale: isActive ? 1.3 : 1,
                  opacity: (activeDomain) ? (fw.id === 'life-wheel' || fw.id === 'para' ? 1 : 0.2) : (isActive || !hoveredFw ? 1 : 0.1)
                }}
                className={cn(
                  "w-32 h-32 rounded-[2rem] glass-card flex flex-col items-center justify-center transition-all duration-500 cursor-pointer border-[3px]",
                  isActive ? "bg-white/10 shadow-[0_0_60px_rgba(255,255,255,0.2)]" : "border-[var(--glass-border)]"
                )}
                style={{ borderColor: isActive ? fw.color : undefined }}
              >
                <Icon className="w-12 h-12 mb-2" style={{ color: fw.color }} />
                <span className="text-[11px] font-black uppercase tracking-widest text-white text-center leading-tight">{fw.label}</span>
              </motion.div>
            </div>
          );
        })}

        {fwsWithPos.map((fw) => 
          fw.items.map((item, i) => (
            <div 
              key={`${fw.id}-${i}`} 
              className="absolute z-30 pointer-events-auto" 
              style={{ left: item.x, top: item.y, transform: 'translate(-50%, -50%)' }}
            >
              <motion.div
                onClick={() => setSelectedItem({ fw, item: item.name })}
                animate={{ 
                  opacity: item.isDimmed ? 0.05 : (hoveredFw === fw.id ? 1 : (hoveredFw ? 0.05 : 0.45)),
                  scale: hoveredFw === fw.id ? 1.1 : (item.isDimmed ? 0.8 : 0.9)
                }}
                className={cn(
                  "px-6 py-3 rounded-2xl glass-card border flex items-center justify-center gap-3 group hover:z-50 shadow-lg",
                  item.name.startsWith('H') ? "border-brass text-brass bg-brass/[0.12]" : "border-white/20 text-white/90"
                )}
                style={{ 
                  boxShadow: hoveredFw === fw.id && !item.isDimmed ? `0 0 30px -10px ${fw.color}` : undefined,
                  borderColor: hoveredFw === fw.id && !item.isDimmed ? fw.color : undefined
                }}
              >
                <span className="text-[13px] font-black uppercase tracking-[0.2em]">{item.name}</span>
                {item.name.startsWith('H') && <Sparkles className="w-4 h-4 opacity-70 animate-pulse" />}
              </motion.div>
            </div>
          ))
        )}
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

export default FrameworksTree;
