# ADR-V0.3.2 — Noyau d'Identité (Zora Core)

> **PRD** : PRD-V0.3.2 · **Exécuteur** : A3

## Décision
Le profil utilisateur et la configuration Life Wheel sont stockés dans `os-settings.store.ts` (extension). L'avatar est un blob IndexedDB (même pattern que les wallpapers). Les DomainConfigs sont la source de vérité pour les labels/couleurs dans PARA et 12WY.

## Phase A : User Profile (4 étapes)

### Contrats
```typescript
export interface UserProfile {
  displayName: string;
  avatarId?: string; // ref IndexedDB
  timezone: string;
  locale: 'en' | 'fr';
}
// Ajouté dans os-settings.store.ts
userProfile: UserProfile;
updateProfile: (partial: Partial<UserProfile>) => void;
```

### Étapes DDD
| Étape | Action | Détail |
|-------|--------|--------|
| A.1 | MODIFY `os-settings.store.ts` | Ajouter `UserProfile` type + state + `updateProfile` |
| A.2 | NEW `ProfileEditor.tsx` | Formulaire : displayName input, avatar upload, timezone Intl dropdown, locale toggle |
| A.3 | Avatar blob | Stocké via `wallpaper.idb.ts` (réutilisation du pattern — DB 'aspace-avatars') |
| A.4 | Gate | Profil modifié + persisté au reload |

## Phase B : Life Wheel Configuration (4 étapes)

### Contrats
```typescript
export interface DomainConfig {
  domain: LifeWheelDomain;
  label: string;    // customizable
  color: string;    // hex
  icon: string;     // emoji
}
domainConfigs: DomainConfig[]; // 8 entries
updateDomainConfig: (domain: LifeWheelDomain, partial: Partial<DomainConfig>) => void;
```

### Étapes DDD
| Étape | Action | Détail |
|-------|--------|--------|
| B.1 | MODIFY `os-settings.store.ts` | Ajouter `DomainConfig[]` avec 8 defaults |
| B.2 | NEW `DomainConfigurator.tsx` | 8 cartes : label editable + color picker + emoji picker |
| B.3 | Cross-framework sync | PARA/12WY lisent `domainConfigs` depuis os-settings au lieu de hardcoded labels |
| B.4 | Gate | Labels + couleurs modifiés → visible dans PARA |
