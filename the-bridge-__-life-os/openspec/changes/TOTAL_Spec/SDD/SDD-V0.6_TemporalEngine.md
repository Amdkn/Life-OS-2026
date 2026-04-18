# SDD — Spec-Driven Development (The Gravity Bridge)

## Méta-Données
* **Version** : V0.6 (V0.6.1 à V0.6.3)
* **Nom de Code** : "The Temporal Engine" (12 Week Year)
* **Auteur** : A'"0 (GravityClaw)
* **Architecte Ciblé** : A"1 (Rick) / A"2 (Doctors)
* **Exécutant Ciblé** : A3 (Gemini CLI / IronClaw)
* **Statut** : Approuvé

---

## 1. L'Intention Temporelle (Le Pourquoi)
Si la "Constitution" V0.5 est l'Ancre Spatiale (Ikigai/Domaines), le 12WY V0.6 est le Moteur Temporel. Le constat d'audit a révélé un UI factice. L'objectif de la V0.6 est de détruire cette illusion pour injecter les véritables mathématiques du livre de Brian P. Moran : la corrélation absolue entre l'achèvement des Tactiques hebdomadaires et l'accomplissement des Objectifs de 12 semaines. Le 12WY ne doit pas gérer les micro-tâches (réservées à GTD V0.7), mais dicter un rythme de marche impitoyable et vérifiable.

---

## 2. Décisions Architecturales Majeures (ADR-Core)

### 2.1 L'Hérésie du Type Unique (La Division)
* **Destruction du type générique `Goal`** existant dans `fw-12wy.store.ts`.
* **Création de la Trinité 12WY** :
   - `WyVision` : Horizon stratégique 3-5 ans.
   - `WyGoal`   : L'Objectif lourd des 12 semaines en cours.
   - `WyTactic` : L'Action Militaire affectée à l'une des 12 semaines (Tactic > Project > Action).

### 2.2 Migration vers IndexedDB Centrale
* Remplacement strict du middleware `persist` (`localStorage`) dans `fw-12wy.store.ts` par le routeur `readFromLD` / `writeToLD` (Base System 12WY via LD-Router).

### 2.3 Le Moteur Measurement
* Suppression des `scores` manuels (SEED_DATA).
* Le "Weekly Execution Score" est dérivé (Selector Zustand) : `(Tactics_Complétées_Semaine_X / Total_Tactics_Semaine_X) * 100`.
* Seuil critique d'Interface : UI en état d'alerte (Rouge/Orange) si la semaine s'achève sous `< 85%`.

### 2.4 Le Croisement PARA & Time Use
* Un Projet (PARA) appartient à un `WyGoal`. Il ne justifie son existence que s'il sert l'objectif du trimestre.
* Interface : La "Semaine Active" (Active Week view) affiche des slots pour bloquer le Temps Stratégique, le Temps Buffer, et le Breakout.

---

## 3. Plan de Décomposition (Pipeline S-P-A-D)

### Itération V0.6.1 — Destruction du Mirage
**Cible :** `fw-12wy.store.ts`
* Refonte complète des contrats TypeScript (`WyVision`, `WyGoal`, `WyTactic`).
* Migration vers IndexedDB et suppression du stockage factice.

### Itération V0.6.2 — La Mathématique de l'Exécution
**Cible :** `MeasurementDashboard.tsx`, `fw-12wy.store.ts`
* Conception du moteur de calcul hebdomadaire (Score en temps réel).
* CSS conditionnel basé sur la limite des 85% de complétion.

### Itération V0.6.3 — Le Nexus Temporel
**Cible :** `TimeUseBlocker.tsx`, `ProjectCommandCard.tsx` (PARA)
* Intégration du composant de Time Blocking (SB/BB/BOB) dans le 12WY.
* Connecteur top-down dans les Projets PARA (Lier un Projet à un `WyGoal`).
