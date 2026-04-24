// src/stores/profile.store.ts
import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { UserProfile, ProfileState, OsSettings } from '../types/profile';
import { DEFAULT_OS_SETTINGS } from '../types/profile';

interface ProfileStore extends ProfileState {
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (patch: Partial<Pick<UserProfile, 'username' | 'displayName' | 'avatarUrl'>>) => Promise<void>;
  updateSettings: (settings: Partial<OsSettings>) => Promise<void>;
  markFirstLaunchComplete: () => Promise<void>;
  clearProfile: () => void;
}

function mapRow(row: Record<string, unknown>): UserProfile {
  const settings = (row.settings as Partial<OsSettings>) ?? {};
  return {
    id: row.id as string,
    username: (row.username as string) ?? null,
    displayName: (row.display_name as string) ?? (row.id as string),
    avatarUrl: (row.avatar_url as string) ?? null,
    settings: { ...DEFAULT_OS_SETTINGS, ...settings },
    createdAt: row.created_at as string,
  };
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) throw error;
      set({ profile: mapRow(data as Record<string, unknown>), loading: false });
    } catch (err) {
      console.warn('[Clara] Profile fetch failed — trigger delay?', err);
      set({ loading: false, error: null, profile: null });
    }
  },

  updateProfile: async (patch) => {
    const profile = get().profile;
    if (!profile) return;

    const dbPatch: Record<string, unknown> = {};
    if (patch.username !== undefined)    dbPatch.username     = patch.username;
    if (patch.displayName !== undefined) dbPatch.display_name = patch.displayName;
    if (patch.avatarUrl !== undefined)   dbPatch.avatar_url   = patch.avatarUrl;

    const { error } = await supabase
      .from('user_profiles')
      .update(dbPatch)
      .eq('id', profile.id);

    if (error) { console.error('[Clara] Profile update failed', error); return; }
    set({ profile: { ...profile, ...patch } });
  },

  updateSettings: async (settingsPatch: Partial<OsSettings>) => {
    const profile = get().profile;
    if (!profile) return;

    const mergedSettings = { ...profile.settings, ...settingsPatch };
    const { error } = await supabase
      .from('user_profiles')
      .update({ settings: mergedSettings })
      .eq('id', profile.id);

    if (error) { console.error('[Clara] Settings sync failed', error); return; }
    set({ profile: { ...profile, settings: mergedSettings } });
  },

  markFirstLaunchComplete: async () => {
    await get().updateSettings({ first_launch: false });
  },

  clearProfile: () => set({ profile: null, loading: false, error: null }),
}));
