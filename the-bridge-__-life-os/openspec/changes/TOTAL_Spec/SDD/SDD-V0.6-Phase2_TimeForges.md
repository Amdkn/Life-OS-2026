# SDD — Spec-Driven Development (The Gravity Bridge)

## Méta-Données
* **Version** : V0.6 Phase 2 (V0.6.4 à V0.6.6)
* **Nom de Code** : "The Time Forges" (UI & Nexus)
* **Auteur** : A'"0 (GravityClaw)
* **Architecte Ciblé** : A"1 (Rick) / A"2 (Doctors)
* **Exécutant Ciblé** : A3 (Gemini CLI / IronClaw)
* **Statut** : Approuvé

---

## 1. L'Intention Temporelle (Le Pourquoi)
L'implémentation de la Phase 1 du 12WY (V0.6.1-V0.6.3) a vu l'émergence d'un "Miracle Fainéant" par l'A3 IronClaw, recourant à des `window.prompt` d'une autre époque pour créer les entités, détruisant ainsi la sacro-sainte immersion Glassmorphism de l'A'Space OS et rendant **impossible la sélection des clés de liaison (le Nexus) avec PARA et Ikigai**.
Cette Phase 2 vise à extirper ces boîtes de dialogue natives et à forger l'UI finale : **les 3 Modales d'Exécution**. Elles forceront le Commanditaire à lier la manœuvre temporelle (12WY) à l'espace dimensionnel (PARA) et à la direction (Ikigai).

---

## 2. Décisions Architecturales Majeures (ADR-Core)

### 2.1 Le Véto sur les API Natives
* L'utilisation de `window.prompt`, `window.alert` ou `window.confirm` est strictement prohibée. Tout doit passer par les composants React d'A'Space OS.

### 2.2 La Triade des Modales (Les Consoles)
* `<VisionForgeModal />` : Crée une `WyVision`. Doit interroger le store `fw-ikigai` pour choisir un `IkigaiVisionId`.
* `<GoalForgeModal />` : Crée un `WyGoal`. Doit scanner le store `fw-para` pour lier le Goal à un `projectId` (Obligatoire).
* `<TacticForgeModal />` : Crée une `WyTactic`. Affecte la tactique à une ou plusieurs `week`. Doit inclure un hook prévisionnel pour V0.7 (Auto-generate Next Actions in GTD).

### 2.3 Symbiose Inter-Store (Cross-Store Data)
Les modales importent différents "hooks de lecture" Zustand (e.g., `useParaStore(s => s.projects)`) pour peupler leurs listes déroulantes (`select`). Ce n'est pas une violation d'isolation car c'est un `read-only` pour mapper une clé étrangère (Data Normalization React). L'écriture reste confinée au composant via l'exécution de l'action `fw-12wy.store`.

---

## 3. Plan de Décomposition (Pipeline S-P-A-D)

### Itération V0.6.4 — La Forge de Vision (Pike's Console)
**Cible :** `TwelveWeekApp.tsx`, `VisionForgeModal.tsx`
* Remplacement du prompt de Titre Vision par `<VisionForgeModal>`.
* Sélection d'une vision mère depuis `useIkigaiStore`.

### Itération V0.6.5 — La Forge d'Objectif (Una's Console)
**Cible :** `TwelveWeekApp.tsx`, `GoalForgeModal.tsx`
* Remplacement du prompt du Goal par `<GoalForgeModal>`.
* Sélection d'un Projet PARA Actif depuis `useParaStore`. Option bonus de raccourci création projet.

### Itération V0.6.6 — La Forge Tactique (M'Benga's Console)
**Cible :** `TwelveWeekApp.tsx`, `TacticForgeModal.tsx`
* Remplacement du prompt de Tactical execution.
* UI de sélection de Semaine (W1-W12) et Flag visuel préparatoire (V0.7 GTD Generator).
