# ADR-WSL-001 — OpenClaw WSL2 : Architecture Souveraine A'Space L0 & Couteau Suisse Multi-A0
**Statut :** ACTIF (V1.1) — Directive d'Exécution & Cadre Stratégique
**Version :** V1.1 — Patch "Architecte de PRD"
**Émis par :** Amadeus A0 (WSL), A'0 (Windows), A"0 (VPS), A'"0 (AGC)
**Architecte Système :** Gemini CLI (A'"0)
**Date :** 2026-03-11
**Ancrage Canon :** `C:\Users\amado\ASpace_OS_V2\00_Amadeus\01_Identity_Core\AGENTS.md`

---

## PATCH V1.1 — Rôles & Synergie E-Myth (Stratégie de Résolution)

Pour garantir l'antifragilité, le développement suit désormais la structure E-Myth :

1.  **Gemini CLI (L'Architecte de PRD) :** 
    - **Mission :** Recherche profonde (Web, Documentation OpenClaw, API) pour définir LA solution optimale.
    - **Livrable :** Un PRD unique par difficulté, mis à jour par la recherche, jamais empilé.
    - **Validation :** Valide les résultats de Ralph Loop et archive les solutions en **Skills** autonomes.
    - **Patch V1.11 (Signalement Actif) :** Gemini doit explicitement signaler une "Action Requise" en cas de blocage sur des éléments hors de sa portée (ex: tokens expirés, intervention humaine BotFather) plutôt que de boucler. L'autonomie reste la règle d'or ("YOLO"), le signalement est l'exception de survie.
2.  **Conductor (Le Manager) :** 
    - **Mission :** Orchestration des extensions et du plan de route (Tracks).
    - **Rôle :** Assurer que l'exécution respecte les priorités du business et de l'infra.
3.  **Ralph Loop (Le Technicien) :** 
    - **Mission :** Test d'hypothèses, scripts de déploiement et corrections itératives.
    - **Rôle :** Exécuter les PRD de Gemini et rapporter les frictions réelles.

---

## CONTEXTE — L'Évolution vers Matrix A0

L'ADR initial prévoyait la destruction ou la mise en silence de l'instance Windows (port 18789) au profit exclusif d'une instance WSL2. **Cette vision centralisée est déclarée obsolète**.

Le "Amadeus Verse" a évolué vers une fédération de 4 entités souveraines, chacune avec un domaine et un rôle précis dans la Pyramide DIKW et le système BMad :

1. **[A0] L0 - Le Noyau Souverain (WSL2)**
   - Rôle : Infrastructure, exécution système stricte, Kernel.
   - Accès : Docker, Scripts bash purs, Services Systemd.
2. **[A'0] L1 - Life OS (Local Windows System)**
   - Rôle : Assistant Bureau, interaction UI, bureautique, navigation locale.
   - Accès : `openclaw.json` local sur le port 18789.
3. **[A"0] L2 - Business Pulse (VPS Hostinger)** 
   - Rôle : Pipelines de données externes, requêtes Always-On, serveurs distants.
   - Accès : Déploiement distant pur.
4. **[A'"0] L3 - Anti Gravity Claws (Agents de Code / AGC)**
   - Rôle : Méta-Science, TVR, création "Build Your Own" d'agents modulaires.
   - Accès : CLI Ephemère, Claude Code, Gemini CLI.

### Problème Critique : Conflit de Canaux (Erreur 409)
Actuellement, A0 (WSL) et A'0 (Windows) partagent le même `TELEGRAM_BOT_TOKEN`. Telegram n'autorise qu'une seule instance de polling ("Long Polling") à la fois. Le gateway Windows "vole" les messages du gateway WSL, créant une erreur `409 Conflict`.

---

## RÈGLES D'OR DE COEXISTENCE (Multi-A0)

1. **Isolation des Canaux (Telegram Bots) :**
   - Chaque instance A0 persistante DOIT avoir son propre bot Telegram (ex: `@Amadeus_A0_WSL_bot`, `@Amadeus_A1_Win_bot`). Aucun partage de Token.
2. **Isolation des Ports Locaux :**
   - A'0 (Windows) : Port 18789
   - A0 (WSL2) : Port 18790
   - Mission Control : Port 8000
3. **Isolation des Mémoires :**
   - Les DB SQLite (rag/mémoire) de WSL et Windows ne se croisent jamais physiquement.
4. **Zéro Destruction :**
   - L'A0' (Windows) ne sera ni tué, ni mis au silence. Il coexiste pacifiquement avec A0 WSL.

---

## ARCHITECTURE CIBLE

```
┌─────────────────────────────────────────────────────────────────────┐
│  WINDOWS 11 — Rôle unique : Hyperviseur Hyper-V + Task Scheduler    │
│  Interdit de : PATH injection, /mnt mount, Docker, agents           │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  WSL2 — Distro : ASpace-L0 (Ubuntu 24.04 LTS)                  │ │
│  │  User : amadeus  |  Systemd : actif                             │ │
│  │                                                                  │ │
│  │  ┌──────────────────────────────────────────────────────────┐   │ │
│  │  │  OpenClaw Gateway — Port 18790                           │   │ │
│  │  │  Systemd service : openclaw.service                      │   │ │
│  │  │  exec.host: "gateway" → /bin/bash natif Linux ✓          │   │ │
│  │  │  exec.security: "full" → zéro restriction                │   │ │
│  │  │                                                           │   │ │
│  │  │  15 Agents L0 (workspaces isolés) :                      │   │ │
│  │  │  main · rick · doctor-11/12/13                           │   │ │
│  │  │  yaz · ryan · graham · amy · rory · river                │   │ │
│  │  │  clara · nardole · bill · donna                          │   │ │
│  │  └──────────────────────────────────────────────────────────┘   │ │
│  │                                                                  │ │
│  │  ┌──────────────────────────────────────────────────────────┐   │ │
│  │  │  Mission Control — Port 8000                             │   │ │
│  │  │  Python FastAPI + Docker (dans WSL)                      │   │ │
│  │  │  Connecté au Gateway via ws://127.0.0.1:18790            │   │ │
│  │  │  UI accessible : http://localhost:8000 (depuis Windows)  │   │ │
│  │  └──────────────────────────────────────────────────────────┘   │ │
│  │                                                                  │ │
│  │  Pont unique vers Windows : TCP ports 18790 + 8000              │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## SÉQUENCE D'EXÉCUTION

### PRÉ-REQUIS WINDOWS (vérification avant tout — Gemini ne touche pas, juste vérifie)

```powershell
# Depuis PowerShell Windows — vérifications seulement
wsl --version                          # WSL2 doit être installé
wsl --list --verbose                   # Inventaire des distros existantes
Get-Service -Name LxssManager          # Service WSL doit être Running
Test-Path "D:\WSL"                     # Dossier destination (créer si absent)
```

Si `D:\` n'existe pas → utiliser `C:\WSL\ASpace-L0` (hors du profil utilisateur).

**STOP SI :** WSL2 n'est pas installé. Rapport à A0. Ne pas continuer.

---

### CHECKPOINT-0 — Inventaire (LOI DU CHECKPOINT PROFOND)

```powershell
# Rapport obligatoire avant toute action destructive
wsl --list --verbose
wsl -d ASpace-L0 -- ls /home/ 2>/dev/null || echo "Distro vide ou inexistante"
wsl -d ASpace-L0 -- du -sh /home/amadeus/ 2>/dev/null || echo "User amadeus absent"
wsl -d ASpace-L0 -- ls ~/.openclaw/ 2>/dev/null || echo "Aucune config OpenClaw dans WSL"
```

**Rapport à produire :**
- Liste de tout ce qui existe dans ASpace-L0
- Taille de chaque dossier > 10MB
- Ce qui sera PERDU après `wsl --unregister`

**STOP. Attendre validation A0 explicite avant de continuer.**

---

### PHASE 0 — Naissance de ASpace-L0

#### 0.1 — Destruction de l'ancienne instance (après validation A0)

```powershell
# Windows PowerShell
wsl --unregister ASpace-L0
```

#### 0.2 — Téléchargement rootfs Ubuntu officiel

```powershell
# Windows PowerShell — source officielle Ubuntu Cloud Images
$rootfsUrl = "https://cloud-images.ubuntu.com/wsl/noble/current/ubuntu-noble-wsl-amd64-wsl.rootfs.tar.gz"
$dest = "$env:USERPROFILE\Downloads\ubuntu-noble-wsl.tar.gz"
Invoke-WebRequest -Uri $rootfsUrl -OutFile $dest -UseBasicParsing
```

#### 0.3 — Import dans WSL

```powershell
# Créer le dossier destination
New-Item -ItemType Directory -Force -Path "D:\WSL\ASpace-L0"

# Import
wsl --import ASpace-L0 "D:\WSL\ASpace-L0" "$env:USERPROFILE\Downloads\ubuntu-noble-wsl.tar.gz" --version 2
```

#### 0.4 — Configuration wsl.conf (isolation + systemd)

```powershell
# Injecter le wsl.conf depuis Windows avant le premier boot complet
wsl -d ASpace-L0 -u root -- bash -c "cat > /etc/wsl.conf << 'EOF'
[boot]
systemd=true

[interop]
appendWindowsPath=false

[automount]
enabled=false
mountFsTab=false

[network]
generateResolvConf=true
EOF"
```

#### 0.5 — Reboot WSL pour appliquer systemd

```powershell
wsl --terminate ASpace-L0
Start-Sleep -Seconds 3
wsl -d ASpace-L0 -u root -- systemctl is-system-running --wait || true
```

#### 0.6 — Création user amadeus

```bash
# Dans WSL ASpace-L0 en root
wsl -d ASpace-L0 -u root -- bash -c "
  useradd -m -s /bin/bash amadeus
  usermod -aG sudo amadeus
  echo 'amadeus ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers.d/amadeus
  chmod 0440 /etc/sudoers.d/amadeus
"

# Définir amadeus comme user par défaut WSL
# Dans /etc/wsl.conf — ajouter section [user]
wsl -d ASpace-L0 -u root -- bash -c "
  echo '' >> /etc/wsl.conf
  echo '[user]' >> /etc/wsl.conf
  echo 'default=amadeus' >> /etc/wsl.conf
"
wsl --terminate ASpace-L0
```

#### 0.7 — Installation nvm + Node LTS

```bash
# Depuis WSL en tant que amadeus
wsl -d ASpace-L0 -u amadeus -- bash -c "
  # Mise à jour système
  sudo apt-get update -qq && sudo apt-get install -y -qq curl git build-essential

  # Installation nvm
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

  # Charger nvm et installer Node LTS
  export NVM_DIR=\"\$HOME/.nvm\"
  source \"\$NVM_DIR/nvm.sh\"
  nvm install --lts
  nvm use --lts
  nvm alias default lts/*

  # Vérification
  node --version
  npm --version
"
```

#### 0.8 — Installation OpenClaw

```bash
wsl -d ASpace-L0 -u amadeus -- bash -c "
  export NVM_DIR=\"\$HOME/.nvm\"
  source \"\$NVM_DIR/nvm.sh\"

  # Installation dans ~/.local (jamais sudo npm global)
  npm config set prefix ~/.local
  npm install -g openclaw

  # Vérification
  openclaw --version
"
```

#### 0.9 — Variables d'environnement (bashrc)

```bash
wsl -d ASpace-L0 -u amadeus -- bash -c "
cat >> ~/.bashrc << 'EOF'

# A'Space L0 Environment
export NVM_DIR=\"\$HOME/.nvm\"
[ -s \"\$NVM_DIR/nvm.sh\" ] && source \"\$NVM_DIR/nvm.sh\"
export PATH=\"\$HOME/.local/bin:\$PATH\"
export OPENCLAW_HOME=\"\$HOME/.openclaw\"
export ASPACE_ROOT=\"\$HOME/aspace\"
export OPENCLAW_GATEWAY_PORT=18790
EOF
"
```

**TEST DE SORTIE PHASE 0 :**
```bash
wsl -d ASpace-L0 -u amadeus -- bash -c "
  source ~/.bashrc
  echo '=== whoami ===' && whoami
  echo '=== PATH check ===' && echo \$PATH | grep -v '/mnt/c' && echo 'PATH clean'
  echo '=== node ===' && node --version
  echo '=== openclaw ===' && openclaw --version
"
```
**Go si :** `whoami=amadeus`, PATH sans `/mnt/c`, node+openclaw installés.

---

### PHASE 1 — Configuration OpenClaw WSL

#### 1.1 — Onboarding OpenClaw

```bash
wsl -d ASpace-L0 -u amadeus -- bash -c "
  source ~/.bashrc
  # Mode local, port 18790
  openclaw onboard --mode local --port 18790 --no-interactive 2>/dev/null || true
  # Génère ~/.openclaw/openclaw.json initial
"
```

#### 1.2 — openclaw.json WSL Canon

Écrire le fichier complet (remplace le généré par onboard) :

```bash
wsl -d ASpace-L0 -u amadeus -- bash -c "
mkdir -p ~/.openclaw

cat > ~/.openclaw/openclaw.json << 'JSONEOF'
{
  \"meta\": {
    \"note\": \"ASpace-L0 WSL Instance — Port 18790 — Sovereign\",
    \"instance\": \"wsl\"
  },
  \"auth\": {
    \"profiles\": {
      \"anthropic\": {
        \"provider\": \"anthropic\",
        \"mode\": \"token\"
      },
      \"openrouter:default\": {
        \"provider\": \"openrouter\",
        \"mode\": \"token\"
      }
    }
  },
  \"agents\": {
    \"defaults\": {
      \"model\": {
        \"primary\": \"anthropic/claude-sonnet-4-6\",
        \"fallbacks\": [
          \"openrouter/z-ai/glm-4.7-flash\"
        ]
      },
      \"models\": {
        \"anthropic/claude-opus-4-6\": { \"alias\": \"opus\" },
        \"anthropic/claude-sonnet-4-6\": { \"alias\": \"sonnet\" },
        \"anthropic/claude-haiku-4-5-20251001\": { \"alias\": \"haiku\" },
        \"openrouter/z-ai/glm-4.7-flash\": { \"alias\": \"glm\" }
      },
      \"workspace\": \"/home/amadeus/.openclaw/workspace\",
      \"subagents\": {
        \"model\": \"anthropic/claude-haiku-4-5-20251001\",
        \"maxConcurrent\": 5
      },
      \"sandbox\": {
        \"mode\": \"off\"
      },
      \"contextPruning\": {
        \"mode\": \"cache-ttl\",
        \"ttl\": \"45m\",
        \"keepLastAssistants\": 2,
        \"minPrunableToolChars\": 12000
      },
      \"compaction\": {
        \"mode\": \"safeguard\",
        \"reserveTokensFloor\": 12000,
        \"memoryFlush\": {
          \"enabled\": true,
          \"softThresholdTokens\": 5000,
          \"prompt\": \"Write any lasting notes to memory/YYYY-MM-DD.md; reply with NO_REPLY if nothing to store.\"
        }
      },
      \"heartbeat\": {
        \"every\": \"30m\",
        \"activeHours\": {
          \"start\": \"08:00\",
          \"end\": \"23:00\",
          \"timezone\": \"America/New_York\"
        },
        \"lightContext\": true
      },
      \"maxConcurrent\": 5
    },
    \"list\": [
      {
        \"id\": \"main\",
        \"model\": { \"primary\": \"anthropic/claude-sonnet-4-6\" }
      },
      {
        \"id\": \"l0-a1-rick\",
        \"name\": \"l0-a1-rick\",
        \"workspace\": \"/home/amadeus/.openclaw/workspace-l0-a1-rick\",
        \"identity\": { \"name\": \"Rick — Architect of Sovereignty\", \"emoji\": \"🧪\" },
        \"model\": { \"primary\": \"anthropic/claude-opus-4-6\" }
      },
      {
        \"id\": \"l0-a2-doctor-13\",
        \"name\": \"l0-a2-doctor-13\",
        \"workspace\": \"/home/amadeus/.openclaw/workspace-l0-a2-doctor-13\",
        \"identity\": { \"name\": \"Doctor 13 — Manager of Infra\", \"emoji\": \"🔧\" },
        \"model\": { \"primary\": \"anthropic/claude-sonnet-4-6\" }
      },
      {
        \"id\": \"l0-a2-doctor-11\",
        \"name\": \"l0-a2-doctor-11\",
        \"workspace\": \"/home/amadeus/.openclaw/workspace-l0-a2-doctor-11\",
        \"identity\": { \"name\": \"Doctor 11 — Manager of Interface\", \"emoji\": \"🎪\" },
        \"model\": { \"primary\": \"anthropic/claude-sonnet-4-6\" }
      },
      {
        \"id\": \"l0-a2-doctor-12\",
        \"name\": \"l0-a2-doctor-12\",
        \"workspace\": \"/home/amadeus/.openclaw/workspace-l0-a2-doctor-12\",
        \"identity\": { \"name\": \"Doctor 12 — Manager of Pipelines\", \"emoji\": \"⚙️\" },
        \"model\": { \"primary\": \"anthropic/claude-sonnet-4-6\" }
      },
      {
        \"id\": \"l0-a3-yaz\",
        \"name\": \"l0-a3-yaz\",
        \"workspace\": \"/home/amadeus/.openclaw/workspace-l0-a3-yaz\",
        \"identity\": { \"name\": \"Yaz — Watchdog (Monitor/Restart)\" },
        \"model\": { \"primary\": \"anthropic/claude-haiku-4-5-20251001\" }
      },
      {
        \"id\": \"l0-a3-ryan\",
        \"name\": \"l0-a3-ryan\",
        \"workspace\": \"/home/amadeus/.openclaw/workspace-l0-a3-ryan\",
        \"identity\": { \"name\": \"Ryan — Mechanic (Keys/Connections)\" },
        \"model\": { \"primary\": \"anthropic/claude-haiku-4-5-20251001\" }
      },
      {
        \"id\": \"l0-a3-graham\",
        \"name\": \"l0-a3-graham\",
        \"workspace\": \"/home/amadeus/.openclaw/workspace-l0-a3-graham\",
        \"identity\": { \"name\": \"Graham — Driver (Router/Bus)\" },
        \"model\": { \"primary\": \"anthropic/claude-haiku-4-5-20251001\" }
      },
      {
        \"id\": \"l0-a3-amy\",
        \"name\": \"l0-a3-amy\",
        \"workspace\": \"/home/amadeus/.openclaw/workspace-l0-a3-amy\",
        \"identity\": { \"name\": \"Amy — Designer (Notion/UI)\" },
        \"model\": { \"primary\": \"anthropic/claude-haiku-4-5-20251001\" }
      },
      {
        \"id\": \"l0-a3-rory\",
        \"name\": \"l0-a3-rory\",
        \"workspace\": \"/home/amadeus/.openclaw/workspace-l0-a3-rory\",
        \"identity\": { \"name\": \"Rory — Sentinel (Backup/Security)\" },
        \"model\": { \"primary\": \"anthropic/claude-haiku-4-5-20251001\" }
      },
      {
        \"id\": \"l0-a3-river\",
        \"name\": \"l0-a3-river\",
        \"workspace\": \"/home/amadeus/.openclaw/workspace-l0-a3-river\",
        \"identity\": { \"name\": \"River — Timekeeper (Sync/Calendar)\" },
        \"model\": { \"primary\": \"anthropic/claude-haiku-4-5-20251001\" }
      },
      {
        \"id\": \"l0-a3-clara\",
        \"name\": \"l0-a3-clara\",
        \"workspace\": \"/home/amadeus/.openclaw/workspace-l0-a3-clara\",
        \"identity\": { \"name\": \"Clara — Processor (ETL/Data)\" },
        \"model\": { \"primary\": \"anthropic/claude-haiku-4-5-20251001\" }
      },
      {
        \"id\": \"l0-a3-nardole\",
        \"name\": \"l0-a3-nardole\",
        \"workspace\": \"/home/amadeus/.openclaw/workspace-l0-a3-nardole\",
        \"identity\": { \"name\": \"Nardole — Dispatcher (Tickets/Ops)\" },
        \"model\": { \"primary\": \"anthropic/claude-haiku-4-5-20251001\" }
      },
      {
        \"id\": \"l0-a3-bill\",
        \"name\": \"l0-a3-bill\",
        \"workspace\": \"/home/amadeus/.openclaw/workspace-l0-a3-bill\",
        \"identity\": { \"name\": \"Bill — Scout (Research/Feeds)\" },
        \"model\": { \"primary\": \"anthropic/claude-haiku-4-5-20251001\" }
      },
      {
        \"id\": \"l0-a3-donna\",
        \"name\": \"l0-a3-donna\",
        \"workspace\": \"/home/amadeus/.openclaw/workspace-l0-a3-donna\",
        \"identity\": { \"name\": \"Donna — Dead Letter Queue\", \"emoji\": \"☕\" },
        \"model\": { \"primary\": \"anthropic/claude-haiku-4-5-20251001\" }
      }
    ]
  },
  \"tools\": {
    \"profile\": \"coding\",
    \"allow\": [\"*\"],
    \"exec\": {
      \"security\": \"full\",
      \"host\": \"gateway\"
    },
    \"elevated\": {
      \"enabled\": true,
      \"allowFrom\": {
        \"telegram\": [8466501613]
      }
    },
    \"browser\": {
      \"enabled\": true
    }
  },
  \"approvals\": {
    \"exec\": {
      \"enabled\": false
    }
  },
  \"commands\": {
    \"native\": \"auto\",
    \"nativeSkills\": \"auto\",
    \"restart\": true,
    \"ownerDisplay\": \"raw\"
  },
  \"session\": {
    \"dmScope\": \"main\",
    \"reset\": {
      \"daily\": true
    },
    \"maintenance\": {
      \"pruneWindowDays\": 30,
      \"cap\": 500
    }
  },
  \"hooks\": {
    \"internal\": {
      \"enabled\": true,
      \"entries\": {
        \"boot-md\": { \"enabled\": true },
        \"command-logger\": { \"enabled\": true },
        \"session-memory\": { \"enabled\": true }
      }
    }
  },
  \"channels\": {
    \"telegram\": {
      \"enabled\": true,
      \"dmPolicy\": \"allowlist\",
      \"allowFrom\": [8466501613],
      \"groupPolicy\": \"allowlist\",
      \"streaming\": \"partial\"
    }
  },
  \"gateway\": {
    \"port\": 18790,
    \"mode\": \"local\",
    \"bind\": \"lan\",
    \"controlUi\": {
      \"allowedOrigins\": [
        \"http://localhost:3000\",
        \"http://127.0.0.1:3000\",
        \"http://localhost:8000\",
        \"http://127.0.0.1:8000\"
      ]
    },
    \"auth\": {
      \"mode\": \"token\"
    },
    \"tailscale\": {
      \"mode\": \"off\"
    },
    \"reload\": {
      \"mode\": \"hot\",
      \"debounceMs\": 750
    }
  },
  \"skills\": {
    \"entries\": {
      \"github\": { \"enabled\": true },
      \"coding-agent\": { \"enabled\": true }
    }
  }
}
JSONEOF

echo 'openclaw.json écrit.'
"
```

#### 1.3 — Variables secrets (.env)

```bash
# Gemini CLI : lire les secrets depuis Windows et les injecter
# NE PAS les hardcoder dans ce document

wsl -d ASpace-L0 -u amadeus -- bash -c "
cat > ~/.openclaw/.env << 'ENVEOF'
ANTHROPIC_API_KEY=PLACEHOLDER_REMPLACER
OPENROUTER_API_KEY=PLACEHOLDER_REMPLACER
TELEGRAM_BOT_TOKEN=PLACEHOLDER_REMPLACER
OPENCLAW_GATEWAY_TOKEN=$(openssl rand -hex 32)
ENVEOF

echo 'Fichier .env créé — REMPLACER les PLACEHOLDER par les vraies valeurs'
"
```

**NOTE GEMINI CLI :** Récupérer les vraies valeurs depuis `C:\Users\amado\.openclaw\.env` (Windows) et les injecter dans le `.env` WSL. Ne pas les afficher dans les logs.

#### 1.4 — Installation du service systemd

```bash
wsl -d ASpace-L0 -u amadeus -- bash -c "
  source ~/.bashrc
  openclaw gateway install
  # Crée automatiquement le fichier systemd openclaw.service
  sudo systemctl enable openclaw
  sudo systemctl start openclaw
  sleep 3
  sudo systemctl status openclaw
"
```

**TEST DE SORTIE PHASE 1 :**
```bash
wsl -d ASpace-L0 -u amadeus -- bash -c "
  echo '=== Gateway status ===' && curl -s http://127.0.0.1:18790 | head -5
  echo '=== Exec test ===' && openclaw agent --message 'exec whoami' --agent main 2>&1 | tail -5
  echo '=== Systemd ===' && sudo systemctl is-active openclaw
"
```
**Go si :** gateway répond sur :18790, systemd=active, exec whoami retourne `amadeus`.

---

### PHASE 2 — Workspaces & Âmes des Agents (Ralph Loop)

Pour chaque agent dans l'ordre : `rick → doctor-13 → doctor-11 → doctor-12 → [companions ×10] → donna`

#### Structure par agent (Ralph Loop itère ce bloc pour chacun)

```bash
# Variable : AGENT_ID, AGENT_NAME, AGENT_ROLE, AGENT_LAW, AGENT_COMPANIONS
WORKSPACE="/home/amadeus/.openclaw/workspace-${AGENT_ID}"

wsl -d ASpace-L0 -u amadeus -- bash -c "
mkdir -p ${WORKSPACE}/memory

# SOUL.md — Identité profonde
cat > ${WORKSPACE}/SOUL.md << 'EOF'
# ${AGENT_NAME} — SOUL

## Qui je suis
${AGENT_DESCRIPTION}

## Ma Loi
${AGENT_LAW}

## Mon Style
- Je parle en ${AGENT_STYLE}
- Je ne commente jamais ce que je ne peux pas exécuter
- Je rapporte les blocages avant qu'ils deviennent des dettes

## Mes Veto Lines
${AGENT_VETO}
EOF

# IDENTITY.md — Position dans la hiérarchie
cat > ${WORKSPACE}/IDENTITY.md << 'EOF'
# ${AGENT_NAME} — Position A'Space

- **Niveau :** ${AGENT_LEVEL}
- **Supérieur :** ${AGENT_SUPERIOR}
- **Inférieurs :** ${AGENT_INFERIOR}
- **Mission :** ${AGENT_MISSION}
- **Scope :** ${AGENT_SCOPE}
EOF

# AGENTS.md — Comportement opérationnel
cat > ${WORKSPACE}/AGENTS.md << 'EOF'
# ${AGENT_NAME} — Operating Instructions

Tu es ${AGENT_NAME}, ${AGENT_ROLE} dans A'Space OS L0.

## Règles absolues
1. Exécute d'abord, explique après.
2. Un blocage = rapport immédiat à ${AGENT_SUPERIOR}, pas une tentative de contournement.
3. Toute action irréversible = confirmation explicite requise.
4. Les chemins sont toujours absolus depuis /home/amadeus/.
5. Jamais de /mnt/c/ dans tes opérations.

## Format de rapport
STATUT: OK | BLOQUÉ | ATTENTION
ACTION: [ce qui a été fait]
RÉSULTAT: [mesurable]
NEXT: [prochaine action ou escalade]
EOF

# TOOLS.md — Outils disponibles
cat > ${WORKSPACE}/TOOLS.md << 'EOF'
# ${AGENT_NAME} — Tools

## Exec
- host: gateway (Linux natif)
- security: full
- Workspace primaire: ${WORKSPACE}

## Spécifique à ce rôle
${AGENT_TOOLS}
EOF
"
```

#### Fichiers SOUL.md spécifiques par agent

**Rick (A1 — Gatekeeper)**
```
AGENT_LAW: "Sobriety & Anti-fragility. Rien ne doit dépendre de Windows."
AGENT_VETO: |
  - Toute opération qui écrit dans /mnt/c/
  - Toute configuration sans ADR correspondant
  - Toute dépendance à Docker Desktop
AGENT_TOOLS: SSH vers VPS futur, audit de config, veto enforcement
```

**Doctor-13 (A2 — Infra)**
```
AGENT_LAW: "Make it Sovereign. L'infra ne doit jamais nécessiter d'intervention manuelle."
AGENT_SUPERIOR: Rick
AGENT_INFERIOR: Yaz, Ryan, Graham
AGENT_TOOLS: systemctl, monitoring, service management
```

**Doctor-11 (A2 — Interface)**
```
AGENT_LAW: "Make it Invisible. L'utilisateur ne doit jamais voir l'infrastructure."
AGENT_SUPERIOR: Rick
AGENT_INFERIOR: Amy, Rory, River
AGENT_TOOLS: UI tooling, notification systems, Notion API
```

**Doctor-12 (A2 — Pipelines)**
```
AGENT_LAW: "Make it Robust. Un pipeline qui tombe une fois doit être remplacé, pas réparé."
AGENT_SUPERIOR: Rick
AGENT_INFERIOR: Clara, Nardole, Bill
AGENT_TOOLS: ETL, data pipelines, cron jobs
```

**Donna (DLQ)**
```
AGENT_LAW: "La femme qui sauve l'univers. Tout ce qui tombe arrive chez Donna."
AGENT_ROLE: Dead Letter Queue — capture tout ce qui échoue dans L0
AGENT_TOOLS: Logs, error capture, alert routing vers Rick
```

**TEST DE SORTIE PHASE 2 :**
```bash
# Vérifier que Rick répond avec son identité
openclaw agent --message "Qui es-tu et quelle est ta loi ?" --agent l0-a1-rick
```
**Go si :** Rick répond en mentionnant "Sobriety & Anti-fragility" et son rôle.

---

### PHASE 3 — Mission Control

#### 3.1 — Installation

```bash
wsl -d ASpace-L0 -u amadeus -- bash -c "
  # Prérequis : docker dans WSL (pas Docker Desktop)
  sudo apt-get install -y docker.io docker-compose-plugin
  sudo usermod -aG docker amadeus
  newgrp docker

  # Clone Mission Control
  mkdir -p ~/aspace/tools
  cd ~/aspace/tools
  git clone https://github.com/abhi1693/openclaw-mission-control
  cd openclaw-mission-control

  # Configuration
  cp .env.example .env
"
```

#### 3.2 — Configuration Mission Control

```bash
wsl -d ASpace-L0 -u amadeus -- bash -c "
  cd ~/aspace/tools/openclaw-mission-control

  # Injecter les variables de connexion au gateway WSL
  sed -i 's|OPENCLAW_GATEWAY_URL=.*|OPENCLAW_GATEWAY_URL=ws://127.0.0.1:18790|' .env
  sed -i 's|OPENCLAW_GATEWAY_TOKEN=.*|OPENCLAW_GATEWAY_TOKEN=\$(grep OPENCLAW_GATEWAY_TOKEN ~/.openclaw/.env | cut -d= -f2)|' .env
"
```

#### 3.3 — Démarrage

```bash
wsl -d ASpace-L0 -u amadeus -- bash -c "
  cd ~/aspace/tools/openclaw-mission-control
  docker compose up -d
  sleep 5
  curl -s http://127.0.0.1:8000/health
"
```

**TEST DE SORTIE PHASE 3 :**
- `http://localhost:8000` accessible depuis Windows (browser)
- Les 15 agents L0 listés dans l'interface
- Connexion gateway = Connected

---

### PHASE 4 — Keepalive Windows (obligatoire)

```powershell
# Windows PowerShell — à exécuter une seule fois

# Script keepalive dans WSL
wsl -d ASpace-L0 -u amadeus -- bash -c "
cat > ~/.local/bin/keepalive.sh << 'EOF'
#!/bin/bash
# A'Space L0 Keepalive — empêche WSL de s'endormir
while true; do
  sleep 55
  # Vérifier que le gateway est vivant
  if ! systemctl is-active --quiet openclaw; then
    systemctl start openclaw
  fi
done
EOF
chmod +x ~/.local/bin/keepalive.sh
"

# Task Scheduler Windows
$action = New-ScheduledTaskAction -Execute "wsl.exe" -Argument "-d ASpace-L0 -u amadeus -- bash -c 'source ~/.bashrc; nohup ~/.local/bin/keepalive.sh >> /tmp/keepalive.log 2>&1 &'"
$trigger = New-ScheduledTaskTrigger -AtStartup
$settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Hours 0) -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1)
Register-ScheduledTask -TaskName "ASpace-L0-Keepalive" -Action $action -Trigger $trigger -Settings $settings -RunLevel Highest -Force

# Démarrer immédiatement
Start-ScheduledTask -TaskName "ASpace-L0-Keepalive"
```

**TEST DE SORTIE PHASE 4 :**
- Attendre 15 min sans toucher Windows
- Tester depuis Telegram : `echo keepalive test`
- **Go si :** réponse reçue en moins de 5 secondes

---

## TESTS DE SOUVERAINETÉ FINALE

Tous ces tests doivent passer avant de déclarer la Phase 0→4 complète :

```bash
wsl -d ASpace-L0 -u amadeus -- bash -c "
echo '1. USER' && whoami | grep -x amadeus && echo OK
echo '2. PATH CLEAN' && echo \$PATH | grep -v '/mnt/c' && echo OK
echo '3. NO WINDOWS MOUNT' && ls /mnt/ 2>/dev/null | wc -l | grep -x 0 && echo OK
echo '4. SYSTEMD' && sudo systemctl is-active openclaw | grep -x active && echo OK
echo '5. GATEWAY' && curl -s http://127.0.0.1:18790 | head -1 && echo OK
echo '6. EXEC' && openclaw agent --message 'exec whoami' --agent main 2>&1 | grep amadeus && echo OK
echo '7. MISSION CONTROL' && curl -s http://127.0.0.1:8000/health | grep -i ok && echo OK
"
```

---

## SECRETS À SÉPARER (Gemini CLI : Action Requise)

| Secret | Instance (Rôle) | Valeur / Action Requise |
|--------|---------------|-----------------|
| `TELEGRAM_BOT_TOKEN` | A'0 (Windows) | Garder le token actuel (Bot Windows existant) |
| `TELEGRAM_BOT_TOKEN` | A0 (WSL) | **CRITIQUE : L'utilisateur doit GÉNÉRER UN NOUVEAU BOT via @BotFather et l'injecter ici** |
| `OPENCLAW_GATEWAY_TOKEN` | A0 (WSL) | Générer un nouveau (`openssl rand -hex 32`) |

**IMPORTANT :** Le bot Telegram WSL est **NOUVEAU**. Sans ce nouveau token, les 409 persisteront.

---

## DÉPRÉCIATION WINDOWS ANNULÉE

L'instance Windows (port 18789) **reste active et légitime** pour le "Life OS" (L1).
Le script keepalive WSL tournera en parallèle sans la perturber, pour peu que les tokens soient différenciés.

---

## CRITÈRES DE SUCCÈS GLOBAL

| Critère | Mesure |
|---------|--------|
| Exec fonctionnel | `whoami` depuis Telegram → `amadeus` en <3s |
| Zéro restriction arbitraire | Toute commande bash s'exécute sans approbation |
| Fleet vivante | Rick répond avec son identité quand interpellé |
| Mission Control connecté | UI accessible, agents listés |
| Autonomie 24h | Gateway vivant après 24h sans intervention |
| Antifragilité | Crash gateway → systemd restart automatique <10s |

---

## ANNEXE — Hiérarchie Complète L0

```
A0  Amadeus (Observateur — ne touche pas aux configs)
│
A1  Rick — Architect of Sovereignty (Veto absolu)
│
├── A2  Doctor-13 — Infra
│   ├── A3  Yaz — Watchdog (Monitor/Restart)
│   ├── A3  Ryan — Mechanic (Keys/Connections)
│   └── A3  Graham — Driver (Router/Bus)
│
├── A2  Doctor-11 — Interface
│   ├── A3  Amy — Designer (Notion/UI)
│   ├── A3  Rory — Sentinel (Backup/Security)
│   └── A3  River — Timekeeper (Sync/Calendar)
│
├── A2  Doctor-12 — Pipelines
│   ├── A3  Clara — Processor (ETL/Data)
│   ├── A3  Nardole — Dispatcher (Tickets/Ops)
│   └── A3  Bill — Scout (Research/Feeds)
│
└── Donna — Dead Letter Queue (captures all failures)

Mission Control — Orchestration Dashboard (externe au gateway)
```

---

*ADR-WSL-001 — Émis le 2026-03-10 par A0 Amadeus*
*"Ce qui naît propre, reste propre."*
*Ancré dans : AGENTS.md — Rick's Verse Canon*

