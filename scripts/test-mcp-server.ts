import { spawn } from 'child_process';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTest() {
  const serverPath = path.resolve(__dirname, '../mcp/server.mjs');

  console.log(`Starting MCP server at ${serverPath}...`);

  const child = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'inherit']
  });

  let outputBuffer = '';

  child.stdout.on('data', (data) => {
    outputBuffer += data.toString();
    console.log(`[RAW STDOUT]: ${data.toString()}`);
  });

  // 1. Send initialize request
  const initializeReq = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'test-client',
        version: '1.0.0'
      }
    }
  };

  console.log('Sending initialize request...');
  child.stdin.write(JSON.stringify(initializeReq) + '\n');

  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 2. Send initialized notification
  const initializedNotif = {
    jsonrpc: '2.0',
    method: 'notifications/initialized'
  };
  console.log('Sending initialized notification...');
  child.stdin.write(JSON.stringify(initializedNotif) + '\n');

  await new Promise(resolve => setTimeout(resolve, 500));

  // 3. Send tools/list request
  const listToolsReq = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
    params: {}
  };

  console.log('Sending tools/list request...');
  child.stdin.write(JSON.stringify(listToolsReq) + '\n');

  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('Test completed, killing server...');
  child.kill();

  // Validate output
  if (outputBuffer.includes('life_os_get_tactics') && outputBuffer.includes('life_os_update_tactic')) {
    console.log('\n✅ Test passed: Server responded correctly with tools.');
    process.exit(0);
  } else {
    console.error('\n❌ Test failed: Server did not respond correctly.');
    console.error('Output was:', outputBuffer);
    process.exit(1);
  }
}

runTest().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
