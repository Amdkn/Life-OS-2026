# ADR-WSL-002 — WSL Amadeus-L1 : Life OS Runtime (Non-Isolé Windows)

**Statut**: PROPOSED
**Date**: 2026-03-15
**Proposé par**: A'"0 GravityClaw (L3)
**Validé par**: En attente Rick (A1) / Amadeus (A0)
**PRD source**: `openspec/changes/aspace-web-os/proposal.md`

## Contexte

Le PRD A'Space Web OS requiert un environnement d'exécution local pour le dev server Vite.
L'infrastructure actuelle possède :
- **ASpace-L0** (WSL) : BedRock souverain, isolé de Windows (`automount=false`)
- **Windows** : OpenClaw A'0 sur port 18789

Le Web OS fait partie du **Life OS (L1)** et doit interagir avec OpenClaw Windows.
Il ne peut PAS tourner dans ASpace-L0 (trop isolé, pas d'accès Windows).
Il ne peut PAS tourner directement sur Windows (pas de Node natif fiable).

## Décision

Créer une **2ème instance WSL** nommée `Amadeus-L1` avec les propriétés :
- `[automount] enabled = true` — accès à `C:\` via `/mnt/c/`
- `[interop] appendWindowsPath = true` — peut voir les exécutables Windows
- Systemd activé pour Dokploy
- Communication libre avec OpenClaw Windows (port 18789)

```
wsl.conf pour Amadeus-L1 :
[boot]
systemd=true

[interop]
enabled=true
appendWindowsPath=true

[automount]
enabled=true
mountFsTab=true

[user]
default=amadeus
```

## Conséquences

### Positives
- Le dev server Vite tourne en WSL avec hot-reload vers le browser Windows
- Dokploy local peut orchestrer des containers pour le Web OS
- OpenClaw A'0 Windows peut communiquer avec le Web OS via localhost

### Négatives
- Introduction d'une 3ème entité WSL (ASpace-L0 + Amadeus-L1)
- Amadeus-L1 est intentionnellement NON-isolé → surface d'attaque plus large

### Risques
- Confusion entre ASpace-L0 et Amadeus-L1 (mitigation : noms et prompts distincts)
- Amadeus-L1 accédant accidentellement aux fichiers ASpace-L0 (mitigation : VHDX séparés)

## Alternatives Considérées

| Alternative | Avantage | Inconvénient | Rejet |
|-------------|----------|-------------|-------|
| Dev sur Windows natif | Pas de WSL | Node/npm instable sur Win, pas de Dokploy | Performance |
| Dev dans ASpace-L0 | Réutilise l'existant | Isolation bloque l'accès OpenClaw Win | Bloquant |
| Dev dans Docker sur Windows | Conteneurisé | Docker Desktop = lourd, conflits port | Complexité |

## Impact sur l'Isolation

| Ressource | Avant | Après |
|-----------|-------|-------|
| Port | — | Vite dev: **3000**, Dokploy: **3100** |
| WSL Instance | ASpace-L0 seul | ASpace-L0 + **Amadeus-L1** |
| Filesystem | L0 isolé | L1 voit `/mnt/c/`, L0 reste isolé |
| Token | — | Aucun nouveau token (pas de Telegram sur L1) |
| Database | — | IndexedDB dans le browser (pas dans WSL) |

## Vérification

```bash
# 1. Amadeus-L1 existe et est distinct de ASpace-L0
wsl --list --verbose | grep -E "ASpace-L0|Amadeus-L1"

# 2. Amadeus-L1 voit Windows
wsl -d Amadeus-L1 -- ls /mnt/c/Users/amado/

# 3. ASpace-L0 ne voit PAS Windows (isolation intacte)
wsl -d ASpace-L0 -- ls /mnt/c/ 2>&1 | grep "No such file"

# 4. Vite dev server accessible depuis Windows browser
curl http://localhost:3000
```
