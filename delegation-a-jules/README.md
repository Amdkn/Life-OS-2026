# Guide d'Orchestration des Délégations Jules & Blocs de PRD

Ce document est le **Meta-Routeur de Délégation de Life OS 2026**.
Il structure le développement en **domaines complets (blocs de PRD cohérents)**, où la numérotation des catégories est strictement alignée sur les préfixes numériques des PRDs.

---

## 1. Cartographie Alignée des Catégories & PRDs

| Catégorie | Domaine Fonctionnel | Plage de PRD | Dossier Dédié |
| :--- | :--- | :--- | :--- |
| **Catégorie 0** | **12 Week Year & Tactical Focus (SNW)** | PRD-001 à PRD-006 | [categorie-0-12wy-snw/](./categorie-0-12wy-snw) |
| **Catégorie 1** | **Agent Portal & Blackboard Local** | PRD-011 à PRD-015 | [categorie-1-agent-portal/](./categorie-1-agent-portal) |
| **Catégorie 2** | **AI-Native Business Bridge (BOS Adapters)** | PRD-021 à PRD-025 | [categorie-2-ai-native-business-bridge/](./categorie-2-ai-native-business-bridge) |
| **Catégorie 3** | **PARA Enterprise V2 Distillation** | PRD-031 à PRD-035 | [categorie-3-para-enterprise-distillation/](./categorie-3-para-enterprise-distillation) |
| **Catégorie 4** | **Life OS 6 Frameworks (Identités & Vaisseaux)** | PRD-041 à PRD-045 | [categorie-4-life-os-6-frameworks/](./categorie-4-life-os-6-frameworks) |
| **Catégorie 5** | **Convergence Life/Business via Blackboard & Jules API** | PRD-051 à PRD-055 | [categorie-5-convergence-blackboard-jules-api/](./categorie-5-convergence-blackboard-jules-api) |

---

## 2. Directives Déterministes pour Jules (Google Labs)

1. **Un mandat par catégorie :** Jules reçoit l'instruction de traiter l'intégralité du brief d'une catégorie sans saucissonnement flou.
2. **Pas d'écrasement monolithique :** Interdiction d'écraser des stores (w-12wy.store.ts) ou des composants vitaux d'un seul bloc pour éviter les échecs de diffs git.
3. **Vérification systématique :** Chaque session doit valider 
pm run lint et 
pm run build à 0 erreur avant la création de la Pull Request.
4. **Local-First & Zéro Dette :** Aucune dépendance 
ode_modules lourde ni mock statique n'est toléré dans le code source.
