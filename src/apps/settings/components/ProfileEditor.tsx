import React, { useState, useRef } from 'react';
import { Camera, Save, Globe, Clock, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useOsSettingsStore } from '../../../stores/os-settings.store';

export const ProfileEditor: React.FC = () => {
  const { profile, updateProfile } = useOsSettingsStore();
  const [formData, setFormData] = useState(profile);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    updateProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormData(prev => ({ ...prev, avatar: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Avatar Section */}
      <div className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-emerald-500/50 transition-all">
            {formData.avatar ? (
              <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-white/5 flex items-center justify-center">
                <User className="w-10 h-10 text-[var(--theme-text)]/20" />
              </div>
            )}
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-2 bg-emerald-500 rounded-full text-[var(--theme-text)] shadow-lg hover:bg-emerald-600 transition-colors"
          >
            <Camera className="w-4 h-4" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleAvatarChange} 
          />
        </div>
        
        <div>
          <h3 className="text-lg font-bold text-[var(--theme-text)] mb-1">{formData.displayName || 'A0 Explorer'}</h3>
          <p className="text-xs text-[var(--theme-text)]/40 uppercase tracking-widest font-medium">Ship Commander Profile</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-[var(--theme-text)]/40 uppercase tracking-widest ml-1">Display Name</label>
          <input 
            type="text" 
            value={formData.displayName}
            onChange={e => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[var(--theme-text)] focus:border-emerald-500/50 outline-none transition-all"
            placeholder="Burnham, Burnham..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[var(--theme-text)]/40 uppercase tracking-widest ml-1">Locale / Language</label>
          <div className="flex gap-2">
            {(['en', 'fr'] as const).map(l => (
              <button
                key={l}
                onClick={() => setFormData(prev => ({ ...prev, locale: l }))}
                className={`flex-1 py-3 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all
                  ${formData.locale === l ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-white/10 text-[var(--theme-text)]/40 hover:bg-white/10'}
                `}
              >
                {l === 'en' ? 'English' : 'Français'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[var(--theme-text)]/40 uppercase tracking-widest ml-1">Timezone</label>
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-text)]/20" />
            <select 
              value={formData.timezone}
              onChange={e => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-[var(--theme-text)] focus:border-emerald-500/50 outline-none transition-all appearance-none"
            >
              {Intl.supportedValuesOf('timeZone').map(tz => (
                <option key={tz} value={tz} className="bg-[#111]">{tz}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button 
        onClick={handleSave}
        className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all
          ${isSaved ? 'bg-emerald-500 text-[var(--theme-text)]' : 'bg-white/10 text-[var(--theme-text)] hover:bg-white/20'}
        `}
      >
        {isSaved ? <Globe className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {isSaved ? 'Synchronizing...' : 'Save Profile'}
      </button>
    </div>
  );
};

