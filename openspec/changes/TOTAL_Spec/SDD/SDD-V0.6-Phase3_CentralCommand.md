# SDD — Spec-Driven Development (The Gravity Bridge)

## Méta-Données
* **Version** : V0.6 Phase 3 (V0.6.7 à V0.6.9)
* **Nom de Code** : "Temporal Central Command" (12WY Profond & Câblage)
* **Auteur** : A'"0 (GravityClaw)
* **Architecte Ciblé** : A"1 (Rick) / A"2 (Doctors)
* **Exécutant Ciblé** : A3 (Gemini CLI / IronClaw)
* **Statut** : Approuvé

---

## 1. L'Intention Stratégique (Le Pourquoi)
Après avoir stabilisé la typologie (Phase 1) et l'interface de saisie de base (Phase 2), le 12 Week Year doit cesser d'être un simple tableau de bord statistique pour devenir le "Routeur d'Alignement" du vaisseau. L'application du Pattern Picard (les grandes cartes de commandement centrales introduites dans PARA) aux entités 12WY va fluidifier l'exécution top-down : 
Ikigai -> WyVision -> WyGoal -> WyTactic -> PARA Project -> GTD Action.

---

## 2. Décisions Architecturales Majeures (ADR-Core)

### 2.1 Le Nexus Absolu (Extension Typologique)
* La `WyVision` gagne une nouvelle clé étrangère optionnelle `domainId` pour lier la Vision stratégique à l'un des 8 Domaines de vie (Life Wheel). Conséquence : la modale `<VisionForgeModal>` doit scanner `fw-ikigai` (Store Ikigai) MAIS AUSSI `fw-wheel` (Store Life Wheel / Areas).

### 2.2 Le Pattern "Central Command" pour 12WY
* **La Carte Vision** : Remplace les listes déroulantes/tiroirs. Un clic sur une Vision ouvre la `<VisionCommandCard />` (pleine page ou overlay massif) affichant le lien Ikigai, les Goals enfants, et le statut global.
* **La Carte Goal** : L'interface ultime de la "Salle Tactique". La `<GoalCommandCard />` expose non seulement les Tactiques enfants, mais surtout le lien descendant vers PARA (Les projets) et les futures actions GTD.

### 2.3 Résolution Paresseuse (Zéro Duplication)
Zustand orchestrera la jointure asynchrone dans les composants `CommandCard`. Le `WyGoal` ne contiendra informatiquement que le string `projectId = 'prj-xyz'`. C'est le composant UI qui appellera `useParaStore` pour récupérer dynamiquement le nom et le statut du projet à afficher.

---

## 3. Plan de Décomposition (Pipeline S-P-A-D)

### Itération V0.6.7 — Les Formulaires de Genèse
**Cible :** `VisionForgeModal.tsx`
* En plus du `ikigaiVisionId`, la modale extraira les `WheelNode` de `useWheelStore` pour forcer le commandant à sélectionner un domaine d'impact (`domainId`).

### Itération V0.6.8 — Vision Central Command
**Cible :** `VisionCommandCard.tsx` (Nouveau)
* Modèle calqué sur la carte Projet PARA. Affiche le Dashboard de Vision avec ses liens ascendants (Ikigai/Wheel) et sa liste de Goals rattachés.

### Itération V0.6.9 — Goal Central Command
**Cible :** `GoalCommandCard.tsx` (Nouveau)
* Le centre nerveux de l'exécution trimestrielle. Affichage des Tactiques gérées, et blocs *Read-Only* tirés de Zustand : Les Projets PARA liés, les Ressources de la Forge liées, et l'Inbox GTD (Préparation V0.7).
