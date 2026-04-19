/** ViewportGuard — ensures all windows stay within safe screen boundaries */
import { useEffect } from 'react';
import React from 'react';
import { useShellStore } from '../stores/shell.store';

export function ViewportGuard({ children }: { children: React.ReactNode }) {
  const windows = useShellStore(s => s.windows);
  const updatePosition = useShellStore(s => s.updatePosition);

  useEffect(() => {
    const checkBoundaries = () => {
      const topBarHeight = 36; // var(--topbar-height)
      const dockHeight = 80;   // Estimated safe area for dock
      const vWidth = window.innerWidth;
      const vHeight = window.innerHeight;

      windows.forEach(win => {
        if (!win.isOpen || win.isMinimized || win.isMaximized) return;

        let newX = win.position.x;
        let newY = win.position.y;
        let changed = false;

        // Top boundary (Protect Titlebar)
        if (newY < topBarHeight) {
          newY = topBarHeight;
          changed = true;
        }

        // Bottom boundary (Stay above dock area)
        if (newY + 40 > vHeight - dockHeight) {
          newY = vHeight - dockHeight - 40;
          changed = true;
        }

        // Left boundary
        if (newX < 0) {
          newX = 0;
          changed = true;
        }

        // Right boundary
        if (newX + 100 > vWidth) {
          newX = vWidth - 100;
          changed = true;
        }

        if (changed) {
          updatePosition(win.id, newX, newY);
        }
      });
    };

    // Check on window resize and every few seconds as a safety net
    window.addEventListener('resize', checkBoundaries);
    const interval = setInterval(checkBoundaries, 2000);

    return () => {
      window.removeEventListener('resize', checkBoundaries);
      clearInterval(interval);
    };
  }, [windows, updatePosition]);

  return <>{children}</>;
}
