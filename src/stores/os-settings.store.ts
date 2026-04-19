import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** 
 * OS Settings Store — Global preferences & UI state (V0.3.1)
 * Persisted in localStorage as 'aspace-os-settings-v1'
 */

export type OSTheme = 'solarpunk' | 'cyberpunk' | 'minimal' | 'glass-dark' | 'glass-light';
export type DockPosition = 'bottom' | 'left';

export interface UserProfile {
  displayName: string;
  avatar?: string;
  timezone: string;
  locale: 'en' | 'fr';
}

export interface DomainConfig {
  domain: string; // LifeWheelDomain
  label: string;
  color: string;
  icon: string;
}

export interface VetoRule {
  id: string;
  action: string;
  requiresApproval: boolean;
  approver: 'manual' | 'auto';
}

export interface OsSettings {
  theme: OSTheme;
  wallpaper: string; // Legacy field or short description
  activeWallpaperId: string; // Reference to IndexedDB 'wallpapers' store
  vetoDefaultStatus: boolean;
  vetoRules: VetoRule[];
  dockPosition: DockPosition;
  language: 'en' | 'fr';
  animations: boolean;
  profile: UserProfile;
  domainConfigs: DomainConfig[];
  activeLdFilter: string; // V0.9 Transversal
}

interface OsSettingsState extends OsSettings {
  // Actions
  setTheme: (theme: OSTheme) => void;
  setWallpaper: (url: string) => void;
  setActiveWallpaper: (id: string) => void;
  setVetoStatus: (status: boolean) => void;
  updateVetoRule: (id: string, partial: Partial<VetoRule>) => void;
  setDockPosition: (pos: DockPosition) => void;
  setLanguage: (lang: 'en' | 'fr') => void;
  toggleAnimations: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateDomainConfig: (domain: string, partial: Partial<DomainConfig>) => void;
  setActiveLdFilter: (filter: string) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: OsSettings = {
  theme: 'solarpunk',
  wallpaper: 'default-solarpunk',
  activeWallpaperId: 'default-solarpunk',
  vetoDefaultStatus: true,
  vetoRules: [
    { id: 'data-delete', action: 'Delete Data', requiresApproval: true, approver: 'manual' },
    { id: 'data-export', action: 'Export External', requiresApproval: true, approver: 'manual' },
    { id: 'agent-exec',  action: 'Agent Execute',  requiresApproval: false, approver: 'auto' },
    { id: 'hard-reset',  action: 'Hard Reset',     requiresApproval: true, approver: 'manual' },
  ],
  dockPosition: 'bottom',
  language: 'en',
  animations: true,
  profile: {
    displayName: 'A0 Explorer',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    locale: 'en',
  },
  domainConfigs: [
    { domain: 'health', label: 'Health', color: '#10b981', icon: 'Heart' },
    { domain: 'career', label: 'Career', color: '#3b82f6', icon: 'Briefcase' },
    { domain: 'finance', label: 'Finance', color: '#f59e0b', icon: 'Wallet' },
    { domain: 'personal_dev', label: 'Personal Dev', color: '#a855f7', icon: 'Zap' },
    { domain: 'fun', label: 'Fun & Social', color: '#ec4899', icon: 'Smile' },
    { domain: 'spiritual', label: 'Contribution', color: '#ef4444', icon: 'Globe' },
    { domain: 'environment', label: 'Environment', color: '#64748b', icon: 'Home' },
    { domain: 'relationship', label: 'Relationships', color: '#f43f5e', icon: 'Users' },
  ],
  activeLdFilter: 'all',
};

export const useOsSettingsStore = create<OsSettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      setTheme: (theme) => set({ theme }),
      setWallpaper: (wallpaper) => set({ wallpaper }),
      setActiveWallpaper: (activeWallpaperId) => set({ activeWallpaperId }),
      setVetoStatus: (vetoDefaultStatus) => set({ vetoDefaultStatus }),
      updateVetoRule: (id, partial) => set((state) => ({
        vetoRules: state.vetoRules.map(r => r.id === id ? { ...r, ...partial } : r)
      })),
      setDockPosition: (dockPosition) => set({ dockPosition }),
      setLanguage: (language) => set({ language }),
      toggleAnimations: () => set((state) => ({ animations: !state.animations })),
      updateProfile: (partial) => set((state) => ({ 
        profile: { ...state.profile, ...partial } 
      })),
      updateDomainConfig: (domain, partial) => set((state) => ({
        domainConfigs: state.domainConfigs.map(c => c.domain === domain ? { ...c, ...partial } : c)
      })),
      setActiveLdFilter: (activeLdFilter) => set({ activeLdFilter }),
      resetSettings: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'aspace-os-settings-v1',
    }
  )
);
