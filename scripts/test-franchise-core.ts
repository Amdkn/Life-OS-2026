import { FranchiseFactory } from '../src/services/franchise/franchise-factory';
import { FranchiseId } from '../src/types/franchise';

const ids: FranchiseId[] = ['abc_childcare', 'rilcot', 'alikaly_holding', 'marina_cleaning'];

let allPassed = true;

for (const id of ids) {
  try {
    const instance = FranchiseFactory.createInstance(id);

    if (instance.id !== id) {
      console.error(`❌ Mismatch ID for ${id}: got ${instance.id}`);
      allPassed = false;
      continue;
    }

    if (!instance.b1Config) {
      console.error(`❌ Missing b1Config for ${id}`);
      allPassed = false;
      continue;
    }

    if (!Array.isArray(instance.activeModules)) {
      console.error(`❌ Invalid activeModules for ${id}`);
      allPassed = false;
      continue;
    }

    console.log(`✅ Franchise initialized successfully: ${id} (Modules: ${instance.activeModules.join(', ')})`);
  } catch (error) {
    console.error(`❌ Error initializing franchise ${id}:`, error);
    allPassed = false;
  }
}

if (!allPassed) {
  console.error('\n❌ Some tests failed.');
  process.exit(1);
} else {
  console.log('\n✅ All franchises initialized correctly.');
  process.exit(0);
}
