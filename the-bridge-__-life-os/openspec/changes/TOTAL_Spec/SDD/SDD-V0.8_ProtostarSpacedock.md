# SDD — Spec-Driven Development (The Gravity Bridge)

## Méta-Données
* **Version** : V0.8 (V0.8.1 à V0.8.4)
* **Nom de Code** : "The Protostar Spacedock" (DEAL Profond)
* **Auteur** : A'"0 (GravityClaw)
* **Architecte Ciblé** : A"1 (Rick) / A"2 (Doctors)
* **Exécutant Ciblé** : A3 (Gemini CLI / IronClaw)
* **Statut** : Approuvé

---

## 1. L'Intention Stratégique (Le Pourquoi)
DEAL est l'Enclume. C'est le lieu où les projets PARA archivés et les tâches itératives (frictions) viennent mourir pour être déconstruits, éliminés ou codés. L'objectif est de transformer cette vitrine en un véritable moteur économique souverain, capable d'absorber des projets, de gérer un workflow de transition d'état, et de renvoyer l'argent/temps gagné vers les compteurs centraux temporels de l'A'Space OS.

---

## 2. Décisions Architecturales Majeures (ADR-Core)

### 2.1 Hub Économique Indépendant
* Migration sur le `ld-router.ts`. Pour accueillir potentiellement des centaines de frictions et de Muses, le système ne peut dépendre du `localStorage`. 

### 2.2 Cross-Boundary Data Absorption
* L'architecture doit permettre l'absorption directe. Une fonction `absorbProjectAsFriction` servira de "Hook" dans le store DEAL. L'application PARA ne fera qu'appeler poliment cette fonction pour se débarrasser de ses archives.

### 2.3 Le Moteur de Mouvement (La Machine à États)
* Actuellement bloqué, le pipeline D-E-A-L exigera une simple fonction `updateDealItem(id, patch)`. Mais plus structurellement, la transformation d'un DealItem en "Muse" ne supprimera pas bêtement l'ancienne entité. La traçabilité doit demeurer.

### 2.4 Le "Revenue Bridge" & "Time Tax"
* C'est le ROI du système. `fw-wheel.store` invoquera une lecture sur `fw-deal.store` ou directement dans `ld06` pour additionner les USD générés par les Muses. Pareil pour `fw-12wy.store` qui calculera le poids de maintenance des "Drones" pour l'afficher dans les matrices temporelles.

---

## 3. Plan de Décomposition (Pipeline S-P-A-D)

### Itération V0.8.1 — Migration Souveraine
**Cible :** `stores/fw-deal.store.ts`
* Supression de `persist`. Configuration d'un `LDId` (par exemple `ld06/deal` et `ld06/muses`). Implémentation du loader et des upserts. Purge des `SEED_MUSES`.

### Itération V0.8.2 — Le Sas de Décompression
**Cibles :** `stores/fw-deal.store.ts` et `apps/para/`
* Création de `absorbProjectAsFriction(projectId, title, reasoning)`. Câblage du bouton "Transfer to DEAL" dans la section Archive de PARA pour invoquer cette commande.

### Itération V0.8.3 — Le Pipeline D-E-A-L
**Cibles :** `stores/fw-deal.store.ts` et vues de liste
* Implémentation de `updateDealItem` (pour passer de 'define' vers 'automate', etc.). Modification des interfaces pour permettre ce mouvement fluide (Boutons fléchés, action rapide).

### Itération V0.8.4 — Le Nexus Ascendant Économique
**Cibles :** `fw-wheel.store.ts` et `fw-12wy.store.ts`
* Conception des sélecteurs hybrides lisant les Muses "achieved" pour injecter la variable d'enrichissement. L'OS devient un système vivant.
