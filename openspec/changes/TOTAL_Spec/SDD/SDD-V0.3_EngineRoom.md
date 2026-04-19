# SDD V0.3 — "The Engine Room" (Settings & Back Office)

> **Auteur** : GravityClaw (A'"0) · **Date** : 2026-03-22
> **Statut** : ✅ Validé par A0 (Amadeus) via Pre-SDD Gemini Chrome
> **Convention** : `V0.3.X.Y.Z` = Version.Itération.Phase(alpha).Étape(num)
> **Store existant** : `os-settings.store.ts` (59L — theme, wallpaper, veto, dock, lang, animations)

---

## Intention (Le Pourquoi)

Les Settings sont la **Salle des Machines** du vaisseau A'Space OS. Ils centralisent tous les leviers de contrôle (Visuels, Données, Flotte IA, Sécurité) dans une interface Glassmorphism cohérente, pour que le vaisseau soit pilotable par un humain — pas par un ingénieur système.

## Décisions Souveraines (A0)
- **Zéro Cloud Lock-in** : Tout persiste localement (IndexedDB / localStorage). Aucune donnée envoyée vers l'extérieur.
- **Glassmorphism uniforme** : Même langage visuel que le Command Center (panneaux translucides, bordures subtiles).
- **Modularité < 200 lignes** : Pas de fichier monolithique Settings.tsx.
- **Pas de hardcoding** : Modèles IA stockés dans le store, modifiables par l'UI.
- **Visibilité des coûts** : Distinction free/paid dans l'allocation des modèles.

---

## V0.3.1 — Environnement & VFS (Virtual File System)

> Gestion du bureau : fonds d'écran Solarpunk, thèmes, apparence.

### Phase A : Wallpaper Manager
| Étape | Description |
|-------|------------|
| V0.3.1.A.1 | Type `WallpaperEntry { id, name, blob: Blob, thumbnail: string }` dans le store |
| V0.3.1.A.2 | Composant `WallpaperUploader.tsx` : drag & drop + file input pour upload |
| V0.3.1.A.3 | Persistance des blobs dans IndexedDB (pas localStorage — trop limité) |
| V0.3.1.A.4 | Grille de sélection des wallpapers (3 solarpunk par défaut + custom) |
| V0.3.1.A.5 | Application du wallpaper sélectionné sur le Desktop via CSS `background-image` |
| V0.3.1.A.6 | Gate : Upload + sélection + persistance au reload |

### Phase B : Theme Switcher
| Étape | Description |
|-------|------------|
| V0.3.1.B.1 | Enrichir `OSTheme` : `'solarpunk' | 'cyberpunk' | 'minimal' | 'glass-dark' | 'glass-light'` |
| V0.3.1.B.2 | Composant `ThemeSelector.tsx` : cards visuelles avec preview couleurs |
| V0.3.1.B.3 | CSS variables système (`--bg-primary`, `--accent`, `--glass-opacity`) par thème |
| V0.3.1.B.4 | Gate : Thème appliqué globalement au switch |

---

## V0.3.2 — Noyau d'Identité (Zora Core)

> Profil utilisateur et configuration des domaines Life Wheel.

### Phase A : User Profile
| Étape | Description |
|-------|------------|
| V0.3.2.A.1 | Type `UserProfile { displayName, avatar?, timezone, locale }` |
| V0.3.2.A.2 | Composant `ProfileEditor.tsx` : champs nom, avatar upload, timezone picker |
| V0.3.2.A.3 | Persistance dans `os-settings.store.ts` (extend) |
| V0.3.2.A.4 | Gate : Profil modifié + persisté |

### Phase B : Life Wheel Configuration
| Étape | Description |
|-------|------------|
| V0.3.2.B.1 | Type `DomainConfig { domain: LifeWheelDomain, label: string, color: string, icon: string }` |
| V0.3.2.B.2 | Composant `DomainConfigurator.tsx` : 8 cartes domaines avec color picker + label editable |
| V0.3.2.B.3 | Synchronisation : changements dans DomainConfig reflétés dans PARA et 12WY |
| V0.3.2.B.4 | Gate : Labels et couleurs modifiés + visible dans PARA |

---

## V0.3.3 — Fleet Gateway & Routing (API & OpenClaw)

> Routeur de Flotte IA : connecteurs, allocation modèles, visibilité coûts.

### Phase A : Connecteurs (Ports d'Attache)
| Étape | Description |
|-------|------------|
| V0.3.3.A.1 | Type `APIConnector { id, name, type: 'openrouter' | 'ollama' | 'openclaw', endpoint, apiKey?, status }` |
| V0.3.3.A.2 | Composant `ConnectorCard.tsx` : champ endpoint + clé sécurisée (masquée) + bouton "Test Connection" |
| V0.3.3.A.3 | 3 connecteurs par défaut : OpenRouter, Ollama Pro (`localhost:11434`), OpenClaw Gateway (`localhost:18789`) |
| V0.3.3.A.4 | Test Connection : fetch simple → status indicator (vert/rouge) |
| V0.3.3.A.5 | Gate : 3 connecteurs affichés, test de connexion fonctionnel |

### Phase B : Table de Routage (Model Allocation)
| Étape | Description |
|-------|------------|
| V0.3.3.B.1 | Type `ModelAllocation { strata: AgentStrata, model: string, provider: string, costTier: 'free' | 'paid' }` |
| V0.3.3.B.2 | Enum `AgentStrata = 'a3-background' | 'a2-logic' | 'a1-chat' | 'a0-strategic'` |
| V0.3.3.B.3 | Composant `ModelRouter.tsx` : dropdowns par strate avec indicateur coût (gratuit/payant) |
| V0.3.3.B.4 | Modèles par défaut : A3 = minimax-free, A2 = glm-4.7-flash, A1 = mistral-small, A0 = codex |
| V0.3.3.B.5 | Gate : Allocation modifiable + badge free/paid visible |

---

## V0.3.4 — Souveraineté des Données (Memory State)

> Panneau de contrôle Zustand/IndexedDB : export, import, hard reset.

### Phase A : State Manager
| Étape | Description |
|-------|------------|
| V0.3.4.A.1 | Composant `StateManagerPanel.tsx` : overview de tous les stores (nom, taille, dernière modification) |
| V0.3.4.A.2 | Bouton "Export System State" → génère JSON de tous les stores Zustand |
| V0.3.4.A.3 | Bouton "Import Backup" → upload JSON + hydratation de tous les stores |
| V0.3.4.A.4 | Gate : Export → Import → vérification état restauré |

### Phase B : Hard Reset & Diagnostics
| Étape | Description |
|-------|------------|
| V0.3.4.B.1 | Bouton "Hard Reset" avec confirmation modale (triple-click ou phrase à taper) |
| V0.3.4.B.2 | Purge : vider tous les localStorage + IndexedDB + reload |
| V0.3.4.B.3 | Section "Diagnostics" : liste des stores avec compteur d'items par store |
| V0.3.4.B.4 | Gate : Hard Reset fonctionne, Diagnostics affiche les compteurs |

---

## V0.3.5 — Doctrine Beth (Permissions & Veto)

> Configuration des seuils de validation avant exécution autonome.

### Phase A : Veto Configuration
| Étape | Description |
|-------|------------|
| V0.3.5.A.1 | Type `VetoRule { id, action: string, requiresApproval: boolean, approver: 'manual' | 'auto' }` |
| V0.3.5.A.2 | Composant `VetoRuleEditor.tsx` : liste des actions avec toggle approval on/off |
| V0.3.5.A.3 | Actions par défaut : "Delete Data", "Export External", "Agent Execute", "Hard Reset" |
| V0.3.5.A.4 | Gate : Rules modifiables + persistées |

### Phase B : Permission Matrix
| Étape | Description |
|-------|------------|
| V0.3.5.B.1 | Composant `PermissionMatrix.tsx` : tableau Agent × Action avec checkboxes |
| V0.3.5.B.2 | Visualisation : qui peut faire quoi sans veto |
| V0.3.5.B.3 | Gate Finale : Matrice visible + veto fonctionnel |

---

## Layout Global : SettingsApp

Le composant `SettingsApp.tsx` utilise un **sidebar interne** avec 5 sections (V0.3.1-V0.3.5) + un `<main>` qui affiche la section active. Pattern identique aux autres Apps Framework.

## Chiffres

| Itération | Phases | Étapes |
|-----------|--------|--------|
| V0.3.1 Environnement | 2 (A, B) | 10 |
| V0.3.2 Identité | 2 (A, B) | 8 |
| V0.3.3 Fleet Gateway | 2 (A, B) | 10 |
| V0.3.4 Memory State | 2 (A, B) | 8 |
| V0.3.5 Permissions | 2 (A, B) | 7 |
| **Total** | **10** | **43** |
