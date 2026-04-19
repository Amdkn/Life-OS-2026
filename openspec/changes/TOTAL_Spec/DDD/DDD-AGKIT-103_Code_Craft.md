# DDD-AGKIT-103 — Phase 3 : Code Craft (Amy & Clara Industrialization) 💎🧿

> **Contexte** : V1.2.0 (Industrialisation AG-KIT — Excellence du Code & Design)
> **PRD** : `_SPECS/prds/antigravity-kit-fusion_PRD.md`
> **ADR** : `_SPECS/adrs/ADR-AGKIT-001_Industrial_Fusion.md`
> **Standard** : A3 Industrial DDD (200-2000 lignes)

---

## ⚠️ PRÉ-REQUIS & ÉQUIPE
1. Agent **Rick** (A1 Orchestrator) : Supervision des standards.
2. Agent **Amy** (L0 A3 Designer) : Cible principale de l'upgrade UI/UX Radical.
3. Agent **Clara** (L0 A3 Processor) : Cible principale de l'upgrade Architecture Backend.
4. **Source Directory** : `C:\Users\amado\Antigravity-Kit-Source\.agent/`
5. **Standard BMad** : Chaque fichier ingéré DOIT comporter le Sceau 3-Tours.

---

## Phase 1 : Audit & Déconstruction (Clearing the Canvas)

### Fichiers de l'Édifice à auditer
- `src/components/` (Amy's Domain)
- `src/stores/` (Clara's Domain)
- `CONTRACTS.md` (Reference for invariants)

### Étapes concrètes
1. Vérifier l'existence des répertoires `skills/clean-code` and `skills/api-patterns` dans la source.
2. Analyser l'actuel `L0_A3_Amy.md` pour identifier les directives "artisanales" à supprimer.
3. Analyser l'actuel `L0_A3_Clara.md` pour les logiques de traitement de données.
4. Prévoir une structure de co-location pour les nouveaux composants industriels.

### Anti-patterns à traquer
- ❌ Ne pas laisser Amy utiliser des "Safe Splits" ou des "Bento Grids" par défaut.
- ❌ Empêcher Clara de mettre de la logique métier directement dans les composants UI.

### Build Gate ✅
```bash
ls .agent/skills/clean-code/SKILL.md
echo "Phase 1 : Audit Code Craft OK"
```

---

## Phase 2 : Ingestion Amy (Radical Designer Upgrade)

### Fichier Cible : `.agent/agents/L0_A3_Amy.md`
Ce fichier fusionne l'agent **`frontend-specialist.md`** du Kit avec l'identité de **Amy (Designer)**.

### Étapes concrètes
1. Initialiser le fichier avec le **Sceau BMad 3-Tours**.
2. Injecter la directive **Deep Design Thinking** : "DO NOT start designing until you complete the internal analysis."
3. Ajouter la section **Design Commitment** : Amy doit déclarer son style radical (Brutalist, Neo-Retro, etc.) avant de coder.
4. Imposer le **Maestro Auditor** : Rejet automatique des "Safe Harbors" (Gradients mous, Blue Trap, Purple Ban).
5. Définir le mandat de **Layout Diversification** : "Break the grid. Betray expectations."

### Build Gate ✅
```bash
grep "Maestro Auditor" .agent/agents/L0_A3_Amy.md
echo "Amy Upgrade OK"
```

---

## Phase 3 : Ingestion Clara (Architectural Processor Upgrade)

### Fichier Cible : `.agent/agents/L0_A3_Clara.md`
Ce fichier fusionne l'agent **`backend-specialist.md`** du Kit avec l'identité de **Clara (Processor)**.

### Étapes concrètes
1. Initialiser le fichier avec le **Sceau BMad 3-Tours**.
2. Définir la structure en couches : **Controller → Service → Repository**.
3. Imposer la validation systématique via **Zod/Pydantic** à la frontière de l'API.
4. Injecter les directives **API Style Selection** (REST vs GraphQL vs tRPC).
5. Ajouter le mandat de **Performance Measurement** : "Measure before optimizing."

### Build Gate ✅
```bash
grep "Controller → Service → Repository" .agent/agents/L0_A3_Clara.md
echo "Clara Upgrade OK"
```

---

## Phase 4 : Skill Clean-Code (The Master Rulebook)

### Répertoire Cible : `.agent/skills/clean-code/`

### Étapes concrètes
1. Ingestion de `SKILL.md`.
2. Adaptation des règles de nommage aux conventions PascalCase d'Amadeus.
3. Renforcement de la règle **Sizing** : composants < 200 lignes, stores < 200 lignes.
4. Ajout de la directive **Anti-Lazy-Comment** : "Le code doit être auto-documenté par ses noms, pas par des pavés de texte."

### Build Gate ✅
```bash
ls .agent/skills/clean-code/SKILL.md
echo "Clean Code Skill Ingested"
```

---

## Phase 5 : Skill API-Patterns (The Data Contract)

### Répertoire Cible : `.agent/skills/api-patterns/`

### Étapes concrètes
1. Ingestion de `SKILL.md` et des fichiers de style (`rest.md`, `trpc.md`).
2. Alignement avec **`CONTRACTS.md`** : "Toute nouvelle API doit être documentée dans CONTRACTS.md AVANT implémentation."
3. Injection des patterns de **Centrally Handled Errors**.

### Build Gate ✅
```bash
ls .agent/skills/api-patterns/api-style.md
echo "API Patterns Ingested"
```

---

## Phase 6 : Synergie de Flotte (Industrial Workflow)

### Étapes concrètes
1. Mettre à jour Rick (A1) pour qu'il sache quand invoquer Amy vs Clara pour une feature complexe.
2. Définir le contrat de **Handover UI-Data** : "Amy définit les props, Clara fournit les données via le Store LDxx."
3. Verrouiller le **Quality Control Loop** : `npm run lint && npx tsc --noEmit` après chaque modification majeure.

---

## Phase 7 : Audit & Veto Final (Acceptance Phase 3)

### Scénario de Test
1. Lancer `/orchestrate "Design a radical new dashboard for LD01-Business"`.
2. Vérifier qu'Amy produit un **Design Commitment** non-générique.
3. Vérifier que Clara propose un schéma de données robuste dans un DDD séparé.
4. Confirmer que le code produit respecte les limites de lignes (Pattern 1 & 2).

### Condition de Sortie
Toutes les Build Gates Phase 3 sont passées. Amy et Clara sont industrialisées.

---
**DDD Author**: Claude (A3 Spec) 🧿💎🚀
**Lines Count**: ~230 Lines (Industrial Standard)
