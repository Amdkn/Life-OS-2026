# DDD-V0.3.2 — Noyau d'Identité (Zora Core)

> **ADR** : ADR-V0.3.2 · **Dossier** : `the-bridge-__-life-os/src/`

---

## Étapes A.1-A.3 : User Profile

**MODIFY** `os-settings.store.ts` — ajouter :
```typescript
export interface UserProfile {
  displayName: string; avatarId?: string; timezone: string; locale: 'en' | 'fr';
}

// Dans state :
userProfile: UserProfile;
updateProfile: (partial: Partial<UserProfile>) => void;

// Default :
userProfile: { displayName: 'Amadeus', timezone: 'America/New_York', locale: 'fr' },
updateProfile: (partial) => set(s => ({ userProfile: { ...s.userProfile, ...partial } })),
```

**NEW** `src/apps/settings/components/ProfileEditor.tsx`
```typescript
export function ProfileEditor() {
  const { userProfile, updateProfile } = useOsSettingsStore();
  return (
    <div className="space-y-6">
      <div>
        <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Display Name</label>
        <input value={userProfile.displayName} onChange={e => updateProfile({ displayName: e.target.value })}
          className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/80" />
      </div>
      <div>
        <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Timezone</label>
        <select value={userProfile.timezone} onChange={e => updateProfile({ timezone: e.target.value })}
          className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/80">
          {Intl.supportedValuesOf('timeZone').map(tz => <option key={tz} value={tz}>{tz}</option>)}
        </select>
      </div>
      <div className="flex gap-3">
        {(['en', 'fr'] as const).map(lang => (
          <button key={lang} onClick={() => updateProfile({ locale: lang })}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase ${userProfile.locale === lang ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-white/30 border border-white/5'}`}>
            {lang === 'en' ? 'English' : 'Français'}
          </button>
        ))}
      </div>
    </div>
  );
}
```

## Étapes B.1-B.3 : DomainConfig

**MODIFY** `os-settings.store.ts` — ajouter :
```typescript
import type { LifeWheelDomain } from './fw-para.store';

export interface DomainConfig { domain: LifeWheelDomain; label: string; color: string; icon: string; }

domainConfigs: DomainConfig[];
updateDomainConfig: (domain: LifeWheelDomain, partial: Partial<DomainConfig>) => void;

// Defaults :
domainConfigs: [
  { domain: 'business',   label: 'Business Pulse', color: '#10b981', icon: '💼' },
  { domain: 'finance',    label: 'Finance',        color: '#f59e0b', icon: '💰' },
  { domain: 'health',     label: 'Health',          color: '#ef4444', icon: '❤️' },
  { domain: 'cognition',  label: 'Cognition',       color: '#8b5cf6', icon: '🧠' },
  { domain: 'creativity', label: 'Creativity',      color: '#ec4899', icon: '🎨' },
  { domain: 'habitat',    label: 'Habitat',         color: '#06b6d4', icon: '🏠' },
  { domain: 'relations',  label: 'Relations',       color: '#f97316', icon: '🤝' },
  { domain: 'impact',     label: 'Impact',          color: '#14b8a6', icon: '🌍' },
],
```

**NEW** `src/apps/settings/components/DomainConfigurator.tsx` — 8 cartes avec label editable + color input + emoji.

**Gate** : Profil + Domaines modifiés et persistés au reload
