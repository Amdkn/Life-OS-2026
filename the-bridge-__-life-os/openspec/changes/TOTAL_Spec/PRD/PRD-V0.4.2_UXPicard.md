# PRD-V0.4.2 — UX Picard (The Enterprise Computer)

> **Phase** : V0.4.2 · **Statut** : 🏗️ Draft

## 1. TVR (Faisabilité / Valeur / Réutilisabilité)
- **T (Faisabilité)** : Élevée. Retirer le composant `ProjectDetailPanel` et créer `ProjectCommandCard` est standard. Le défi réside dans les connexions inter-stores sans boucle infinie.
- **V (Valeur)** : Majeure. Transforme PARA d'une liste de tâches glorifiée en un véritable centre de commandement spatial pour chaque projet (UX Picard). 
- **R (Réutilisabilité)** : Le pattern "Central Command Card" sera le standard pour GTD (Review Mode) et DEAL (Muse Mode).

## 2. User Stories (Phase A, B & C)

### Phase A : Central Command Card
> En tant que Capitaine (Picard), je veux voir mon projet au centre de l'écran sans qu'un tiroir latéral étriqué ne limite ma vision.

- **US-34 : Destruction du Slide-out**
  - **Critères d'acceptation** :
    - [ ] `ProjectDetailPanel.tsx` est supprimé du code.
    - [ ] Création de `ProjectCommandCard.tsx` (modale plein cadre, `absolute inset-0`).
    - [ ] L'UI affiche une barre de progression large modifiable au clic (0% → 100%).

### Phase B : Ponts Inter-Frameworks
> En tant qu'utilisateur, je veux pouvoir sauter d'un projet vers ses ressources (Geordi), ses actions (GTD) ou ses trimestres (12WY) instantanément.

- **US-35 : Le Pont Resources (Geordi)**
  - **Critères d'acceptation** :
    - [ ] Affiche les noms des ressources (pas juste les IDs). Si `resource_1` est dans le store PARA, faire le lookup.
- **US-36 : Le Pont GTD/12WY**
  - **Critères d'acceptation** :
    - [ ] Création du composant `FrameworkBridge.tsx`.
    - [ ] Affiche un résumé (ex: "3 Actions Next", "1 Goal Q3") via des selecteurs croisés sur `fw-gtd.store` et `fw-12wy.store`.
    - [ ] Bouton d'ouverture qui utilise `openApp('gtd')` ou `openApp('twelve-week')`.

### Phase C : Éditeur Inline & Cycle de Vie
> En tant que Manager, je dois modifier le statut, le titre ou les piliers sans quitter la vue de commandement.

- **US-37 : Édition Inline**
  - **Critères d'acceptation** :
    - [ ] Titre du projet cliquable pour édition en place.
    - [ ] Sélecteur de piliers (checkboxes) connectés à l'action `updateProject`.
- **US-38 : Archive & Delete**
  - **Critères d'acceptation** :
    - [ ] Bouton Archive change le status et ferme la carte.
    - [ ] Bouton Delete avec confirmation native (`window.confirm`) appelle `deleteProject` et ferme la carte.

## 3. Anti-Patterns
| ❌ | ✅ |
|----|----|
| Utiliser un composant `Drawer` ou `Sidebar` pour le détail du projet. | Utiliser un espace large type "Dashboard interne" (`inset-0`). |
| Dupliquer les données d'une tâche GTD dans le store PARA. | Stocker l'ID du projet (`linkedProject`) dans GTD. Le composant Bridge PARA lit l'ID. |
| Importer massivement le store GTD dans PARA. | Utiliser un sélecteur léger `const count = useGtdStore(s => s.items.filter(...))` |
| Bouton Edit qui ouvre encore une autre modale par dessus. | Édition "in-place" directement sur la Command Card. |

## 4. Fichiers Impactés
- `src/apps/para/ParaApp.tsx` (Modifié)
- `src/apps/para/components/ProjectDetailPanel.tsx` (Supprimé)
- `src/apps/para/components/ProjectCommandCard.tsx` (Nouveau)
- `src/apps/para/components/FrameworkBridge.tsx` (Nouveau)
