import React, { useEffect, useState } from 'react';
import { Check, Trash2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { loadWallpapers, deleteWallpaper, WallpaperEntry } from '../../../utils/wallpaper.idb';
import { useOsSettingsStore } from '../../../stores/os-settings.store';

const DEFAULT_WALLPAPERS = [
  { id: 'default-solarpunk', name: 'Solarpunk Dawn', thumbnail: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=200&q=80' },
  { id: 'default-cyberpunk', name: 'Cyberpunk Night', thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=200&q=80' },
  { id: 'default-minimal', name: 'Minimal Cloud', thumbnail: 'https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=200&q=80' },
];

export const WallpaperGrid: React.FC = () => {
  const [customWallpapers, setCustomWallpapers] = useState<WallpaperEntry[]>([]);
  const { activeWallpaperId, setActiveWallpaper } = useOsSettingsStore();

  useEffect(() => {
    refresh();
  }, [activeWallpaperId]);

  const refresh = async () => {
    const loaded = await loadWallpapers();
    setCustomWallpapers(loaded);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteWallpaper(id);
    if (activeWallpaperId === id) setActiveWallpaper('default-solarpunk');
    refresh();
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {/* Defaults */}
      {DEFAULT_WALLPAPERS.map(wp => (
        <WallpaperCard 
          key={wp.id}
          id={wp.id}
          name={wp.name}
          thumbnail={wp.thumbnail}
          isActive={activeWallpaperId === wp.id}
          onSelect={() => setActiveWallpaper(wp.id)}
        />
      ))}

      {/* Customs */}
      <AnimatePresence mode="popLayout">
        {customWallpapers.map(wp => (
          <WallpaperCard 
            key={wp.id}
            id={wp.id}
            name={wp.name}
            thumbnail={wp.thumbnail}
            isActive={activeWallpaperId === wp.id}
            onSelect={() => setActiveWallpaper(wp.id)}
            onDelete={(e) => handleDelete(e, wp.id)}
            isCustom
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface CardProps {
  id: string;
  name: string;
  thumbnail: string;
  isActive: boolean;
  onSelect: () => void;
  onDelete?: (e: React.MouseEvent) => void;
  isCustom?: boolean;
}

const WallpaperCard: React.FC<CardProps> = ({ name, thumbnail, isActive, onSelect, onDelete, isCustom }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className={`group relative aspect-video rounded-lg overflow-hidden border-2 cursor-pointer transition-all
      ${isActive ? 'border-emerald-500 shadow-lg shadow-emerald-500/20' : 'border-white/5 hover:border-white/20'}
    `}
    onClick={onSelect}
  >
    <img src={thumbnail} alt={name} className="w-full h-full object-cover" />
    <div className={`absolute inset-0 bg-black/40 flex flex-col justify-end p-2 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
      <span className="text-[10px] text-[var(--theme-text)]/80 font-medium truncate">{name}</span>
    </div>

    {isActive && (
      <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
        <Check className="w-3 h-3 text-[var(--theme-text)]" />
      </div>
    )}

    {isCustom && (
      <button 
        onClick={onDelete}
        className="absolute top-2 left-2 p-1.5 bg-red-500/80 hover:bg-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="w-3 h-3 text-[var(--theme-text)]" />
      </button>
    )}
  </motion.div>
);

