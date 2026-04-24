// src/apps/settings/ProfilePanel.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProfileStore } from '../../stores/profile.store';
import { useAuth } from '../../hooks/useAuth';

export const ProfilePanel: React.FC = () => {
  const { email, logout } = useAuth();
  const { profile, updateProfile } = useProfileStore();
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(profile?.displayName ?? '');
  const [saving, setSaving] = useState(false);

  const handleSaveName = async () => {
    if (!draftName.trim() || draftName === profile?.displayName) {
      setEditingName(false); return;
    }
    setSaving(true);
    await updateProfile({ displayName: draftName.trim() });
    setSaving(false); setEditingName(false);
  };

  return (
    <div className="p-6 max-w-sm mx-auto font-mono">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-2xl text-green-400 select-none">
          {(profile?.displayName?.[0] ?? '?').toUpperCase()}
        </div>
        <div>
          <p className="text-[10px] text-green-600/50 tracking-widest uppercase mb-0.5">Identité de Bord</p>
          <p className="text-green-300 font-bold text-sm">{profile?.displayName ?? email}</p>
          <p className="text-green-800/60 text-[10px] mt-0.5">{email}</p>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-[10px] text-green-600/60 tracking-widest mb-1.5 uppercase">
          Nom d'Affichage
        </label>
        {editingName ? (
          <div className="flex gap-2">
            <input
              autoFocus value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setEditingName(false); }}
              className="flex-1 bg-black/50 border border-green-500/30 rounded-lg px-3 py-2 text-green-300 text-sm focus:outline-none focus:border-green-400/60"
            />
            <motion.button whileTap={{ scale: 0.96 }} onClick={handleSaveName} disabled={saving}
              className="px-4 py-2 rounded-lg border border-green-500/25 bg-green-500/10 text-green-400 text-[10px] tracking-widest hover:bg-green-500/20 transition-all disabled:opacity-40">
              {saving ? 'SYNC...' : 'VALIDER'}
            </motion.button>
          </div>
        ) : (
          <button onClick={() => { setDraftName(profile?.displayName ?? ''); setEditingName(true); }}
            className="w-full text-left px-3 py-2 rounded-lg border border-green-500/15 bg-black/30 text-green-300 text-sm hover:border-green-500/30 transition-all group">
            {profile?.displayName ?? '—'}
            <span className="float-right text-green-700/40 text-[10px] tracking-widest group-hover:text-green-600/60 transition-colors">MODIFIER</span>
          </button>
        )}
      </div>

      <div className="border-t border-green-500/10 pt-6">
        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }} onClick={logout}
          className="w-full py-2.5 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400/80 text-[10px] tracking-widest hover:bg-red-500/10 transition-all">
          DÉCONNEXION VAISSEAU
        </motion.button>
      </div>
    </div>
  );
};
