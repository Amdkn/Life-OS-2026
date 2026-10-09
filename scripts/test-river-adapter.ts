import { RiverBusinessAdapter } from '../src/lib/river/adapter.js';
import { app } from '../server/api/harness.js';
import http from 'http';

const PORT = 3001;
const HOST = '127.0.0.1';

async function runTests() {
  console.log('--- Starting River Business Adapter Tests ---');

  const server = http.createServer(app);
  await new Promise<void>((resolve) => {
    server.listen(PORT, HOST, () => {
      console.log(`[Test] Server started on http://${HOST}:${PORT}`);
      resolve();
    });
  });

  try {
    const testToken = Buffer.from('test-principal:test-tenant:read,write,dispatch').toString('base64');
    const adapter = new RiverBusinessAdapter();

    console.log('\n--- Testing business.bandwidth.update ---');
    const updateReceipt = await adapter.handleRequest({
      id: 'req-1',
      type: 'business.bandwidth.update',
      payload: { availableBandwidthBlocks: 5 },
      correlation_id: 'corr-1',
      source: 'test'
    }, testToken);

    if (updateReceipt.status === 'SUCCESS' && updateReceipt.adapter === 'river-business-adapter') {
      console.log('✅ bandwidth update capability processed successfully');
    } else {
      console.error('❌ bandwidth update failed', updateReceipt);
      process.exitCode = 1;
    }

    console.log('\n--- Testing business.milestones.fetch ---');
    const fetchReceipt = await adapter.handleRequest({
      id: 'req-2',
      type: 'business.milestones.fetch',
      payload: {},
      correlation_id: 'corr-2',
      source: 'test'
    }, testToken);

    if (fetchReceipt.status === 'SUCCESS' && fetchReceipt.evidence && fetchReceipt.evidence.status === 'disconnected') {
      console.log('✅ milestone fetch capability processed successfully');
    } else {
      console.error('❌ milestone fetch failed', fetchReceipt);
      process.exitCode = 1;
    }

    console.log('\n--- Testing UNKNOWN ---');
    const unknownReceipt = await adapter.handleRequest({
      id: 'req-3',
      type: 'business.unknown',
      payload: {},
      correlation_id: 'corr-3',
      source: 'test'
    }, testToken);

    if (unknownReceipt.status === 'UNKNOWN') {
      console.log('✅ unknown capability handled correctly');
    } else {
      console.error('❌ unknown capability failed', unknownReceipt);
      process.exitCode = 1;
    }

  } catch (err) {
    console.error('❌ Test execution failed', err);
    process.exitCode = 1;
  } finally {
    server.close(() => {
      console.log('\n[Test] Server stopped.');
      console.log('--- Tests Completed ---');
    });
  }
}

runTests();
