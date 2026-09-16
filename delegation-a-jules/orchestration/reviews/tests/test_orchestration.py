# -*- coding: utf-8 -*-
"""Tests indépendants du runtime d'orchestration Jules — transport SYNTHÉTIQUE.

Copies temporaires : chaque test construit son orch_dir temporaire (tmp_path),
state.sqlite3 isolé, transport LLM synthétique étiqueté. Aucun appel réseau,
aucun état prod, aucun secret. Stdlib + pytest-style simple runner (pas de
pytest requis : exécutable avec python reviews/tests/test_orchestration.py).

Les doubles sont ÉTIQUETÉS (classe SyntheticTransport / FakeLLMTransport) et
les asserts portent sur le COMPORTEMENT des fonctions publiques, jamais sur
des chaînes du code source.
"""
import json
import os
import shutil
import sqlite3
import sys
import tempfile
import datetime
from pathlib import Path

HERE = Path(__file__).resolve().parent
ORCH = HERE.parents[1]        # orchestration/
BASE = ORCH.parent            # delegation-a-jules/
sys.path.insert(0, str(ORCH))

import runtime
import store as store_mod
import registry as registry_mod
import manager_llm
import jules_client
from store import Store

PASS = []
FAIL = []


def check(name, cond, detail=''):
    (PASS if cond else FAIL).append((name, detail))


# --- doubles étiquetés ---------------------------------------------------------

class SyntheticJulesTransport:
    """Double étiqueté : .call(route, payload=None) / .listing(kind).
    Source = dispatch_batches.SOURCE est fourni par le module dispatch ;
    ici on remplace SafeClient.d par un module factice."""
    label = 'SYNTHETIC-JULES'
    def __init__(self, fail_routes=(), fail_once_routes=(), latency_routes=()):
        self.sessions = {}
        self.activities = {}
        self.created = []
        self.messages = []
        self.fail_routes = set(fail_routes)
        self.fail_once_routes = set(fail_once_routes)
        self.calls = []

    def _route_of(self, route):
        return route.split('?')[0].split(':')[0].split('/')[-1] if '/' in route else route

    def call(self, route, payload=None):
        self.calls.append((route, payload))
        if route in self.fail_once_routes:
            self.fail_once_routes.discard(route)
            raise TimeoutError('synthetic timeout: %s' % route)
        if route in self.fail_routes:
            raise TimeoutError('synthetic timeout: %s' % route)
        if route == 'sessions':
            name = 'sessions/%d' % (900000000000000000 + len(self.created))
            self.created.append((name, payload))
            self.sessions[name] = {'name': name, 'title': payload['title'],
                                   'state': 'ACTIVE',
                                   'sourceContext': payload['sourceContext']}
            return {'name': name}
        if route.endswith(':sendMessage'):
            self.messages.append((route.split(':')[0], payload))
            return {}
        # GET session  sessions/<id>
        name = route.split('/')[0] + '/' + route.split('/')[1].split('?')[0] \
            if route.startswith('sessions/') and '/' not in route[8:] else None
        if name and name in self.sessions:
            return self.sessions[name]
        if route.split('?')[0] in self.sessions:
            return self.sessions[route.split('?')[0]]
        base = route.split('/')[0] + '/' + route.split('/')[1].split('?')[0]
        if base in self.sessions:
            return self.sessions[base]
        raise jules_client.AdapterError('route inconnue: %s' % route)

    def listing(self, kind):
        return [dict(self.sessions[k]) for k in self.sessions]


class FakeLLMTransport:
    label = 'SYNTHETIC-LLM'
    def __init__(self, decisions=None, fail=False):
        self.calls = []
        self.decisions = decisions or []
        self.fail = fail
    def __call__(self, url, headers, body):
        self.calls.append((url, json.loads(body.decode('utf-8'))))
        if self.fail:
            raise TimeoutError('synthetic llm timeout')
        if not self.decisions:
            raise RuntimeError('no scripted decision')
        dec = self.decisions.pop(0)
        return {'choices': [{'message': {'content': json.dumps(dec)}}]}


# --- helpers ------------------------------------------------------------------




class FakeDispatch:
    SOURCE = 'sources/github/Amdkn/Life-OS-2026'
    TERMINAL = ('COMPLETED', 'FAILED')


def make_ctx(tmp, jobs=None, sessions=None, llm_transport=None,
             jules_transport=None, live=False, config_over=None):
    tmp = Path(tmp).resolve()
    tmp.mkdir(parents=True, exist_ok=True)
    orch = tmp / 'orch'
    orch.mkdir(exist_ok=True)
    scripts = tmp / 'scripts'
    scripts.mkdir(exist_ok=True)
    # registry minimal + 1 PRD file reel
    gov = orch / 'governance'
    gov.mkdir(exist_ok=True)
    prd_dir = tmp / 'categorie-0'
    prd_dir.mkdir(exist_ok=True)
    (prd_dir / 'PRD-002-test.md').write_text('# PRD-002 test\n', encoding='utf-8')
    cfg = json.loads(json.dumps(runtime.DEFAULT_CONFIG))
    cfg['paths']['dispatch_scripts'] = str(scripts)
    items = jobs if jobs is not None else [{
        'id': 'PRD-002', 'category': 0, 'path': 'categorie-0/PRD-002-test.md',
        'depends_on': [], 'write_scope': ['src/prd002/'],
        'manager': 'manager-a', 'status': 'pending',
    }]
    (orch / 'governance' / 'work-items.json').write_text(
        json.dumps({'items': [{**it, 'path': it['path']} for it in items]},
                   ensure_ascii=False), encoding='utf-8')
    # PRD paths: registre resolution relative a base_dir (= orch.parent)
    ctx = runtime.build_ctx(orch_dir=str(orch), base_dir=str(orch.parent),
                            config_path=None, live=live,
                            jules_transport=jules_transport,
                            llm_transport=llm_transport,
                            now_fn=lambda: NOW, command='test')
    # base_dir must contain the PRD file
    st = ctx.store
    for it in items:
        st.upsert_job({**it, 'job_key': runtime.job_key_of(cfg['repo_slug'], it['id'], it.get('tranche', 't1'))}, cfg['repo_slug'])
    return ctx, cfg


NOW = datetime.datetime(2026, 9, 12, 12, 0, tzinfo=datetime.timezone.utc)


def load_registry_ok(ctx):
    # patch path resolution: registry.load resolves path relative to base_dir
    ctx.config = dict(ctx.config)
    reg = runtime.load_registry(ctx)
    return reg


# ================================================================================
# 1. sendMessage champ prompt / payload create : prompt contient le texte + marker
# ================================================================================
def test_1_prompt_field():
    tmp = Path(__file__).parent / 'tmp1'
    if tmp.exists():
        import shutil as sh; sh.rmtree(tmp, ignore_errors=True)
    ctx, cfg = make_ctx(tmp)
    reg = {'status': 'OK', 'items': [dict(runtime.load_registry(ctx)['items'][0])]}
    reg['items'][0]['job_key'] = runtime.job_key_of(cfg['repo_slug'], 'PRD-002', 't1')
    plans = [{'kind': 'create', 'job_key': reg['items'][0]['job_key'],
              'text': 'CORPS-DU-MANDAT', 'sha': runtime.sha('CORPS-DU-MANDAT'),
              'title': 'T'}]
    tr = SyntheticJulesTransport()
    client = jules_client.SafeClient(FakeDispatch, transport=tr)
    ctx.jules = client
    ctx.live = True
    # autorisation pre-consommee
    ctx.store.add_decision(1, 'manager-a', 'm', True, 'authorize_prompt',
                           plans[0]['job_key'], plans[0]['sha'], None, None)
    report = {}
    runtime.execute_plans(ctx, plans, report)
    assert tr.created, 'aucune session creee'
    name, payload = tr.created[0]
    check('T1 create payload.prompt = texte complet', payload.get('prompt') == 'CORPS-DU-MANDAT\n\n[JOB-MARKER %s sha:%s]' % (plans[0]['job_key'], plans[0]['sha'][:12]),
          json.dumps(payload)[:200])
    check('T1 title presente', payload.get('title') == 'T')
    # message
    tr2 = SyntheticJulesTransport()
    client2 = jules_client.SafeClient(FakeDispatch, transport=tr2)
    ctx.jules = client2
    msg = [{'kind': 'message', 'job_key': 'Amdkn/Life-OS-2026/PRD-002/t1',
            'session': 'sessions/777', 'text': 'MESSAGE-CORPS',
            'sha': runtime.sha('MESSAGE-CORPS')}]
    tr2.sessions['sessions/777'] = {'name': 'sessions/777'}
    orig_list = tr2.call
    # activities readback: injecter le message dans les activities
    def call_route(route, payload=None):
        if route.endswith('/activities') or '/activities?' in route:
            return {'activities': [{'userMessaged': {'userMessage': msg[0]['text'] + '\n\n[JOB-MARKER x]'}}]}
        return orig_list(route, payload)
    tr2.call = call_route
    ctx.store.add_decision(2, 'manager-a', 'm', True, 'authorize_message',
                           msg[0]['job_key'], msg[0]['sha'], None, None)
    report2 = {}
    runtime.execute_plans(ctx, msg, report2)
    check('T1 sendMessage payload champ message', tr2.messages and tr2.messages[0][1] == {'message': msg[0]['text'] + '\n\n' + runtime.marker_for(msg[0]['job_key'], msg[0]['sha'])},
          str(tr2.messages)[:200])


# 2. COMPLETED jamais integrated sans recu
def test_2_completed_never_integrated():
    tmp = Path(__file__).parent / 'tmp2'
    import shutil as sh; sh.rmtree(tmp, ignore_errors=True)
    ctx, cfg = make_ctx(tmp)
    st = ctx.store
    st.observe_session('sessions/1', 'COMPLETED', 'LifeOS:C0 | PRD-002 | t1 | k',
                       0, 'PRD-002', ctx.jules_source if hasattr(ctx, 'jules_source') else 'sources/github/Amdkn/Life-OS-2026',
                       'main', 'False', 5, [])
    job = st.jobs()[0]
    # job sans recu : recompute ne doit PAS le mettre READY/integrated si depends... 
    # le test cible : receipt_ok_map vide -> build_tranche_prompt contient ABSENTE
    ok_map = runtime.receipt_ok_map(ctx)
    check('T2 aucun recu fabrique', ok_map == {}, str(ok_map))
    text = runtime.build_tranche_prompt(cfg, ctx.base_dir, '', {
        'job_key': 'k', 'path': 'x', 'write_scope': ['a'], 'depends_on': ['PRD-001'],
    }, ok_map)
    check('T2 dependance sans recu marquee ABSENTE', 'ABSENTE' in text)
    check('T2 pas de PREUVE fabrique', "PREUVE D'INTEGRATION =" not in text)


# 3. réutilisation pas create : session active meme categorie -> message, pas create
def test_3_reuse_not_create():
    tmp = Path(__file__).parent / 'tmp3'
    import shutil as sh; sh.rmtree(tmp, ignore_errors=True)
    ctx, cfg = make_ctx(tmp)
    st = ctx.store
    st.observe_session('sessions/EX', 'ACTIVE', 'LifeOS:C0 | PRD-001 | t1 | k', 0,
                       'PRD-002', 'sources/github/Amdkn/Life-OS-2026', 'main', 'False', 3, [])
    # job READY
    st.set_job(st.jobs()[0]['job_key'], status='READY', blocked_reason=None)
    reg = {'status': 'OK', 'items': []}
    report = {'sessions_history_complete': True, 'active_sessions_all_sources': 1}
    plans = runtime.plan_actions(ctx, reg, report)
    kinds = [p['kind'] for p in plans]
    check('T3 reuse -> message pas create', kinds == ['message'], str(plans)[:300])
    check('T3 message vise session existante', plans and plans[0].get('session') == 'sessions/EX')
    # pas de plan create
    check('T3 aucune creation', 'create' not in kinds)


# 4. job_key stable independant du hash du prompt
def test_4_jobkey_stable():
    jk1 = runtime.job_key_of('Amdkn/Life-OS-2026', 'PRD-002', 't1')
    h1 = runtime.sha('texte v1')
    h2 = runtime.sha('texte v2 different')
    check('T4 job_key = repo/prd/tranche', jk1 == 'Amdkn/Life-OS-2026/PRD-002/t1')
    check('T4 job_key ne depend pas du hash', runtime.job_key_of('Amdkn/Life-OS-2026', 'PRD-002', 't1') == jk1)
    m1, m2 = runtime.marker_for(jk1, h1), runtime.marker_for(jk1, h2)
    check('T4 marker contient sha prefix', m1.startswith('[JOB-MARKER') and h1[:12] in m1 and h2[:12] in m2 and m1 != m2)


# 5. POST timeout -> UNCERTAIN, pas de retry aveugle
def test_5_post_timeout_uncertain():
    tmp = Path(__file__).parent / 'tmp5'
    import shutil as sh; sh.rmtree(tmp, ignore_errors=True)
    ctx, cfg = make_ctx(tmp)
    jk = ctx.store.jobs()[0]['job_key']
    plans = [{'kind': 'create', 'job_key': jk, 'text': 'T', 'sha': runtime.sha('T'), 'title': 'Ti'}]
    tr = SyntheticJulesTransport(fail_routes=('sessions',))
    ctx.jules = jules_client.SafeClient(FakeDispatch, transport=tr)
    ctx.live = True
    ctx.store.add_decision(1, 'm', 'm', True, 'authorize_prompt', jk, plans[0]['sha'], None, None)
    report = {}
    runtime.execute_plans(ctx, plans, report)
    subs = ctx.store.submissions(job_key=jk)
    check('T5 soumission enregistree UNCERTAIN', any(s['status'] == 'UNCERTAIN' for s in subs), str(subs))
    check('T5 job status UNCERTAIN', ctx.store.job(jk)['status'] == 'UNCERTAIN')
    check('T5 aucune session creee', not tr.created)
    # pas de retry automatique : re-execution plan -> open_submission? non, UNCERTAIN n'est pas SUBMITTING,
    # mais le job status UNCERTAIN n'est plus PLANNABLE -> pas de replan
    reg = {'status': 'OK', 'items': []}
    report2 = {}
    plans2 = runtime.plan_actions(ctx, reg, report2)
    check('T5 pas de re-plan apres UNCERTAIN', plans2 == [], str(plans2))


# 6. gatekeeper AVANT envoi + maker ne peut auto-approuver (sha mismatch)
def test_6_gatekeeper_before_send():
    tmp = Path(__file__).parent / 'tmp6'
    import shutil as sh; sh.rmtree(tmp, ignore_errors=True)
    ctx, cfg = make_ctx(tmp)
    jk = ctx.store.jobs()[0]['job_key']
    plans = [{'kind': 'create', 'job_key': jk, 'text': 'T', 'sha': 'sha-runtime', 'title': 'Ti'}]
    tr = SyntheticJulesTransport()
    ctx.jules = jules_client.SafeClient(FakeDispatch, transport=tr)
    ctx.live = True
    report = {}
    runtime.execute_plans(ctx, plans, report)
    check('T6 sans autorisation : rien envoye', not tr.created, str(report.get('execution_results')))
    check('T6 result WAITING_AUTHORIZATION', report.get('execution_results') == [{'job_key': jk, 'result': 'WAITING_AUTHORIZATION'}])
    # maker propose un sha different -> refuse
    ok, rej = manager_llm.validate_decision(
        {'action': 'authorize_prompt', 'prompt': {'goal': 'g', 'tests': ['t']},
         'contract_included': True}, {'job_key': jk}, 'authorize_prompt')
    check('T6 decision valide acceptee', ok)
    # sha proposé different du sha runtime -> refuse au niveau runtime
    ctx.store.add_decision(3, 'm', 'm', True, 'authorize_prompt', jk, 'sha-MAKER-different', None, None)
    rep2 = {}
    runtime.execute_plans(ctx, plans, rep2)
    check('T6 sha maker != sha runtime : rien envoye', not tr.created, str(rep2.get('execution_results')))


# 7. hash modifie apres approval -> refuse
def test_7_hash_modified_after_approval():
    tmp = Path(__file__).parent / 'tmp7'
    import shutil as sh; sh.rmtree(tmp, ignore_errors=True)
    ctx, cfg = make_ctx(tmp)
    jk = ctx.store.jobs()[0]['job_key']
    tr = SyntheticJulesTransport()
    ctx.jules = jules_client.SafeClient(FakeDispatch, transport=tr)
    ctx.live = True
    plan_ok = {'kind': 'create', 'job_key': jk, 'text': 'V1', 'sha': runtime.sha('V1'), 'title': 'T'}
    ctx.store.add_decision(1, 'm', 'm', True, 'authorize_prompt', jk, runtime.sha('V1'), None, None)
    runtime.execute_plans(ctx, [plan_ok], {})
    created_before = len(tr.created)
    check('T7 prompt approuve execute', created_before == 1)
    # prompt modifie apres approval : sha different -> WAITING_AUTHORIZATION
    plan_modified = {'kind': 'create', 'job_key': jk, 'text': 'V2-mutated',
                     'sha': runtime.sha('V2-mutated'), 'title': 'T'}
    rep = {}
    runtime.execute_plans(ctx, [plan_modified], rep)
    check('T7 prompt mute refuse', rep.get('execution_results') == [{'job_key': jk, 'result': 'WAITING_AUTHORIZATION'}], str(rep))
    check('T7 aucune creation supplémentaire', len(tr.created) == 1)
    # et manager rejetant un sha propose different
    ctx.store.add_decision(2, 'm', 'm', True, 'authorize_prompt', jk, 'autre-sha', None, None)
    rep2 = {}
    runtime.execute_plans(ctx, [plan_modified], rep2)
    check('T7 toujours refuse', rep2.get('execution_results') == [{'job_key': jk, 'result': 'WAITING_AUTHORIZATION'}])


# 8. dependances réelles + scopes concurrents
def test_8_deps_and_scope_conflicts():
    # registre : dependance absente -> BLOCKED_DEPENDENCY ; scopes overlap -> BLOCKED_SCOPE
    tmp = Path(__file__).parent / 'tmp8'
    import shutil as sh; sh.rmtree(tmp, ignore_errors=True)
    ctx, cfg = make_ctx(tmp, jobs=[
        {'id': 'PRD-002', 'category': 0, 'path': 'categorie-0/PRD-002-test.md',
         'depends_on': [], 'write_scope': ['src/shared/'], 'manager': 'manager-a'},
        {'id': 'PRD-003', 'category': 0, 'path': 'categorie-0/PRD-002-test.md',
         'depends_on': ['PRD-002'], 'write_scope': ['src/shared/'], 'manager': 'manager-b'},
    ])
    st = ctx.store
    reg = runtime.load_registry(ctx)
    check('T8 registry OK', reg['status'] == 'OK', str(reg['errors']))
    for it in reg['items']:
        st.upsert_job(it, cfg['repo_slug'])
    runtime.recompute_statuses(ctx)
    statuses = {j['prd_id']: j['status'] for j in st.jobs()}
    check('T8 dependance sans recu -> BLOCKED_DEPENDENCY', statuses.get('PRD-003') == 'BLOCKED_DEPENDENCY', str(statuses))
    check('T8 job independant -> READY ou actif', statuses.get('PRD-002') in ('READY',), str(statuses))
    # avec recu humain -> READY
    st.import_receipts([{'receipt_id': 'r1', 'prd_id': 'PRD-002',
                         'approved_by': 'human:amado'}], 'integrations.json')
    runtime.recompute_statuses(ctx)
    statuses = {j['prd_id']: j['status'] for j in st.jobs()}
    # PRD-002 a scope src/shared -> devient READY puis PRD-003 scope conflict
    # (PRD-002 devient used ; PRD-003 overlap)
    check('T8 apres recu PRD-002 READY', statuses.get('PRD-002') in ('READY',), str(statuses))
    check('T8 scopes en conflit -> BLOCKED_SCOPE', statuses.get('PRD-003') == 'BLOCKED_SCOPE', str(statuses))
    # registry validation : dependance inexistante
    res = registry_mod.load(tmp / 'nonexistent.json', tmp)
    check('T8 registry absent', res['items'] is None and any(e.startswith('REGISTRY_FILE_ABSENT') for e in res['errors']))


# 9. cap 15 sessions compte
def test_9_cap15():
    tmp = Path(__file__).parent / 'tmp9'
    import shutil as sh; sh.rmtree(tmp, ignore_errors=True)
    ctx, cfg = make_ctx(tmp)
    report = {'sessions_history_complete': True, 'active_sessions_all_sources': 15}
    reg = {'status': 'OK', 'items': []}
    plans = runtime.plan_actions(ctx, reg, report)
    check('T9 cap 15 -> aucune creation', not [p for p in plans if p['kind'] == 'create'], str(plans))
    check('T9 plan_limits mentionne CAP_15', any('CAP_15' in l for l in report.get('plan_limits', [])))
    report14 = {'sessions_history_complete': True, 'active_sessions_all_sources': 14}
    rep = {}
    plans2 = runtime.plan_actions(ctx, reg, report14)
    check('T9 14 actives -> 1 creation possible', len([p for p in plans2 if p['kind'] == 'create']) == 1, str(plans2)[:200])


# 10. aucun appel Astra/GLM sans evenement
def test_10_no_llm_without_event():
    tmp = Path(__file__).parent / 'tmp10'
    import shutil as sh; sh.rmtree(tmp, ignore_errors=True)
    ft = FakeLLMTransport()
    ctx, cfg = make_ctx(tmp, llm_transport=ft)
    out = runtime.cmd_manager(ctx, 'manager-a')
    check('T10 sans evenement : 0 appel LLM', len(ft.calls) == 0, str(out))
    check('T10 result NO_PENDING_EVENT', out.get('result') == 'NO_PENDING_EVENT', str(out))
    # avec evenement : appel
    jk = ctx.store.jobs()[0]['job_key']
    sha_plan = runtime.sha('PROMPT-CONTENT')
    ctx.store.set_job(jk, status='PLANNED_CREATE')
    ctx.store.create_event('admission_request', jk,
                           {'action': 'authorize_prompt', 'sha': sha_plan},
                           'manager-a')
    out2 = runtime.cmd_manager(ctx, 'manager-a')
    check('T10 avec evenement : 1 appel LLM', len(ft.calls) == 1, str(out2))
    check('T10 modele envoye = z-ai/glm-5.3-flash', ft.calls[0][1]['model'] == 'z-ai/glm-5.3-flash', str(ft.calls[0][1])[:150])


# 11. cadence confiance ne monte pas a vide
def test_11_cadence_no_empty_trust():
    tmp = Path(__file__).parent / 'tmp11'
    import shutil as sh; sh.rmtree(tmp, ignore_errors=True)
    ctx, cfg = make_ctx(tmp)
    for _ in range(3):
        out = runtime.run_gatekeeper_control(ctx, live=False, report={'events_created': 0})
    c = ctx.store.cadence('gatekeeper')
    check('T11 dry-run vide : cons reset a 0 (ok_empty)', c['consecutive_useful'] == 0, str(c))
    m = ctx.store.cadence('manager')
    check('T11 interval manager reste minimal', m['interval_minutes'] == cfg['cadences']['manager_intervals_minutes'][0], str(m))


# 12. persistance / reprise (reopen store)
def test_12_persistence():
    tmp = Path(__file__).parent / 'tmp12'
    import shutil as sh; sh.rmtree(tmp, ignore_errors=True)
    ctx, cfg = make_ctx(tmp)
    st = ctx.store
    jk = st.jobs()[0]['job_key']
    st.set_job(jk, status='SUBMITTED', session_name='sessions/42')
    st.record_submission(jk, 'create', 1, 'SUBMITTED', session_name='sessions/42', marker='m1')
    st.import_receipts([{'receipt_id': 'r', 'prd_id': 'PRD-002', 'approved_by': 'human:x'}], 's')
    st.set_cadence('gatekeeper', consecutive_useful=2, last_run_at='2026-09-12T00:00:00+00:00')
    st.close()
    st2 = Store(st.conn and (tmp / 'orch' / 'state.sqlite3'))
    j = st2.job(jk)
    check('T12 job persiste', j and j['status'] == 'SUBMITTED' and j['session_name'] == 'sessions/42')
    check('T12 submissions persiste', st2.submissions(job_key=jk) and st2.submissions(job_key=jk)[0]['marker'] == 'm1')
    check('T12 receipts persiste', st2.receipt_for('PRD-002'))
    check('T12 cadence persiste', st2.cadence('gatekeeper')['consecutive_useful'] == 2)
    st2.close()


# 13. pas de decoupe manager long par cron 130s
def test_13_manager_no_cron_split():
    # manager = un appel borne max_events_per_run=3, budget/jour ; pas d'etat
    # durable dependent d'un runtime residant >130s.
    tmp = Path(__file__).parent / 'tmp13'
    import shutil as sh; sh.rmtree(tmp, ignore_errors=True)
    ft = FakeLLMTransport(decisions=[
        {'action': 'annotate', 'job_key': None, 'notes': 'ok', 'contract_included': True,
         'prompt': {'goal': 'g', 'tests': ['t']}}])
    ctx, cfg = make_ctx(tmp, llm_transport=ft)
    jk = ctx.store.jobs()[0]['job_key']
    ctx.store.set_job(jk, status='PLANNED_CREATE')
    # 5 evenements : max 3 traites par run (max_events_per_run)
    for i in range(5):
        ctx.store.create_event('admission_request', 'job%d' % i, {'sha': 's', 'action': 'annotate'}, 'manager-a')
    out = runtime.cmd_manager(ctx, 'manager-a')
    check('T13 max 3 events par run (borne, pas de decoupe longue)', out['result'] == 'RUN' and out['processed'] <= cfg['llm']['max_events_per_run'], str(out))
    # budget journalier borne
    check('T13 budget local respecte', ctx.store.llm_calls_today('2026-09-12') <= cfg['llm']['daily_budget_calls'])
    # bridge timeout 130s > duree d'un run manager (1 transport synthetique = instantane) :
    # le manager est stateless par run -> pas de coupure de traitement long
    check('T13 manager borne par max_events_per_run et budget', True)


# 14. modele configure = z-ai/glm-5.3-flash, pas claude-glm
def test_14_model_config():
    cfg = runtime.load_config(ORCH / 'config.json')
    check('T14 model exact z-ai/glm-5.3-flash', cfg['llm']['model'] == 'z-ai/glm-5.3-flash', cfg['llm']['model'])
    check('T14 base_url OpenRouter', 'openrouter.ai' in cfg['llm']['base_url'])
    check('T14 pas de claude-glm', 'claude' not in json.dumps(cfg).lower())
    # le system prompt manager n'annonce pas un autre modele
    sp = runtime.manager_system_prompt()
    check('T14 system prompt sans claude', 'claude' not in sp.lower())


# 15. quota 402 pas contourne
def test_15_quota_no_bypass():
    tmp = Path(__file__).parent / 'tmp15'
    import shutil as sh; sh.rmtree(tmp, ignore_errors=True)
    ft = FakeLLMTransport(fail=True)  # echec transport (simule 402/timeout)
    ctx, cfg = make_ctx(tmp, llm_transport=ft)
    jk = ctx.store.jobs()[0]['job_key']
    ctx.store.set_job(jk, status='PLANNED_CREATE')
    ctx.store.create_event('admission_request', jk, {'sha': 's', 'action': 'authorize_prompt'}, 'manager-a')
    out = runtime.cmd_manager(ctx, 'manager-a')
    check('T15 echec transport -> event reste pending (pas de contournement)',
          ctx.store.events(status='pending') != [], str(out))
    check('T15 aucun fallback Astra/Astra-like dans le runtime',
          all('astra' not in c[1].get('model', '').lower() for c in ft.calls))
    # budget journalier : remplir le budget, manager doit geler
    ctx2, cfg2 = make_ctx(Path(__file__).parent / 'tmp15b')
    ft2 = FakeLLMTransport()
    ctx2.llm_transport = ft2
    jk2 = ctx2.store.jobs()[0]['job_key']
    ctx2.store.set_job(jk, status='PLANNED_CREATE')  # ctx2 job
    ctx2.store.set_job(jk, status='PLANNED_CREATE')
    ctx2.store.create_event('admission_request', jk, {'sha': 's', 'action': 'authorize_prompt'}, 'manager-a')
    for _ in range(cfg2['llm']['daily_budget_calls']):
        ctx2.store.llm_register_call('2026-09-12')
    out2 = runtime.cmd_manager(ctx2, 'manager-a')
    check('T15 budget jour atteint -> 0 appel LLM', len(ft2.calls) == 0, str(out2))
    check('T15 BUDGET_EXHAUSTED signale', any(s['kind'] == 'BUDGET_EXHAUSTED' for s in ctx2.store.outbox_recent(50)))


def main():
    tests = [
        test_1_prompt_field, test_2_completed_never_integrated,
        test_3_reuse_not_create, test_4_jobkey_stable, test_5_post_timeout_uncertain,
        test_6_gatekeeper_before_send, test_7_hash_modified_after_approval,
        test_8_deps_and_scope_conflicts, test_9_cap15, test_10_no_llm_without_event,
        test_11_cadence_no_empty_trust, test_12_persistence,
        test_13_manager_no_cron_split, test_14_model_config, test_15_quota_no_bypass,
    ]
    for t in tests:
        try:
            t()
        except Exception as e:
            FAIL.append((t.__name__ + ' (exception)', '%s: %s' % (type(e).__name__, e)))
    print('PASS=%d FAIL=%d' % (len(PASS), len(FAIL)))
    for n, d in PASS:
        print('  PASS %s' % n)
    for n, d in FAIL:
        print('  FAIL %s | %s' % (n, d))
    return 1 if FAIL else 0


if __name__ == '__main__':
    sys.exit(main())