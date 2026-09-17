import time, subprocess, sys
from pathlib import Path

REPO_DIR = Path(__file__).resolve().parents[1]
WATCHDOG_SCRIPT = REPO_DIR / "scripts" / "jules_watchdog.py"

print("[Watchdog Daemon] Starting continuous loop (every 30s)...")
while True:
    try:
        subprocess.run([sys.executable, str(WATCHDOG_SCRIPT)], cwd=str(REPO_DIR))
    except Exception as e:
        print(f"[Watchdog Daemon] Error: {e}", file=sys.stderr)
    time.sleep(30)
