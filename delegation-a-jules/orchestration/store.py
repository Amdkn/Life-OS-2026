"""Etat transactionnel SQLite du runtime d'orchestration. Stdlib uniquement.

Toutes les horodatages sont UTC ISO-8601. Les claims sont atomiques avec
expiration et reprise : un claim expire peut etre repris par un autre owner
(BEGIN IMMEDIATE). Aucun compteur de quota fictif n'est ecrit ici : le champ
quota reste UNKNOWN tant que l'API ne l'expose pas.
"""
import datetime
import json
import sqlite3

SCHEMA = """
CREATE TABLE IF NOT EXISTS meta(k TEXT PRIMARY KEY, v TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS jobs(
  job_key TEXT PRIMARY KEY, prd_id TEXT NOT NULL, category INTEGER NOT NULL,
  tranche TEXT NOT NULL, repo TEXT NOT NULL, path TEXT NOT NULL,
  scope TEXT NOT NULL, depends_on TEXT NOT NULL, manager TEXT NOT NULL,
  item_status TEXT, status TEXT NOT NULL, blocked_reason TEXT,
  session_name TEXT, prompt_sha256 TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS submissions(
  job_key TEXT NOT NULL, attempt INTEGER NOT NULL, kind TEXT NOT NULL,
  status TEXT NOT NULL, title TEXT, marker TEXT, session_name TEXT,
  at TEXT NOT NULL, detail TEXT,
  PRIMARY KEY(job_key, attempt, kind)
);
CREATE TABLE IF NOT EXISTS sessions_observed(
  session_name TEXT PRIMARY KEY, state TEXT, title TEXT, category INTEGER,
  prd_hint TEXT, source TEXT, branch TEXT, env_observed TEXT,
  activity_cursor INTEGER NOT NULL DEFAULT 0, pr_refs TEXT, observed_at TEXT
);
CREATE TABLE IF NOT EXISTS events(
  id INTEGER PRIMARY KEY AUTOINCREMENT, kind TEXT NOT NULL, subject TEXT NOT NULL,
  payload TEXT, status TEXT NOT NULL, assignee TEXT, created_at TEXT NOT NULL,
  processed_at TEXT, note TEXT
);
CREATE TABLE IF NOT EXISTS decisions(
  id INTEGER PRIMARY KEY AUTOINCREMENT, event_id INTEGER, manager TEXT, model TEXT,
  ok INTEGER NOT NULL, action TEXT, job_key TEXT, prompt_sha256 TEXT,
  payload TEXT, rejection TEXT, consumed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS cadences(
  name TEXT PRIMARY KEY, interval_minutes INTEGER NOT NULL,
  consecutive_useful INTEGER NOT NULL DEFAULT 0, last_run_at TEXT,
  last_outcome TEXT, note TEXT
);
CREATE TABLE IF NOT EXISTS claims(
  claim_key TEXT PRIMARY KEY, owner TEXT NOT NULL, expires_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS llm_budget(day TEXT PRIMARY KEY, calls INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS outbox(
  id INTEGER PRIMARY KEY AUTOINCREMENT, at TEXT NOT NULL, kind TEXT NOT NULL,
  level TEXT NOT NULL, subject TEXT NOT NULL, detail TEXT
);
CREATE TABLE IF NOT EXISTS receipts(
  receipt_id TEXT PRIMARY KEY, prd_id TEXT NOT NULL, kind TEXT NOT NULL,
  source TEXT NOT NULL, approved_by TEXT, at TEXT, payload TEXT
);
CREATE INDEX IF NOT EXISTS idx_events_pending ON events(status, assignee);
CREATE INDEX IF NOT EXISTS idx_outbox_kind ON outbox(kind, at);
"""

# Statuts de job lies a une session observee : recalcules par la reconciliation,
# jamais ecrases par la reclassification statique des jobs sans session.
JOB_ACTIVE_LINKED = (
    'PLANNED_CREATE', 'PLANNED_MESSAGE', 'SUBMITTING', 'SUBMITTED', 'UNCERTAIN',
    'ACTIVE', 'AWAITING_PLAN_APPROVAL', 'AWAITING_USER_FEEDBACK',
    'SESSION_TERMINAL', 'PR_PUBLISHED', 'BLOCKED_REVIEW',
)


def utcnow():
    return datetime.datetime.now(datetime.timezone.utc)


def iso(dt):
    return dt.astimezone(datetime.timezone.utc).isoformat()


def parse_iso(s):
    return datetime.datetime.fromisoformat(s)


class Store:
    def __init__(self, db_path, now_fn=None):
        self.now_fn = now_fn or utcnow
        self.conn = sqlite3.connect(str(db_path), isolation_level=None)
        self.conn.row_factory = sqlite3.Row
        self.conn.executescript(SCHEMA)
        for name, interval in (
            ('manager', 1), ('gatekeeper', 1), ('supervisor', 5), ('prompt_library', 10),
        ):
            self.conn.execute(
                'INSERT OR IGNORE INTO cadences(name, interval_minutes) VALUES(?,?)',
                (name, interval))

    def close(self):
        self.conn.close()

    def now(self):
        return self.now_fn()

    def now_iso(self):
        return iso(self.now())

    # --- meta ---------------------------------------------------------------
    def meta_set(self, k, v):
        self.conn.execute(
            'INSERT INTO meta(k,v) VALUES(?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v',
            (k, v if isinstance(v, str) else json.dumps(v, ensure_ascii=False)))

    def meta_get(self, k, default=None):
        row = self.conn.execute('SELECT v FROM meta WHERE k=?', (k,)).fetchone()
        return row['v'] if row else default

    # --- claims atomiques (expiration + reprise) ----------------------------
    def acquire_claim(self, key, owner, ttl_seconds):
        now = self.now()
        exp = iso(now + datetime.timedelta(seconds=ttl_seconds))
        self.conn.execute('BEGIN IMMEDIATE')
        try:
            row = self.conn.execute(
                'SELECT expires_at FROM claims WHERE claim_key=?', (key,)).fetchone()
            if row is not None and parse_iso(row['expires_at']) > now:
                self.conn.execute('ROLLBACK')
                return False
            self.conn.execute(
                'INSERT INTO claims(claim_key,owner,expires_at) VALUES(?,?,?) '
                'ON CONFLICT(claim_key) DO UPDATE SET owner=excluded.owner, '
                'expires_at=excluded.expires_at',
                (key, owner, exp))
            self.conn.execute('COMMIT')
            return True
        except Exception:
            self.conn.execute('ROLLBACK')
            raise

    def release_claim(self, key):
        self.conn.execute('DELETE FROM claims WHERE claim_key=?', (key,))

    # --- jobs ---------------------------------------------------------------
    def upsert_job(self, item, repo):
        now = self.now_iso()
        self.conn.execute(
            '''INSERT INTO jobs(job_key,prd_id,category,tranche,repo,path,scope,depends_on,
               manager,item_status,status,blocked_reason,session_name,prompt_sha256,
               created_at,updated_at)
               VALUES(?,?,?,?,?,?,?,?,?,?,'PENDING_VALIDATE',NULL,NULL,NULL,?,?)
               ON CONFLICT(job_key) DO UPDATE SET prd_id=excluded.prd_id,
               category=excluded.category, path=excluded.path, scope=excluded.scope,
               depends_on=excluded.depends_on, manager=excluded.manager,
               item_status=excluded.item_status, updated_at=excluded.updated_at''',
            (item['job_key'], item['id'], item['category'], item.get('tranche', 't1'),
             repo, item['path'], json.dumps(item.get('write_scope', [])),
             json.dumps(item.get('depends_on', [])), item['manager'],
             item.get('status'), now, now))

    def jobs(self):
        rows = self.conn.execute(
            'SELECT * FROM jobs ORDER BY category, prd_id, tranche').fetchall()
        return [dict(r) for r in rows]

    def job(self, job_key):
        r = self.conn.execute('SELECT * FROM jobs WHERE job_key=?', (job_key,)).fetchone()
        return dict(r) if r else None

    def set_job(self, job_key, status=None, blocked_reason=None, session_name=None,
                prompt_sha256=None):
        cur = self.conn.execute(
            'UPDATE jobs SET status=COALESCE(?,status), '
            'blocked_reason=COALESCE(?,blocked_reason), '
            'session_name=COALESCE(?,session_name), '
            'prompt_sha256=COALESCE(?,prompt_sha256), updated_at=? WHERE job_key=?',
            (status, blocked_reason, session_name, prompt_sha256, self.now_iso(), job_key))
        return cur.rowcount > 0

    def jobs_with_scopes(self, statuses):
        rows = self.conn.execute('SELECT job_key, status, scope FROM jobs').fetchall()
        return [(r['job_key'], json.loads(r['scope'])) for r in rows if r['status'] in statuses]

    def jobs_by_status(self):
        rows = self.conn.execute(
            'SELECT status, COUNT(*) AS n FROM jobs GROUP BY status').fetchall()
        return {r['status']: r['n'] for r in rows}

    # --- receipts d'integration (importes d'un fichier, jamais fabriques) ---
    def import_receipts(self, receipts, source):
        for r in receipts:
            self.conn.execute(
                'INSERT INTO receipts(receipt_id,prd_id,kind,source,approved_by,at,payload) '
                'VALUES(?,?,?,?,?,?,?) ON CONFLICT(receipt_id) DO UPDATE SET payload=excluded.payload',
                (r['receipt_id'], r['prd_id'], r.get('kind', 'integration'), source,
                 r.get('approved_by'), r.get('at'), json.dumps(r, ensure_ascii=False)))

    def receipt_for(self, prd_id):
        row = self.conn.execute(
            'SELECT receipt_id FROM receipts WHERE prd_id=?', (prd_id,)).fetchone()
        return row is not None

    def all_receipts(self):
        rows = self.conn.execute('SELECT prd_id, receipt_id, source FROM receipts').fetchall()
        return [dict(r) for r in rows]

    # --- ledger de soumission (SUBMITTING avant POST) ------------------------
    def next_attempt(self, job_key, kind):
        row = self.conn.execute(
            'SELECT MAX(attempt) AS m FROM submissions WHERE job_key=? AND kind=?',
            (job_key, kind)).fetchone()
        return (row['m'] or 0) + 1

    def record_submission(self, job_key, kind, attempt, status, title=None, marker=None,
                          session_name=None, detail=None):
        self.conn.execute(
            'INSERT INTO submissions(job_key,attempt,kind,status,title,marker,session_name,at,detail) '
            'VALUES(?,?,?,?,?,?,?,?,?) ON CONFLICT(job_key,attempt,kind) DO UPDATE SET '
            'status=excluded.status, title=excluded.title, marker=excluded.marker, '
            'session_name=excluded.session_name, detail=excluded.detail',
            (job_key, attempt, kind, status, title, marker, session_name,
             self.now_iso(), detail))

    def submissions(self, job_key=None, status=None):
        if job_key and status:
            rows = self.conn.execute(
                'SELECT * FROM submissions WHERE job_key=? AND status=?',
                (job_key, status)).fetchall()
        elif job_key:
            rows = self.conn.execute(
                'SELECT * FROM submissions WHERE job_key=?', (job_key,)).fetchall()
        elif status:
            rows = self.conn.execute(
                'SELECT * FROM submissions WHERE status=?', (status,)).fetchall()
        else:
            rows = self.conn.execute('SELECT * FROM submissions').fetchall()
        return [dict(r) for r in rows]

    def open_submission(self, job_key, kind, statuses=('SUBMITTING', 'UNCERTAIN')):
        marks = ','.join('?' * len(statuses))
        rows = self.conn.execute(
            f'SELECT * FROM submissions WHERE job_key=? AND kind=? AND status IN ({marks}) '
            'ORDER BY attempt DESC', (job_key, kind, *statuses)).fetchall()
        return [dict(r) for r in rows]

    def stale_submitting(self, horizon_hours):
        cut = iso(self.now() - datetime.timedelta(hours=horizon_hours))
        rows = self.conn.execute(
            "SELECT * FROM submissions WHERE status='SUBMITTING' AND at < ?",
            (cut,)).fetchall()
        return [dict(r) for r in rows]

    # --- sessions observees --------------------------------------------------
    def observe_session(self, name, state, title, category, prd_hint, source, branch,
                        env_observed, activity_cursor, pr_refs):
        self.conn.execute(
            '''INSERT INTO sessions_observed(session_name,state,title,category,prd_hint,
               source,branch,env_observed,activity_cursor,pr_refs,observed_at)
               VALUES(?,?,?,?,?,?,?,?,?,?,?)
               ON CONFLICT(session_name) DO UPDATE SET state=excluded.state,
               title=excluded.title, category=excluded.category, prd_hint=excluded.prd_hint,
               source=excluded.source, branch=excluded.branch,
               env_observed=excluded.env_observed,
               activity_cursor=MAX(excluded.activity_cursor, sessions_observed.activity_cursor),
               pr_refs=excluded.pr_refs, observed_at=excluded.observed_at''',
            (name, state, title, category, prd_hint, source, branch, env_observed,
             activity_cursor, json.dumps(pr_refs, ensure_ascii=False), self.now_iso()))

    def sessions_observed(self, source=None, active_only=False):
        rows = self.conn.execute('SELECT * FROM sessions_observed').fetchall()
        out = []
        for r in rows:
            if source and r['source'] != source:
                continue
            if active_only and r['state'] in ('COMPLETED', 'FAILED'):
                continue
            out.append(dict(r))
        return out

    # --- events --------------------------------------------------------------
    def create_event(self, kind, subject, payload, assignee):
        dup = self.conn.execute(
            "SELECT id FROM events WHERE kind=? AND subject=? AND status='pending'",
            (kind, subject)).fetchone()
        if dup:
            return None
        cur = self.conn.execute(
            "INSERT INTO events(kind,subject,payload,status,assignee,created_at) "
            "VALUES(?,?,?,'pending',?,?)",
            (kind, subject, json.dumps(payload, ensure_ascii=False), assignee, self.now_iso()))
        return cur.lastrowid

    def pending_events(self, assignees, limit=50):
        marks = ','.join('?' * len(assignees))
        rows = self.conn.execute(
            f"SELECT * FROM events WHERE status='pending' AND assignee IN ({marks}) "
            'ORDER BY id LIMIT ?', (*assignees, limit)).fetchall()
        return [dict(r) for r in rows]

    def set_event(self, event_id, status, note=None):
        processed_at = self.now_iso() if status in ('processed', 'rejected') else None
        self.conn.execute(
            'UPDATE events SET status=?, processed_at=COALESCE(?,processed_at), '
            'note=COALESCE(?,note) WHERE id=?',
            (status, processed_at, note, event_id))

    def events(self, status=None, kind=None):
        q, args = 'SELECT * FROM events', []
        if status:
            q += ' WHERE status=?'
            args.append(status)
        if kind:
            q += (' AND kind=?' if status else ' WHERE kind=?')
            args.append(kind)
        rows = self.conn.execute(q + ' ORDER BY id', args).fetchall()
        return [dict(r) for r in rows]

    def events_since(self, since_id, kind=None):
        q, args = 'SELECT * FROM events WHERE id > ?', [since_id]
        if kind:
            q += ' AND kind=?'
            args.append(kind)
        rows = self.conn.execute(q + ' ORDER BY id', args).fetchall()
        return [dict(r) for r in rows]

    # --- decisions (ledger du manager) ---------------------------------------
    def add_decision(self, event_id, manager, model, ok, action, job_key, prompt_sha,
                     payload, rejection):
        cur = self.conn.execute(
            'INSERT INTO decisions(event_id,manager,model,ok,action,job_key,prompt_sha256,'
            'payload,rejection,consumed,created_at) VALUES(?,?,?,?,?,?,?,?,?,0,?)',
            (event_id, manager, model, 1 if ok else 0, action, job_key, prompt_sha,
             json.dumps(payload, ensure_ascii=False) if payload else None,
             rejection, self.now_iso()))
        return cur.lastrowid

    def take_authorization(self, job_key, action, prompt_sha):
        """Consomme une decision ok non consommee (transactionnel)."""
        self.conn.execute('BEGIN IMMEDIATE')
        try:
            row = self.conn.execute(
                "SELECT id FROM decisions WHERE ok=1 AND consumed=0 AND job_key=? "
                'AND action=? AND (prompt_sha256 IS NULL OR prompt_sha256=?) '
                'ORDER BY id DESC LIMIT 1', (job_key, action, prompt_sha)).fetchone()
            if row is None:
                self.conn.execute('ROLLBACK')
                return None
            self.conn.execute('UPDATE decisions SET consumed=1 WHERE id=?', (row['id'],))
            self.conn.execute('COMMIT')
            return dict(row)
        except Exception:
            self.conn.execute('ROLLBACK')
            raise

    def decisions(self):
        rows = self.conn.execute('SELECT * FROM decisions ORDER BY id').fetchall()
        return [dict(r) for r in rows]

    # --- cadences ------------------------------------------------------------
    def cadence(self, name):
        r = self.conn.execute('SELECT * FROM cadences WHERE name=?', (name,)).fetchone()
        return dict(r) if r else None

    def set_cadence(self, name, interval_minutes=None, consecutive_useful=None,
                    last_run_at=None, last_outcome=None, note=None):
        self.conn.execute(
            'UPDATE cadences SET interval_minutes=COALESCE(?,interval_minutes), '
            'consecutive_useful=COALESCE(?,consecutive_useful), '
            'last_run_at=COALESCE(?,last_run_at), last_outcome=COALESCE(?,last_outcome), '
            'note=COALESCE(?,note) WHERE name=?',
            (interval_minutes, consecutive_useful, last_run_at, last_outcome, note, name))

    # --- budget LLM local ----------------------------------------------------
    def llm_calls_today(self, day):
        row = self.conn.execute('SELECT calls FROM llm_budget WHERE day=?', (day,)).fetchone()
        return row['calls'] if row else 0

    def llm_register_call(self, day, n=1):
        self.conn.execute(
            'INSERT INTO llm_budget(day,calls) VALUES(?,?) ON CONFLICT(day) DO UPDATE '
            'SET calls=calls+excluded.calls', (day, n))

    # --- outbox (signaux, pas de bruit par tick) ------------------------------
    def signal(self, kind, level, subject, detail=None, dedupe_hours=0):
        if dedupe_hours:
            cut = iso(self.now() - datetime.timedelta(hours=dedupe_hours))
            row = self.conn.execute(
                'SELECT id FROM outbox WHERE kind=? AND subject=? AND at > ?',
                (kind, subject, cut)).fetchone()
            if row:
                return None
        cur = self.conn.execute(
            'INSERT INTO outbox(at,kind,level,subject,detail) VALUES(?,?,?,?,?)',
            (self.now_iso(), kind, level, subject, detail))
        return cur.lastrowid

    def outbox_recent(self, n=20):
        rows = self.conn.execute(
            'SELECT * FROM outbox ORDER BY id DESC LIMIT ?', (n,)).fetchall()
        return [dict(r) for r in rows]

    def outbox_count_since(self, since_iso, kind=None):
        if kind:
            row = self.conn.execute(
                'SELECT COUNT(*) AS c FROM outbox WHERE at > ? AND kind=?',
                (since_iso, kind)).fetchone()
        else:
            row = self.conn.execute(
                'SELECT COUNT(*) AS c FROM outbox WHERE at > ?', (since_iso,)).fetchone()
        return row['c']