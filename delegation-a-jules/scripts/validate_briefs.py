"""Validate all ten categories. Document validity != runtime readiness."""
from pathlib import Path
import json,re,sys,unittest
BASE=Path(__file__).resolve().parents[1]
ALIAS='PRD-12WY-SQLITE-GLASSMORPHISM.md'
def prd_id(name):
 if name==ALIAS:return 'PRD-001'
 m=re.match(r'^(PRD-\d{3})-',name)
 return m.group(1) if m else None
def validate(docs):
 errors=[];ids={};categories=set()
 for name,text in docs.items():
  p=Path(name)
  if p.name.startswith('PRD-'):
   pid=prd_id(p.name)
   if not pid:errors.append('invalid identifier '+name);continue
   if pid in ids:errors.append('duplicate '+pid)
   ids[pid]=name
   cm=re.match(r'categorie-(\d+)-',p.parts[0])
   if not cm:errors.append('PRD outside category '+name);continue
   cat=int(cm.group(1));categories.add(cat)
   if int(pid[-3:])//10!=cat:errors.append('category mismatch '+name)
   for command in ['npm run lint','npm run build']:
    if command not in text:errors.append('missing '+command+' in '+name)
   if not re.search(r'acceptation|critères|tests? fonctionnel',text,re.I):errors.append('missing acceptance '+name)
   if 'CONTRAT-COMMUN.md' not in text:errors.append('missing common contract '+name)
  if re.search(r'^\s*pm run\b',text,re.M):errors.append('broken npm command '+name)
  if '\x08' in text or '\x0b' in text:errors.append('control characters '+name)
  for link in re.findall(r'\]\(([^)]+)\)',text):
   link=link.split('#')[0]
   if not link or re.match(r'\w+://',link) or link.startswith('mailto:'):continue
   target=(BASE/p.parent/link).resolve()
   if target.suffix=='.md' and not target.exists():errors.append('broken link '+name+' -> '+link)
 if categories!=set(range(10)):errors.append('categories incomplete '+str(sorted(categories)))
 return errors,ids
class NegativeTests(unittest.TestCase):
 def fixture(self):
  return {f'categorie-{c}-test/PRD-{c*10+1:03d}-TEST.md':'npm run lint\nnpm run build\n## Acceptation\nCONTRAT-COMMUN.md' for c in range(10)}
 def test_valid(self):self.assertEqual(validate(self.fixture())[0],[])
 def test_missing_category(self):
  d=self.fixture();d.pop(next(iter(d)));self.assertTrue(validate(d)[0])
 def test_broken_command(self):
  d=self.fixture();k=next(iter(d));d[k]=d[k].replace('npm run lint','pm run lint');self.assertTrue(validate(d)[0])
 def test_duplicate(self):
  d=self.fixture();d['categorie-0-test/PRD-001-OTHER.md']=next(iter(d.values()));self.assertTrue(validate(d)[0])
 def test_misplaced(self):
  d=self.fixture();d['categorie-2-test/PRD-095-WRONG.md']=next(iter(d.values()));self.assertTrue(validate(d)[0])
 def test_link(self):
  d=self.fixture();k=next(iter(d));d[k]+='\n[x](definitely-missing-brief.md)';self.assertTrue(validate(d)[0])
 def test_alias_preserved(self):self.assertEqual(prd_id(ALIAS),'PRD-001')
def main():
 if '--self-test' in sys.argv:
  r=unittest.TextTestRunner(verbosity=2).run(unittest.defaultTestLoader.loadTestsFromTestCase(NegativeTests));return 0 if r.wasSuccessful() else 1
 docs={p.relative_to(BASE).as_posix():p.read_text(encoding='utf-8') for d in BASE.glob('categorie-*') for p in d.glob('*.md')}
 for n in ['README.md','CONTRAT-COMMUN.md']:
  p=BASE/n
  if p.exists():docs[n]=p.read_text(encoding='utf-8')
 errors,ids=validate(docs)
 print(json.dumps({'document_checks':'FAIL' if errors else 'PASS','prd_count':len(ids),'errors':errors,'application_tests':'NOT_RUN_BY_THIS_SCRIPT','remote_readiness':'NOT_VERIFIED_BY_THIS_SCRIPT','launch_authorized_by_validation':False},ensure_ascii=False,indent=2))
 return bool(errors)
if __name__=='__main__':sys.exit(main())
