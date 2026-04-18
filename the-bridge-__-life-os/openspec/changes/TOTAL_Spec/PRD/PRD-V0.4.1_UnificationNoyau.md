# PRD-V0.4.1 — Unification Noyau (The Enterprise Computer)

> **Phase** : V0.4.1 · **Statut** : 🏗️ Draft

## 1. TVR (Faisabilité / Valeur / Réutilisabilité)
- **T (Faisabilité)** : Haute. Les stores IndexedDB existent déjà. Le store Zustand existe. Il s'agit uniquement de créer un adaptateur de types et un hook de synchronisation (write-through cache).
- **V (Valeur)** : Critique. Actuellement, l'UI affiche des données statiques et la modale de création écrit dans le vide. Sans cette étape, PARA n'est qu'un mockup. 
- **R (Réutilisabilité)** : Le hook `useSyncLD` deviendra le standard de persistance pour tous les futurs frameworks (12WY, GTD, etc.).

## 2. User Stories (Phase A & B)

### Phase A : Adaptateur de Données
> En tant que système, je dois pouvoir convertir un `Project` enrichi (UI) vers un `ParaItem` simplifié (IndexedDB) sans perte d'information.

- **US-30 : L'Adaptateur `paraAdapter.ts`**
  - **Critères d'acceptation** :
    - [ ] Création du fichier `src/utils/paraAdapter.ts`.
    - [ ] Fonction `projectToParaItem` implémentée.
    - [ ] Fonction `paraItemToProject` implémentée.
    - [ ] Le type `ParaItem` (dans `ld01.store.ts` → `ld08.store.ts`) est étendu avec les champs optionnels.

### Phase B : Synchronisation Bidirectionnelle
> En tant qu'utilisateur, mes actions CRUD dans l'interface doivent être persistées dans les bases de données souveraines (IndexedDB) et restaurées au rechargement.

- **US-31 : Le Hook `useSyncLD()`**
  - **Critères d'acceptation** :
    - [ ] Création de `src/hooks/useSyncLD.ts`.
    - [ ] Au chargement (mount), le hook lit les 8 bases LD via `ld-router.ts`.
    - [ ] Les données lues hydratent le store `fw-para.store.ts`.
- **US-32 : CRUD complet dans `fw-para.store.ts`**
  - **Critères d'acceptation** :
    - [ ] Les actions `addProject`, `updateProject`, `deleteProject`, `archiveProject` existent dans le store Zustand.
    - [ ] Omission : Retrait des seed data (fake data) du store initial.
    - [ ] Chaque action Zustand déclenche une écriture asynchrone via `ld-router.writeToLD()`.
- **US-33 : Câblage UI de base**
  - **Critères d'acceptation** :
    - [ ] Le bouton "New" du header dans `ParaApp.tsx` ouvre `ItemModal`.
    - [ ] La sauvegarde d'`ItemModal` appelle `addProject()`.
    - [ ] Le bouton "Archive" dans `ProjectDetailPanel` appelle `archiveProject()`.

## 3. Anti-Patterns
| ❌ | ✅ |
|----|----|
| Sauvegarder l'état PARA dans `localStorage` via Zustand persist | Désactiver ou limiter stringify du store persisté, la vérité est IndexedDB |
| Modifier les fichiers LD01-08 un par un | Mettre à jour l'interface `ParaItem` partagée ou dans un seul fichier central si unifiée |
| Appeler l'API IndexedDB directement depuis les composants React | Passer strictement par les actions Zustand qui gèrent l'effet de bord (write-through cache) |
| Dupliquer les données lors d'un archivage | Changer le statut `project.status = 'archived'` et synchroniser. |

## 4. Fichiers Impactés
- `src/stores/fw-para.store.ts` (Modifié)
- `src/stores/ld01.store.ts` (Modifié)
- `src/utils/paraAdapter.ts` (Nouveau)
- `src/hooks/useSyncLD.ts` (Nouveau)
- `src/apps/para/ParaApp.tsx` (Modifié)
