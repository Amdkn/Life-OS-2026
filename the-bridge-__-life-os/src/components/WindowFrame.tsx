/** WindowFrame — glassmorphic draggable window with breadcrumbs */
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useShellStore } from '../stores/shell.store';
import { X, Minus, Maximize2, ChevronLeft, Layout } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import { useWindowManager } from '../hooks/useWindowManager';
import { WindowContext } from '../contexts/WindowContext';

interface WindowFrameProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export function WindowFrame({ id, title, children }: WindowFrameProps) {
  const windowState = useShellStore(s => s.windows.find(w => w.id === id));
  const closeApp = useShellStore(s => s.closeApp);
  const minimizeApp = useShellStore(s => s.minimizeApp);
  const maximizeApp = useShellStore(s => s.maximizeApp);
  const focusApp = useShellStore(s => s.focusApp);

  const { 
    windowPosition, 
    windowSize, 
    isDragging, 
    resizeDir, 
    snapZone, 
    handleTitleBarMouseDown, 
    handleResizeStart 
  } = useWindowManager(id);

  const [activePage, setActivePage] = useState('Dashboard');

  if (!windowState || !windowState.isOpen) return null;
  if (windowState.isMinimized) return null;

  const isMax = windowState.isMaximized;

  return (
    <div
      data-window-frame
      onMouseDown={() => focusApp(id)}
      className={`absolute flex flex-col glass overflow-hidden ${
        isMax ? 'rounded-none border-t-0' : 'rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.7)]'
      }`}
      style={{
        top: isMax ? 36 : windowPosition.y,
        left: isMax ? 0 : windowPosition.x,
        width: isMax ? '100vw' : windowSize.width,
        height: isMax ? 'calc(100vh - 36px)' : windowSize.height,
        zIndex: windowState?.zIndex ?? 1,
        transition: isDragging || resizeDir ? 'none' : 'top 0.3s, left 0.3s, width 0.3s, height 0.3s',
        backgroundColor: `var(--theme-bg)`,
        borderColor: isMax ? 'transparent' : `rgba(var(--theme-accent-rgb, 255, 255, 255), 0.2)`,
        borderWidth: isMax ? 0 : '1px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full h-full flex flex-col"
      >
        {/* Title bar — draggable area */}
        <div 
          onMouseDown={handleTitleBarMouseDown}
          className="h-11 flex items-center justify-between px-4 bg-black/40 border-b border-white/5 cursor-grab active:cursor-grabbing select-none shrink-0"
        >
          {/* Left: Window Controls */}
          <div className="flex items-center gap-2.5 w-1/4">
            <TrafficLight color="red" onClick={() => closeApp(id)} icon={<X className="w-2.5 h-2.5" />} />
            <TrafficLight color="amber" onClick={() => minimizeApp(id)} icon={<Minus className="w-2.5 h-2.5" />} />
            <TrafficLight color="green" onClick={() => maximizeApp(id)} icon={<Maximize2 className="w-2.5 h-2.5" />} />
          </div>

          {/* Center: Title */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.05)]">
            <Layout className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
            <span className="text-[10px] font-bold text-[var(--theme-text)]/80 tracking-[0.15em] uppercase font-outfit truncate max-w-[200px]">
              {title}
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-2 w-1/4">
            <button className="p-1.5 rounded-lg hover:bg-white/10 text-[var(--theme-text)]/40 hover:text-[var(--theme-text)]/80 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        <WindowContext.Provider value={{ setActivePage }}>
          {/* Breadcrumbs Row */}
          <div className="bg-black/30 border-b border-white/5 px-4 h-9 flex items-center shrink-0">
            <Breadcrumbs appTitle={title} activePage={activePage} />
          </div>

          {/* Content area */}
          <div className="flex-1 min-h-0 overflow-auto custom-scrollbar bg-black/20 relative flex flex-col">
            <div className="flex-1 w-full h-full min-h-[400px]">
              {children}
            </div>
          </div>
        </WindowContext.Provider>
      </motion.div>

      {/* Resize handles — 8 directions */}
      {!isMax && (
        <>
          <div className="absolute top-0 left-3 right-3 h-1 cursor-n-resize z-50" onMouseDown={e => handleResizeStart(e, 'n')} />
          <div className="absolute bottom-0 left-3 right-3 h-1 cursor-s-resize z-50" onMouseDown={e => handleResizeStart(e, 's')} />
          <div className="absolute left-0 top-3 bottom-3 w-1 cursor-w-resize z-50" onMouseDown={e => handleResizeStart(e, 'w')} />
          <div className="absolute right-0 top-3 bottom-3 w-1 cursor-e-resize z-50" onMouseDown={e => handleResizeStart(e, 'e')} />
          <div className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize z-50" onMouseDown={e => handleResizeStart(e, 'nw')} />
          <div className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize z-50" onMouseDown={e => handleResizeStart(e, 'ne')} />
          <div className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize z-50" onMouseDown={e => handleResizeStart(e, 'sw')} />
          <div className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize z-50" onMouseDown={e => handleResizeStart(e, 'se')} />
        </>
      )}

      {/* Snap Zone Indicator */}
      {snapZone && (
        <div className={`fixed top-[40px] ${snapZone === 'left' ? 'left-0' : 'right-0'} w-1/2 bottom-[100px] bg-emerald-500/10 border-2 border-emerald-500/30 rounded-2xl z-[9999] pointer-events-none transition-all duration-300`} />
      )}
    </div>
  );
}

interface TrafficLightProps {
  color: 'red' | 'amber' | 'green';
  onClick: () => void;
  icon: React.ReactNode;
}

function TrafficLight({ color, onClick, icon }: TrafficLightProps) {
  const themes = {
    red: 'bg-[#ff5f56] hover:bg-[#ff5f56]/80 shadow-[0_0_8px_rgba(255,95,86,0.3)]',
    amber: 'bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 shadow-[0_0_8px_rgba(255,189,46,0.3)]',
    green: 'bg-[#27c93f] hover:bg-[#27c93f]/80 shadow-[0_0_8px_rgba(39,201,63,0.3)]',
  };

  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`w-3.5 h-3.5 rounded-full ${themes[color]} flex items-center justify-center group transition-transform active:scale-90`}
    >
      <span className="text-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
        {icon}
      </span>
    </button>
  );
}

