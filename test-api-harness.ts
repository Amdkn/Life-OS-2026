import { app } from './server/api/harness.js';
import * as assert from 'assert';
import http from 'http';

async function testHarness() {
  console.log('Testing API Bridge Harness with Auth...');

  const server = http.createServer(app);
  server.listen(0); // Listen on random port
  const port = (server.address() as any).port;
  const baseUrl = `http://localhost:${port}`;

  const token = Buffer.from('user1:tenantA:write,read').toString('base64');

  // Test POST with auth & tenant scope
  let res = await fetch(`${baseUrl}/api/bridge/life-to-business`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ availableBandwidthBlocks: 5, tenantId: 'tenantA' })
  });

  assert.strictEqual(res.status, 200);
  let body = await res.json();
  assert.strictEqual(body.payload.acknowledgedBandwidth, 5);
  console.log('✅ POST with correct auth & tenant passed');

  // Test POST with missing scope (only read)
  const readToken = Buffer.from('user1:tenantA:read').toString('base64');
  res = await fetch(`${baseUrl}/api/bridge/life-to-business`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${readToken}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ availableBandwidthBlocks: 5, tenantId: 'tenantA' })
  });

  assert.strictEqual(res.status, 403);
  console.log('✅ POST with insufficient scope rejected as expected');

  // Test POST with wrong tenant
  res = await fetch(`${baseUrl}/api/bridge/life-to-business`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ availableBandwidthBlocks: 5, tenantId: 'tenantB' })
  });

  assert.strictEqual(res.status, 403);
  console.log('✅ POST with wrong tenant rejected as expected');

  // Test GET with auth & tenant scope
  res = await fetch(`${baseUrl}/api/bridge/business-to-life?tenantId=tenantA`, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`
    }
  });

  assert.strictEqual(res.status, 200);
  body = await res.json();
  assert.strictEqual(body.status, 'disconnected');
  console.log('✅ GET with correct auth & tenant passed');

  console.log('All API tests passed!');
  server.close();
}

testHarness().catch(console.error);
