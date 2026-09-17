import { app } from '../server/api/harness.js';
import { sendBandwidthToBusiness, fetchBusinessMilestones } from '../src/lib/api/client.js';
import http from 'http';

const PORT = 3001;
const HOST = '127.0.0.1';

async function runTests() {
  console.log('--- Starting API Harness Tests ---');

  // Start the server
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(PORT, HOST, () => {
      console.log(`[Test] Server started on http://${HOST}:${PORT}`);
      resolve();
    });
  });

  try {
    console.log('\n--- Testing POST /api/bridge/life-to-business ---');
    const success = await sendBandwidthToBusiness({ availableBandwidthBlocks: 5 });
    if (success) {
      console.log('✅ POST request successful and validated');
    } else {
      console.error('❌ POST request failed');
      process.exitCode = 1;
    }

    console.log('\n--- Testing GET /api/bridge/business-to-life ---');
    const response = await fetchBusinessMilestones();
    if (response && response.status === 'disconnected') {
      console.log('✅ GET request successful, returned explicit disconnected state');
      console.log(JSON.stringify(response, null, 2));
    } else {
      console.error('❌ GET request failed or returned incorrect state', response);
      process.exitCode = 1;
    }

  } catch (err) {
    console.error('❌ Test execution failed', err);
    process.exitCode = 1;
  } finally {
    // Stop the server
    server.close(() => {
      console.log('\n[Test] Server stopped.');
      console.log('--- Tests Completed ---');
    });
  }
}

runTests();
