"""Registre de travail governance/work-items.json : chargement et validation.

Le registre est importe, jamais invente. Validation : ids PRD-NNN uniques,
dependances existantes sans cycle, chemin reel sous delegation-a-jules,
categorie derivee de l'id (PRD-001 est le nom historique de
PRD-12WY-SQLITE-GLASSMORPHISM), scopes avec chevauchement par prefixe/ancetre
et exclusivite globale des package.json/lockfiles.
"""
import json
import re
from pathlib import Path

MANAGERS = ('manager-a', 'manager-b', 'manager-c')
PRD_ID_RE = re.compile(r'^PRD-\d{3}$')
FILENAME_RE = re.compile(r'^(PRD-\d{3})-')
HISTORICAL_PREFIX = 'PRD-12WY-'  # PRD-001 historique
HISTORICAL_ID = 'PRD-001'
LOCKFILE_NAMES = frozenset({
    'package.json', 'package-lock.json', 'pnpm-lock.yaml', 'yarn.lock',
    'npm-shrinkwrap.json', 'bun.lockb',
})
KNOWN_ITEM_STATUS = ('pending', 'in_progress', 'blocked', 'done')


class RegistryError(Exception):
    def __init__(self, errors):
        super().__init__('; '.join(errors))
        self.errors = list(errors)


def prd_id_from_filename(name):
    m = FILENAME_RE.match(name)
    if m:
        return m.group(1)
    if name.startswith(HISTORICAL_PREFIX):
        return HISTORICAL_ID
    return None


def category_from_id(prd_id):
    n = int(prd_id[4:7])
    return n // 10


def assign_manager(category):
    return MANAGERS[category % len(MANAGERS)]


def normalize_scope(s):
    s = s.strip().replace('\\', '/')
    if s.startswith('./'):
        s = s[2:]
    return s


def lockfiles_in_scope(scopes):
    out = set()
    for s in scopes:
        parts = normalize_scope(s).rstrip('/').split('/')
        if parts[-1] in LOCKFILE_NAMES:
            out.add(parts[-1])
    return out


def scopes_overlap(scopes_a, scopes_b):
    """Prefixes identiques ou ancetres ; lockfiles exclusifs globalement."""
    la, lb = lockfiles_in_scope(scopes_a), lockfiles_in_scope(scopes_b)
    if la and lb:
        return True
    for a in scopes_a:
        for b in scopes_b:
            if a == b or a.startswith(b) or b.startswith(a):
                return True
    return False


def _detect_cycle(items):
    graph = {it['id']: list(it.get('depends_on', [])) for it in items}
    state, stack_found = {}, []
    for root in graph:
        if root in state:
            continue
        path = []
        def dfs(node):
            if node in state:
                if state[node] == 1 and node in path:
                    stack_found.append(path[path.index(node):])
                return
            state[node] = 1
            path.append(node)
            for dep in graph.get(node, []):
                dfs(dep)
            path.pop()
            state[node] = 2
        dfs(root)
    return stack_found


def load(path, base_dir):
    """Charge et valide. Retourne {'items': [...], 'errors': [...]}.

    items enrichis : job_key, manager (auto modulo3 si absent), write_scope
    normalisee. En cas d'erreur de validation, items est None.
    """
    p = Path(path)
    if not p.exists():
        return {'items': None, 'errors': ['REGISTRY_FILE_ABSENT: %s' % p]}
    errors = []
    try:
        data = json.loads(p.read_text(encoding='utf-8'))
    except (ValueError, OSError) as e:
        return {'items': None, 'errors': ['REGISTRY_UNREADABLE: %s' % e]}
    items = data.get('items')
    if not isinstance(items, list) or not items:
        return {'items': None, 'errors': ['REGISTRY_INVALID: items manquant ou vide']}
    seen = set()
    by_id = {}
    for it in items:
        if not isinstance(it, dict):
            errors.append('REGISTRY_INVALID: item non objet')
            continue
        prd = it.get('id')
        if not prd or not PRD_ID_RE.match(prd):
            errors.append('REGISTRY_INVALID: id manquant ou invalide: %r' % (prd,))
            continue
        if prd in seen:
            errors.append('REGISTRY_DUPLICATE_ID: %s' % prd)
            continue
        seen.add(prd)
        cat = it.get('category')
        if not isinstance(cat, int) or not 0 <= cat <= 9:
            errors.append('REGISTRY_INVALID: categorie hors programme (0-9) pour %s: %r'
                          % (prd, cat))
            continue
        if cat != category_from_id(prd):
            errors.append('REGISTRY_INVALID: categorie %r ne correspond pas a l\'id %s '
                          '(attendu %d)' % (cat, prd, category_from_id(prd)))
            continue
        path_rel = it.get('path')
        if not path_rel:
            errors.append('REGISTRY_INVALID: path manquant pour %s' % prd)
            continue
        f = Path(base_dir) / path_rel
        if not f.is_file():
            errors.append('REGISTRY_PATH_MISSING: %s -> %s' % (prd, path_rel))
            continue
        fname = f.name
        derived = prd_id_from_filename(fname)
        if derived != prd:
            errors.append('REGISTRY_PATH_ID_MISMATCH: %s -> %s (derive %s)'
                          % (prd, fname, derived))
            continue
        mgr = it.get('manager')
        if mgr is None:
            mgr = assign_manager(cat)
        elif mgr not in MANAGERS:
            errors.append('REGISTRY_INVALID: manager inconnu %r pour %s' % (mgr, prd))
            continue
        deps = it.get('depends_on', [])
        if not isinstance(deps, list):
            errors.append('REGISTRY_INVALID: depends_on non liste pour %s' % prd)
            continue
        scopes = it.get('write_scope', [])
        if not isinstance(scopes, list) or not scopes:
            errors.append('REGISTRY_INVALID: write_scope vide pour %s' % prd)
            continue
        st = it.get('status', 'pending')
        if st not in KNOWN_ITEM_STATUS:
            errors.append('REGISTRY_INVALID: status inconnu %r pour %s' % (st, prd))
            continue
        by_id[prd] = {
            'id': prd, 'category': cat, 'path': path_rel,
            'depends_on': [str(d) for d in deps], 'write_scope': [normalize_scope(s) for s in scopes],
            'manager': mgr, 'status': st, 'tranche': it.get('tranche', 't1'),
        }
    for prd, it in by_id.items():
        for d in it['depends_on']:
            if d not in by_id:
                errors.append('REGISTRY_MISSING_DEPENDENCY: %s depend de %s absent' % (prd, d))
    for cyc in _detect_cycle(list(by_id.values())):
        errors.append('REGISTRY_CYCLE: ' + ' -> '.join(cyc))
    if errors:
        return {'items': None, 'errors': errors}
    return {'items': list(by_id.values()), 'errors': []}


def inventory(base_dir, max_category=9):
    """Inventorie les PRD reels sous categorie-0..max_category du depot."""
    base = Path(base_dir)
    found = []
    for d in sorted(base.glob('categorie-*')):
        m = re.match(r'categorie-(\d+)-', d.name)
        if not m or int(m.group(1)) > max_category:
            continue
        for f in sorted(d.glob('PRD-*.md')):
            found.append({'path': d.name + '/' + f.name,
                          'prd_id': prd_id_from_filename(f.name)})
    return found