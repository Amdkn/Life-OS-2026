"""Runtime d'orchestration Jules — manager E-Myth sous Astra.

Commandes : tick, manager, gatekeeper, supervisor, status.
DRY_RUN par defaut (zero mutation reseau) ; --live explicite pour les appels
reels (GET/POST Jules uniquement). Stdlib uniquement. Aucune ecriture hors
delegation-a-jules/orchestration/. Aucune cle lue ni affichee.

Admission : MAX 15 sessions actives compte global toutes sources, MAX 3
categories actives du programme, scopes exclusifs, dependances prouvees par
recus d'integration (jamais fabriques). Sessions existantes reprisees via
sendMessage, jamais recreees. UNCERTAIN bloque uniquement le job et ses
scopes. Pas de retry aveugle sur FAILED/PAUSED/UNKNOWN. COMPLETED != PRD
termine : livraison verifiee, PR publiee et integration sont des etats
distincts.
"""
import argparse
import datetime
import hashlib
import json
import re
import sys
from pathlib import Path

ORCH_DIR = Path(__file__).resolve().parent
BASE_DIR_DEFAULT = ORCH_DIR.parent

import jules_client
import manager_llm
import registry as registry_mod
import worker as worker_mod
from jules_client import AdapterError
from manager_llm import (CredentialMissing, InvalidDecision, call_llm,
                         find_credential, parse_decision, validate_decision)
from store import JOB_ACTIVE_LINKED, Store, iso, parse_iso

TERMINAL_STATES = {'COMPLETED', 'FAILED'}
NO_RETRY_STATES = {'FAILED', 'PAUSED', 'UNSPECIFIED', 'UNKNOWN'}
PR_URL_RE = re.compile(r'https?://\S*/pull/\d+')
PLANNABLE = ('READY', 'PLANNED_CREATE', 'PLANNED_MESSAGE')

DEFAULT_CONFIG = {
    'source': 'sources/github/Amdkn/Life-OS-2026',
    'repo_slug': 'Amdkn/Life-OS-2026',
    'starting_branch': 'main',
    'registry_file': 'governance/work-items.json',
    'integration_receipts_file': 'integrations.json',
    'limits': {
        'max_active_sessions_account': 15,
        'max_active_categories_program': 3,
        'max_creations_per_tick': 2,
        'max_messages_per_tick': 4,
        'submission_expiry_horizon_hours': 24,
        'claim_ttl_seconds': 600,
        'activities_pages_max': 50,
        'list_pages_max': 50,
    },
    'managers': ['manager-a', 'manager-b', 'manager-c'],
    'llm': {
        'base_url': 'https://openrouter.ai/api/v1/chat/completions',
        'model': 'z-ai/glm-5.3-flash',
        'max_tokens': 4096,
        'temperature': 0.0,
        'daily_budget_calls': None,
        'budget_note': "null = plafond d'appels local desactive ; le plafond financier de la cle n'est pas modifie",
        'env_key': 'OPENROUTER_API_KEY',
        'hermes_env_file': None,
        'max_events_per_run': 3,
        'max_invalid_attempts_per_event': 3,
    },
    'cadences': {
        'manager_intervals_minutes': [1, 5, 15],
        'gatekeeper_useful_required': 4,
        'supervisor_intervals_minutes': [5, 15, 30, 60],
        'prompt_library_refresh_minutes': 10,
    },
    'api': {
        'automation_mode': 'AUTO_CREATE_PR',
        'require_plan_approval': False,
        'input_only_note': 'input-only : envoyes, jamais compares aux champs absents du GET',
    },
    'known_sessions': [],
    'paths': {'dispatch_scripts': '../scripts'},
}


def load_config(path):
    cfg = json.loads(json.dumps(DEFAULT_CONFIG))
    p = Path(path)
    if p.is_file():
        data = json.loads(p.read_text(encoding='utf-8'))
        for k, v in data.items():
            if isinstance(v, dict) and isinstance(cfg.get(k), dict):
                cfg[k].update(v)
            else:
                cfg[k] = v
    return cfg


def sha(text):
    return hashlib.sha256(text.encode('utf-8')).hexdigest()


def assignee_for_category(cfg, category):
    return cfg['managers'][category % len(cfg['managers'])]


def job_key_of(repo_slug, prd_id, tranche):
    return '%s/%s/%s' % (repo_slug, prd_id, tranche)


def marker_for(job_key, sha_hex):
    return '[JOB-MARKER %s sha:%s]' % (job_key, sha_hex[:12])


def session_title_for(job):
    return 'LifeOS:C%d | %s | %s | %s' % (
        job['category'], job['prd_id'], job.get('tranche', 't1'), job['job_key'])


def parse_session_title(title):
    cat = None
    m = re.search(r'LifeOS:C(\d+)', title or '')
    if m:
        cat = int(m.group(1))
    prd = None
    m = re.search(r'PRD-\d{3}', title or '')
    if m:
        prd = m.group(0)
    elif 'PRD-12WY-' in (title or ''):
        prd = 'PRD-001'
    return cat, prd


def state_to_job_status(state):
    if state == 'COMPLETED':
        return 'SESSION_TERMINAL'
    if state in NO_RETRY_STATES:
        return 'BLOCKED_REVIEW'
    if state == 'AWAITING_PLAN_APPROVAL':
        return 'AWAITING_PLAN_APPROVAL'
    if state == 'AWAITING_USER_FEEDBACK':
        return 'AWAITING_USER_FEEDBACK'
    return 'ACTIVE'


def extract_pr_refs(obj):
    found = []

    def walk(o):
        if isinstance(o, dict):
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)
        elif isinstance(o, str):
            found.extend(PR_URL_RE.findall(o))

    walk(obj)
    return sorted(set(found))


class Ctx:
    def __init__(self, orch_dir, base_dir, config, store, jules, llm_transport, live,
                 command):
        self.orch_dir = orch_dir
        self.base_dir = base_dir
        self.config = config
        self.store = store
        self.jules = jules
        self.llm_transport = llm_transport
        self.live = live
        self.command = command

    @property
    def now(self):
        return self.store.now()


def build_ctx(orch_dir=None, base_dir=None, config_path=None, live=False,
              jules_transport=None, llm_transport=None, now_fn=None, command='cli'):
    orch = Path(orch_dir) if orch_dir else ORCH_DIR
    base = Path(base_dir) if base_dir else orch.parent
    cfg = load_config(config_path or (orch / 'config.json'))
    st = Store(orch / 'state.sqlite3', now_fn=now_fn)
    jules = None
    if jules_transport is not None or live:
        scripts = orch / cfg['paths']['dispatch_scripts']
        mod = jules_client.load_dispatch_module(scripts)
        jules = jules_client.SafeClient(
            mod, transport=jules_transport,
            activities_pages_max=cfg['limits']['activities_pages_max'])
    return Ctx(orch, base, cfg, st, jules, llm_transport, live, command)


# --- prompts -------------------------------------------------------------------

def load_contract(base_dir):
    p = Path(base_dir) / 'CONTRAT-COMMUN.md'
    return p.read_text(encoding='utf-8') if p.is_file() else ''


def build_tranche_prompt(cfg, base_dir, contract, item, receipt_ok):
    prd_path = Path(base_dir) / item['path']
    prd_text = prd_path.read_text(encoding='utf-8') if prd_path.is_file() else ''
    dep_lines = []
    for d in item.get('depends_on', []):
        if d in receipt_ok:
            dep_lines.append('- %s : PREUVE D\'INTEGRATION = recu %s' % (d, receipt_ok[d]))
        else:
            dep_lines.append('- %s : PREUVE D\'INTEGRATION ABSENTE — tranche bloquee '
                             'tant que la preuve n\'est pas fournie' % d)
    header = (
        'MANDAT EXECUTABLE DE CETTE TRANCHE — job %s\n'
        'PRD exact : delegation-a-jules/%s\n'
        'Scope exclusif d\'ecriture : %s\n'
        'Dependances et preuves :\n%s\n'
        'Tests obligatoires : cas positif ET cas negatif, commandes exactes et rc '
        'attendus ; sans runner present, fournir un runner reproductible.\n'
        'Aucun acces au corpus Windows (C:/Users/amado/...) depuis la VM : tout besoin '
        'documentaire doit etre extrait en paquet source sans secrets ; pas d\'upload '
        'massif du corpus.\n'
        'Livrer une PR pour cette tranche seulement. COMPLETED != PRD termine. Pas de '
        'merge, pas de push main, pas de deploiement.\n'
        % (item['job_key'], item['path'], ', '.join(item['write_scope']),
           '\n'.join(dep_lines) or '- aucune')
    )
    return (header + '\n---\n# CONTRAT COMMUN\n\n' + contract +
            '\n---\n# PRD SOURCE : delegation-a-jules/' + item['path'] + '\n\n' + prd_text)


def build_continuation_message(cfg, base_dir, contract, item, receipt_ok):
    body = build_tranche_prompt(cfg, base_dir, contract, item, receipt_ok)
    return ('[REPRISE SESSION EXISTANTE] Nouvelle tranche %s pour %s. Aucun doublon : '
            'cette session existante est reprise, pas recreee.\n\n%s'
            % (item.get('tranche', 't1'), item['job_key'], body))


def refresh_prompt_library(ctx, reg):
    st = ctx.store
    cad = st.cadence('prompt_library')
    now = ctx.now
    if cad['last_run_at']:
        due_at = parse_iso(cad['last_run_at']) + datetime.timedelta(
            minutes=ctx.config['cadences']['prompt_library_refresh_minutes'])
        if now < due_at:
            return 'NOT_DUE'
    if reg.get('status') != 'OK' or not reg.get('items'):
        st.set_cadence('prompt_library', last_run_at=iso(now),
                       last_outcome='SKIPPED_NO_REGISTRY')
        return 'SKIPPED_NO_REGISTRY'
    contract = load_contract(ctx.base_dir)
    receipt_ok = receipt_ok_map(ctx)
    outdir = ctx.orch_dir / 'prompts'
    outdir.mkdir(exist_ok=True)
    count = 0
    for item in reg['items']:
        text = build_tranche_prompt(ctx.config, ctx.base_dir, contract, item, receipt_ok)
        (outdir / ('%s-%s.md' % (item['id'], item.get('tranche', 't1')))).write_text(
            text, encoding='utf-8')
        count += 1
    st.set_cadence('prompt_library', last_run_at=iso(now),
                   last_outcome='REFRESHED_%d' % count)
    return 'REFRESHED_%d' % count


# --- registre + recus ------------------------------------------------------------

def load_registry(ctx):
    st = ctx.store
    reg_file = ctx.orch_dir / ctx.config['registry_file']
    res = registry_mod.load(reg_file, ctx.base_dir)
    if res['items'] is None:
        absent = all(e.startswith('REGISTRY_FILE_ABSENT') for e in res['errors'])
        status = 'BLOCKED_REGISTRY' if absent else 'INVALID'
        st.meta_set('registry_status', status)
        st.meta_set('registry_errors', json.dumps(res['errors'], ensure_ascii=False))
        return {'status': status, 'items': None, 'errors': res['errors']}
    for it in res['items']:
        it['job_key'] = job_key_of(ctx.config['repo_slug'], it['id'],
                                   it.get('tranche', 't1'))
    st.meta_set('registry_status', 'OK')
    st.meta_set('registry_errors', '[]')
    return {'status': 'OK', 'items': res['items'], 'errors': []}


def load_receipts(ctx):
    """Recus importes d'un fichier fourni par l'humain ; jamais fabriques.

    Un recu sans approbation humaine explicite (approved_by: human:*) est ignore.
    """
    st = ctx.store
    p = ctx.orch_dir / ctx.config['integration_receipts_file']
    if not p.is_file():
        return []
    try:
        data = json.loads(p.read_text(encoding='utf-8'))
    except (ValueError, OSError) as e:
        st.signal('INCIDENT', 'error', 'receipts_file_unreadable',
                  jules_client.redact(str(e)))
        return []
    out = [r for r in data.get('receipts', [])
           if str(r.get('approved_by', '')).startswith('human:')]
    if out:
        st.import_receipts(out, source=p.name)
    return out


def receipt_ok_map(ctx):
    return {r['prd_id']: r['receipt_id'] for r in ctx.store.all_receipts()}


def recompute_statuses(ctx):
    st = ctx.store
    receipt_ok = receipt_ok_map(ctx)
    used = []
    for j in st.jobs():
        # Seuls les scopes des jobs ACTIFS reservent leur territoire.
        # Un job BLOCKED_* (dep manquante) ne reserve rien : sinon un seul
        # scope large bloque toute la chane pour rien (mesure 2026-09-16 :
        # PRD-007 'src/lib/' figeait 024/031/051/071/091 sans rien produire).
        if j['status'] in JOB_ACTIVE_LINKED and \
                j['status'] != 'SESSION_TERMINAL' and \
                j['prd_id'] not in receipt_ok:
            used.extend((j['job_key'], s) for s in json.loads(j['scope']))
    for j in st.jobs():
        deps = json.loads(j['depends_on'])
        missing = [d for d in deps if d not in receipt_ok]
        if missing:
            if j['status'] not in JOB_ACTIVE_LINKED:
                st.set_job(j['job_key'], status='BLOCKED_DEPENDENCY',
                           blocked_reason='preuve d\'integration absente pour '
                                          + ','.join(missing))
            continue
        scopes = json.loads(j['scope'])
        conflict = None
        for other_key, other_scopes in used:
            if other_key != j['job_key'] and \
                    registry_mod.scopes_overlap(scopes, other_scopes):
                conflict = other_key
                break
        if conflict:
            if j['status'] not in JOB_ACTIVE_LINKED:
                st.set_job(j['job_key'], status='BLOCKED_SCOPE',
                           blocked_reason='scopes en conflit avec ' + conflict)
            continue
        if j['status'] in JOB_ACTIVE_LINKED:
            continue
        st.set_job(j['job_key'], status='READY', blocked_reason=None)
        used.extend((j['job_key'], s) for s in scopes)


# --- reconciliation ---------------------------------------------------------------

def collect_pr_refs(ctx, session_name):
    rows, complete = ctx.jules.list_activities(session_name)
    if not complete:
        return []
    return extract_pr_refs(rows)


def prd_category_from_jobs(st, prd):
    """Categorie canonique d'un PRD depuis le registre charge (source de verite)."""
    for j in st.jobs():
        if j['prd_id'] == prd:
            return j['category']
    return None


def reconcile(ctx, report):
    st = ctx.store
    d = ctx.jules
    cfg = ctx.config
    sessions = d.list_sessions()
    report['sessions_history_complete'] = True
    report['active_sessions_all_sources'] = len(
        [s for s in sessions if s.get('state') not in TERMINAL_STATES])
    st.meta_set('active_sessions_all_sources', str(report['active_sessions_all_sources']))
    prog = [s for s in sessions if (s.get('sourceContext') or {}).get('source') == d.source]
    unclassified = []
    obs = []
    for s in prog:
        title = s.get('title', '')
        name = s.get('name', '')
        cat, prd = parse_session_title(title)
        if cat is None and prd is not None:
            # Sessions pre-2026-09-14 sans prefixe LifeOS:C : la categorie
            # vient du registre (55 PRD), pas d'une regle inventee.
            cat = prd_category_from_jobs(st, prd)
        if cat is None or prd is None:
            unclassified.append(name)
            continue
        state = s.get('state', 'UNKNOWN')
        branch = (((s.get('sourceContext') or {}).get('githubRepoContext') or {})
                  .get('startingBranch'))
        env_obs = (s.get('sourceContext') or {}).get('environmentVariablesEnabled', 'ABSENT')
        pr_refs = collect_pr_refs(ctx, name) if state == 'COMPLETED' else []
        st.observe_session(name, state, title, cat, prd, d.source, branch,
                           json.dumps(env_obs), 0, pr_refs)
        obs.append({'session': name, 'state': state, 'category': cat, 'prd': prd,
                    'pr_refs': pr_refs})
        job = None
        for j in st.jobs():
            if j['prd_id'] == prd and (not j.get('session_name')
                                       or j['session_name'] == name):
                job = j
                break
        if job is None:
            st.meta_set('unattached_session:%s' % name,
                        json.dumps({'title': title, 'state': state}))
        else:
            st.set_job(job['job_key'], session_name=name)
            new_status = ('PR_PUBLISHED' if (state == 'COMPLETED' and pr_refs)
                          else state_to_job_status(state))
            if job['status'] != new_status and \
                    job['status'] not in ('UNCERTAIN', 'SUBMITTING'):
                st.set_job(job['job_key'], status=new_status)
        assignee = assignee_for_category(cfg, cat)
        if job is not None:
            if state == 'COMPLETED':
                st.create_event(
                    'session_completed_outcome', subject=name,
                    payload={'prd': prd, 'category': cat, 'pr_refs': pr_refs,
                             'note': 'COMPLETED != PRD termine ; integration = recu requis'},
                    assignee=assignee)
                if pr_refs:
                    st.signal('DELIVERY_OBSERVED', 'info', name,
                              json.dumps({'pr_refs': pr_refs}))
            elif state in NO_RETRY_STATES:
                st.set_job(job['job_key'],
                           blocked_reason='pas de retry aveugle (%s)' % state)
                st.create_event('session_blocked_review', subject=name,
                                payload={'state': state, 'prd': prd},
                                assignee=assignee)
                st.signal('SESSION_BLOCKED', 'error', name, 'state=%s' % state)
            elif state == 'AWAITING_PLAN_APPROVAL':
                bounded = bool(json.loads(job['scope'])) if job else False
                st.create_event(
                    'awaiting_plan_approval', subject=name,
                    payload={'state': state, 'gate': 'bounded' if bounded else 'unbounded',
                             'note': 'approbation plan = action humaine ; aucune route API '
                                     'autorisee ici'},
                    assignee=assignee)
            elif state == 'AWAITING_USER_FEEDBACK':
                st.create_event('awaiting_user_feedback', subject=name,
                                payload={'state': state, 'prd': prd},
                                assignee=assignee)
    if unclassified:
        report['inertia_stop'] = True
        st.signal('INCIDENT', 'error', 'unclassified_session',
                  json.dumps({'sessions': unclassified}), dedupe_hours=24)
    by_name = {s.get('name'): s for s in prog}
    known = []
    for k in cfg.get('known_sessions', []):
        entry = {'session': k['session'], 'prd_id': k['prd_id'],
                 'source_ref': k.get('source_ref')}
        s = by_name.get(k['session'])
        entry['observed'] = s.get('state', 'UNKNOWN') if s else 'NOT_FOUND_IN_LISTING'
        known.append(entry)
    report['known_sessions'] = known
    report['program_sessions_observed'] = obs
    # reconciliation des soumissions UNCERTAIN : par titre exact / marker, sans recreation
    reconciled = []
    for sub in st.submissions(status='UNCERTAIN'):
        job = st.job(sub['job_key'])
        if sub['kind'] == 'create' and sub.get('title'):
            match = next((s for s in sessions if s.get('title') == sub['title']), None)
            if match is not None:
                exact = d.get_session(match['name'])
                if exact.get('title') == sub['title'] and \
                        (exact.get('sourceContext') or {}).get('source') == d.source:
                    st.record_submission(sub['job_key'], 'create', sub['attempt'],
                                         'SUBMITTED', title=sub['title'],
                                         session_name=match['name'])
                    if job is not None:
                        st.set_job(sub['job_key'], status='SUBMITTED',
                                   session_name=match['name'])
                    reconciled.append({'job_key': sub['job_key'],
                                       'session': match['name']})
        elif sub['kind'] == 'message' and sub.get('marker'):
            target = (job or {}).get('session_name')
            if target:
                rows, _complete = d.list_activities(target)
                if any(sub['marker'] in ((a.get('userMessaged') or {}).get('userMessage') or '')
                       for a in rows):
                    st.record_submission(sub['job_key'], 'message', sub['attempt'],
                                         'PROCESSED', marker=sub['marker'],
                                         session_name=target)
                    reconciled.append({'job_key': sub['job_key'],
                                       'message': 'marker_found'})
    report['uncertain_reconciled'] = reconciled
    return report


# --- planification + execution ------------------------------------------------------

def registry_item_from_job(job):
    return {'id': job['prd_id'], 'category': job['category'], 'path': job['path'],
            'depends_on': json.loads(job['depends_on']),
            'write_scope': json.loads(job['scope']), 'manager': job['manager'],
            'tranche': job.get('tranche', 't1'), 'job_key': job['job_key']}


def plan_actions(ctx, reg, report):
    st = ctx.store
    cfg = ctx.config
    plans = []
    if reg.get('status') != 'OK':
        report['plan_skipped'] = reg['status']
        return plans
    history_ready = bool(report.get('sessions_history_complete'))
    active_all = report.get('active_sessions_all_sources')
    if not history_ready:
        report['plan_note'] = ('aucun historique complet de sessions : aucune creation '
                               'planifiee ; quota UNKNOWN')
    lim = cfg['limits']
    prog_sessions = st.sessions_observed(source=cfg['source'])
    active_by_cat = {}
    for s in prog_sessions:
        if s['state'] not in TERMINAL_STATES and s['category'] is not None:
            active_by_cat.setdefault(s['category'], s)
    # categories avec soumission en vol (soumise sans session confirmee) comptent actives
    in_flight = {j['category'] for j in st.jobs()
                 if j['status'] in ('SUBMITTING', 'UNCERTAIN', 'PLANNED_CREATE')
                 and j['session_name'] is None}
    active_cats = set(active_by_cat) | in_flight
    creations = messages = 0
    contract = load_contract(ctx.base_dir)
    receipt_ok = receipt_ok_map(ctx)
    for job in st.jobs():
        if job['status'] not in PLANNABLE:
            continue
        cat = job['category']
        cat_session = active_by_cat.get(cat)
        if cat in in_flight and cat_session is None:
            # Un job deja PLANNED_CREATE/PLANNED_MESSAGE avec decision en attente
            # doit rester planifiable : sinon son POST n'arrive jamais et il
            # s'auto-bloque (mesure 2026-09-16, PRD-024 fige 2 cycles).
            if job['status'] == 'READY':
                continue
        if cat_session is not None:
            if not history_ready:
                continue
            if cat_session['state'] == 'AWAITING_USER_FEEDBACK':
                last_msg = st.open_submission(job['job_key'], 'message')
                last_cursor = None
                if last_msg:
                    try:
                        last_cursor = int(last_msg[0].get('detail') or 0)
                    except (TypeError, ValueError):
                        last_cursor = None
                if last_cursor is not None and \
                        cat_session['activity_cursor'] <= last_cursor:
                    continue
            if messages >= lim['max_messages_per_tick']:
                report.setdefault('plan_limits', []).append(
                    'MAX_MESSAGES_PER_TICK atteint ; job %s reporte' % job['job_key'])
                continue
            item = registry_item_from_job(job)
            text = build_continuation_message(cfg, ctx.base_dir, contract, item, receipt_ok)
            plans.append({'kind': 'message', 'job_key': job['job_key'],
                          'session': cat_session['session_name'], 'text': text,
                          'sha': sha(text)})
            messages += 1
            st.set_job(job['job_key'], status='PLANNED_MESSAGE')
            continue
        completed_same_cat = [s for s in prog_sessions
                              if s['state'] == 'COMPLETED' and s['category'] == cat
                              and s['branch'] == cfg['starting_branch']]
        if completed_same_cat:
            if not history_ready:
                continue
            if messages >= lim['max_messages_per_tick']:
                continue
            item = registry_item_from_job(job)
            text = build_continuation_message(cfg, ctx.base_dir, contract, item, receipt_ok)
            text = ('[HYPOTHESE NON GARANTIE] Reutilisation d\'une session COMPLETED : '
                    'son comptage de quota reste suppose inchange ; a verifier.\n\n' + text)
            plans.append({'kind': 'message', 'job_key': job['job_key'],
                          'session': completed_same_cat[0]['session_name'],
                          'text': text, 'sha': sha(text), 'reuse_completed': True})
            messages += 1
            st.set_job(job['job_key'], status='PLANNED_MESSAGE')
            continue
        if not history_ready or active_all_none(report):
            continue
        if creations >= lim['max_creations_per_tick']:
            report.setdefault('plan_limits', []).append(
                'MAX_CREATIONS_PER_TICK atteint ; job %s reporte' % job['job_key'])
            continue
        if active_all_value(report) + creations >= lim['max_active_sessions_account']:
            report.setdefault('plan_limits', []).append(
                'CAP_15 : %d sessions actives toutes sources ; creation refusee pour %s'
                % (active_all_value(report), job['job_key']))
            continue
        if len(active_cats | {cat}) > lim['max_active_categories_program']:
            report.setdefault('plan_limits', []).append(
                'CAP_3_CATEGORIES : categories actives %s ; creation refusee pour %s'
                % (sorted(active_cats), job['job_key']))
            continue
        item = registry_item_from_job(job)
        text = build_tranche_prompt(cfg, ctx.base_dir, contract, item, receipt_ok)
        plans.append({'kind': 'create', 'job_key': job['job_key'], 'text': text,
                      'sha': sha(text), 'title': session_title_for(job)})
        creations += 1
        active_cats.add(cat)
        in_flight.add(cat)
        st.set_job(job['job_key'], status='PLANNED_CREATE')
    report['plans'] = [{'kind': p['kind'], 'job_key': p['job_key'],
                        'session': p.get('session'), 'sha': p['sha']} for p in plans]
    report['planned_creations'] = creations
    report['planned_messages'] = messages
    return plans


def active_all_none(report):
    return report.get('active_sessions_all_sources') is None


def active_all_value(report):
    return report.get('active_sessions_all_sources') or 0


def ensure_authorization_events(ctx, plans):
    st = ctx.store
    created = 0
    for p in plans:
        job = st.job(p['job_key'])
        assignee = assignee_for_category(ctx.config, job['category'])
        # Le manager GLM decide sur PIECE : but, scope, tests et sha proposes.
        # Sans cela il repond request_review pour demander l'info (mesure
        # 2026-09-16 : event 7 note 'non fourni dans la demande d'admission').
        eid = st.create_event(
            'admission_request', p['job_key'],
            {'action': 'authorize_prompt' if p['kind'] == 'create' else 'authorize_message',
             'job_key': p['job_key'],
             'sha': p['sha'], 'session': p.get('session'),
             'goal': (job.get('title') or p['job_key']),
             'scope': json.loads(job['scope']),
             'depends_on': json.loads(job['depends_on']),
             'manager': job['manager'],
             'note': 'decision necessaire avant execution au prochain tick'},
            assignee)
        if eid:
            created += 1
    return created


def readback_marker(ctx, session, marker):
    rows, complete = ctx.jules.list_activities(session)
    return (any(marker in ((a.get('userMessaged') or {}).get('userMessage') or '')
                for a in rows), complete)


def execute_plans(ctx, plans, report):
    st = ctx.store
    cfg = ctx.config
    if not ctx.live:
        report['execution'] = 'DRY_RUN (aucune mutation reseau)'
        return
    d = ctx.jules
    if d is None:
        report['execution'] = 'BLOCKED_CREDENTIAL (client indisponible)'
        st.signal('CREDENTIAL_MISSING', 'error', 'jules_client',
                  'credential Jules absent ; aucune mutation', dedupe_hours=24)
        return
    done = []
    for p in plans:
        job = st.job(p['job_key'])
        if st.open_submission(p['job_key'], p['kind']):
            done.append({'job_key': p['job_key'], 'result': 'SKIPPED_OPEN_SUBMISSION'})
            continue
        action = 'authorize_prompt' if p['kind'] == 'create' else 'authorize_message'
        auth = st.take_authorization(p['job_key'], action, p['sha'])
        if auth is None:
            done.append({'job_key': p['job_key'], 'result': 'WAITING_AUTHORIZATION'})
            continue
        if not st.acquire_claim('submit:' + p['job_key'], owner='tick:%s' % p['kind'],
                                ttl_seconds=cfg['limits']['claim_ttl_seconds']):
            done.append({'job_key': p['job_key'], 'result': 'CLAIM_BUSY'})
            continue
        attempt = st.next_attempt(p['job_key'], p['kind'])
        try:
            if p['kind'] == 'create':
                title = p['title']
                marker = marker_for(p['job_key'], p['sha'])
                text = p['text'] + '\n\n' + marker
                st.record_submission(p['job_key'], 'create', attempt, 'SUBMITTING',
                                     title=title, marker=marker)
                st.set_job(p['job_key'], status='SUBMITTING')
                payload = {
                    'title': title, 'prompt': text,
                    'sourceContext': {
                        'source': d.source,
                        'githubRepoContext': {'startingBranch': cfg['starting_branch']},
                        'environmentVariablesEnabled': False,
                    },
                    'automationMode': cfg['api']['automation_mode'],
                    'requirePlanApproval': cfg['api']['require_plan_approval'],
                }
                created = d.create_session(payload)
                name = created.get('name', '')
                if not jules_client.SESSION_NAME_RE.match(name):
                    raise ValueError('nom de session malforme retourne')
                exact = d.get_session(name)
                if exact.get('title') != title:
                    raise ValueError('readback : titre divergent')
                if (exact.get('sourceContext') or {}).get('source') != d.source:
                    raise ValueError('readback : source divergente')
                env_obs = (exact.get('sourceContext') or {}).get(
                    'environmentVariablesEnabled', 'ABSENT')
                rb = {
                    'status': 'SUBMITTED_VERIFIED',
                    'provider_state': exact.get('state'),
                    'environment_variables_enabled_observed': env_obs,
                    'environment_guarantee': 'NOT_GUARANTEED_NO_SECRET_ISOLATION_CLAIM',
                    'automation_readback': 'INPUT_ONLY_NOT_VERIFIABLE',
                }
                st.record_submission(p['job_key'], 'create', attempt, 'SUBMITTED',
                                     title=title, marker=marker, session_name=name,
                                     detail=json.dumps(rb))
                st.set_job(p['job_key'], status='SUBMITTED', session_name=name)
                st.observe_session(name, exact.get('state', 'UNKNOWN'), title,
                                   job['category'], job['prd_id'], d.source,
                                   cfg['starting_branch'], json.dumps(env_obs), 0, [])
                done.append({'job_key': p['job_key'], 'result': 'SUBMITTED',
                             'session': name})
            else:
                marker = marker_for(p['job_key'], p['sha'])
                text = p['text'] + '\n\n' + marker
                session = p['session']
                st.record_submission(p['job_key'], 'message', attempt, 'SUBMITTING',
                                     marker=marker, session_name=session)
                st.set_job(p['job_key'], status='SUBMITTING')
                d.send_message(session, text)
                rows, complete = d.list_activities(session)
                cursor = len(rows)
                found = any(marker in ((a.get('userMessaged') or {}).get('userMessage') or '')
                            for a in rows)
                if found and complete:
                    st.record_submission(p['job_key'], 'message', attempt, 'PROCESSED',
                                         marker=marker, session_name=session,
                                         detail=str(cursor))
                    st.set_job(p['job_key'], status='SUBMITTED')
                    done.append({'job_key': p['job_key'], 'result': 'MESSAGE_PROCESSED'})
                else:
                    reason = 'activities_incomplete' if not complete \
                        else 'marker_not_visible'
                    st.record_submission(p['job_key'], 'message', attempt, 'UNCERTAIN',
                                         marker=marker, session_name=session,
                                         detail=reason)
                    st.set_job(p['job_key'], status='UNCERTAIN',
                               blocked_reason='readback message : ' + reason)
                    st.signal('UNCERTAIN_MESSAGE', 'error', p['job_key'],
                              'readback %s : UNCERTAIN, sans retry' % reason)
                    done.append({'job_key': p['job_key'],
                                 'result': 'UNCERTAIN_' + reason})
        except Exception as e:
            detail = jules_client.redact(str(e))
            st.record_submission(p['job_key'], p['kind'], attempt, 'UNCERTAIN',
                                 session_name=None, detail=detail)
            st.set_job(p['job_key'], status='UNCERTAIN', blocked_reason=detail)
            st.signal('UNCERTAIN_SUBMISSION', 'error', p['job_key'],
                      'POST ambigu : UNCERTAIN, bloque ce job et ses scopes uniquement ; '
                      'reconciliation par titre/marker au prochain tick. ' + detail)
            done.append({'job_key': p['job_key'], 'result': 'UNCERTAIN'})
        finally:
            st.release_claim('submit:' + p['job_key'])
    report['execution_results'] = done


def expire_stale_submissions(ctx, report):
    st = ctx.store
    horizon = ctx.config['limits']['submission_expiry_horizon_hours']
    for sub in st.stale_submitting(horizon):
        st.record_submission(sub['job_key'], sub['kind'], sub['attempt'], 'UNCERTAIN',
                             title=sub.get('title'), marker=sub.get('marker'),
                             session_name=sub.get('session_name'),
                             detail='horizon %dh depasse' % horizon)
        st.set_job(sub['job_key'], status='UNCERTAIN',
                   blocked_reason='soumission %dh sans reconciliation' % horizon)
        job = st.job(sub['job_key'])
        assignee = assignee_for_category(ctx.config, job['category']) if job else \
            ctx.config['managers'][0]
        st.create_event('uncertain_reconcile', sub['job_key'],
                        {'job_key': sub['job_key'], 'reason': 'expired_horizon'},
                        assignee)
        st.signal('UNCERTAIN_EXPIRED', 'error', sub['job_key'],
                  'soumission plus vieille que l\'horizon de %dh' % horizon)
        report.setdefault('expired', []).append(sub['job_key'])


# --- gatekeeper -----------------------------------------------------------------------

def run_gatekeeper_control(ctx, live, report=None):
    st = ctx.store
    useful = ok = False
    progress = 0
    note = ''
    try:
        if not live or ctx.jules is None:
            note = 'DRY_RUN_NO_OBSERVATION'
            ok = True
        else:
            for s in st.sessions_observed(source=ctx.jules.source, active_only=True):
                rows, complete = ctx.jules.list_activities(s['session_name'])
                if not complete:
                    continue
                if len(rows) > s['activity_cursor']:
                    progress += len(rows) - s['activity_cursor']
                    st.observe_session(s['session_name'], s['state'], s['title'],
                                       s['category'], s['prd_hint'], s['source'],
                                       s['branch'], s['env_observed'], len(rows),
                                       json.loads(s['pr_refs'] or '[]'))
            events_created = int((report or {}).get('events_created', 0))
            useful = progress > 0 or events_created > 0
            ok = True
            note = 'progress=%d events=%d' % (progress, events_created)
    except Exception as e:
        ok = False
        note = jules_client.redact(str(e))
    cfg = ctx.config
    cons = (st.cadence('gatekeeper')['consecutive_useful'] or 0)
    if not ok:
        new_cons, outcome = 0, 'error'
    elif useful:
        new_cons, outcome = cons + 1, 'useful'
    else:
        new_cons, outcome = 0, 'ok_empty'
    st.set_cadence('gatekeeper', consecutive_useful=new_cons, last_run_at=iso(ctx.now),
                   last_outcome=outcome, note=note)
    needed = cfg['cadences']['gatekeeper_useful_required']
    mgr_i = cfg['cadences']['manager_intervals_minutes']
    sup_i = cfg['cadences']['supervisor_intervals_minutes']
    st.set_cadence('manager',
                   interval_minutes=mgr_i[min(len(mgr_i) - 1, new_cons // needed)])
    if not ok:
        st.set_cadence('supervisor', interval_minutes=sup_i[0], consecutive_useful=0,
                       note='reset sur erreur gatekeeper')
    else:
        st.set_cadence('supervisor',
                       interval_minutes=sup_i[min(len(sup_i) - 1, new_cons // needed)])
    return {'ok': ok, 'useful': useful, 'consecutive_useful': new_cons, 'note': note}


# --- manager -------------------------------------------------------------------------

def manager_system_prompt():
    return (
        "Tu es le manager E-Myth du runtime d'orchestration Jules. Tu reponds UNIQUEMENT "
        'avec un objet JSON valide, sans texte hors JSON, avec les champs : '
        '{"action": "authorize_prompt"|"authorize_message"|"request_review"|"annotate", '
        '"job_key": "...", "prompt": {"goal": "...", "scope": ["..."], "tests": "..."}, '
        '"contract_included": true, "prompt_sha256": "<sha propose>", "notes": "..."}. '
        "Tu n'executes aucune commande et n'inclus jamais de secret. Un authorize engage "
        'le prompt determine par le runtime (sha fourni) ; un sha different sera refuse.')


def cmd_manager(ctx, role=None):
    st = ctx.store
    cfg = ctx.config
    out = {'command': 'manager'}
    gk = st.cadence('gatekeeper')
    mg = st.cadence('manager')
    cons = gk['consecutive_useful'] or 0
    needed = cfg['cadences']['gatekeeper_useful_required']
    intervals = cfg['cadences']['manager_intervals_minutes']
    interval = intervals[min(len(intervals) - 1, cons // needed)]
    if mg['interval_minutes'] != interval:
        st.set_cadence('manager', interval_minutes=interval)
    if mg['last_run_at']:
        due_at = parse_iso(mg['last_run_at']) + datetime.timedelta(minutes=interval)
        if ctx.now < due_at:
            out.update({'result': 'NOT_DUE', 'due_at': iso(due_at)})
            return out
    roles = [role] if role else list(cfg['managers'])
    events = st.pending_events(roles, limit=cfg['llm']['max_events_per_run'])
    if not events:
        st.set_cadence('manager', last_run_at=iso(ctx.now), last_outcome='NO_PENDING_EVENT')
        out.update({'result': 'NO_PENDING_EVENT', 'llm_calls': 0})
        return out
    day = ctx.now.strftime('%Y-%m-%d')
    calls = st.llm_calls_today(day)
    budget = cfg['llm']['daily_budget_calls']
    budget_disabled = budget is None
    if budget_disabled:
        budget = float('inf')
    key, _origin = find_credential(cfg['llm'])
    processed = rejected = 0
    contract = load_contract(ctx.base_dir)
    for ev in events:
        if not budget_disabled and calls >= budget:
            st.signal('BUDGET_EXHAUSTED', 'warning', 'llm_budget:' + day,
                      'budget local journalier atteint (%d)' % budget, dedupe_hours=20)
            break
        if key is None:
            st.set_event(ev['id'], 'pending',
                         note='BLOCKED_CREDENTIAL : aucun fallback Astra')
            st.signal('CREDENTIAL_MISSING', 'error', 'openrouter_key',
                      'cle %s absente (env ou hermes_env_file) ; BLOCKED_CREDENTIAL, '
                      'zero fallback' % cfg['llm']['env_key'], dedupe_hours=24)
            break
        payload = json.loads(ev['payload'] or '{}')
        job = st.job(payload.get('job_key') or '')
        expected_sha = payload.get('sha')
        action_hint = payload.get('action')
        if job:
            item_summary = {
                'job_key': job['job_key'], 'prd': job['prd_id'],
                'category': job['category'], 'scope': json.loads(job['scope']),
                'depends_on': json.loads(job['depends_on']), 'manager': job['manager'],
                'prompt_sha_expected': expected_sha, 'contract_chars': len(contract),
            }
        else:
            item_summary = {'subject': ev['subject'], 'note': 'job non resolve'}
        user = json.dumps({'event': {'kind': ev['kind'], 'subject': ev['subject'],
                                     'payload': payload},
                           'job': item_summary}, ensure_ascii=False)
        try:
            data = call_llm(cfg['llm'], key, manager_system_prompt(), user,
                            transport=ctx.llm_transport)
            st.llm_register_call(day)
            calls += 1
            content = data
        except InvalidDecision as e:
            st.add_decision(ev['id'], role or 'manager', cfg['llm']['model'], False,
                            None, payload.get('job_key'), None, None, e.reason)
            attempts = _bump_attempts(st, ev)
            if attempts >= cfg['llm']['max_invalid_attempts_per_event']:
                st.set_event(ev['id'], 'rejected', note='invalid_attempts:%d' % attempts)
                rejected += 1
            else:
                st.set_event(ev['id'], 'pending', note='invalid_attempts:%d' % attempts)
            continue
        except Exception as e:
            if isinstance(e, manager_llm.ProviderBillingStop):
                st.signal('PROVIDER_STOP', 'error', 'openrouter_billing',
                          'HTTP %s : arret explicite, aucune boucle ni contournement ; '
                          'action humaine requise' % e.code)
                out.update({'result': 'PROVIDER_STOP_HTTP_%s' % e.code,
                            'llm_calls_used_today': calls})
                st.set_cadence('manager', last_run_at=iso(ctx.now),
                               last_outcome='PROVIDER_STOP')
                return out
            st.set_event(ev['id'], 'pending',
                         note='LLM_ERROR: ' + manager_llm.redact_text(str(e), key))
            continue
        try:
            dec = manager_llm.parse_decision(content)
        except InvalidDecision as e:
            st.add_decision(ev['id'], role or 'manager', cfg['llm']['model'], False,
                            None, payload.get('job_key'), None, None, e.reason)
            attempts = _bump_attempts(st, ev)
            if attempts >= cfg['llm']['max_invalid_attempts_per_event']:
                st.set_event(ev['id'], 'rejected', note='invalid_attempts:%d' % attempts)
                rejected += 1
            else:
                st.set_event(ev['id'], 'pending', note='invalid_attempts:%d' % attempts)
            continue
        if dec.get('prompt_sha256') not in (None, expected_sha):
            ok_v, rej = False, 'sha de prompt propose different du sha du runtime : refuse'
        else:
            ok_v, rej = manager_llm.validate_decision(dec, job, action_hint)
        st.add_decision(ev['id'], role or 'manager', cfg['llm']['model'], ok_v,
                        dec.get('action'), payload.get('job_key'),
                        dec.get('prompt_sha256'), dec if ok_v else None,
                        None if ok_v else rej)
        if ok_v:
            st.set_event(ev['id'], 'processed', note='decision: %s' % dec.get('action'))
            processed += 1
        else:
            attempts = _bump_attempts(st, ev)
            if attempts >= cfg['llm']['max_invalid_attempts_per_event']:
                st.set_event(ev['id'], 'rejected', note='rejet: %s' % rej)
                rejected += 1
            else:
                st.set_event(ev['id'], 'pending',
                             note='rejet: %s (invalid_attempts:%d)' % (rej, attempts))
    st.set_cadence('manager', last_run_at=iso(ctx.now),
                   last_outcome='PROCESSED_%d_REJECTED_%d' % (processed, rejected))
    out.update({'result': 'RUN', 'processed': processed, 'rejected': rejected,
                'llm_calls_used_today': calls,
                'llm_budget': None if budget_disabled else cfg['llm']['daily_budget_calls'],
                'interval_minutes': interval})
    return out


def _bump_attempts(st, ev):
    note = ev.get('note') or ''
    m = None
    for part in note.split():
        if part.startswith('invalid_attempts:'):
            try:
                m = int(part.split(':')[1])
            except ValueError:
                m = None
    attempts = (m or 0) + 1
    return attempts


# --- supervisor ---------------------------------------------------------------------

def build_monitor(ctx):
    st = ctx.store
    return {
        'registry_status': st.meta_get('registry_status'),
        'jobs_by_status': st.jobs_by_status(),
        'active_sessions_all_sources': st.meta_get('active_sessions_all_sources'),
        'program_categories_active': sorted({
            s['category'] for s in st.sessions_observed(active_only=True)
            if s['category'] is not None}),
        'uncertain_jobs': sorted({j['job_key'] for j in st.jobs()
                                  if j['status'] == 'UNCERTAIN'}),
        'open_incidents': len(st.events(status='pending')),
        'quota_display': 'UNKNOWN',
    }


def cmd_supervisor(ctx):
    st = ctx.store
    cfg = ctx.config
    out = {'command': 'supervisor'}
    gk = st.cadence('gatekeeper')
    sup = st.cadence('supervisor')
    if gk['last_outcome'] == 'error':
        st.set_cadence('supervisor',
                       interval_minutes=cfg['cadences']['supervisor_intervals_minutes'][0],
                       consecutive_useful=0, note='reset sur erreur gatekeeper')
        sup = st.cadence('supervisor')
        out['reset'] = 'erreur gatekeeper'
    cons = gk['consecutive_useful'] or 0
    needed = cfg['cadences']['gatekeeper_useful_required']
    intervals = cfg['cadences']['supervisor_intervals_minutes']
    level = min(len(intervals) - 1, cons // needed)
    if sup['interval_minutes'] != intervals[level]:
        st.set_cadence('supervisor', interval_minutes=intervals[level])
    if sup['last_run_at']:
        due_at = parse_iso(sup['last_run_at']) + datetime.timedelta(
            minutes=sup['interval_minutes'])
        if ctx.now < due_at:
            out.update({'result': 'NOT_DUE'})
            return out
    monitor = build_monitor(ctx)
    monitor_hash = sha(json.dumps(monitor, sort_keys=True, ensure_ascii=False))
    prev = st.meta_get('supervisor_monitor_hash')
    gated = cons < needed
    out.update({'monitor_hash': monitor_hash, 'gated': gated,
                'consecutive_useful': cons, 'interval_minutes': sup['interval_minutes']})
    if monitor_hash != prev and not gated:
        st.meta_set('supervisor_monitor_hash', monitor_hash)
        st.signal('SUPERVISION_CHANGE', 'info', 'monitor:' + monitor_hash[:12],
                  json.dumps(monitor, sort_keys=True, ensure_ascii=False))
        out['result'] = 'CHANGE_SIGNALLED'
    elif monitor['open_incidents'] > 0 and monitor['open_incidents'] != \
            int(st.meta_get('supervisor_last_incidents') or 0):
        st.signal('SUPERVISION_INCIDENT', 'error', 'open_incidents',
                  json.dumps(monitor, sort_keys=True, ensure_ascii=False))
        out['result'] = 'INCIDENT_SIGNALLED'
    else:
        out['result'] = 'STABLE_NO_OUTPUT'
    st.meta_set('supervisor_last_incidents', str(monitor['open_incidents']))
    st.set_cadence('supervisor', last_run_at=iso(ctx.now), last_outcome=out['result'])
    (ctx.orch_dir / 'supervision.json').write_text(
        json.dumps({'monitor': monitor, 'monitor_hash': monitor_hash,
                    'generated_at': iso(ctx.now)}, ensure_ascii=False, indent=2),
        encoding='utf-8')
    return out


# --- status ------------------------------------------------------------------------

def build_status(ctx, report=None):
    st = ctx.store
    cfg = ctx.config
    day = ctx.now.strftime('%Y-%m-%d')
    jobs = st.jobs()
    return {
        'generated_at': iso(ctx.now),
        'command': ctx.command,
        'mode': 'LIVE' if ctx.live else 'DRY_RUN',
        'registry': {
            'status': st.meta_get('registry_status'),
            'file': str(ctx.orch_dir / cfg['registry_file']),
            'inventory_measured': len(registry_mod.inventory(ctx.base_dir)),
            'inventory_expected': 55,
        },
        'jobs': {
            'count': len(jobs),
            'by_status': st.jobs_by_status(),
            'blocked': [{'job_key': j['job_key'], 'status': j['status'],
                         'reason': j['blocked_reason']} for j in jobs
                        if j['blocked_reason'] or j['status'].startswith('BLOCKED')],
        },
        'sessions': {
            'observed': st.sessions_observed(),
            'active_all_sources': st.meta_get('active_sessions_all_sources'),
            'program_categories_active': sorted({
                s['category'] for s in st.sessions_observed(active_only=True)
                if s['category'] is not None}),
            'quota_display': 'UNKNOWN',
            'quota_note': 'aucun compteur fictif ; quota API inconnu',
        },
        'caps': cfg['limits'],
        'receipts': st.all_receipts(),
        'events': {s: len(st.events(status=s))
                   for s in ('pending', 'processed', 'rejected')},
        'decisions': {'total': len(st.decisions()),
                      'authorized': len([x for x in st.decisions() if x['ok']])},
        'llm': {
            'model': cfg['llm']['model'],
            'budget_day': day,
            'calls_used': st.llm_calls_today(day),
            'daily_limit': cfg['llm']['daily_budget_calls'],
            'note': cfg['llm']['budget_note'],
        },
        'cadences': {n: st.cadence(n) for n in
                     ('manager', 'gatekeeper', 'supervisor', 'prompt_library')},
        'outbox_recent': st.outbox_recent(10),
        'known_sessions': cfg.get('known_sessions', []),
        'pole1': 'WAITING_USER_INPUT — resumes Gemini manquants ; aucune categorie '
                 'fictive produite par ce runtime',
        'assumptions': [
            'Session COMPLETED reutilisee via sendMessage : son comptage de quota reste '
            'suppose inchange — hypothese NON garantie.',
            'environmentVariablesEnabled : observation consignee ; aucune isolation de '
            "secrets n'est pretendue.",
            'automationMode/requirePlanApproval : champs input-only envoyes explicitement, '
            'jamais verifies par comparaison de champs absents dans GET.',
        ],
        'limits_honnetes': [
            "Ce runtime ne prouve ni quota fournisseur, ni integration : un recu "
            "d'integration fourni par l'humain est requis pour lever BLOCKED_DEPENDENCY.",
            "Aucun cron Hermes n'est modifie : les cadences vivent dans state.sqlite3.",
            'DRY_RUN par defaut : aucune mutation reseau sans --live explicite.',
        ],
        'report': report or {},
    }


def write_status(ctx, status):
    p = ctx.orch_dir / 'status.json'
    p.write_text(json.dumps(status, ensure_ascii=False, indent=2), encoding='utf-8')
    return p


# --- tick -----------------------------------------------------------------------------

def cmd_tick(ctx):
    st = ctx.store
    report = {'command': 'tick', 'mode': 'LIVE' if ctx.live else 'DRY_RUN'}
    reg = load_registry(ctx)
    report['registry_status'] = reg['status']
    if reg['status'] == 'OK':
        for it in reg['items']:
            st.upsert_job(it, ctx.config['repo_slug'])
        load_receipts(ctx)
        recompute_statuses(ctx)
        report['prompt_library'] = refresh_prompt_library(ctx, reg)
    elif reg['status'] == 'BLOCKED_REGISTRY':
        st.signal('REGISTRY_BLOCKED', 'warning', 'registry:absent',
                  'registre governance/work-items.json absent ; aucun job invente',
                  dedupe_hours=24)
    else:
        st.signal('REGISTRY_INVALID', 'error', 'registry:invalid',
                  json.dumps(reg['errors'], ensure_ascii=False))
        report['registry_errors'] = reg['errors']
    if ctx.live and ctx.jules is not None:
        last_event = st.events(status=None)
        last_id = last_event[-1]['id'] if last_event else 0
        try:
            reconcile(ctx, report)
        except Exception as e:
            report['inertia_stop'] = True
            report['reconcile_error'] = jules_client.redact(str(e))
            st.signal('INCIDENT', 'error', 'reconcile', report['reconcile_error'])
        report['events_created'] = len(st.events_since(last_id))
    plans = plan_actions(ctx, reg, report)
    report['events_admission_created'] = ensure_authorization_events(ctx, plans) \
        if reg['status'] == 'OK' else 0
    report['events_created'] = report.get('events_created', 0) + \
        report['events_admission_created']
    if not report.get('inertia_stop'):
        execute_plans(ctx, plans, report)
    else:
        report['execution'] = 'STOP_INERTIE (incoherence detectee ; aucune creation)'
        for p in plans:
            if st.job(p['job_key'])['status'] in ('PLANNED_CREATE', 'PLANNED_MESSAGE'):
                st.set_job(p['job_key'], status='READY', blocked_reason=None)
    expire_stale_submissions(ctx, report)
    report['gatekeeper'] = run_gatekeeper_control(ctx, ctx.live, report)
    st.meta_set('last_tick', iso(ctx.now))
    status = build_status(ctx, report)
    write_status(ctx, status)
    return status


# --- worker Hermes natif ----------------------------------------------------------------

def cmd_worker(ctx, action='start', task_file=None, job_key=None):
    """Demarre/reconcilie UN processus worker durable et revient vite."""
    if action == 'reconcile':
        changed = worker_mod.reconcile(ctx.orch_dir)
        return {'command': 'worker', 'action': 'reconcile',
                'changed': [{'pid': e['pid'], 'state': e['state'],
                             'stop_reason': e.get('stop_reason')} for e in changed]}
    if task_file is None:
        task_file = ctx.orch_dir / 'worker_task.json'
    entry, result = worker_mod.start(ctx.orch_dir, ctx.config, task_file, job_key)
    st = ctx.store
    if result == 'STARTED':
        st.signal('WORKER_STARTED', 'info', entry['command'] and 'worker',
                  json.dumps({'pid': entry['pid'], 'job_key': job_key}))
    elif result == 'ALREADY_RUNNING':
        st.signal('WORKER_ALREADY_RUNNING', 'info', 'worker',
                  json.dumps({'pid': entry['pid']}), dedupe_hours=1)
    return {'command': 'worker', 'action': 'start', 'result': result,
            'pid': entry['pid'], 'job_key': entry.get('job_key')}


# --- CLI --------------------------------------------------------------------------------

def main(argv=None):
    ap = argparse.ArgumentParser(
        description="Runtime d'orchestration Jules (DRY_RUN par defaut ; --live explicite)")
    sub = ap.add_subparsers(dest='command', required=True)
    for name in ('tick', 'manager', 'gatekeeper', 'supervisor', 'worker', 'status'):
        sub.add_parser(name)

    ap.add_argument('--live', action='store_true',
                    help='mutations reseau explicites ; sans ce drapeau : DRY_RUN')
    ap.add_argument('--role', choices=('manager-a', 'manager-b', 'manager-c'))
    ap.add_argument('--config')
    ap.add_argument('--orch-dir')
    ap.add_argument('--worker-action', choices=('start', 'reconcile'),
                    default='start', help='sous-commande worker')
    ap.add_argument('--worker-task', help='fichier de tache JSON pour le worker')
    ap.add_argument('--worker-job-key')
    args = ap.parse_args(argv)
    try:
        ctx = build_ctx(orch_dir=args.orch_dir, config_path=args.config,
                        live=args.live, command=args.command)
    except (AdapterError, ValueError) as e:
        print(json.dumps({'error': 'BLOCKED_CREDENTIAL',
                          'detail': manager_llm.redact_text(str(e))},
                         ensure_ascii=False))
        sys.exit(2)
    try:
        if args.command == 'tick':
            out = cmd_tick(ctx)
        elif args.command == 'manager':
            out = cmd_manager(ctx, args.role)
        elif args.command == 'gatekeeper':
            out = run_gatekeeper_control(ctx, ctx.live)
        elif args.command == 'supervisor':
            out = cmd_supervisor(ctx)
        elif args.command == 'worker':
            out = cmd_worker(ctx, args.worker_action, args.worker_task,
                             args.worker_job_key)
        else:
            out = build_status(ctx)
            write_status(ctx, out)
        print(json.dumps(out, ensure_ascii=False, indent=2))
        rc = 0
    except Exception as e:
        print(json.dumps({'error': manager_llm.redact_text(str(e))}, ensure_ascii=False))
        rc = 1
    finally:
        ctx.store.close()
    sys.exit(rc)


if __name__ == '__main__':
    main()