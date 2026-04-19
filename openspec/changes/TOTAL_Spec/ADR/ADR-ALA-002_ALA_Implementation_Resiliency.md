# ADR-ALA-002 — Implementation Specs & Research-Driven Resiliency

**Statut**: ACCEPTED
**Date**: 2026-03-16
**Proposé par**: A2 (Architect)
**Validé par**: Amadeus (A0)

## Contexte
Suite à [ADR-ALA-001](file:///c:/Users/amado/ASpace_OS_V2/_SPECS/ADR/ADR-ALA-001_ALA_Standard.md), nous devons définir les mécanismes précis de déploiement, le wrapper Git Bash pour Windows, et surtout le protocole de résilience par pivot documentaire (RCA).

## Décision

### 1. Structure de Dossiers
- **Forge**: `C:/Users/amado/Meta-Tools/cli-anything` (Dépôt forké et adapté).
- **Deployment & Skills**: `C:\Users\amado\.openclaw\workspace` (Contient les ALAs packagés).
- **Registry & Knowledge Partitioning**:
  - `Bedrock/registry/skills/[name].ala.json`
  - `Bedrock/knowledge/ala-forks/[name]/` (Buffer de recherche et documentations externes).

### 2. Le Polyglot Wrapper (Windows Git Bash)
Le point d'entrée ALA sur Windows sera un script `ala-proxy.ps1` qui :
- Localise `bash.exe` via le PATH Git.
- Mappe les chemins Windows -> Unix (cygpath).
- Capture les flux de sortie pour enrichir le monitoring.

### 3. RCA Module & Research Pivot
En cas d'échec de l'ingestion :
1.  **Stop-Technician** : Arrêt immédiat de l'A3.
2.  **RCA Generation** : Création de `logs/RCA-[ID].md` avec analyse de l'erreur.
3.  **Visionary Reset** : Changement de posture vers A1/A2.
4.  **External Search** : Recherche obligatoire dans les documentations et forums (Google, GitHub Issues).
5.  **Hypothesis Registry** : Test manuel de configuration avant reprise du workflow.

## Conséquences

### Positives
- **Cognitive Sovereignty** : Le système ne stagne pas sur une erreur de configuration inconnue.
- **Isolation** : Pas de pollution du WSL L0.
- **Traceability** : Chaque échec nourrit la base de connaissance méta.

### Négatives
- **Complexity** : Le workflow d'ingestion devient un système expert à part entière.

## Impact sur l'Isolation
- **Filesystem** : Le "Générateur" n'a accès qu'à `Meta-Tools` et au registre spécifique.
- **Process** : Ingestion via des processus enfants isolés (child_process).

## Vérification
- Test d'un pivot de recherche simulé après une erreur `Command Not Found` forcée.
- Existence des partitions de skills dans le registre.

