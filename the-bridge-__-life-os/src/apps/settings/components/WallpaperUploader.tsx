import React, { useState, useRef } from 'react';
import { Upload, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { saveWallpaper } from '../../../utils/wallpaper.idb';
import { useOsSettingsStore } from '../../../stores/os-settings.store';

export const WallpaperUploader: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setActiveWallpaper = useOsSettingsStore(state => state.setActiveWallpaper);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    setStatus('uploading');
    try {
      // Create thumbnail
      const thumbnail = await createThumbnail(file);
      const id = crypto.randomUUID();
      
      await saveWallpaper({
        id,
        name: file.name,
        blob: file,
        thumbnail,
        createdAt: Date.now()
      });

      setActiveWallpaper(id);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed to save wallpaper:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const createThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const MAX_WIDTH = 200;
          const scale = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scale;
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div 
      className={`relative h-40 border-2 border-dashed rounded-xl transition-all flex flex-col items-center justify-center p-4 cursor-pointer
        ${isDragging ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 hover:border-white/20 bg-white/5'}
        ${status === 'error' ? 'border-red-500/50 bg-red-500/5' : ''}
      `}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} 
      />

      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div 
            key="idle"
            initial={{ opacity: 0, y: 5 }} 
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex flex-col items-center text-center"
          >
            <Upload className="w-8 h-8 text-[var(--theme-text)]/40 mb-2" />
            <p className="text-sm text-[var(--theme-text)]/60 font-medium">Upload Solarpunk Wallpaper</p>
            <p className="text-xs text-[var(--theme-text)]/30 mt-1">Drag & drop or click to browse</p>
          </motion.div>
        )}

        {status === 'uploading' && (
          <motion.div key="uploading" className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-[var(--theme-text)]/70">Processing...</span>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div key="success" className="flex flex-col items-center text-emerald-400">
            <Check className="w-8 h-8 mb-1" />
            <span className="text-sm font-medium">Applied!</span>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div key="error" className="flex flex-col items-center text-red-400">
            <X className="w-8 h-8 mb-1" />
            <span className="text-sm font-medium">Invalid Image</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

