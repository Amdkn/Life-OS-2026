# ADR-V0.8.5 — Le Radar à Frictions (Pont GTD -> DEAL)

## 1. Contexte & Problème
Les tâches répétitives sont le signal le plus fort d'un besoin d'automatisation. Actuellement, si une tâche GTD se répète insidieusement, l'utilisateur doit ouvrir DEAL et re-taper manuellement la tâche pour lancer une réflexion.

## 2. Décisions (Crosstalk GTD -> DEAL)

### 2.1 Action d'Extraction Silencieuse
Dans `EngageView.tsx` (app GTD), un nouveau bouton sera présent sur la carte de chaque tâche Actionable : *Send to Spacedock*.
Au clic, l'application procédera à 2 actions asynchrones successives :
1. `useDealStore.getState().createDefinitionFromText(task.content)` (Appel externe vers le store DEAL)
2. `useGtdStore.getState().processItem(task.id, { status: "incubating" }, "Transferred to Spacedock for Reverse Engineering")` (Manipulation interne GTD).

### 2.2 Zéro Stockage Croisé Lourd
Contrairement à PARA où nous gardions le `projectId`, GTD et DEAL n'ont pas besoin de maintenir une relation active. DEAL s'approprie la tâche, GTD la met en jachère (`incubating` ou `completed` selon ce qui est choisi dans le DDD). Le couplage de données reste donc extrêmement lâche.

## 3. Conséquences & Isolation
*   Renforce le principe de "Mind Like Water". Dès qu'une tâche devient une friction mentale reconnue, un clic l'extrait de la boucle d'exécution quotidienne pour la placer dans le chantier de réparation structurelle (DEAL).
*   L'UI d'exécution GTD (`EngageView.tsx`) devient réactive à son environnement.

## 4. Étapes DDD (A3)
*   **Étape A** : Ajouter l'icône/bouton dans le mapping de `EngageView.tsx`.
*   **Étape B** : Implémenter le Handler qui appelle les deux stores simultanément.
