"""Synthetic admission tests; never contacts Jules."""
import unittest,tempfile
from pathlib import Path
from dispatch_batches import choose,category,SOURCE,lock,digest

def session(cat,state='IN_PROGRESS',title=None,source=SOURCE):
 return {'title':title or f'LifeOS:C{cat} | test','state':state,'sourceContext':{'source':source}}
class AdmissionTests(unittest.TestCase):
 def test_parallel_independent(self):self.assertEqual(choose([1,4],[session(0,title='PRD-003: ongoing')],[]),[1,4])
 def test_existing_prd_not_duplicated(self):
  with self.assertRaises(ValueError):choose([0],[session(0,title='PRD-003: ongoing')],[])
 def test_fourth_category(self):
  with self.assertRaises(ValueError):choose([4],[session(0),session(1),session(2)],[])
 def test_dependency_not_merged(self):
  with self.assertRaises(ValueError):choose([2],[],[])
 def test_dependency_satisfied(self):self.assertEqual(choose([2],[],[1]),[2])
 def test_waiting_counts_account_capacity(self):
  others=[session(None,'AWAITING_USER_FEEDBACK',title='other',source='sources/github/other/repo') for _ in range(15)]
  with self.assertRaises(ValueError):choose([1],others,[])
 def test_unknown_active_blocks(self):
  with self.assertRaises(ValueError):choose([1],[session(None,title='unknown')],[])
 def test_completed_job_no_auto_replay(self):
  with self.assertRaises(ValueError):choose([1],[session(1,'COMPLETED')],[])
 def test_duplicate_request(self):
  with self.assertRaises(ValueError):choose([1,1],[],[])
 def test_identifier_not_repaired(self):self.assertIsNone(category(session(None,title='PRD-03 invalid')))
 def test_lock_exclusive(self):
  with tempfile.TemporaryDirectory() as d:
   path=Path(d)/'lock'
   with lock(path):
    with self.assertRaises(FileExistsError):
     with lock(path):pass
   self.assertFalse(path.exists())
 def test_hash_detects_mutation(self):self.assertNotEqual(digest('brief'),digest('brief modified'))
if __name__=='__main__':unittest.main(verbosity=2)
