# SDD — Spec-Driven Development (The Gravity Bridge)

## Méta-Données
* **Version** : V0.5 (V0.5.1 à V0.5.3)
* **Nom de Code** : "The Sovereign Constitution" (Ikigai & Life Wheel)
* **Auteur** : A'"0 (GravityClaw)
* **Architecte Ciblé** : A"1 (Rick) / A"2 (Doctors)
* **Exécutant Ciblé** : A3 (Gemini CLI / IronClaw)
* **Statut** : Approuvé

---

## 1. L'Intention de l'Ikigai (Le Pourquoi)
L'Ikigai et la Life Wheel doivent cesser d'être des mockups visuels pour devenir le **Livre des Lois** de The Watcher. 
Si la machine automatise sans principe, elle prend le contrôle. L'objectif est de permettre la création d'Ambitions (Life Wheel) et de Visions (Ikigai) profondes, immuablement ancrées dans le socle (les Horizons/Protocoles, ou les 8 Domaines). Ces principes doivent ensuite être confrontés mathématiquement à la réalité de l'exécution dans PARA.

---

## 2. Décisions Architecturales Majeures (ADR-Core)

### 2.1 Le Veto des Conteneurs (Anti-Pattern)
* **Les 8 Domaines de la Life Wheel et les Axes de l'Ikigai sont FIGÉS.**
* Le bouton `+ New` ne crée JAMAIS une nouvelle catégorie. Il crée un nœud de contenu (un "Vision Node" ou une "Ambition") *à l'intérieur* de ces conteneurs.

### 2.2 Migration vers IndexedDB
* Remplacement strict du middleware `persist` (`localStorage`) dans `fw-ikigai.store.ts` et `fw-wheel.store.ts` par le système `ld-router.ts`.
* La Configuration de l'Ikigai et du Life Wheel devient souveraine et persistée.

### 2.3 Le Pont Top-Down / Bottom-Up
* **Extension du Contrat PARA** : Un `Project` gagne un pointeur optionnel `ikigaiVisionId` et `wheelAmbitionId`.
* **Sélecteurs Dérivés** : L'Ikigai lira le sous-ensemble de Projets de PARA pointant vers ses Vision Nodes pour un affichage "Accordion".

### 2.4 Le Compas (Télémétrie)
* Le store `fw-wheel.store.ts` s'abonne (ou lit via selectors) aux stores PARA/GTD pour remplacer l'entrée manuelle par le "Ratio d'Exécution" (Projets complétés / actifs).

---

## 3. Plan de Décomposition (Pipeline S-P-A-D)

### Itération V0.5.1 — La Forge des Principes
**Cible :** `IkigaiApp.tsx`, `LifeWheelApp.tsx`, `fw-ikigai.store.ts`, `fw-wheel.store.ts`
* Création du composant `VisionNode` (CRUD).
* Création du composant `AmbitionNode` (CRUD).
* Migration vers IndexedDB et abandon du local storage persist.

### Itération V0.5.2 — Le Pont d'Irrigation
**Cible :** `ProjectCommandCard.tsx` (PARA), `IkigaiDetailPanel.tsx` (Ikigai)
* Ajout du Linker Ikigai/Ambition dans la carte projet (alignement).
* Accordéon dans Ikigai montrant les projets PARA liés.

### Itération V0.5.3 — Life Wheel Automatisée
**Cible :** `fw-wheel.store.ts`, `Dashboard.tsx` (Life Wheel)
* Implémentation du moteur de calcul du "Réel" vs "L'Ambition".
* Double calque sur le Radar Chart (CSS/SVG pur).
