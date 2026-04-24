// src/hooks/useProfile.ts
import { useEffect } from 'react';
import { useProfileStore } from '../stores/profile.store';
import { useAuth } from './useAuth';

export function useProfile() {
  const { userId, isAuthenticated } = useAuth();
  const { profile, loading, error, fetchProfile, updateProfile, updateSettings, clearProfile } = useProfileStore();

  useEffect(() => {
    if (isAuthenticated && userId && !profile) fetchProfile(userId);
    if (!isAuthenticated) clearProfile();
  }, [isAuthenticated, userId, profile, fetchProfile, clearProfile]);

  return {
    profile,
    loading,
    error,
    isFirstLaunch: profile?.settings?.first_launch !== false,
    displayName: profile?.displayName ?? null,
    avatarUrl: profile?.avatarUrl ?? null,
    settings: profile?.settings ?? null,
    updateProfile,
    updateSettings,
  };
}

export function useOsSettings() {
  return useProfileStore((s) => s.profile?.settings ?? null);
}
