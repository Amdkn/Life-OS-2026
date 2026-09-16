"""Synthetic API readback tests; no network access."""
import unittest
from dispatch_batches import verify_readback,SOURCE
class ReadbackTests(unittest.TestCase):
 def fixture(self):return {'title':'fixture','state':'IN_PROGRESS','sourceContext':{'source':SOURCE,'githubRepoContext':{'startingBranch':'main'},'environmentVariablesEnabled':False}}
 def test_input_only_fields_absent(self):self.assertEqual(verify_readback(self.fixture(),'fixture')['automation_readback'],'INPUT_ONLY_NOT_VERIFIABLE')
 def test_environment_requires_acceptance(self):
  x=self.fixture();x['sourceContext']['environmentVariablesEnabled']=True
  with self.assertRaises(ValueError):verify_readback(x,'fixture')
 def test_explicit_acceptance_preserves_warning(self):
  x=self.fixture();x['sourceContext']['environmentVariablesEnabled']=True
  self.assertIs(verify_readback(x,'fixture',True)['environment_variables_enabled_observed'],True)
 def test_unknown_not_false(self):
  x=self.fixture();del x['sourceContext']['environmentVariablesEnabled']
  with self.assertRaises(ValueError):verify_readback(x,'fixture')
 def test_wrong_repo(self):
  x=self.fixture();x['sourceContext']['source']='sources/wrong'
  with self.assertRaises(ValueError):verify_readback(x,'fixture',True)
 def test_wrong_title(self):
  with self.assertRaises(ValueError):verify_readback(self.fixture(),'wrong',True)
 def test_wrong_branch(self):
  x=self.fixture();x['sourceContext']['githubRepoContext']['startingBranch']='other'
  with self.assertRaises(ValueError):verify_readback(x,'fixture',True)
if __name__=='__main__':unittest.main(verbosity=2)
