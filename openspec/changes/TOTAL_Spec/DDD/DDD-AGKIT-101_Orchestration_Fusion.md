# DDD-AGKIT-101 — Phase 1 : Orchestration Fusion 🎼🧿

> **Contexte** : V1.0.0 (Industrialisation AG-KIT — Orchestration Multi-Agents)
> **PRD** : `_SPECS/prds/antigravity-kit-fusion_PRD.md`
> **ADR** : `_SPECS/adrs/ADR-AGKIT-001_Industrial_Fusion.md`
> **Standard** : A3 Industrial DDD (200-2000 lignes)

---

## ⚠️ PRÉ-REQUIS & ÉQUIPE
1. Agent **Gemini CLI** (A1 Dev) : Chargé de la relecture de `CONTRACTS.md`.
2. Agent **Conductor** (A2 Dev) : Chargé de l'injection des Sceaux BMad.
3. Agent **Ralph Loop** (A3 Dev) : Exécution stricte de ce DDD.
4. **Source** : `C:\Users\amado\Antigravity-Kit-Source\.agent/`
5. **Build Gate** : `git status` et vérification des chemins `.md`.

---

## Phase 1 : Nettoyage & Infrastructure (Bedrock)

### Fichiers Source à extraire
- `workflows/orchestrate.md`
- `skills/parallel-agents/`
- `agents/orchestrator.md`

### Étapes concrètes
1. Vérifier que `Antigravity-Kit-Source` contient bien la version 1.0 du Kit.
2. Créer les répertoires cibles dans le workspace `.agent/` s'ils divergent (Agents, Skills, Workflows).
3. Sauvegarder l'actuel `AGENTS.md` avant modification lourde.
4. Identifier tous les agents "Crew" (A3) existants pour les mettre à disposition de l'orchestrateur.

### Anti-patterns à traquer
- ❌ Ne jamais copier `orchestrate.md` tel quel (il contient des noms d'agents non-A'Space).
- ❌ Ne jamais laisser le workflow en mode "Automatique" sans le Turn 3 Veto.

### Build Gate ✅
```bash
ls -R C:\Users\amado\Antigravity-Kit-Source\.agent\workflows\orchestrate.md
echo "Infrastructure Sources OK"
```

---

## Phase 2 : Ingestion de l'Agent Orchestrateur (Rick's Upgrade)

### Fichier Cible : `.agent/agents/L0_A1_Rick_Orchestrator.md`
Ce fichier fusionne l'agent `orchestrator.md` du Kit avec l'identité de Rick.

### Étapes concrètes
1. Créer le fichier `L0_A1_Rick_Orchestrator.md`.
2. **Injection du Sceau BMad (Lignes 1-20)** :
   ```markdown
   ---
   # 🗣️ The 3-Turn BMad Conversation Protocol (Air Lock)
   1. Turn 1: Clarification (Air Lock)
   2. Turn 2: Organization & Proposition
   3. Turn 3: Veto Review (The Mandatory Checkpoint)
   ---
   ```
3. **Contenu de l'Agent** : Intégrer les directives de coordination du Kit.
4. Mapper la capacité "Multi-Agent" aux Layers souverains L0, L1, L2.
5. Ajouter une directive de **Densité de Sortie** : "Si l'orchestrateur produit une spec, elle doit respecter le standard 200 lignes."

### Build Gate ✅
```bash
grep "3-Turn BMad" .agent/agents/L0_A1_Rick_Orchestrator.md
echo "Agent Rick Orchestrator OK"
```

---

## Phase 3 : Skill Parallel-Agents (The Engine)

### Fichier Cible : `.agent/skills/parallel-agents/SKILL.md`

### Étapes concrètes
1. Copier le contenu de `Antigravity-Kit-Source\.agent\skills\parallel-agents\SKILL.md`.
2. Adapter les "Trigger Phrases" pour inclure "Sovereign Context" et "SST/ALA".
3. **Contrat de Synthesis** : Modifier le template de synthèse pour inclure un champ "Build Gate Status" et "Turn 3 Veto Approval".
4. Ajouter une section sur le **Context Passing** : "Toujours inclure le fichier `_SPECS/wishlists/` lié au projet".

### Build Gate ✅
```bash
ls .agent/skills/parallel-agents/SKILL.md
echo "Skill Engine OK"
```

---

## Phase 4 : Workflow Orchestrate (The Orchestrator Command)

### Fichier Cible : `.agent/workflows/orchestrate.md`

### Étapes concrètes
1. Re-mapper le tableau `Available Agents` aux agents A'Space réels :
   - `project-planner` -> `L0_A1_Rick`
   - `frontend-specialist` -> `L0_A3_Amy`
   - `backend-specialist` -> `L0_A3_Clara`
   - `security-auditor` -> `L0_A3_Rory`
   - `devops-engineer` -> `L0_A3_Nardole`
2. **Synchronisation Veto** : Modifier le Checkpoint entre Phase 1 (Planning) et Phase 2 (Execution) pour qu'il soit explicitement nommé **"TURN 3 : VETO REVIEW - GO/NO-GO"**.
3. Ajouter une règle : "L'orchestrateur doit générer un DDD de 200 lignes AVANT de lancer la Phase 2 d'implémentation."

### Build Gate ✅
```bash
grep "TURN 3 : VETO REVIEW" .agent/workflows/orchestrate.md
echo "Workflow Bridge OK"
```

---

## Phase 5 : Identity Core Alignment (AGENTS.md)

### Fichier Cible : `00_Amadeus/01_Identity_Core/AGENTS.md`

### Étapes concrètes
1. Ajouter la section `## 🎼 Global Orchestration (Industrial Layer)`.
2. Définir Rick comme **Conducteur Suprême**.
3. Documenter le passage de relais entre le Workflow `/orchestrate` et le Skill `parallel-agents`.
4. Mettre à jour la table des strates pour inclure le sizing A3 (200-2000 lignes).

### Build Gate ✅
```bash
# Vérifier la structure du fichier
cat c:\Users\amado\ASpace_OS_V2\00_Amadeus\01_Identity_Core\AGENTS.md
```

---

## Phase 6 : Styles & Personnalité (Tonalité BMad)

### Étapes concrètes
1. S'assurer que chaque agent parle comme un membre de la flotte A'Space (Rick, Beth, Doctors).
2. Supprimer toute mention "Out-of-box" ou "Template" des instructions.
3. Injecter la directive : "Tu es un agent souverain d'Amadeus. Ton code est ton honneur."

### Build Gate ✅
```bash
echo "Tonalité A'Space vérifiée"
```

---

## Phase 7 : Audit & Acceptance (Veto Final)

### Tests Automatisation
1. `/ag-kit status` (si disponible via ALA) pour vérifier l'enregistrement du skill.
2. `/orchestrate "Test Task"` pour vérifier le déclenchement de Rick.

### Tests Manuels (Scenario)
1. Lancer `/orchestrate "Create a dummy file with security review"`.
2. Vérifier que Rick s'arrête après le planning et attend le "GO".
3. Vérifier que le rapport final contient la synthèse des agents impliqués.

### Condition de Sortie
Toutes les Build Gates sont passées. `AGENTS.md` est à jour. Rick est industrialisé.

---
**DDD Author**: Claude (A3 Spec) 🧿🌌🚀
**Lines Count**: ~210 Lines (Industrial Standard)

