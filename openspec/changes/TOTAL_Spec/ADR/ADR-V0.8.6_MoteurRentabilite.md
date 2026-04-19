# ADR-V0.8.6 — Le Moteur de Rentabilité (MCO & ROI)

## 1. Contexte & Problème
Une automatisation (Muse) coûte de l'énergie à créer et à maintenir. Sans ces métriques, les Muses DEAL ne sont que des "vanity metrics". Nous devons forcer l'OS à calculer son propre Retour Sur Investissement (ROI).

## 2. Décisions (Type Extension & Mathématiques pures)

### 2.1 Évolution Typographique
L'interface `Muse` dans `fw-deal.store.ts` est étendue :
```typescript
export interface Muse extends LdEntity {
    // Existant :
    // title, revenueEstimate, timeCost
    
    // Nouveaux :
    buildCost: number; // Heures investies pour la créer
    status: 'candidate' | 'testing' | 'operational' | 'failing' | 'deprecated';
}
```

### 2.2 Calcul du Break-Even (Temps)
Le ROI est calculé dans l'UI (`Muses.tsx`) via `useMemo`.
Si une automatisation "Sauve" 2 heures par semaine, et nous a coûté 10 heures à construire :
`BreakEven Weeks = buildCost / timeSavedWeek`.
Si l'unité monétaire est engagée, la formule est similaire. L'UI doit indiquer visuellement s'il est rentable d'avoir codé ce script.

### 2.3 Conditionnement du Nexus Ascendant
Dans `fw-wheel.store.tsx` et `TimeUseMatrix.tsx` (modifiés en phase 1), le calcul des Muses actives doive être restreint. Le filtre `status !== 'candidate'` devient `status === 'operational'`. Une muse `failing` ne rapporte rien.

## 3. Conséquences & Isolation
*   La dette technique d'une automatisation devient transparente et mesurable par le Commanditaire en temps réel.
*   Les sélecteurs des autres applications doivent obligatoirement vérifier le Maintien en Condition Opérationnelle (`operational`) avant de s'octroyer des victoires métriques.

## 4. Étapes DDD (A3)
*   **Étape A** : Update du type `Muse` dans le store et gestion de `buildCost`.
*   **Étape B** : Injecter le module de calcul dans les composants cartes de `Muses.tsx`.
*   **Étape C** : Modifier le code Phase 1 de LifeWheel et 12WY pour resserrer le filtre sur `operational`.
