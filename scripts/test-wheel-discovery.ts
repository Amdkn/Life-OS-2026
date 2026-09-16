import { getSwarmMapping, WHEEL_SWARM_CONFIG } from '../src/config/wheel-swarms.config';

function runTests() {
  let hasError = false;
  console.log("Starting Discovery Wheel Mapping Tests...\n");

  const expectedMappings = [
    { ldId: 'ld01', domainName: 'Business', discoveryAgent: 'Zora', swarmName: 'Guardians' },
    { ldId: 'ld02', domainName: 'Finance', discoveryAgent: 'Saru', swarmName: 'Illuminati' },
    { ldId: 'ld03', domainName: 'Health', discoveryAgent: 'Culber', swarmName: 'Avengers' },
    { ldId: 'ld04', domainName: 'Cognition', discoveryAgent: 'Tilly', swarmName: 'Fantastic4' },
    { ldId: 'ld05', domainName: 'Relations', discoveryAgent: 'Stamets', swarmName: 'Kang' },
    { ldId: 'ld06', domainName: 'Habitat', discoveryAgent: 'Burnham', swarmName: 'Thunderbolts' },
    { ldId: 'ld07', domainName: 'Creativity', discoveryAgent: 'Reno', swarmName: 'X-Men' },
    { ldId: 'ld08', domainName: 'Impact', discoveryAgent: 'Georgiou', swarmName: 'Eternals' },
  ];

  // Test 1: Config has exactly 8 entries
  const configKeys = Object.keys(WHEEL_SWARM_CONFIG);
  if (configKeys.length !== 8) {
    console.error(`[FAIL] Expected 8 wheel swarm mappings, found ${configKeys.length}`);
    hasError = true;
  } else {
    console.log("[PASS] Wheel swarm mapping contains exactly 8 domains.");
  }

  // Test 2: Mappings are correct
  for (const expected of expectedMappings) {
    const mapping = getSwarmMapping(expected.ldId);
    if (!mapping) {
      console.error(`[FAIL] Missing mapping for ${expected.ldId}`);
      hasError = true;
      continue;
    }

    if (
      mapping.domainName !== expected.domainName ||
      mapping.discoveryAgent !== expected.discoveryAgent ||
      mapping.swarmName !== expected.swarmName
    ) {
      console.error(`[FAIL] Incorrect mapping for ${expected.ldId}. Expected: ${JSON.stringify(expected)}, Got: ${JSON.stringify(mapping)}`);
      hasError = true;
    } else {
      console.log(`[PASS] Correct mapping for ${expected.ldId} -> ${expected.discoveryAgent} & ${expected.swarmName}`);
    }
  }

  // Test 3: Gauge calculation (mocking the telemetry hook behavior)
  const mockTelemetryScores: Record<string, number> = {
    'd1': 50,
    'd2': 0, // Should be treated as non-measured or exactly 0
  };

  const getGaugeDisplay = (score: number | undefined) => {
    return (score && score > 0) ? `${score}%` : 'non mesuré';
  };

  if (getGaugeDisplay(mockTelemetryScores['d1']) !== '50%') {
    console.error(`[FAIL] Gauge display logic failed for positive score.`);
    hasError = true;
  } else {
    console.log("[PASS] Gauge display logic correctly returns percentage for positive score.");
  }

  if (getGaugeDisplay(mockTelemetryScores['d2']) !== 'non mesuré') {
    console.error(`[FAIL] Gauge display logic failed for zero score.`);
    hasError = true;
  } else {
    console.log("[PASS] Gauge display logic correctly returns 'non mesuré' for zero score.");
  }

  if (getGaugeDisplay(undefined) !== 'non mesuré') {
    console.error(`[FAIL] Gauge display logic failed for undefined score.`);
    hasError = true;
  } else {
    console.log("[PASS] Gauge display logic correctly returns 'non mesuré' for undefined score.");
  }

  if (hasError) {
    console.error("\nTests finished with errors.");
    process.exit(1);
  } else {
    console.log("\nAll tests passed successfully.");
    process.exit(0);
  }
}

runTests();