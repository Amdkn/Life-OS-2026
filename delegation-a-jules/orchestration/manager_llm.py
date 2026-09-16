"""Raisonnement manager via OpenRouter, modele exact z-ai/glm-5.3-flash.

Appel unique borne (max_tokens configures, budget/jour local explicite),
reponse attendue en JSON structure valide ; un appel ne lance jamais une
commande libre. Cle OpenRouter depuis l'environnement existant ou un fichier
Hermes .env lu en interne : jamais affichee, jamais ecrite. Sans cle :
BLOCKED_CREDENTIAL, zero fallback.
"""
import json
import os
import re
import urllib.error
import urllib.request
from pathlib import Path

SECRET_PATTERNS = (
    re.compile(r'sk-[A-Za-z0-9_-]{8,}'),
    re.compile(r'ck_[A-Za-z0-9_-]{6,}'),
    re.compile(r'ak_[A-Za-z0-9_-]{6,}'),
    re.compile(r'X-Goog-Api-Key'),
)


class CredentialMissing(Exception):
    pass


class BudgetExhausted(Exception):
    pass


class ProviderBillingStop(Exception):
    """HTTP 402/403 du fournisseur : arret explicite, zero contournement."""

    def __init__(self, code):
        super().__init__('HTTP %s : arret explicite du fournisseur' % code)
        self.code = code


class InvalidDecision(Exception):
    def __init__(self, reason):
        super().__init__(reason)
        self.reason = reason


def find_credential(cfg, env=None):
    """Retourne (cle, origine) ou (None, raison). Ne journalise jamais la cle."""
    env = os.environ if env is None else env
    key = env.get(cfg['env_key'])
    if key:
        return key, 'env'
    hf = cfg.get('hermes_env_file')
    if hf:
        p = Path(hf).expanduser()
        if p.is_file():
            for line in p.read_text(encoding='utf-8', errors='replace').splitlines():
                line = line.strip()
                if line.startswith(cfg['env_key'] + '='):
                    val = line.split('=', 1)[1].strip().strip('"\'')
                    if val and not val.startswith('${'):
                        return val, 'hermes_env_file'
    return None, 'BLOCKED_CREDENTIAL'


def real_llm_transport(url, headers, body, timeout=40):
    req = urllib.request.Request(url, data=body, headers=headers)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.load(r)


def call_llm(cfg, key, system, user, transport=None):
    """Un appel borne. transport injectable pour tests synthetiques."""
    if transport is None:
        transport = real_llm_transport
    body = {
        'model': cfg['model'],
        'max_tokens': int(cfg['max_tokens']),
        'temperature': float(cfg.get('temperature', 0.0)),
        'messages': [
            {'role': 'system', 'content': system},
            {'role': 'user', 'content': user},
        ],
    }
    headers = {
        'Authorization': 'Bearer ' + key,
        'Content-Type': 'application/json',
    }
    try:
        data = transport(cfg['base_url'], headers, json.dumps(body).encode('utf-8'))
    except urllib.error.HTTPError as e:
        if e.code in (402, 403):
            raise ProviderBillingStop(e.code)
        raise RuntimeError(redact_text(str(e), key))
    except Exception as e:
        raise RuntimeError(redact_text(str(e), key))
    try:
        content = data['choices'][0]['message']['content']
    except (KeyError, IndexError, TypeError):
        raise InvalidDecision('reponse LLM sans choices[0].message.content')
    return content


def redact_text(text, *secrets):
    out = str(text)
    for s in secrets:
        if s:
            out = out.replace(s, '[REDACTED]')
    return out


def parse_decision(content):
    """Extrait le JSON de la reponse (tolere les fences markdown)."""
    text = content.strip()
    m = re.search(r'```(?:json)?\s*(.*?)\s*```', text, re.DOTALL)
    if m:
        text = m.group(1)
    try:
        d = json.loads(text)
    except ValueError as e:
        raise InvalidDecision('JSON invalide: %s' % e)
    if not isinstance(d, dict):
        raise InvalidDecision('decision non objet')
    return d


ALLOWED_ACTIONS = ('authorize_prompt', 'authorize_message', 'request_review', 'annotate')


def validate_decision(d, job, action_hint):
    """Validation stricte cote code. Retourne (ok, rejet|None)."""
    action = d.get('action')
    if action not in ALLOWED_ACTIONS:
        return False, 'action invalide: %r' % (action,)
    if action in ('authorize_prompt', 'authorize_message'):
        if job is None:
            return False, 'job_key inconnu pour une autorisation'
        if action_hint and action != action_hint:
            return False, 'action %r ne correspond pas a la demande %r' % (action, action_hint)
        prompt = d.get('prompt')
        if not isinstance(prompt, dict):
            return False, 'prompt manquant'
        if not str(prompt.get('goal', '')).strip():
            return False, 'prompt.goal vide'
        tests = prompt.get('tests')
        if isinstance(tests, list):
            if not tests:
                return False, 'prompt.tests vide'
        elif not str(tests or '').strip():
            return False, 'prompt.tests vide'
        if d.get('contract_included') is not True:
            return False, 'contract_included doit etre true (contrat commun obligatoire)'
        blob = json.dumps(d, ensure_ascii=False)
        for pat in SECRET_PATTERNS:
            if pat.search(blob):
                return False, 'motif de secret detecte dans la decision: rejetee'
    if action_hint in ('authorize_prompt', 'authorize_message') and \
            action in ('request_review', 'annotate'):
        blob = json.dumps(d, ensure_ascii=False)
        for pat in SECRET_PATTERNS:
            if pat.search(blob):
                return False, 'motif de secret detecte dans la decision: rejetee'
    return True, None