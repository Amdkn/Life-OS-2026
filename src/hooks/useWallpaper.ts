import { useState, useEffect } from 'react';
import { useOsSettingsStore } from '../stores/os-settings.store';
import { getWallpaperById } from '../utils/wallpaper.idb';

const DEFAULT_WALLPAPERS: Record<string, string> = {
  'default-solarpunk': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1920&q=80',
  'default-cyberpunk': 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1920&q=80',
  'default-minimal': 'https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=1920&q=80',
};

export function useWallpaper() {
  const activeId = useOsSettingsStore(state => state.activeWallpaperId);
  const [wallpaperUrl, setWallpaperUrl] = useState<string>(DEFAULT_WALLPAPERS['default-solarpunk']);

  useEffect(() => {
    let currentObjectUrl: string | null = null;
    let isMounted = true;

    async function load() {
      // 1. Check if it's a default wallpaper
      if (DEFAULT_WALLPAPERS[activeId]) {
        if (isMounted) setWallpaperUrl(DEFAULT_WALLPAPERS[activeId]);
        return;
      }

      // 2. Load from IndexedDB
      try {
        const wp = await getWallpaperById(activeId);
        if (isMounted) {
          if (wp && wp.blob) {
            currentObjectUrl = URL.createObjectURL(wp.blob);
            setWallpaperUrl(currentObjectUrl);
          } else {
            // Fallback if ID not found in DB
            setWallpaperUrl(DEFAULT_WALLPAPERS['default-solarpunk']);
          }
        }
      } catch (err) {
        console.error('Failed to load wallpaper from IDB:', err);
        if (isMounted) setWallpaperUrl(DEFAULT_WALLPAPERS['default-solarpunk']);
      }
    }

    load();

    return () => {
      isMounted = false;
      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
      }
    };
  }, [activeId]);

  return wallpaperUrl;
}
