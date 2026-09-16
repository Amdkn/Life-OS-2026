"""Adaptateur sur delegation-a-jules/scripts/dispatch_batches.Client.

Le module existant est importe par chemin de fichier (il n'est pas un
package). L'adaptateur borne les routes autorisees (GET sessions/activites
pagines, POST sessions, POST sessions/{id}:sendMessage), ne touche jamais a
la cle (elle reste dans le Client existant, jamais lue ni affichee ici) et
n'expose aucun secret dans ses erreurs.
"""
import importlib.util
import re
import sys
from pathlib import Path

SESSION_NAME_RE = re.compile(r'^sessions/\d+$')


class AdapterError(Exception):
    pass


def load_dispatch_module(scripts_dir):
    p = Path(scripts_dir) / 'dispatch_batches.py'
    if not p.is_file():
        raise AdapterError('dispatch_batches.py introuvable: %s' % p)
    spec = importlib.util.spec_from_file_location('dispatch_batches_runtime_adapter', str(p))
    mod = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = mod
    spec.loader.exec_module(mod)
    return mod


def redact(text, *secrets):
    out = str(text)
    for s in secrets:
        if s:
            out = out.replace(s, '[REDACTED]')
    return out


class SafeClient:
    """Surface bornee sur le Client existant. transport = objet avec
    .call(route, payload=None) et .listing(kind) (duck-typing du Client de
    dispatch_batches ; les tests injectent un transport synthetique etiquete)."""

    def __init__(self, dispatch_module, transport=None, activities_pages_max=50):
        self.d = dispatch_module
        self.source = dispatch_module.SOURCE
        self.terminal_states = set(getattr(dispatch_module, 'TERMINAL', ('COMPLETED', 'FAILED')))
        self.activities_pages_max = activities_pages_max
        if transport is None:
            transport = dispatch_module.Client()
        self.inner = transport

    def _guard(self, route):
        if route == 'sessions' or SESSION_NAME_RE.match(route) or \
           SESSION_NAME_RE.match(route.split(':')[0]):
            return route
        raise AdapterError('Route non autorisee: %r' % route)

    def list_sessions(self):
        return self.inner.listing('sessions')

    def get_session(self, name):
        if not SESSION_NAME_RE.match(name):
            raise AdapterError('Nom de session invalide: %r' % name)
        return self.inner.call(name)

    def create_session(self, payload):
        return self.inner.call('sessions', payload)

    def send_message(self, name, text):
        if not SESSION_NAME_RE.match(name):
            raise AdapterError('Nom de session invalide: %r' % name)
        return self.inner.call(name + ':sendMessage', {'prompt': text})

    def list_activities(self, name, max_pages=None):
        """GET activities pagine, pages bornees. Retourne (rows, complete)."""
        cap = max_pages or self.activities_pages_max
        rows, token, seen = [], '', set()
        for _ in range(cap):
            q = {'pageSize': 100}
            if token:
                q['pageToken'] = token
            from urllib.parse import urlencode
            d = self.inner.call(name + '/activities?' + urlencode(q))
            rows.extend(d.get('activities', []))
            token = d.get('nextPageToken', '')
            if not token:
                return rows, True
            if token in seen:
                raise AdapterError('Token de page activities repete')
            seen.add(token)
        return rows, False