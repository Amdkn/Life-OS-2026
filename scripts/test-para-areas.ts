import { JERRY_SQUADS } from '../src/utils/jerrySquads';
import { LD_TO_DOMAIN } from '../src/utils/paraAdapter';

const assert = (condition: boolean, message: string) => {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
};

const runTests = () => {
  console.log("Starting Tests for PRD-032...");

  // Test 1: Mapping exists and has exactly 8 domains
  const domains = Object.keys(JERRY_SQUADS);
  assert(domains.length === 8, "JERRY_SQUADS should map exactly 8 domains.");

  // Test 2: Business domain maps to J01 Prime & E-Myth SYSTEMIZE
  assert(JERRY_SQUADS['business'].id === 'J01', "Business domain should map to J01 Prime.");
  assert(JERRY_SQUADS['business'].standard === 'E-Myth SYSTEMIZE', "Business domain standard should be E-Myth SYSTEMIZE.");

  // Test 3: Finance and Habitat domains map to J03 Nexus & FIP Standard
  assert(JERRY_SQUADS['finance'].id === 'J03', "Finance domain should map to J03 Nexus.");
  assert(JERRY_SQUADS['habitat'].id === 'J03', "Habitat domain should map to J03 Nexus.");
  assert(JERRY_SQUADS['finance'].standard === 'FIP Standard', "Finance domain standard should be FIP Standard.");
  assert(JERRY_SQUADS['habitat'].standard === 'FIP Standard', "Habitat domain standard should be FIP Standard.");

  // Test 4: Health and Cognition domains map to J02 Bio & Vitalité & Nutrition
  assert(JERRY_SQUADS['health'].id === 'J02', "Health domain should map to J02 Bio.");
  assert(JERRY_SQUADS['cognition'].id === 'J02', "Cognition domain should map to J02 Bio.");
  assert(JERRY_SQUADS['health'].standard === 'Vitalité & Nutrition', "Health domain standard should be Vitalité & Nutrition.");
  assert(JERRY_SQUADS['cognition'].standard === 'Vitalité & Nutrition', "Cognition domain standard should be Vitalité & Nutrition.");

  // Test 5: Relations, Creativity, Impact map to J04 Solarpunk & Sunday Uplink
  assert(JERRY_SQUADS['relations'].id === 'J04', "Relations domain should map to J04 Solarpunk.");
  assert(JERRY_SQUADS['creativity'].id === 'J04', "Creativity domain should map to J04 Solarpunk.");
  assert(JERRY_SQUADS['impact'].id === 'J04', "Impact domain should map to J04 Solarpunk.");
  assert(JERRY_SQUADS['relations'].standard === 'Sunday Uplink', "Relations domain standard should be Sunday Uplink.");

  // Test 6: Verify mapping to LD-Router LD01-08 logic
  assert(LD_TO_DOMAIN['ld01'] === 'business', "LD01 should be business.");
  assert(LD_TO_DOMAIN['ld02'] === 'finance', "LD02 should be finance.");
  assert(LD_TO_DOMAIN['ld03'] === 'health', "LD03 should be health.");
  assert(LD_TO_DOMAIN['ld04'] === 'cognition', "LD04 should be cognition.");
  assert(LD_TO_DOMAIN['ld05'] === 'relations', "LD05 should be relations.");
  assert(LD_TO_DOMAIN['ld06'] === 'habitat', "LD06 should be habitat.");
  assert(LD_TO_DOMAIN['ld07'] === 'creativity', "LD07 should be creativity.");
  assert(LD_TO_DOMAIN['ld08'] === 'impact', "LD08 should be impact.");

  console.log("All tests passed!");
};

runTests();
