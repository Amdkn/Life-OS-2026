# ADR-V0.6.9 — Goal Central Command (Salle Tactique)

## 1. Contexte & Problème
À l'instar de la Vision, le Goal de 12 Semaines est l'entonnoir d'exécution le plus important du vaisseau. L'utilisateur doit réunir en un seul écran ses Tactiques (Semainier), les projets qui soutiennent l'Objectif (PARA), la Forge et agir (GTD Inbox placeholder).

## 2. Décisions (Le Superviseur d'Exécution)

### 2.1 L'État Tactique Actif
```typescript
// hw-12wy.store.ts
interface TwelveWeekState {
   // ...
   activeGoalId: string | null;
   setActiveGoalId: (id: string | null) => void;
}
```

### 2.2 Execution Bridge Layout
La `<GoalCommandCard />` sera scindée en deux colonnes majeures :
*   **Left Column (Tactical Board) :** Affichage des `WyTactics` de M'Benga, triées de W1 à W12, avec leurs statuts d'exécution et des checkboxes interactives.
*   **Right Column (The Nexus) :** 
    *   **PARA Frame :** Une mini `<ProjectCardReadonly />` affichant le projet pointé par `goal.projectId`. Un clic lance une navigation vers PARA Dashboard via la méthode `Global Router` (si existante, sinon une action simple comme un message *Go to PARA*).
    *   **GTD Frame :** Une boîte d'Inbox fantôme (préparation V0.7) indiquant "System Linked".

## 3. Conséquences & UI
L'OS gagne son composant le plus productif. On ne regarde plus son trimestre via un tableur statique, mais via une véritable salle de contrôle intégrant le futur et l'immédiat. Le design doit être irréprochable et aéré.

## 4. Étapes DDD (A3)
*   **Étape A** : Ajouter `activeGoalId` à `fw-12wy.store.ts`.
*   **Étape B** : Créer le mastodonte CSS/React `<GoalCommandCard />`.
*   **Étape C** : Implémenter les "Mini Readonly Cards" (Pont de visualisation).
*   **Étape D** : Câbler les composants de click-through pour ouvrir ces "Cartes" depuis les tables de la Vue d'Ensemble existante.
