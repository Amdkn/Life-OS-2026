import { businessBridgeRouter } from '../api/bridge/business-bridge';
import express from 'express';

async function runTests() {
  console.log('--- STARTING BRIDGE TESTS ---');

  // Setup simple in-memory express app to test the router locally without binding to a port
  const app = express();
  app.use(express.json());
  app.use('/api/bridge', businessBridgeRouter);

  // We can use a mock request function to simulate requests to the express router directly
  // However, it's easier to just start it on a random port and use native fetch

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


      console.log(`\nTest 2: POST /life-to-business (Valid Payload)`);
      const postResValid = await fetch(`${baseUrl}/life-to-business`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availableBandwidthBlocks: 10 })
      });
      if (!postResValid.ok) throw new Error(`POST (valid) failed with status ${postResValid.status}`);
      const postDataValid = await postResValid.json();

      if (!postDataValid.success || postDataValid.received !== 10) {
        throw new Error(`POST (valid) response format invalid: ${JSON.stringify(postDataValid)}`);
      }
      console.log('✅ POST /life-to-business (Valid Payload) handled successfully');


      console.log(`\nTest 3: POST /life-to-business (Invalid Payload)`);
      const postResInvalid = await fetch(`${baseUrl}/life-to-business`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availableBandwidthBlocks: "not-a-number" })
      });
      if (postResInvalid.status !== 400) {
        throw new Error(`POST (invalid) should return 400, got ${postResInvalid.status}`);
      }
      console.log('✅ POST /life-to-business (Invalid Payload) rejected with 400');

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
