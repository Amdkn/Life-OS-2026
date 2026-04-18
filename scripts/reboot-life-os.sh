#!/bin/bash

# --- CONFIG ---
PORT=4444
PROJECT_DIR="/home/amadeus/aspace/life-os/the-bridge-__-life-os"
LOG_DIR="/home/amadeus/aspace/life-os/logs"
mkdir -p "$LOG_DIR"

echo "[INFRA] Lancement du reboot Antifragile pour Life OS..."

# --- PHASE 1: AUDIT & CLEANUP ---
echo "[INFRA] Phase 1 : Nettoyage du port $PORT..."
# lsof -t is great for just getting PIDs
PIDS=$(lsof -t -i :$PORT)
if [ ! -z "$PIDS" ]; then
    echo "[INFRA] Processus trouvés sur $PORT : $PIDS. Envoi de SIGTERM..."
    kill $PIDS
    sleep 2
    # Second pass force if needed
    PIDS_REMAINING=$(lsof -t -i :$PORT)
    if [ ! -z "$PIDS_REMAINING" ]; then
        echo "[INFRA] Résistance détectée. Envoi de SIGKILL sur $PIDS_REMAINING..."
        kill -9 $PIDS_REMAINING
    fi
else
    echo "[INFRA] Port $PORT déjà libre."
fi

# --- PHASE 2: CACHE PURGE ---
echo "[INFRA] Phase 2 : Purge du cache Vite..."
rm -rf "$PROJECT_DIR/node_modules/.vite"

# --- PHASE 3: BOOT ---
echo "[INFRA] Phase 3 : Lancement du serveur Life OS sur $PORT..."
cd $PROJECT_DIR
# Use nohup or setsid to keep it running in background properly
# 0.0.0.0 is used to ensure it's accessible within WSL
nohup npm run dev -- --port $PORT --host 0.0.0.0 > "$LOG_DIR/life-os.log" 2>&1 &

# --- PHASE 4: STATE CAPTURE ---
if [ -f "/home/amadeus/aspace/life-os/SOVEREIGN_CONTEXT.md" ]; then
    echo "[INFRA] Phase 4 : Mise à jour du Sovereign Context Registry..."
    SED_DATE=$(date '+%Y-%m-%d %H:%M:%S')
    # Update timestamp in SCR
    sed -i "s/- \*\*Dernier Reboot\*\* : .*/- **Dernier Reboot** : $SED_DATE/g" /home/amadeus/aspace/life-os/SOVEREIGN_CONTEXT.md
    sed -i "s/\*Mis à jour par Antigravity le .*/\*Mis à jour par Antigravity le $SED_DATE\*/g" /home/amadeus/aspace/life-os/SOVEREIGN_CONTEXT.md
    echo "[INFRA] Registre SCR synchronisé."
fi

echo "[INFRA] Succès : Life OS redémarré de manière idempotente sur le port $PORT."
