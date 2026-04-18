# ADR-NET-001 — Hébergement Multi-Couche (Local → Dev → Production)

**Statut**: PROPOSED
**Date**: 2026-03-15
**Proposé par**: A'"0 GravityClaw (L3)
**Validé par**: En attente Rick (A1) / Amadeus (A0)
**PRD source**: `openspec/changes/aspace-web-os/proposal.md` (D16-D18)

## Contexte

Le Web OS doit être hébergé sur 3 environnements avec des niveaux de sécurité croissants :
1. **Local** : Développement rapide, hot-reload
2. **Dev Cloud** : Preview pour tests et partage
3. **Production** : Accessible 24/7 avec sécurité renforcée

## Décision

### Environnement Local (WSL Amadeus-L1)

```
Amadeus-L1 (WSL) ──→ Vite Dev Server ──→ http://localhost:3000
                  └─→ Dokploy Local   ──→ http://localhost:3100
```

| Composant | Technologie | Port |
|-----------|-------------|------|
| Dev server | Vite (`npm run dev`) | **3000** |
| Dokploy local | Docker container | **3100** |
| Hot-reload | Vite HMR | via 3000 |

- **Pas de firewall** : communication libre Windows ↔ WSL
- **Pas de SSL** : localhost uniquement
- **Accès** : `http://localhost:3000` depuis browser Windows

### Environnement Dev Cloud (GitHub + Vercel)

```
GitHub Repo ──push──→ Vercel ──auto-deploy──→ https://aspace-web-os.vercel.app
                         └──PR preview──→ https://aspace-web-os-<hash>.vercel.app
```

| Composant | Technologie |
|-----------|-------------|
| VCS | GitHub (repo privé) |
| CI/CD | Vercel auto-deploy |
| Preview | Vercel PR previews |
| SSL | Auto (Vercel) |
| Domain | `*.vercel.app` (gratuit) |

- Chaque PR génère une preview URL
- Branch `main` = preview stable
- Branch `production` = déclenche le deploy prod (si configuré)

### Environnement Production (Dokploy sur VPS Hostinger)

```
Dokploy (VPS) ──→ Docker container ──→ https://os.aspace.app (futur)
                   └─→ Nginx reverse proxy
                   └─→ Let's Encrypt SSL
                   └─→ UFW Firewall
```

| Composant | Technologie | Port |
|-----------|-------------|------|
| Container runtime | Dokploy | **443** (HTTPS) |
| Reverse proxy | Nginx (via Dokploy) | 80 → 443 redirect |
| SSL | Let's Encrypt auto-renew | via Dokploy |
| Firewall | UFW | Rules ci-dessous |
| OS | Ubuntu 24.04 LTS | VPS Hostinger |

#### Firewall Rules (UFW)

```bash
# Default: deny all incoming, allow all outgoing
sudo ufw default deny incoming
sudo ufw default allow outgoing

# SSH (with rate limiting)
sudo ufw limit 22/tcp

# HTTP/HTTPS (public)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Dokploy admin (restrict to home IP only)
sudo ufw allow from <HOME_IP> to any port 3000 proto tcp

# Everything else: DENIED
sudo ufw enable
```

## Conséquences

### Positives
- 3 environnements distincts avec séparation claire des responsabilités
- Vercel offre des previews gratuites par PR (collaboration facile)
- Dokploy sur VPS = contrôle total, pas de vendor lock-in

### Négatives
- 3 environnements à maintenir (mitigation: Dokploy + Vercel sont quasi zero-maintenance)
- VPS Hostinger a des limites de RAM/CPU (mitigation: le Web OS est frontend-only, ~50MB build)

### Risques
- Dokploy local + Dokploy prod = confusion de config (mitigation: `.env.local` vs `.env.production`)
- Domain DNS non configuré au début (mitigation: utiliser l'IP directe ou `*.vercel.app` en attendant)

## Alternatives Considérées

| Alternative | Avantage | Inconvénient | Rejet |
|-------------|----------|-------------|-------|
| Vercel seul (pas de VPS) | Zéro ops | Pas de contrôle, limites free tier | Besoin de souveraineté |
| Coolify au lieu de Dokploy | Plus populaire | UI moins clean, plus lourd | Préférence Dokploy |
| Netlify au lieu de Vercel | Similar | Vercel mieux intégré React/Vite | Écosystème |
| GitHub Pages | Gratuit | Pas de SSR, build limits | Trop limité |

## Impact sur l'Isolation

| Ressource | Avant | Après |
|-----------|-------|-------|
| Port local | — | Vite: **3000**, Dokploy local: **3100** |
| Port VPS | — | **80, 443** (public), **3000** (admin, IP-locked) |
| Domain | — | `aspace-web-os.vercel.app` (dev), futur `os.aspace.app` (prod) |
| Firewall | — | UFW actif sur VPS, aucun en local |

## Mise à jour `isolation_protocol.md`

Ajouter les ports suivants à la table :

| Layer | Service | Port | Owner |
|-------|---------|------|-------|
| L1 (Amadeus-L1) | Vite Dev Server | 3000 | Web OS Dev |
| L1 (Amadeus-L1) | Dokploy Local | 3100 | Web OS Container |
| L2 (VPS) | Dokploy Web OS | 443 | Web OS Prod |
| L2 (VPS) | Dokploy Admin | 3000 (IP-locked) | Admin only |

## Vérification

```bash
# Local
curl http://localhost:3000  # Vite dev server responds

# Dev Cloud
curl https://aspace-web-os.vercel.app  # Vercel preview responds

# Production
curl https://<VPS_IP>  # Nginx/Dokploy responds with Web OS
sudo ufw status  # Firewall rules active
```
