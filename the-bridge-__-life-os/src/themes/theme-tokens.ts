import type { OSTheme } from '../stores/os-settings.store';

export const THEME_TOKENS: Record<OSTheme, Record<string, string>> = {
  solarpunk: {
    '--theme-bg': '#0a0f0d',
    '--theme-accent': '#10b981', // Emerald
    '--theme-text': '#f8fafc',
    '--theme-glass-opacity': '0.08',
  },
  cyberpunk: {
    '--theme-bg': '#0d0a1a',
    '--theme-accent': '#a855f7', // Purple
    '--theme-text': '#ffffff',
    '--theme-glass-opacity': '0.12',
  },
  minimal: {
    '--theme-bg': '#111111',
    '--theme-accent': '#ffffff', // White
    '--theme-text': '#e2e8f0',
    '--theme-glass-opacity': '0.05',
  },
  'glass-dark': {
    '--theme-bg': '#050505',
    '--theme-accent': '#3b82f6', // Blue
    '--theme-text': '#ffffff',
    '--theme-glass-opacity': '0.15',
  },
  'glass-light': {
    '--theme-bg': '#f8fafc',
    '--theme-accent': '#2563eb', // Strong Blue
    '--theme-text': '#0f172a',
    '--theme-glass-opacity': '0.3',
  }
};
