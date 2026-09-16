"""Workers de production Hermes natifs (longue duree, hors timeout cron).

Un tick de cron demarre OU reconcile UN processus durable puis revient vite :
il ne bloque jamais sur le worker et ne le coupe pas. Le worker tourne via la
CLI Hermes locale (profil deja configure OpenRouter), sans --run-budget ni
limite de tours : la commande exacte est parametree dans config.json.

Journal : worker_journal.json (pid, session, etat, decision JSON controlee).
Aucune execution de texte shell produit par un LLM : seules les commandes
configures sont lancees. 402/403 du fournisseur = arret explicite consigne,
pas de relance automatique.
"""
import json
import os
import subprocess
import sys
import time
from pathlib import Path

STOP_HTTP = (402, 403)


class WorkerError(Exception):
    pass


def journal_path(orch_dir):
    return Path(orch_dir) / 'worker_journal.json'


def load_journal(orch_dir):
    p = journal_path(orch_dir)
    if not p.is_file():
        return {'workers': []}
    try:
        return json.loads(p.read_text(encoding='utf-8'))
    except (ValueError, OSError) as e:
        raise WorkerError('journal illisible: %s' % e)


def save_journal(orch_dir, journal):
    journal_path(orch_dir).write_text(
        json.dumps(journal, ensure_ascii=False, indent=2), encoding='utf-8')


def pid_alive(pid):
    if pid is None:
        return False
    try:
        if os.name == 'nt':
            out = subprocess.run(
                ['tasklist', '/FI', 'PID eq %d' % pid], capture_output=True,
                text=True, timeout=15)
            return 'PID eq %d' % pid in out.stdout or ('%d' % pid) in out.stdout
        os.kill(pid, 0)
        return True
    except (OSError, subprocess.SubprocessError):
        return False


def worker_command(cfg, task_file, journal_file):
    """Commande worker depuis la configuration — jamais construite par un LLM."""
    w = cfg.get('worker') or {}
    cmd = list(w.get('command') or ['hermes', 'run', '--yes'])
    cmd.append(str(task_file))
    return cmd, w


def start(orch_dir, cfg, task_file, job_key=None):
    """Demarre un worker detache et journalise pid/etat. Retourne l'entree."""
    orch_dir = Path(orch_dir)
    cmd, wcfg = worker_command(cfg, task_file, journal_path(orch_dir))
    j = load_journal(orch_dir)
    for e in j['workers']:
        if e.get('state') == 'RUNNING' and pid_alive(e.get('pid')):
            if job_key and e.get('job_key') == job_key:
                return e, 'ALREADY_RUNNING'
            if not job_key:
                return e, 'ALREADY_RUNNING'
    env = dict(os.environ)
    env.setdefault('PYTHONIOENCODING', 'utf-8')
    flags = getattr(subprocess, 'DETACHED_PROCESS', 0) | \
        getattr(subprocess, 'CREATE_NEW_PROCESS_GROUP', 0) if os.name == 'nt' else 0
    log = open(orch_dir / ('worker_%s.log' % time.strftime('%Y%m%d_%H%M%S')),
               'w', encoding='utf-8')
    p = subprocess.Popen(cmd, cwd=str(orch_dir), env=env, stdout=log, stderr=log,
                         stdin=subprocess.DEVNULL, creationflags=flags,
                         close_fds=True)
    entry = {'pid': p.pid, 'job_key': job_key, 'task_file': str(task_file),
             'command': cmd, 'state': 'RUNNING', 'started_at': time.strftime(
                 '%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
             'last_outcome': None, 'stop_reason': None}
    j['workers'].append(entry)
    save_journal(orch_dir, j)
    return entry, 'STARTED'


def reconcile(orch_dir):
    """Reconcilie le journal : vivant -> RUNNING, mort -> EXITED/STOPPED."""
    orch_dir = Path(orch_dir)
    j = load_journal(orch_dir)
    changed = []
    for e in j['workers']:
        if e['state'] != 'RUNNING':
            continue
        if pid_alive(e['pid']):
            continue
        e['state'] = 'EXITED'
        e['stop_reason'] = 'processus absent du systeme'
        changed.append(e)
        if e.get('last_outcome') in ('PROVIDER_STOP_402', 'PROVIDER_STOP_403'):
            e['state'] = 'STOPPED_PROVIDER'
            e['stop_reason'] = 'arret explicite fournisseur : aucune relance automatique'
    if changed:
        save_journal(orch_dir, j)
    return changed


def set_outcome(orch_dir, pid, outcome):
    j = load_journal(orch_dir)
    for e in j['workers']:
        if e.get('pid') == pid and e['state'] in ('RUNNING', 'EXITED'):
            e['last_outcome'] = outcome
            if isinstance(outcome, str) and any('PROVIDER_STOP_%d' % c in outcome
                                                for c in STOP_HTTP):
                e['state'] = 'STOPPED_PROVIDER'
                e['stop_reason'] = 'arret explicite fournisseur'
            save_journal(orch_dir, j)
            return True
    return False
