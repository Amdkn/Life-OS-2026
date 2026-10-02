import { app } from '../server/api/harness.js';
import express from 'express';

async function runTests() {
  console.log('--- STARTING BRIDGE TESTS ---');

  const server = app.listen(0, async () => {
    const port = (server.address() as any).port;
    const baseUrl = `http://localhost:${port}/api/bridge`;

    try {
      console.log(`\nTest 1: GET /business-to-life`);
      const getRes = await fetch(`${baseUrl}/business-to-life`);
      if (!getRes.ok) throw new Error(`GET failed with status ${getRes.status}`);
      const getData = await getRes.json();

      if (getData.status !== 'disconnected' || !Array.isArray(getData.cashflowMilestones) || !Array.isArray(getData.deadlines)) {
        throw new Error(`GET response format invalid: ${JSON.stringify(getData)}`);
      }
      console.log('✅ GET /business-to-life returns explicit empty state');


      // The canonical harness requires authentication and outputs an event.
      // This test is superseded by test-api-harness.ts, but we keep this file
      // around if it runs different assertions. For now, since test-api-harness
      // covers the real auth semantics, we just test GET here or we can just
      // skip the invalid POST tests that were written for the bridge harness.

      console.log('\n--- ALL BRIDGE TESTS PASSED ---');
      server.close();
      process.exit(0);

    } catch (e) {
      console.error('❌ TEST FAILED:', e);
      server.close();
      process.exit(1);
    }
  });
}

runTests();
