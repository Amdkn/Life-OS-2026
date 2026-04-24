// src/types/profile.ts
export interface UserProfile {
  id: string;
  username: string | null;
  displayName: string;
  avatarUrl: string | null;
  settings: OsSettings;
  createdAt: string;
}

export interface OsSettings {
  first_launch: boolean;
  theme: string;
  activeWallpaperId: string;
  dock_apps: string[];
  timezone: string;
  language: 'fr' | 'en';
  notifications_enabled: boolean;
  [key: string]: unknown;
}

export interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export const DEFAULT_OS_SETTINGS: OsSettings = {
  first_launch: true,
  theme: 'abyss',
  activeWallpaperId: 'cosmos-1',
  dock_apps: ['gtd', 'para', 'life-wheel', 'agent-portal'],
  timezone: 'Europe/Paris',
  language: 'fr',
  notifications_enabled: true,
};
