# ADR-V0.4.2 — UX Picard (The Enterprise Computer)

> **Phase** : V0.4.2
> **Contexte** : Nécessité d'une vue centrale pour les projets et de liens avec les autres frameworks (12WY, GTD) sans créer de dépendances cycliques ou de duplication.

## Décision Architecturale : Résolution d'Identité Paresseuse (Lazy Lookup)

Pour connecter PARA avec GTD et 12WY, nous ne créons **pas** de tables de jointure compliquées, ni de duplications. Nous utilisons le principe d'ID en Foreign Key basique du côté de l'enfant.
- Un objet GTD (Next Action) possède `linkedProject: 'prj-123'`.
- Un objectif 12WY possède `projectIds: ['prj-123']`.
- Le projet PARA (Parent) ne liste pas ses actions GTD en dur dans son tableau.

La résolution se fait dans l'UI (React) au moment du rendu du composant bridge (`FrameworkBridge.tsx`), via un selecteur Zustand.

### Justification
Maintient l'isolation pure de chaque fichier `/stores/xx.store.ts`. Si le store GTD est supprimé, le store PARA ne plante pas (le sélecteur renverra juste une table vide ou ne sera pas affiché). Cela respecte l'Anti-fragilité (Loi de Rick).

## Phase A : Central Command Card

### Contrats TypeScript (AVANT/APRÈS)
Pas de changements sur les contrats de données de l'API. Changement purement fonctionnel/composant.

### Plan DDD Tabulé
| Étape | Fichier | Description | Gate |
|-------|---------|-------------|------|
| A.1 | `ProjectDetailPanel.tsx` | **Supprimer** physiquement le fichier. | `npx tsc --noEmit` |
| A.2 | `ProjectCommandCard.tsx` | Créer la structure `absolute inset-0 bg-black/90 z-50` avec header (Close), sidebar gauche (détails) et main court (widgets). | `npx tsc --noEmit` |
| A.3 | `ParaApp.tsx` | Remplacer l'import de `ProjectDetailPanel` par `ProjectCommandCard`. | `npm run gate` |

## Phase B : Ponts Inter-Frameworks

### Plan DDD Tabulé
| Étape | Fichier | Description | Gate |
|-------|---------|-------------|------|
| B.1 | `FrameworkBridge.tsx` | Composant Widget : accepte un projet, interroge `useGtdStore` (`items.filter(i => i.linkedProject === project.id)`) et affiche le count. | `npx tsc --noEmit` |
| B.2 | `ProjectCommandCard.tsx` | Insérer la grille de widgets : GTD Bridge, 12WY Bridge, Resources Bridge (lecture de `useParaStore(s => s.resources)`). | `npx tsc --noEmit` |

## Phase C : Éditeur Inline

### Plan DDD Tabulé
| Étape | Fichier | Description | Gate |
|-------|---------|-------------|------|
| C.1 | `ProjectCommandCard.tsx` | Lier `<input>` du titre à `updateProject`. Ajouter sélection de `pillars` avec style `DomainConfig`. | `npx tsc --noEmit` |
| C.2 | `ProjectCommandCard.tsx` | Boutons Archive (`archiveProject`) et Delete (`deleteProject` + `window.confirm`). Fermer modale après action. | `npm run gate` |
