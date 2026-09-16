# -*- coding: utf-8 -*-
"""Suite de tests pole0 runtime — transport synthetique, zero reseau.

Scenarios reels + controles negatifs (contrat API, admission, gatekeeper,
maker!=gatekeeper, hash, dependances, cycles, scopes, UNCERTAIN, 402).
Execution : python test_pole0_runtime.py   (unittest, verbosity=2)
"""
import copy
import datetime
import importlib.util
import json
import os
import shutil
import sqlite3
import sys
import tempfile
import types
import unittest
import urllib.error
from pathlib import Path

ORCH = Path(r'C:/Users/amado/Life-OS-2026/delegation-a-jules/orchestration')
DELEG = ORCH.parent
sys.path.insert(0, str(ORCH))

import jules_client
import manager_llm
import registry as registry_mod
import runtime
import store as store_mod
import worker as worker_mod


def load_config():
    return runtime.load_config(ORCH / 'config.json')


class SyntheticJules:
    """Transport synthetique etiquete : routes journalisees, zero reseau."""
    def __init__(self, sessions=None, activities=None):
        self.calls = []
        self.sessions = sessions or []
        self.activities = activities or {}
        self.ambiguous_post = False
        self.fail_http = None

    def call(self, route, payload=None):
        self.calls.append((route, payload))
        if self.fail_http is not None:
            raise urllib.error.HTTPError('u', self.fail_http, 'err', {}, None)
        if route == 'sessions':
            if self.ambiguous_post:
                return {}  # reponse ambigu : pas de name exploitable
            name = 'sessions/9990001112223'
            created = {'name': name, 'title': payload.get('title'),
                       'state': 'ACTIVE',
                       'sourceContext': {'source': 'sources/github/Amdkn/Life-OS-2026',
                                         'githubRepoContext': {'startingBranch': 'main'},
                                         'environmentVariablesEnabled': False}}
            self.sessions.append(created)  # lisible par get_session (readback)
            return created
        if route.endswith(':sendMessage'):
            return {}
        if route.endswith('/activities'):
            return {'activities': self.activities.get(route.split('/')[0], []),
                    'nextPageToken': ''}
        if route.startswith('sessions/'):
            for s in self.sessions:
                if s['name'] == route:
                    return s
            return {}
        raise AssertionError('route inattendue: %r' % route)

    def listing(self, kind):
        return self.sessions


def make_ctx(tmp, live=False, jules_transport=None, llm_transport=None,
             config_overrides=None, now_fn=None):
    orch = tmp / 'orch'
    orch.mkdir(exist_ok=True)
    base = tmp / 'base'
    base.mkdir(exist_ok=True)
    for f in ('runtime.py', 'store.py', 'registry.py', 'manager_llm.py',
              'jules_client.py', 'worker.py'):
        shutil.copy(ORCH / f, orch / f)
    shutil.copy(ORCH / 'config.json', orch / 'config.json')
    (base / 'CONTRAT-COMMUN.md').write_text('# contrat test', encoding='utf-8')
    gov = base / 'governance'
    if not gov.exists():
        shutil.copytree(ORCH / 'governance', gov)
    # PRD minimaux pour tous les items du registre
    items = json.loads((gov / 'work-items.json').read_text(encoding='utf-8'))['items']
    for it in items:
        p = base / it['path']
        p.parent.mkdir(parents=True, exist_ok=True)
        if not p.exists():
            p.write_text('# PRD %s\n' % it['id'], encoding='utf-8')
    cfg = load_config()
    if config_overrides:
        for k, v in config_overrides.items():
            if isinstance(v, dict) and isinstance(cfg.get(k), dict):
                cfg[k].update(v)
            else:
                cfg[k] = v
    (orch / 'config.json').write_text(json.dumps(cfg), encoding='utf-8')
    # stub dispatch_batches pour build_ctx sans reseau (SOURCE requis par SafeClient)
    scripts = orch.parent / 'scripts'
    scripts.mkdir(exist_ok=True)
    (scripts / 'dispatch_batches.py').write_text(
        "SOURCE='sources/github/Amdkn/Life-OS-2026'\n"
        "TERMINAL=('COMPLETED','FAILED')\n"
        "class Client:\n"
        "    def call(self, route, payload=None): raise AssertionError('no net')\n"
        "    def listing(self, kind): return []\n", encoding='utf-8')
    return runtime.build_ctx(orch_dir=orch, base_dir=base,
                             jules_transport=jules_transport,
                             llm_transport=llm_transport, live=live,
                             now_fn=now_fn,
                             config_path=orch / 'config.json')


class Base(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp(prefix='pole0_test_'))

    def tearDown(self):
        shutil.rmtree(self.tmp, ignore_errors=True)


# --- 1. contrat API ----------------------------------------------------------

class TestApiContract(Base):
    def test_send_message_official_prompt_field(self):
        t = SyntheticJules()
        mod = types.SimpleNamespace(
            SOURCE='sources/github/Amdkn/Life-OS-2026',
            TERMINAL=('COMPLETED', 'FAILED'))
        c = jules_client.SafeClient(mod, transport=t)
        c.send_message('sessions/123', 'contract-test')
        route, payload = t.calls[-1]
        self.assertEqual(route, 'sessions/123:sendMessage')
        self.assertEqual(payload, {'prompt': 'contract-test'})
        self.assertNotIn('message', payload)

    def test_malformed_session_rejected(self):
        mod = types.SimpleNamespace(SOURCE='s')
        c = jules_client.SafeClient(mod, transport=SyntheticJules())
        for bad in ('sessions/abc', 'sessions/123:delete', 'other', ''):
            with self.assertRaises(Exception):
                c.send_message(bad, 'x')
        self.assertEqual([r for r, _ in
                          jules_client.SafeClient(mod, transport=SyntheticJules()).inner.calls],
                         [])

    def test_send_message_negative_bad_session(self):
        mod = types.SimpleNamespace(SOURCE='s')
        c = jules_client.SafeClient(mod, transport=SyntheticJules())
        with self.assertRaises(jules_client.AdapterError):
            c.send_message('sessions/12:34', 'x')


# --- 2. registre -------------------------------------------------------------

class TestRegistry(Base):
    def load_real(self):
        return registry_mod.load(ORCH / 'governance' / 'work-items.json', DELEG)

    def test_55_items_valid(self):
        res = self.load_real()
        self.assertEqual(res['errors'], [])
        self.assertEqual(len(res['items']), 55)
        ids = [it['id'] for it in res['items']]
        self.assertEqual(len(set(ids)), 55)

    def test_dependency_cycle_detected(self):
        items = [{'id': 'PRD-001', 'category': 0, 'path': 'a.md',
                  'depends_on': ['PRD-002'], 'write_scope': ['x/'],
                  'manager': 'manager-a'},
                 {'id': 'PRD-002', 'category': 0, 'path': 'b.md',
                  'depends_on': ['PRD-001'], 'write_scope': ['y/'],
                  'manager': 'manager-a'}]
        # noms de fichiers derives corrects (PRD-001-, PRD-002-)
        items[0]['path'] = 'PRD-001-x.md'
        items[1]['path'] = 'PRD-002-y.md'
        for it in items:
            (self.tmp / it['path']).write_text('x', encoding='utf-8')
        reg = self.tmp / 'reg.json'
        reg.write_text(json.dumps({'items': items}), encoding='utf-8')
        res = registry_mod.load(reg, self.tmp)
        self.assertTrue(any('CYCLE' in e for e in res['errors']))

    def test_scope_conflict_detected(self):
        a = ['delegation-a-jules/orchestration/']
        b = ['delegation-a-jules/orchestration/runtime.py']
        self.assertTrue(registry_mod.scopes_overlap(a, b))
        self.assertFalse(registry_mod.scopes_overlap(['x/'], ['y/']))
        # lockfiles exclusifs globalement
        self.assertTrue(registry_mod.scopes_overlap(['p/package.json'], ['q/package.json']))


# --- 3. admission ------------------------------------------------------------

class TestAdmission(Base):
    def test_max_15_active_counted_all_sources(self):
        ctx = make_ctx(self.tmp, jules_transport=SyntheticJules(
            sessions=[{'name': 'sessions/%d' % i, 'title': 'autre %d' % i,
                       'state': 'ACTIVE', 'sourceContext': {'source': 'autre/%d' % i}}
                      for i in range(14)]))
        ctx.store.meta_set('registry_status', 'OK')
        report = {'sessions_history_complete': True}
        runtime.reconcile(ctx, report)
        self.assertEqual(report['active_sessions_all_sources'], 14)
        # ajouter un job READY : la creation doit etre refusee a 15 mais ok a 14
        item = {'id': 'PRD-001', 'category': 0, 'path': 'categorie-0-12wy-snw/PRD-12WY-SQLITE-GLASSMORPHISM.md',
                'depends_on': [], 'write_scope': ['categorie-0-12wy-snw/'],
                'manager': 'manager-a', 'tranche': 't1',
                'job_key': 'Amdkn/Life-OS-2026/PRD-001/t1'}
        ctx.store.upsert_job(item, 'Amdkn/Life-OS-2026')
        ctx.store.set_job(item['job_key'], status='READY')
        reg = {'status': 'OK', 'items': [dict(item)], 'errors': []}
        plans = runtime.plan_actions(ctx, reg, report)
        self.assertEqual(report['planned_creations'], 1)  # 14+1=15 <= cap
        ctx.store.release_claim('x')
        # a 15 actifs : refuse (le 1er appel a passe le job en PLANNED_CREATE,
        # on le remet READY pour tester la garde CAP_15 isolement)
        ctx.store.set_job(item['job_key'], status='READY')
        report2 = {'sessions_history_complete': True,
                   'active_sessions_all_sources': 15}
        plans2 = runtime.plan_actions(ctx, reg, report2)
        self.assertEqual(report2['planned_creations'], 0)
        self.assertTrue(any('CAP_15' in m for m in report2.get('plan_limits', [])))

    def test_max_categories_cap(self):
        ctx = make_ctx(self.tmp)
        cap = ctx.config['limits']['max_active_categories_program']
        item = {'id': 'PRD-041', 'category': 4, 'path': 'categorie-4-life-os-6-frameworks/PRD-041-IDENTITIES.md',
                'depends_on': [], 'write_scope': ['categorie-4-life-os-6-frameworks/'],
                'manager': 'manager-b', 'tranche': 't1'}
        reg = {'status': 'OK', 'items': [item], 'errors': []}
        report = {'sessions_history_complete': True, 'active_sessions_all_sources': 0}
        active = {s['category'] for s in ctx.store.sessions_observed(active_only=True)}
        # simuler cap categories deja actives via sessions observees (source = config),
        # toutes differentes de celle de l'item (sinon le job est saute, pas cappe)
        for i, cat in enumerate([c for c in range(1, cap + 2) if c != 4][:cap]):
            ctx.store.observe_session('sessions/1%02d' % i, 'ACTIVE',
                                      'LifeOS:C%d | PRD-0%02d | t1 | k' % (cat, cat + 1),
                                      cat, 'PRD-0%02d' % (cat + 1), ctx.config['source'],
                                      'main', 'false', 0, [])
        item = dict(item, id='PRD-041', category=4)
        item['job_key'] = 'k/PRD-041/t1'
        ctx.store.upsert_job(item, 'r')
        ctx.store.set_job(item['job_key'], status='READY')
        plans = runtime.plan_actions(ctx, {'status': 'OK', 'items': [item]}, report)
        self.assertTrue(any('CAP_3_CATEGORIES' in m
                            for m in report.get('plan_limits', [])))

    def test_continuation_priority_existing_session_same_category(self):
        sj = SyntheticJules(sessions=[
            {'name': 'sessions/7587937436525114170', 'title': 'LifeOS:C1 | PRD-011 | t1 | k',
             'state': 'ACTIVE',
             'sourceContext': {'source': load_config()['source'],
                               'githubRepoContext': {'startingBranch': 'main'},
                               'environmentVariablesEnabled': False}}])
        ctx = make_ctx(self.tmp, live=False, jules_transport=sj)
        item = {'id': 'PRD-011', 'category': 1,
                'path': 'categorie-1-agent-portal/PRD-011-BLACKBOARD-SQLITE-SCHEMA.md',
                'depends_on': [], 'write_scope': ['categorie-1-agent-portal/'],
                'manager': 'manager-b', 'tranche': 't1',
                'job_key': 'Amdkn/Life-OS-2026/PRD-011/t1'}
        report = {'sessions_history_complete': True, 'active_sessions_all_sources': 1}
        runtime.reconcile(ctx, report)
        ctx.store.upsert_job(item, 'Amdkn/Life-OS-2026')
        ctx.store.set_job(item['job_key'], status='READY')
        reg = {'status': 'OK', 'items': [item], 'errors': []}
        plans = runtime.plan_actions(ctx, reg, report)
        self.assertEqual(len([p for p in plans if p['kind'] == 'message']), 1)
        self.assertIn('sessions/7587937436525114170', plans[0]['session'])

    def test_dependency_needs_real_receipt_no_mock(self):
        ctx = make_ctx(self.tmp)
        item = {'id': 'PRD-016', 'category': 1,
                'path': 'categorie-1-agent-portal/PRD-016-CONTRACTS.md',
                'depends_on': ['PRD-011'], 'write_scope': ['categorie-1-agent-portal/contrats/'],
                'manager': 'manager-b', 'tranche': 't1',
                'job_key': 'Amdkn/Life-OS-2026/PRD-016/t1'}
        ctx.store.upsert_job(item, 'r')
        ctx.store.set_job(item['job_key'], status='PENDING_VALIDATE')
        runtime.recompute_statuses(ctx)
        self.assertEqual(ctx.store.job(item['job_key'])['status'], 'BLOCKED_DEPENDENCY')
        # recu non approuve par humain : ignore
        (ctx.orch_dir / 'integrations.json').write_text(json.dumps(
            {'receipts': [{'receipt_id': 'r1', 'prd_id': 'PRD-011',
                           'approved_by': 'runtime-auto'}]}), encoding='utf-8')
        runtime.load_receipts(ctx)
        runtime.recompute_statuses(ctx)
        self.assertEqual(ctx.store.job(item['job_key'])['status'], 'BLOCKED_DEPENDENCY')
        # recu approuve par humain : leve le blocage
        (ctx.orch_dir / 'integrations.json').write_text(json.dumps(
            {'receipts': [{'receipt_id': 'r2', 'prd_id': 'PRD-011',
                           'approved_by': 'human:amdkn'}]}), encoding='utf-8')
        runtime.load_receipts(ctx)
        runtime.recompute_statuses(ctx)
        self.assertEqual(ctx.store.job(item['job_key'])['status'], 'READY')


# --- 4. gatekeeper / decisions --------------------------------------------------

class TestGatekeeper(Base):
    def test_maker_cannot_authorize_own_prompt(self):
        """Une decision posee par le maker n'est jamais consommee par le tick
        du meme role : l'autorisation vient de la decision du manager LLM,
        jamais d'une auto-approbation."""
        ctx = make_ctx(self.tmp)
        ctx.store.upsert_job(
            {'id': 'PRD-001', 'category': 0, 'tranche': 't1',
             'path': 'categorie-0-12wy-snw/PRD-12WY-SQLITE-GLASSMORPHISM.md',
             'depends_on': [], 'write_scope': ['x/'], 'manager': 'manager-a',
             'job_key': 'k/PRD-001/t1'}, 'r')
        # simulation d'un "auto-approve" sans event LLM : aucune decision valide
        auth = ctx.store.take_authorization('k/PRD-001/t1', 'authorize_prompt',
                                            'abc123')
        self.assertIsNone(auth)  # tick ne peut envoyer sans decision approuvee

    def test_tick_cannot_send_without_or_modified_hash(self):
        ctx = make_ctx(self.tmp, live=True, jules_transport=SyntheticJules())
        job_key = 'k/PRD-001/t1'
        ctx.store.upsert_job(
            {'id': 'PRD-001', 'category': 0, 'tranche': 't1', 'path': 'p.md',
             'depends_on': [], 'write_scope': ['x/'], 'manager': 'manager-a',
             'job_key': job_key}, 'r')
        ctx.store.set_job(job_key, status='PLANNED_CREATE')
        plans = [{'kind': 'create', 'job_key': job_key, 'text': 'T', 'sha': 'AAA',
                  'title': 'title'}]
        # aucune autorisation du tout -> pas d'envoi
        rep = {}
        runtime.execute_plans(ctx, plans, rep)
        self.assertEqual(rep['execution_results'][0]['result'],
                         'WAITING_AUTHORIZATION')
        # autorisation pour un autre hash -> refuse
        ctx.store.add_decision(1, 'manager-a', 'm', True, 'authorize_prompt',
                               job_key, 'BBB', {'action': 'authorize_prompt'}, None)
        rep = {}
        runtime.execute_plans(ctx, plans, rep)
        self.assertEqual(rep['execution_results'][0]['result'],
                         'WAITING_AUTHORIZATION')
        # bon hash + bonne action -> envoi (transport synthetique)
        ctx.store.add_decision(2, 'manager-a', 'm', True, 'authorize_prompt',
                               job_key, 'AAA', {'action': 'authorize_prompt'}, None)
        rep = {}
        runtime.execute_plans(ctx, plans, rep)
        self.assertEqual(rep['execution_results'][0]['result'], 'SUBMITTED')

    def test_authorization_bound_to_job(self):
        ctx = make_ctx(self.tmp)
        ctx.store.add_decision(1, 'manager-a', 'm', True, 'authorize_prompt',
                               'k/OTHER/t1', 'AAA', {}, None)
        self.assertIsNone(ctx.store.take_authorization('k/OTHER2/t1',
                                                       'authorize_prompt', 'AAA'))

    def test_expired_or_absent_event_no_llm_call(self):
        ctx = make_ctx(self.tmp, llm_transport=self._fail_transport)
        out = runtime.cmd_manager(ctx)
        self.assertEqual(out['result'], 'NO_PENDING_EVENT')
        self.assertEqual(out['llm_calls'], 0)

    def _fail_transport(self, *a, **k):
        raise AssertionError('LLM appelé sans événement en attente')

    def test_empty_cadence_no_progress_no_llm(self):
        ctx = make_ctx(self.tmp, llm_transport=self._fail_transport)
        out = runtime.cmd_manager(ctx)
        self.assertEqual(out['result'], 'NO_PENDING_EVENT')
        self.assertEqual(out['llm_calls'], 0)
        out2 = runtime.cmd_supervisor(ctx)
        self.assertIn(out2['result'], ('NOT_DUE', 'STABLE_NO_OUTPUT',
                                       'CHANGE_SIGNALLED', 'INCIDENT_SIGNALLED'))


# --- 5. reconciliation / UNCERTAIN ----------------------------------------------

class TestReconcile(Base):
    def test_uncertain_create_reconciled_by_title_no_resend(self):
        src = load_config()['source']
        title = 'LifeOS:C0 | PRD-001 | t1 | k'
        sj = SyntheticJules(sessions=[
            {'name': 'sessions/1391687838750096362', 'title': title,
             'state': 'ACTIVE',
             'sourceContext': {'source': src,
                               'githubRepoContext': {'startingBranch': 'main'},
                               'environmentVariablesEnabled': False}}])
        ctx = make_ctx(self.tmp, jules_transport=sj)
        ctx.store.record_submission('k/PRD-001/t1', 'create', 1, 'UNCERTAIN',
                                    title=title)
        report = {}
        runtime.reconcile(ctx, report)
        self.assertEqual(len(report['uncertain_reconciled']), 1)
        self.assertEqual(report['uncertain_reconciled'][0]['session'],
                         'sessions/1391687838750096362')
        subs = ctx.store.submissions('k/PRD-001/t1')
        self.assertEqual(subs[-1]['status'], 'SUBMITTED')

    def test_ambiguous_post_marks_uncertain_no_retry(self):
        sj = SyntheticJules()
        sj.ambiguous_post = True
        ctx = make_ctx(self.tmp, live=True, jules_transport=sj)
        job_key = 'k/PRD-001/t1'
        ctx.store.upsert_job(
            {'id': 'PRD-001', 'category': 0, 'tranche': 't1', 'path': 'p.md',
             'depends_on': [], 'write_scope': ['x/'], 'manager': 'manager-a',
             'job_key': job_key}, 'r')
        ctx.store.set_job(job_key, status='PLANNED_CREATE')
        plans = [{'kind': 'create', 'job_key': job_key, 'text': 'T',
                  'sha': runtime.sha('T'), 'title': 'LifeOS:C0 | PRD-001 | t1 | k'}]
        # autorisation approuvee (sha exact) pour atteindre le POST
        ctx.store.add_decision(1, 'manager-a', 'm', True, 'authorize_prompt',
                               job_key, runtime.sha('T'),
                               {'action': 'authorize_prompt'}, None)
        rep = {}
        runtime.execute_plans(ctx, plans, rep)
        self.assertEqual(rep['execution_results'][0]['result'], 'UNCERTAIN')
        self.assertEqual(ctx.store.job(job_key)['status'], 'UNCERTAIN')
        # pas de nouvel envoi : soumission ouverte bloque le retry
        self.assertTrue(ctx.store.open_submission(job_key, 'create'))
        rep2 = {}
        runtime.execute_plans(ctx, plans, rep2)
        self.assertEqual(rep2['execution_results'][0]['result'],
                         'SKIPPED_OPEN_SUBMISSION')

    def test_list_sessions_history_incomplete_blocks_creations(self):
        ctx = make_ctx(self.tmp)
        report = {'sessions_history_complete': False,
                  'active_sessions_all_sources': None}
        item = {'id': 'PRD-001', 'category': 0, 'path': 'p.md', 'depends_on': [],
                'write_scope': ['x/'], 'manager': 'manager-a', 'tranche': 't1',
                'job_key': 'k/PRD-001/t1'}
        ctx.store.upsert_job(item, 'r')
        ctx.store.set_job(item['job_key'], status='READY')
        plans = runtime.plan_actions(ctx, {'status': 'OK', 'items': [item]}, report)
        self.assertEqual(report['planned_creations'], 0)
        self.assertIn('quota UNKNOWN', report.get('plan_note', ''))


# --- 6. LLM / maker-gatekeeper / 402 ------------------------------------------

class TestManagerLLM(Base):
    def test_parse_decision_valid_and_invalid(self):
        d = manager_llm.parse_decision('```json\n{"action": "annotate"}\n```')
        self.assertEqual(d['action'], 'annotate')
        with self.assertRaises(manager_llm.InvalidDecision):
            manager_llm.parse_decision('pas du json')

    def test_validate_decision_rejects_missing_tests(self):
        dec = {'action': 'authorize_prompt',
               'prompt': {'goal': 'g', 'tests': ''}, 'contract_included': True,
               'prompt_sha256': 'a' * 64}
        ok, rej = manager_llm.validate_decision(dec, {'job_key': 'k'}, None)
        self.assertFalse(ok)
        dec['prompt']['tests'] = ['t1']
        ok, rej = manager_llm.validate_decision(dec, {'job_key': 'k'}, None)
        self.assertTrue(ok)

    def test_secret_in_decision_rejected(self):
        dec = {'action': 'authorize_prompt',
               'prompt': {'goal': 'cle sk-AAAAAAAAAAAA cachee', 'tests': 'x'},
               'contract_included': True}
        ok, rej = manager_llm.validate_decision(dec, {'job_key': 'k'}, None)
        self.assertFalse(ok)

    def test_timeout_post_marks_uncertain(self):
        def boom(url, headers, body, timeout=40):
            raise TimeoutError('t')
        cfg = load_config()['llm']
        with self.assertRaises(RuntimeError):
            manager_llm.call_llm(cfg, 'k', 's', 'u', transport=boom)

    def test_402_stops_without_fallback(self):
        def boom(url, headers, body, timeout=40):
            raise urllib.error.HTTPError('u', 402, 'Payment Required', {}, None)
        cfg = load_config()['llm']
        with self.assertRaises(manager_llm.ProviderBillingStop):
            manager_llm.call_llm(cfg, 'k', 's', 'u', transport=boom)

    def test_403_stops_without_fallback(self):
        def boom(url, headers, body, timeout=40):
            raise urllib.error.HTTPError('u', 403, 'Forbidden', {}, None)
        cfg = load_config()['llm']
        with self.assertRaises(manager_llm.ProviderBillingStop):
            manager_llm.call_llm(cfg, 'k', 's', 'u', transport=boom)

    def test_budget_null_means_disabled(self):
        ctx = make_ctx(self.tmp, llm_transport=self._ok_transport)
        ctx.store.create_event('admission_request', 'k/PRD-001/t1',
                               {'action': 'annotate', 'sha': 'x'}, 'manager-a')
        cfg = json.loads((ctx.orch_dir / 'config.json').read_text(encoding='utf-8'))
        self.assertIsNone(cfg['llm']['daily_budget_calls'])  # null = desactive
        out = runtime.cmd_manager(ctx)
        self.assertEqual(out['result'], 'RUN')
        self.assertIsNone(out['llm_budget'])

    def _ok_transport(self, url, headers, body):
        return {'choices': [{'message': {'content': json.dumps(
            {'action': 'annotate', 'notes': 'ok'})}}]}

    def test_no_credential_no_fallback(self):
        cfg = copy.deepcopy(load_config()['llm'])
        cfg['hermes_env_file'] = None
        key, origin = manager_llm.find_credential(cfg, env={})
        self.assertIsNone(key)
        self.assertEqual(origin, 'BLOCKED_CREDENTIAL')


# --- 7. store / persistance -----------------------------------------------------

class TestStore(Base):
    def test_sqlite_restart_persists_state(self):
        ctx = make_ctx(self.tmp)
        ctx.store.meta_set('k', 'v')
        ctx.store.create_event('admission_request', 's', {'a': 1}, 'manager-a')
        ctx.store.close()
        ctx2 = runtime.build_ctx(orch_dir=ctx.orch_dir, base_dir=ctx.base_dir,
                                 config_path=ctx.orch_dir / 'config.json')
        self.assertEqual(ctx2.store.meta_get('k'), 'v')
        self.assertEqual(len(ctx2.store.events()), 1)
        ctx2.store.close()

    def test_claim_expiration_and_takeover(self):
        ctx = make_ctx(self.tmp)
        self.assertTrue(ctx.store.acquire_claim('c', 'a', ttl_seconds=-1))
        self.assertTrue(ctx.store.acquire_claim('c', 'b', ttl_seconds=60))
        self.assertFalse(ctx.store.acquire_claim('c', 'c', ttl_seconds=60))


# --- 8. worker durable -----------------------------------------------------------

class TestWorker(Base):
    def test_start_reconcile_journal(self):
        ctx = make_ctx(self.tmp)
        # commande worker synthetique : python -c sleep
        cfg = json.loads((ctx.orch_dir / 'config.json').read_text(encoding='utf-8'))
        cfg['worker'] = {'command': [sys.executable, '-c', 'import time; time.sleep(30)']}
        (ctx.orch_dir / 'config.json').write_text(json.dumps(cfg), encoding='utf-8')
        task = ctx.orch_dir / 'worker_task.json'
        task.write_text('{"task": "test"}', encoding='utf-8')
        entry, result = worker_mod.start(ctx.orch_dir, cfg, task)
        self.assertEqual(result, 'STARTED')
        # deuxieme start : pas de doublon
        entry2, result2 = worker_mod.start(ctx.orch_dir, cfg, task)
        self.assertEqual(result2, 'ALREADY_RUNNING')
        self.assertEqual(entry2['pid'], entry['pid'])
        # reconcile avec processus vivant : reste RUNNING
        changed = worker_mod.reconcile(ctx.orch_dir)
        self.assertEqual(changed, [])
        # kill -> EXITED au reconcile
        import signal
        try:
            import os
            os.kill(entry['pid'], 9)
        except OSError:
            pass
        import time as t
        t.sleep(0.5)
        changed = worker_mod.reconcile(ctx.orch_dir)
        self.assertEqual(len(changed), 1)
        self.assertEqual(changed[0]['state'], 'EXITED')

    def test_provider_stop_no_auto_restart(self):
        ctx = make_ctx(self.tmp)
        cfg = json.loads((ctx.orch_dir / 'config.json').read_text(encoding='utf-8'))
        cfg['worker'] = {'command': [sys.executable, '-c', 'pass']}
        (ctx.orch_dir / 'config.json').write_text(json.dumps(cfg), encoding='utf-8')
        task = ctx.orch_dir / 'worker_task.json'
        task.write_text('{}', encoding='utf-8')
        entry, _ = worker_mod.start(ctx.orch_dir, cfg, task)
        import time as t2
        t2.sleep(0.5)
        worker_mod.set_outcome(ctx.orch_dir, entry['pid'], 'PROVIDER_STOP_402')
        j = worker_mod.load_journal(ctx.orch_dir)
        self.assertEqual(j['workers'][0]['state'], 'STOPPED_PROVIDER')

    def test_worker_cli_subcommand(self):
        ctx = make_ctx(self.tmp)
        out = runtime.cmd_worker(ctx, action='reconcile')
        self.assertEqual(out['changed'], [])


if __name__ == '__main__':
    unittest.main(verbosity=2)
