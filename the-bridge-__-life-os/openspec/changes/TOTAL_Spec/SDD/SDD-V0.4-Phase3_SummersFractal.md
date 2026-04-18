# SDD — Spec-Driven Development (The Gravity Bridge)

## Méta-Données
* **Version** : V0.4 Phase 3 (V0.4.7 à V0.4.9)
* **Nom de Code** : "The Summers Fractal & The Forge"
* **Auteur** : A'"0 (GravityClaw)
* **Architecte Ciblé** : A"1 (Rick) / A"2 (Doctors)
* **Exécutant Ciblé** : A3 (Gemini CLI / IronClaw)
* **Statut** : Approuvé

---

## 1. L'Intention de l'Ikigai & Mythologie (Le Pourquoi)
La macro-structure doit se refléter dans la micro-structure. Un projet actif (Instance Summers / Picard) n'est pas un simple titre, c'est un hologramme du Domaine (Jerry / Spock) auquel il appartient. 

**L'objectif de cette phase est double :**
1. **The Summers Fractal** : Injecter le "Business Pulse" (les 8 Piliers de l'Entreprise) directement au cœur de la Carte de Commandement d'un projet "Business". Cela permet un découpage tactique intra-projet sans créer de sous-projets complexes.
2. **The Forge** : Activer l'ingénierie Geordi La Forge (Ressources). La création et la liaison de savoirs (Resources) depuis un projet doivent se faire sans friction formuaire (pas de dropdown pour resélectionner le projet). L'OS doit auto-déduire le contexte courant et l'injecter.

---

## 2. Décisions Architecturales Majeures (ADR-Core)

### 2.1 L'Élasticité de la Fractale (Sobriété Intelligente)
* Le store `fw-para.store.ts` doit étendre l'interface `Project` avec `pillarsContent?: Partial<Record<BusinessPillar, string>>`.
* **Isolement Strict** : La fractale des 8 piliers ne s'affiche **QUE** si `project.domain === 'business'`. Les projets `health` ou `cognition` conservent une interface standard.
* **UX State** : Les slots sont grisés (inactifs) par défaut. Le clic les active (state local React) et affiche la zone de texte. La sauvegarde vers IndexedDB n'a lieu qu'à la saisie (avec debounce).

### 2.2 Auto-Injection Contextuelle (La Forge)
* La modale de création de ressource appelée depuis un "Project Command Card" est "Context-Aware" (Consciente).
* **Au Save** : L'ID du projet parent et son `domain` sont attachés silencieusement au payload de la nouvelle Ressource via `addResource`.

### 2.3 Search & Link (Moteur de Recherche)
* Lecture asynchrone / selector dérivé sur `useParaStore` pour lister toutes les ressources existantes non-liées au projet courant.
* Affichage de mini-cartes (Previews) pour les ressources effectivement liées dans la vue Projet.

---

## 3. Plan de Décomposition (Pipeline S-P-A-D)

### Itération V0.4.7 — La Fractale de Summers
**Cible :** `ProjectCommandCard.tsx`, `fw-para.store.ts`
* Étendre le type `Project` avec `pillarsContent`.
* Intégrer un composant `ProjectFractal` conditionnel au `domain === 'business'`.
* Grille 8 slots, activation locale, sauvegarde conditionnelle.

### Itération V0.4.8 — Le Workflow de la Forge
**Cible :** `ProjectCommandCard.tsx`, `ResourceModal.tsx` 
* Bouton `+ Create Resource` injecté dans la section "Resources" de Picard.
* Modale simplifiée cachant les select de contextes.
* Sauvegarde avec `projectId` auto-injecté.

### Itération V0.4.9 — Le Workflow de Liaison & Affichage
**Cible :** `ProjectCommandCard.tsx`, `ResourceLinker.tsx`
* Bouton `Link Existing` + Vue "Search Bar".
* Composant de "Mini Preview Card" affichant les ressources liées.
* Extension du type `Project` avec `linkedResources?: string[]` (array d'IDs).

---
*Ce SDD impose des contraintes de frugalité (Store Zustand minimal, UI CSS pure, pas de dépendances externes). Il passe à présent aux A1/A2 pour la rédaction des PRD et ADR détaillés.*
