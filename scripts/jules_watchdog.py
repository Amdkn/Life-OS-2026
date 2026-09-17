import json, os, subprocess, sys, time, urllib.request, urllib.parse
from pathlib import Path

REPO_DIR = Path(__file__).resolve().parents[1]
API_URL = "https://jules.googleapis.com/v1alpha/"
SOURCE = "sources/github/Amdkn/Life-OS-2026"

def get_api_key():
    key = os.environ.get("JULES_API_KEY")
    if key and not key.startswith("${"):
        return key
    mcp_config = Path.home() / ".gemini/config/mcp_config.json"
    if mcp_config.exists():
        try:
            data = json.loads(mcp_config.read_text(encoding="utf-8"))
            key = data.get("mcpServers", {}).get("jules", {}).get("env", {}).get("JULES_API_KEY")
            if key and not key.startswith("${"):
                return key
        except Exception:
            pass
    return None

def jules_api(endpoint, payload=None, method=None):
    key = get_api_key()
    if not key:
        return None
    url = API_URL + endpoint
    data = json.dumps(payload).encode("utf-8") if payload else None
    headers = {"X-Goog-Api-Key": key, "Content-Type": "application/json"}
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print(f"[Watchdog] API Error ({endpoint}): {e}", file=sys.stderr)
        return None

def check_and_unblock_sessions():
    data = jules_api("sessions?pageSize=30")
    if not data or "sessions" not in data:
        return
    for s in data["sessions"]:
        if s.get("sourceContext", {}).get("source") != SOURCE:
            continue
        state = s.get("state")
        sid = s.get("id") or s.get("name", "").split("/")[-1]
        title = s.get("title", sid)
        
        # 1. State AWAITING_USER_FEEDBACK is an immediate blocker
        if state == "AWAITING_USER_FEEDBACK":
            print(f"[Watchdog] Session {title} ({sid}) is AWAITING_USER_FEEDBACK. Auto-unblocking...")
            msg_payload = {"prompt": "Please proceed immediately, run pre-commit checks, and submit the Pull Request."}
            jules_api(f"sessions/{sid}:sendMessage", payload=msg_payload)
            continue
            
        if state in ("COMPLETED", "FAILED"):
            continue
            
        # 2. Check activities for implicit questions
        acts = jules_api(f"sessions/{sid}/activities?pageSize=2")
        if acts and "activities" in acts:
            for a in acts["activities"]:
                content = json.dumps(a).lower()
                if any(term in content for term in ["waiting for your input", "confirm this aligns", "tweaks needed", "should i proceed"]):
                    print(f"[Watchdog] Text cue trigger for session {title} ({sid}). Auto-unblocking...")
                    msg_payload = {"prompt": "Please proceed immediately, run pre-commit checks, and submit the Pull Request."}
                    jules_api(f"sessions/{sid}:sendMessage", payload=msg_payload)
                    break

def check_and_merge_prs():
    try:
        cmd = ["gh", "pr", "list", "--repo", "Amdkn/Life-OS-2026", "--state", "open", "--json", "number,title,isDraft,mergeable,mergeStateStatus,headRefName"]
        res = subprocess.run(cmd, cwd=str(REPO_DIR), capture_output=True, text=True, check=True)
        prs = json.loads(res.stdout)
    except Exception as e:
        print(f"[Watchdog] Error listing PRs: {e}", file=sys.stderr)
        return

    for pr in prs:
        num = pr["number"]
        title = pr["title"]
        print(f"[Watchdog] Processing PR #{num}: {title}...")
        
        if pr.get("isDraft"):
            print(f"[Watchdog] Marking PR #{num} as ready...")
            subprocess.run(["gh", "pr", "ready", str(num), "--repo", "Amdkn/Life-OS-2026"], cwd=str(REPO_DIR), capture_output=True)
            time.sleep(2)
        
        view_cmd = ["gh", "pr", "view", str(num), "--repo", "Amdkn/Life-OS-2026", "--json", "mergeable,mergeStateStatus"]
        v_res = subprocess.run(view_cmd, cwd=str(REPO_DIR), capture_output=True, text=True)
        try:
            status = json.loads(v_res.stdout)
        except Exception:
            continue
        
        if status.get("mergeable") == "MERGEABLE":
            print(f"[Watchdog] Merging PR #{num} ({title})...")
            m_res = subprocess.run(["gh", "pr", "merge", str(num), "--repo", "Amdkn/Life-OS-2026", "--squash", "--delete-branch"], cwd=str(REPO_DIR), capture_output=True, text=True)
            if m_res.returncode == 0:
                print(f"[Watchdog] PR #{num} merged!")
                subprocess.run(["git", "pull", "origin", "main"], cwd=str(REPO_DIR), capture_output=True)

def run_once():
    print(f"[Watchdog] Cycle started at {time.strftime('%Y-%m-%d %H:%M:%S')}...")
    check_and_unblock_sessions()
    check_and_merge_prs()
    print("[Watchdog] Cycle complete.")

if __name__ == "__main__":
    run_once()
