# SDD — Spec-Driven Development (The Gravity Bridge)

## Méta-Données
* **Version** : V0.8 Phase 2 (V0.8.5 à V0.8.8)
* **Nom de Code** : "The Replicator Forge" (DEAL Avancé)
* **Auteur** : A'"0 (GravityClaw)
* **Architecte Ciblé** : A"1 (Rick) / A"2 (Doctors)
* **Exécutant Ciblé** : A3 (Gemini CLI / IronClaw)
* **Statut** : Approuvé

---

## 1. L'Intention Stratégique (Le Pourquoi)
La Phase 1 a doté DEAL d'une base de données persistante et d'un tuyau depuis PARA. Mais il manque l'intelligence de la Machine. La Phase 2 transforme ce module en un système de ciblage et d'exécution automatiques. L'OS devient capable d'aspirer de la friction depuis GTD, de s'exécuter via N8N/Webhooks, et de calculer froidement le ROI du temps investi pour ne retenir que les "Muses" rentables.

---

## 2. Décisions Architecturales Majeures (ADR-Core)

### 2.1 Le Hook GTD (Reverse-Transfer)
* Le flux naturel veut qu'une tâche répétitive devienne une friction. La vue Engage de GTD (V0.7.4) gagne le pouvoir de déclencher une action "Send to Spacedock" qui dialogue avec le store DEAL pour injecter le titre et le contexte de la tâche en tant que `DealItem` en statut `define`. La tâche GTD est ensuite validée/archivée.

### 2.2 Zéro Fausse Promesse (Data Model Muse V2)
* La `Muse` gagne les attributs `buildCost: number` (le temps investi pour la créer) et `webhookUrl?: string`. La notion de Rentabilité (Break-Even) devient calculable : `(buildCost / (revenueEstimate ou timeSaved))`. L'UI implémente cette mathématique pour afficher une timeline ROI.

### 2.3 Executable Webhooks (Active Action)
* Une Muse n'est plus seulement une pancarte passive. Un composant `<ExecutionTrigger>` fera un simple `fetch()` POST local ou distant (vers N8N ou un endpoint localhost). Pas de dépendance tierce à installer, l'OS natif s'en charge.

### 2.4 Lifecycle MCO (Sunsetting)
* La variable `status` de la Muse s'étend en `'operational' | 'failing' | 'deprecated'`.
* Un statut qui chute en `failing` retire ses bénéfices de la "Life Wheel" et augmente sa pondération (Taxe Temporelle) dans le 12WY, ce qui déclenchera un signal visuel de dette technique sur les Dashboards centraux.

---

## 3. Plan de Décomposition (Pipeline S-P-A-D)

### Itération V0.8.5 — Radar à Frictions (Pont GTD)
**Cibles :** `src/apps/gtd/pages/EngageView.tsx` & `fw-deal.store.ts`
* Création du pont interactif permettant à une tâche GTD d'être clonée en friction et décommissionnée de la to-do list en un clic.

### Itération V0.8.6 — Le Moteur de Rentabilité (ROI/MCO)
**Cibles :** `fw-deal.store.ts` et `src/apps/deal/pages/Muses.tsx`
* Extension typographique (`buildCost`, nouveaux statuts). Refactor de l'UI pour intégrer les jauges de Break-Even et la colorimétrie MCO (Bleu = Opérationnel, Rouge = Failing).
* Ajustement dynamique des exports vers Wheel/12WY selon le statut `operational`.

### Itération V0.8.7 — Le Pont Exécutif (The Core)
**Cibles :** `src/apps/deal/pages/Muses.tsx` (Carte détaillée)
* Ajout du bouton d'orchestration (Run Protocol). Intégration d'un handler de `fetch()` protégé. Si une URL est vide, le bouton est grisé.

### Itération V0.8.8 — La Nécropole des Drones
**Cibles :** `src/apps/deal/pages/Muses.tsx` ou nouvelle route
* Remplacement de la méthode de suppression par l'archivage `deprecated`. La Muse sort des calculs MRR mais reste listée dans une section "Graveyard / Archives".
