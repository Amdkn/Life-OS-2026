"""Prepare complete category bundles and submit bounded Jules jobs.
Default is LOCAL preparation, never network mutation. No daemon, no auto-merge.
"""
import argparse,datetime,hashlib,json,os,re,sys,urllib.request,urllib.parse
from pathlib import Path
from contextlib import contextmanager
BASE=Path(__file__).resolve().parents[1]
API='https://jules.googleapis.com/v1alpha/'
SOURCE='sources/github/Amdkn/Life-OS-2026'
TERMINAL={'COMPLETED','FAILED'}
DEPS={0:[],1:[],4:[],2:[1],3:[0,1,4],7:[1,2],6:[1,2,4],5:[0,1,2,3,4],8:[3,5,6,7],9:[6,7,8]}
ROOT_SLICES={1:('PRD-011','server/blackboard/, src/lib/blackboard/, tests/blackboard/. Ownership package.json et lockfile pour le socle serveur seulement. Ne pas modifier les vues, stores metier ou routes globales.'),4:('PRD-041','src/types/frameworks.ts, src/config/vessels.config.ts, tests/frameworks/. Ne pas modifier package.json, lockfile, sidebar, header, vues ou stores partages. Utiliser un runner deja present ou un test Node sans nouvelle dependance.')}
def digest(text):return hashlib.sha256(text.encode()).hexdigest()
def category(s):
 title=s.get('title','')
 m=re.search(r'LifeOS:C(\d+)\b',title)
 if m:return int(m.group(1))
 m=re.search(r'PRD-(\d{3})\b',title)
 return int(m.group(1))//10 if m else None
def choose(requested,sessions,integrated):
 active=[s for s in sessions if s.get('state') not in TERMINAL]
 local=[s for s in active if s.get('sourceContext',{}).get('source')==SOURCE]
 cats={category(s) for s in local}
 if None in cats:raise ValueError('Unclassified active Life OS session: reconcile before submitting')
 if len(requested)!=len(set(requested)):raise ValueError('Duplicate requested category')
 if any(c not in DEPS for c in requested):raise ValueError('Unknown category')
 result=[]
 for c in requested:
  if c in cats:raise ValueError(f'Category {c} already active: resume existing session')
  if not set(DEPS[c])<=set(integrated):raise ValueError(f'Category {c} dependencies not integrated: {DEPS[c]}')
  if any(category(s)==c and s.get('sourceContext',{}).get('source')==SOURCE and s.get('title','').startswith('LifeOS:C') for s in sessions):raise ValueError(f'Category {c} already submitted historically: review outcome, no automatic replay')
  cats.add(c);result.append(c)
 if len(cats)>3:raise ValueError('More than three active program categories')
 if len(active)+len(result)>15:raise ValueError('Account concurrent ceiling exceeded including waiting sessions')
 return result
class Client:
 def __init__(self):
  key=os.environ.get('JULES_API_KEY')
  if not key:
   p=Path.home()/'.gemini/config/mcp_config.json'
   e=json.loads(p.read_text(encoding='utf-8'))['mcpServers']['jules']['env'];key=e.get('JULES_API_KEY') or e.get('GOOGLE_JULES_API_KEY')
  if not key or key.startswith('${'):raise ValueError('Credential missing; never print secrets')
  self.key=key
 def call(self,route,payload=None):
  data=None if payload is None else json.dumps(payload).encode()
  req=urllib.request.Request(API+route,data=data,headers={'X-Goog-Api-Key':self.key,'Content-Type':'application/json'})
  with urllib.request.urlopen(req,timeout=40) as r:return json.load(r)
 def listing(self,kind):
  rows=[];token='';seen=set()
  for _ in range(50):
   q={'pageSize':100}
   if token:q['pageToken']=token
   d=self.call(kind+'?'+urllib.parse.urlencode(q));rows.extend(d.get(kind,[]));token=d.get('nextPageToken','')
   if not token:return rows
   if token in seen:raise ValueError('Repeated page token')
   seen.add(token)
  raise ValueError('Incomplete pagination: refuse submission')
def prepare():
 from validate_briefs import validate
 docs={p.relative_to(BASE).as_posix():p.read_text(encoding='utf-8') for d in BASE.glob('categorie-*') for p in d.glob('*.md')}
 errors,ids=validate(docs)
 if errors:raise ValueError('Document checks failed: '+json.dumps(errors,ensure_ascii=False))
 common=(BASE/'CONTRAT-COMMUN.md').read_text(encoding='utf-8')
 out=BASE/'lots';out.mkdir(exist_ok=True)
 rows=[]
 for c in range(10):
  directory=next(BASE.glob(f'categorie-{c}-*'))
  files=sorted(directory.glob('PRD-*.md'))
  parts=[f'# Mandat complet catégorie {c}\n\nTous les PRD suivent. Ne relancer aucun travail déjà intégré. Implémenter par tranches testables en respectant les dépendances. Livrer une PR, jamais merge/push main ni déploiement. Les chemins locaux cités dans les anciennes sources sont inaccessibles sur la VM : ne pas inventer leur contenu. Les correctifs joints priment sur la version distante antérieure.\n',common]
  for p in files:parts.extend([f'\n---\n## SOURCE : delegation-a-jules/{p.relative_to(BASE).as_posix()}\n',p.read_text(encoding='utf-8')])
  text='\n'.join(parts);target=out/f'CATEGORIE-{c}.md';target.write_text(text,encoding='utf-8')
  rows.append({'category':c,'depends_on_categories':DEPS[c],'prd_files':[p.relative_to(BASE).as_posix() for p in files],'prompt_file':target.relative_to(BASE).as_posix(),'sha256':digest(text),'status':'PREPARED_NOT_SUBMITTED'})
 manifest={'source':SOURCE,'max_active_categories':3,'provider_concurrent_ceiling':15,'quota_remaining':'UNKNOWN','categories':rows,'integration_receipts':{},'note':'Category graph is conservative admission policy; per-PRD dependencies still apply. No automatic merge.'}
 (out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
 return {'categories':len(rows),'prds':sum(len(r['prd_files']) for r in rows),'manifest':str(out/'manifest.json'),'remote_mutations':0}
@contextmanager
def lock(path):
 # Atomic exclusive file; a crash leaves it for explicit reconciliation, never TTL auto-steal.
 fd=os.open(str(path),os.O_CREAT|os.O_EXCL|os.O_WRONLY)
 try:os.write(fd,str(os.getpid()).encode());os.close(fd);yield
 finally:path.unlink(missing_ok=True)
def save(path,state):
 tmp=path.with_suffix('.tmp');tmp.write_text(json.dumps(state,ensure_ascii=False,indent=2),encoding='utf-8');os.replace(tmp,path)
def verify_readback(exact,title,accept_provider_environment=False):
 if exact.get('title')!=title or exact.get('sourceContext',{}).get('source')!=SOURCE:raise ValueError('Readback target mismatch')
 context=exact.get('sourceContext',{})
 if context.get('githubRepoContext',{}).get('startingBranch')!='main':raise ValueError('Readback branch mismatch')
 env=context.get('environmentVariablesEnabled','UNKNOWN')
 if env is not False and not accept_provider_environment:raise ValueError('Environment disabled not verified: explicit acceptance required')
 return {'status':'SUBMITTED_VERIFIED','provider_state':exact.get('state'),'environment_variables_enabled_observed':env,'environment_warning_accepted':accept_provider_environment,'automation_requested':'AUTO_CREATE_PR','plan_approval_requested':False,'automation_readback':'INPUT_ONLY_NOT_VERIFIABLE','readback_at':datetime.datetime.now(datetime.timezone.utc).isoformat()}
def submit(cats,accept_provider_environment=False):
 manifest=json.loads((BASE/'lots/manifest.json').read_text(encoding='utf-8'))
 rows={r['category']:r for r in manifest['categories']}
 # No boolean/hand-written integration auto-trust. Initial independent categories only.
 if any(c not in ROOT_SLICES for c in cats):raise ValueError('Initial dispatcher admits only root slices PRD-011 and PRD-041. Other slices require verified prerequisite receipts.')
 audit=BASE/'audit';audit.mkdir(exist_ok=True);statefile=audit/'dispatch-state.json'
 with lock(audit/'dispatch.lock'):
  state=json.loads(statefile.read_text(encoding='utf-8')) if statefile.exists() else {'jobs':{}}
  if any(j.get('status') in {'SUBMITTING','UNCERTAIN'} for j in state['jobs'].values()):raise ValueError('Uncertain POST: reconcile exact session before retry')
  client=Client();sources=client.listing('sources')
  if SOURCE not in {s.get('name') for s in sources}:raise ValueError('Exact repository not connected')
  sessions=client.listing('sessions');choose(cats,sessions,[])
  for c in cats:
   if str(c) in state['jobs']:raise ValueError('Existing local receipt: no duplicate submission')
   r=rows[c];text=(BASE/r['prompt_file']).read_text(encoding='utf-8')
   if digest(text)!=r['sha256']:raise ValueError('Bundle hash mismatch')
   # Refresh account inventory immediately before every POST.
   fresh=client.listing('sessions');choose([c],fresh,[])
   prd,scope=ROOT_SLICES[c]
   title=f'LifeOS:C{c} | {prd} tranche racine | audit 2026-09-12'
   text=(f'MANDAT EXECUTABLE DE CETTE SESSION : {prd} uniquement, tranche racine independante. Les autres PRD joints sont le CONTEXTE COMPLET de la categorie, pas des travaux autorises dans cette tranche. Scope exclusif : {scope}\nLivrer une PR fonctionnelle et testee pour cette tranche seulement. Ne pas attendre les PRD consommateurs ; ne pas creer leurs implementations de remplacement. Expliciter les exigences de la categorie restant non couvertes. Pas de merge ni de deploiement.\n\n'+text)
   payload={'title':title,'prompt':text,'sourceContext':{'source':SOURCE,'githubRepoContext':{'startingBranch':'main'},'environmentVariablesEnabled':False},'automationMode':'AUTO_CREATE_PR','requirePlanApproval':False}
   state['jobs'][str(c)]={'status':'SUBMITTING','title':title,'sha256':r['sha256'],'at':datetime.datetime.now(datetime.timezone.utc).isoformat()};save(statefile,state)
   try:
    created=client.call('sessions',payload);name=created.get('name','')
    if not re.fullmatch(r'sessions/\d+',name):raise ValueError('Malformed returned session name')
    state['jobs'][str(c)]['session']=name;save(statefile,state)
    exact=client.call(name)
    state['jobs'][str(c)].update(verify_readback(exact,title,accept_provider_environment));save(statefile,state)
   except Exception:
    state['jobs'][str(c)]['status']='UNCERTAIN';save(statefile,state);raise
  return state
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--submit',help='Explicit categories e.g. 1,4. Creates remote sessions. Without it only prepares files.');p.add_argument('--accept-provider-environment',action='store_true',help='Explicit informed acceptance: environment disabling is not guaranteed by this API.');a=p.parse_args()
 try:print(json.dumps(submit([int(x) for x in a.submit.split(',')],a.accept_provider_environment) if a.submit else prepare(),ensure_ascii=False,indent=2))
 except Exception as e:print(type(e).__name__+': '+str(e),file=sys.stderr);sys.exit(1)
