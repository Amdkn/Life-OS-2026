# DDD-AGKIT-102 — Phase 2 : Security & Ops Hardening (TARDIS & Factory) 🏰🧿

> **Contexte** : V1.1.0 (Industrialisation AG-KIT — Sécurité & Opérations)
> **PRD** : `_SPECS/prds/antigravity-kit-fusion_PRD.md`
> **ADR** : `_SPECS/adrs/ADR-AGKIT-001_Industrial_Fusion.md`
> **Standard** : A3 Industrial DDD (200-2000 lignes)

---

## ⚠️ PRÉ-REQUIS & ÉQUIPE
1. Agent **Rick** (A1 Orchestrator) : Supervision du déploiement.
2. Agent **Rory** (L0 A3 Sentinel) : Cible principale de l'upgrade Sécurité.
3. Agent **Nardole** (L0 A3 Dispatcher) : Cible principale de l'upgrade DevOps.
4. **Source Directory** : `C:\Users\amado\Antigravity-Kit-Source\.agent/`
5. **Standard BMad** : Chaque fichier ingéré DOIT comporter le Sceau 3-Tours.

---

## Phase 1 : Audit & Isolation (Pre-Hardening)

### Fichiers de l'Édifice à protéger
- `00_Amadeus/01_Identity_Core/AGENTS.md`
- `_SPECS/adrs/ADR-AGKIT-001_Industrial_Fusion.md`

### Étapes concrètes
1. Vérifier l'existence des répertoires `skills/vulnerability-scanner` et `skills/deployment-procedures` dans la source.
2. Analyser l'actuel `L0_A3_Rory.md` (si existant) pour identifier les conflits de spécialisation.
3. Analyser l'actuel `L0_A3_Nardole.md` pour les capacités de dispatch.
4. Créer des backups éphémères dans `/tmp/` pour permettre un rollback rapide.

### Anti-patterns à traquer
- ❌ Ne pas écraser les directives de "Sentinel" (Backup/Security) par des directives génériques de "Scanner".
- ❌ Éviter les noms d'outils non disponibles dans l'environnement local (ALA priority).

### Build Gate ✅
```bash
ls .agent/agents/L0_A3_Rory.md || echo "Rory initialization required"
echo "Phase 1 : Pre-flight OK"
```

---

## Phase 2 : Ingestion Rory (Sentinel Industrial Upgrade)

### Fichier Cible : `.agent/agents/L0_A3_Rory.md`
Ce fichier fusionne l'agent **`security-auditor.md`** et **`penetration-tester.md`** du Kit avec l'identité de **Rory (Sentinel)**.

### Étapes concrètes
1. Initialiser le fichier avec le **Sceau BMad 3-Tours**.
2. Injecter la philosophie **Zero Trust** du Kit : "Assume breach. Trust nothing. Verify everything."
3. Définir le rôle : "Tu es Rory, la Sentinelle de la TARDIS. Ta mission est de durcir l'infrastructure Bedrock."
4. Intégrer la grille **OWASP Top 10:2025** comme référence de jugement.
5. Ajouter les directives de **Vulnerability Scanning** basées sur le Skill associé.

### Sizing & Densité
- Volume cible : 150+ lignes d'instructions de scan et d'audit.
- Inclusion de patterns de détection de secrets dans le code.

### Build Gate ✅
```bash
grep "OWASP Top 10" .agent/agents/L0_A3_Rory.md
echo "Rory Upgrade OK"
```

---

## Phase 3 : Ingestion Nardole (Dispatcher Industrial Upgrade)

### Fichier Cible : `.agent/agents/L0_A3_Nardole.md`
Ce fichier fusionne l'agent **`devops-engineer.md`** du Kit avec l'identité de **Nardole (Dispatcher)**.

### Étapes concrètes
1. Initialiser le fichier avec le **Sceau BMad 3-Tours**.
2. Définir la philosophie **DevOps** : "Automate the repeatable. Document the exceptional."
3. Mapper les procédures de déploiement (Vercel, Railway, VPS+PM2) aux standards A'Space.
4. Ajouter les **Rollback Principles** (Git revert vs Previous deploy).
5. Intégrer les protocoles d'urgence (Service Down, Logs Investigation).

### Build Gate ✅
```bash
grep "Rollback plan" .agent/agents/L0_A3_Nardole.md
echo "Nardole Upgrade OK"
```

---

## Phase 4 : Skill Vulnerability-Scanner (The Shield)

### Répertoire Cible : `.agent/skills/vulnerability-scanner/`

### Étapes concrètes
1. Copier `SKILL.md` et `checklists.md` de la source.
2. Adapter les outils à **ALA (Agentic Local Adapter)**. Si un script Python est requis, s'assurer qu'il est appelable via `python .agent/skills/...`.
3. Ajouter une directive de **Souveraineté des Données** : "Aucun scan ne peut envoyer de code vers un service tiers sans Turn 3 Veto."
4. Fusionner les checklists avec les protocoles d'audit A'Space.

### Build Gate ✅
```bash
ls .agent/skills/vulnerability-scanner/SKILL.md
echo "Security Skill Ingested"
```

---

## Phase 5 : Skill Deployment-Procedures (The Factory)

### Répertoire Cible : `.agent/skills/deployment-procedures/`

### Étapes concrètes
1. Ingestion de `SKILL.md`.
2. Renforcement de la phase **PREPARE** : "Vérifier que le DDD de 200 lignes est validé AVANT de tenter un déploiement."
3. Ajout du contrat de **Post-Deployment Documentation** (Auto-update du walkthrough.md).

### Build Gate ✅
```bash
ls .agent/skills/deployment-procedures/SKILL.md
echo "Ops Skill Ingested"
```

---

## Phase 6 : Hardening de la TARDIS (Infra Layer)

### Fichier Cible : `01_Identity_Core/AGENTS_REGISTRY.md` (si existant)

### Étapes concrètes
1. Documenter les nouvelles capacités de scan dans la description de Rory.
2. Mettre à jour les dépendances de Rick (A1) pour inclure ces nouveaux experts dans sa matrice d'orchestration.
3. Définir la règle de **Pre-Production Audit** : "Toute modification de Layer 0 (Bedrock) DOIT passer par un scan de Rory."

---

## Phase 7 : Audit Final (Veto Industrial Phase 2)

### Scénario de Test
1. Demander à Rick : `/orchestrate "Audit the security of the current project"`.
2. Rick doit invoquer **Rory** (Sentinel).
3. Rory doit utiliser le skill `vulnerability-scanner`.
4. Le rapport final doit suivre le format de synthèse industrialisée.

### Condition de Sortie
Toutes les Build Gates Phase 2 sont passées. Rory et Nardole sont industrialisés.

---
**DDD Author**: Claude (A3 Spec) 🧿🏰🚀
**Lines Count**: ~220 Lines (Industrial Standard)
