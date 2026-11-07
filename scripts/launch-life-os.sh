#!/bin/bash

# Canonical Life OS Launcher — M4 Convergence
# Runtime identity: ASpace_Worlds/Life_OS_2026
# Ports: 4444 (UI), 4445 (Blackboard), 3001 (Terra API Runtime)

set -euo pipefail

CANONICAL_ROOT="/mnt/c/Users/amado/ASpace_Worlds/Life_OS_2026"
PORT_UI=4444
PORT_BLACKBOARD=4445
PORT_API=3001
LOG_DIR="$CANONICAL_ROOT/logs"

mkdir -p "$LOG_DIR"

echo "[LAUNCHER] Canonical runtime: $CANONICAL_ROOT"
echo "[LAUNCHER] Ports: UI=$PORT_UI Blackboard=$PORT_BLACKBOARD API=$PORT_API"

# Phase 1: Port cleanup
for PORT in $PORT_UI $PORT_BLACKBOARD $PORT_API; do
    PIDS=$(lsof -t -i :$PORT 2>/dev/null || true)
    if [ -n "$PIDS" ]; then
        echo "[LAUNCHER] Cleaning port $PORT: $PIDS"
        kill $PIDS 2>/dev/null || true
        sleep 1
        PIDS_REMAINING=$(lsof -t -i :$PORT 2>/dev/null || true)
        if [ -n "$PIDS_REMAINING" ]; then
            kill -9 $PIDS_REMAINING 2>/dev/null || true
        fi
    fi
done

# Phase 2: Vite cache purge
echo "[LAUNCHER] Purging Vite cache..."
rm -rf "$CANONICAL_ROOT/node_modules/.vite" 2>/dev/null || true

# Phase 3: Start services
cd "$CANONICAL_ROOT"

# Start Blackboard (port 4445)
echo "[LAUNCHER] Starting Blackboard on $PORT_BLACKBOARD..."
nohup npm run server > "$LOG_DIR/blackboard.log" 2>&1 &
BB_PID=$!
echo "[LAUNCHER] Blackboard PID: $BB_PID"

# Wait for Blackboard health
sleep 2
for i in {1..10}; do
    if curl -s "http://localhost:$PORT_BLACKBOARD/health" >/dev/null 2>&1; then
        echo "[LAUNCHER] Blackboard healthy"
        break
    fi
    sleep 1
done

# Start Terra API Runtime (port 3001)
echo "[LAUNCHER] Starting Terra API Runtime on $PORT_API..."
nohup npx tsx server/api/harness.ts > "$LOG_DIR/api-runtime.log" 2>&1 &
API_PID=$!
echo "[LAUNCHER] API Runtime PID: $API_PID"

# Start UI (port 4444)
echo "[LAUNCHER] Starting UI on $PORT_UI..."
nohup npm run dev -- --port $PORT_UI --host 0.0.0.0 > "$LOG_DIR/ui.log" 2>&1 &
UI_PID=$!
echo "[LAUNCHER] UI PID: $UI_PID"

# Wait for UI
sleep 3
for i in {1..15}; do
    if curl -s "http://localhost:$PORT_UI" >/dev/null 2>&1; then
        echo "[LAUNCHER] UI healthy"
        break
    fi
    sleep 1
done

echo "[LAUNCHER] All services started"
echo "  UI:           http://localhost:$PORT_UI"
echo "  Blackboard:   http://localhost:$PORT_BLACKBOARD"
echo "  API Runtime:  http://localhost:$PORT_API"
echo "  Logs:         $LOG_DIR"
echo ""
echo "To stop: kill $UI_PID $BB_PID $API_PID"