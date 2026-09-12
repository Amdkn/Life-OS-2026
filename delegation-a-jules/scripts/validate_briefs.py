"""Limited document checks, not application tests or remote launch approval."""
from pathlib import Path
import json,re,sys
BASE=Path(__file__).resolve().parents[1]
NAMES=['PRD-12WY-SQLITE-GLASSMORPHISM.md','PRD-002-12WY-VISION-SOLARPUNK.md','PRD-003-12WY-PLANNING-OBJECTIFS.md','PRD-004-12WY-PROCESS-CONTROL-TACTICS.md','PRD-005-12WY-MEASUREMENT-85PERCENT.md','PRD-006-12WY-TIME-USE-BLOCKS.md','README.md']
def validate(docs):
 errors=[]
 for n in NAMES:
  if n not in docs:errors.append('missing '+n);continue
  t=docs[n]
  for bad in ['garantit mathématiquement','Il intègre en dur','latence sub-milliseconde','résilience 100% offline','IN_PROGRESS en permanence']:
   if bad in t:errors.append(n+': forbidden '+bad)
  if n!='README.md':
   for required in ['## Acceptation fonctionnelle','## Contrat de livraison','Remplacer' if n.startswith('PRD-003') else 'npm run lint','npm run build']:
    if required not in t:errors.append(n+': missing '+required)
 for link in re.findall(r'\]\(([^)]+\.md)\)',docs.get('README.md','')):
  if link not in docs:errors.append('broken brief link '+link)
 return errors

def main():
 docs={n:(BASE/n).read_text(encoding='utf-8') for n in NAMES if (BASE/n).is_file()}
 errors=validate(docs)
 for source in ['vue.html','package.json','src/lib/idb.ts','src/lib/ld-router.ts','src/lib/db/core-db.ts','src/apps/twelve-week/hooks/useWeeklyScore.ts','src/apps/twelve-week/components/TimeUseMatrix.tsx']:
  if not (BASE.parent/source).is_file():errors.append('missing existing source '+source)
 if '--self-test' in sys.argv:
  assert not errors,errors
  bad=dict(docs);bad[NAMES[4]]+='\ngarantit mathématiquement'
  assert validate(bad),'false guarantee not rejected'
  bad=dict(docs);del bad[NAMES[0]]
  assert validate(bad),'missing PRD not rejected'
  bad=dict(docs);bad['README.md']+='\n[x](absent.md)'
  assert validate(bad),'broken link not rejected'
  print(json.dumps({'self_tests_passed':3,'scope':'negative document mutations only'}));return 0
 print(json.dumps({'document_checks':'FAIL' if errors else 'PASS','errors':errors,'application_tests':'NOT_RUN','remote_availability':'NOT_VERIFIED','launch_authorized':False},indent=2));return 1 if errors else 0
if __name__=='__main__':sys.exit(main())
