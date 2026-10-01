import { app as harnessApp } from '../server/api/harness.js';
import { app as blackboardApp, startServer, stopServer } from '../server/blackboard/index.js';
import { sendBandwidthToBusiness, fetchBusinessMilestones } from '../src/lib/api/client.js';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const HARNESS_PORT = 3001;
const BLACKBOARD_PORT = 4445;
const HOST = '127.0.0.1';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const DB_PATH = path.join(ROOT_DIR, 'data', 'blackboard.sqlite');

async function runTests() {
  console.log('--- Starting Restart / Equivalence Tests ---');
  let harnessServer: any;
  let exitCode = 0;

  try {
    // 1. Setup Harness
    harnessServer = http.createServer(harnessApp);
    await new Promise<void>((resolve) => {
      harnessServer.listen(HARNESS_PORT, HOST, () => {
        console.log(`[Test] Harness Server started on http://${HOST}:${HARNESS_PORT}`);
        resolve();
      });
    });

    // 2. Test HTTP capability equivalent semantics
    console.log('\n[Test 1] Domain operation via HTTP yields equivalent semantics');
    const testToken = Buffer.from('test-principal:test-tenant:read,write,dispatch').toString('base64');

    const getRes = await fetchBusinessMilestones(testToken);
    if (getRes?.status !== 'disconnected') {
      console.error('❌ GET /business-to-life returned incorrect state', getRes);
      exitCode = 1;
    } else {
      console.log('✅ GET request yields valid equivalent semantics');
    }

    const postRes = await sendBandwidthToBusiness({ availableBandwidthBlocks: 10 }, testToken);
    if (!postRes) {
      console.error('❌ POST /life-to-business failed');
      exitCode = 1;
    } else {
      console.log('✅ POST request yields valid equivalent semantics');
    }

    // 3. Start Blackboard
    console.log('\n[Test 2] Blackboard DB Lifecycle & CWD Independence');
    startServer(BLACKBOARD_PORT);
    
    // Check if DB exists
    if (!fs.existsSync(DB_PATH)) {
      console.error(`❌ DB not found at ${DB_PATH}`);
      exitCode = 1;
    } else {
      console.log(`✅ DB successfully placed at canonical path: ${DB_PATH}`);
    }

    // Give cron time to run its initial job
    await new Promise(r => setTimeout(r, 2000));

    // 4. Create an event to test restart persistence
    console.log('\n[Test 3] Blackboard survives service restart');
    
    const eventPayload = {
      id: `test-event-${Date.now()}`,
      workspace_id: 'cron-registry-workspace',
      actor_id: 'test',
      actor_layer: 'test',
      event_type: 'test_event',
      payload_json: JSON.stringify({ hello: 'world' }),
      timestamp: Date.now()
    };

    const writeRes = await fetch(`http://${HOST}:${BLACKBOARD_PORT}/api/blackboard/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventPayload)
    });

    if (!writeRes.ok) {
       console.error('❌ Failed to write event');
       exitCode = 1;
    }

    // Restart server
    console.log('Stopping Blackboard Server...');
    stopServer();
    await new Promise(r => setTimeout(r, 1000));
    
    console.log('Restarting Blackboard Server...');
    startServer(BLACKBOARD_PORT);
    await new Promise(r => setTimeout(r, 1000));

    const readRes = await fetch(`http://${HOST}:${BLACKBOARD_PORT}/api/blackboard/events?workspace_id=cron-registry-workspace`);
    const events = await readRes.json();
    
    const found = events.find((e: any) => e.id === eventPayload.id);
    if (!found) {
      console.error('❌ Event did not survive restart');
      exitCode = 1;
    } else {
      console.log('✅ Event survived restart successfully');
    }

    // 5. Test Duplicate replay (attempting to post identical ID should be handled/idempotent or throw SQLite Constraint)
    console.log('\n[Test 4] Duplicate replay does not double-apply');
    const duplicateWriteRes = await fetch(`http://${HOST}:${BLACKBOARD_PORT}/api/blackboard/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventPayload)
    });

    if (duplicateWriteRes.ok) {
      console.error('❌ Duplicate event write was accepted');
      exitCode = 1;
    } else {
      console.log('✅ Duplicate replay rejected (idempotency preserved via SQLite constraints)');
    }

    // 6. Assert Cron emitted UNKNOWN
    console.log('\n[Test 5] Missing effect evidence returns UNKNOWN');
    const cronEvents = events.filter((e: any) => e.event_type === 'action_receipt');
    let hasUnknown = false;
    for (const e of cronEvents) {
      try {
        const payload = JSON.parse(e.payload_json);
        if (payload.status === 'UNKNOWN') {
           hasUnknown = true;
           break;
        }
      } catch (e) {}
    }

    if (!hasUnknown) {
       console.error('❌ Cron action_receipt with UNKNOWN status not found');
       exitCode = 1;
    } else {
       console.log('✅ Cron semantic correctly emitted UNKNOWN status reflecting missing effect evidence');
    }

  } catch (err) {
    console.error('❌ Test execution failed', err);
    exitCode = 1;
  } finally {
    console.log('\n[Teardown] Stopping servers...');
    if (harnessServer) {
       harnessServer.close();
    }
    stopServer();
    process.exit(exitCode);
  }
}

runTests();