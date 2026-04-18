import { useEffect } from 'react';
import { useOsSettingsStore } from '../stores/os-settings.store';
import { THEME_TOKENS } from '../themes/theme-tokens';

export function useThemeApply() {
  const theme = useOsSettingsStore(state => state.theme);

  useEffect(() => {
    const tokens = THEME_TOKENS[theme];
    if (!tokens) return;

    const root = document.documentElement;
    
    // Apply all tokens as CSS variables
    Object.entries(tokens).forEach(([key, value]) => {
      root.style.setProperty(key, value);
      
      // If it's the accent color, also provide an RGB version for opacity handling
      if (key === '--theme-accent') {
        const rgb = hexToRgb(value);
        if (rgb) {
          root.style.setProperty('--theme-accent-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
        }
      }
    });

    // Special: data-theme attribute for tailwind hooks if needed
    root.setAttribute('data-theme', theme);
  }, [theme]);
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
