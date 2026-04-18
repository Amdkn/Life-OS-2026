# PRD-V0.4.3 — Routage Spock & Data (The Enterprise Computer)

> **Phase** : V0.4.3 · **Statut** : 🏗️ Draft

## 1. TVR (Faisabilité / Valeur / Réutilisabilité)
- **T (Faisabilité)** : Basse complexité, haut impact. L'interface `DomainCard` existe déjà. Il suffit de grouper les filtres et d'ajouter un event listener pour `openApp('ikigai')`. Pour l'extraction DEAL, appel croisé de fonction basique.
- **V (Valeur)** : Connecte le niveau Stratégique (Ikigai) au niveau Opérationnel (PARA) et le niveau Archives (Mort) à la re-création (DEAL/Muse). Cela donne tout son sens au "Life OS". 
- **R (Réutilisabilité)** : Utilise les `DomainConfigs` créées en V0.3.2 (Zora Core), centralisant le style des domaines.

## 2. User Stories (Phase A & B)

### Phase A : Areas (Officier Scientifique Spock)
> En tant qu'utilisateur, je veux voir l'état de mon Business Pulse pour chaque domaine et basculer instantanément sur mon Ikigai pour aligner ma stratégie.

- **US-39 : Matrice de Piliers (DomainCard)**
  - **Critères d'acceptation** :
    - [ ] `DomainCard` affiche le compteur réel de projetsactifs par pilier sous chaque icône de pilier.
    - [ ] Le clic sur un pilier modifie le filtre de liste (ex: affiche les projets `domain='business'` ET `pillar='finance'`).
- **US-40 : Le Pont Ikigai**
  - **Critères d'acceptation** :
    - [ ] Un bouton "View in Ikigai" est ajouté dans l'en-tête de `DomainCard`.
    - [ ] Appelle `openApp('ikigai', 'Ikigai Engine')`.
- **US-41 : Zora Core Styling**
  - **Critères d'acceptation** :
    - [ ] Les couleurs des domaines utilisent `useOsSettingsStore().domainConfigs` au lieu de `emerald-400` en dur.

### Phase B : Archives (Commandeur Data)
> En tant qu'utilisateur, je ne veux pas que mes projets meurent. Je veux les extraire vers DEAL pour les transformer en Muse ou en système automatisé.

- **US-42 : Extractor (Pont DEAL)**
  - **Critères d'acceptation** :
    - [ ] Le bouton `Transform via DEAL` dans `ProjectCard` (onglet Archives) est branché.
    - [ ] Il transmet la data du projet (titre, description) au store DEAL `useDealStore` (soit via une fonction d'import spéciale, soit en créant un draft 'D' dans DEAL).
    - [ ] Appelle `openApp('deal', 'D.E.A.L')`.
- **US-43 : Visual Timeline**
  - **Critères d'acceptation** :
    - [ ] Les projets archivés affichent leur `archivedAt` formaté au lieu de l'UI de Progress.

## 3. Anti-Patterns
| ❌ | ✅ |
|----|----|
| Boutons de navigation morts ou `console.log()` | Utilisation stricte de `openApp(id, title)` du Shell |
| Couleurs `text-emerald-400` répétées 20 fois | `style={{ color: config?.color }}` via `DomainConfig` |
| DEAL Extractor efface l'archive PARA | L'archive PARA reste intacte (Read-only data source). Un nouveau "Definition" est créé dans DEAL en copiant le texte. |

## 4. Fichiers Impactés
- `src/apps/para/components/DomainCard.tsx` (Modifié)
- `src/apps/para/components/ProjectCard.tsx` (Modifié)
- `src/apps/para/ParaApp.tsx` (Modifié)
