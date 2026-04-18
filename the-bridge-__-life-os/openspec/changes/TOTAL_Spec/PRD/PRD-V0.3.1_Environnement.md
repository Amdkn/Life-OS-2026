# PRD-V0.3.1 — Environnement & VFS

> **SDD** : SDD-V0.3 · **Priorité** : 🔴 Critique (base visuelle du vaisseau)
> **TVR** : ✅T (IndexedDB + CSS) · ✅V (fond d'écran = première impression) · ✅R (upload réutilisable)

## User Stories

### US-20 : Wallpaper Manager (Phase A)
> En tant qu'utilisateur, j'upload mes fonds d'écran Solarpunk et ils persistent au reload.

- [ ] Upload drag & drop + file input (images uniquement)
- [ ] Persistance blob dans IndexedDB (pas localStorage — limite 5MB)
- [ ] Grille de sélection : 3 wallpapers Solarpunk par défaut + custom
- [ ] **Layering L-10** : Background en `fixed z-[-10]` pour éviter l'occlusion par les couleurs opaques du parent.
- [ ] **Réactivité forcée** : Utilisation d'une `key` React sur le composant wallpaper pour forcer le re-rendu au changement d'ID.

### US-21 : Theme Switcher (Phase B)
> En tant qu'utilisateur, je bascule entre 5 thèmes visuels avec une adaptation typographique automatique.

- [ ] 5 thèmes : Solarpunk, Cyberpunk, Minimal, Glass Dark, Glass Light
- [ ] **Moteur de Variables CSS** : Injection de `--theme-bg`, `--theme-accent`, `--theme-text`.
- [ ] **Contraste Typographique** : Toutes les instances de texte utilisent `--theme-text` pour rester lisibles sur fonds clairs.
- [ ] **Opacité Dynamique** : Conversion de l'accent en RGB (`--theme-accent-rgb`) pour permettre les transparences `rgba()`.

## Anti-Patterns
| ❌ | ✅ |
|----|-----|
| Couleurs de texte en dur (`text-white`) | Variable dynamique `--theme-text` |
| Z-index mal géré (fond noir) | Layering explicite L-10 (fond), L-9 (overlay), L0 (UI) |
| `#root` ou `body` opaque | `background: transparent` pour laisser voir le socle |
| Couleurs d'accent en dur (`text-emerald-400`) | Variable dynamique `--theme-accent` |
