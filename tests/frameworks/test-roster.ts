import { vesselConfigs } from '../../src/config/vessels.config';
import { FrameworkId } from '../../src/types/frameworks';

function testRoster() {
  console.log('--- Running Roster Test ---');

  if (!vesselConfigs) {
    throw new Error('vesselConfigs is not exported or undefined.');
  }

  if (vesselConfigs.length !== 6) {
    throw new Error(`Expected exactly 6 framework vessels, found ${vesselConfigs.length}`);
  }

  const expectedIds = ['FW01', 'FW02', 'FW03', 'FW04', 'FW05', 'FW06'];
  const actualIds = vesselConfigs.map(v => v.id).sort();

  if (JSON.stringify(expectedIds) !== JSON.stringify(actualIds)) {
    throw new Error(`Expected IDs FW01-FW06, found: ${actualIds}`);
  }

  const expectedNames = ['Ikigai', 'Life Wheel', 'PARA', '12WY', 'GTD', 'DEAL'];

  vesselConfigs.forEach(vessel => {
    if (!expectedNames.includes(vessel.frameworkName)) {
      throw new Error(`Unexpected framework name: ${vessel.frameworkName}`);
    }

    if (!vessel.crew || !Array.isArray(vessel.crew) || vessel.crew.length === 0) {
      throw new Error(`Vessel ${vessel.vesselName} is missing a crew or has an empty crew.`);
    }

    vessel.crew.forEach(member => {
      if (!member.id || !member.name || !member.role) {
        throw new Error(`Invalid crew member structure in ${vessel.vesselName}: ${JSON.stringify(member)}`);
      }
    });
  });

  console.log('All tests passed successfully!');
}

testRoster();
