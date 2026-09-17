import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import * as assert from 'assert';

async function testMcpServer() {
  console.log('Testing MCP Server Auth Integration...');

  const mcpScript = resolve(process.cwd(), 'mcp/server.mjs');

  const child = spawn('node', [mcpScript], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: process.env
  });

  let stdout = '';
  let stderr = '';

  child.stdout.on('data', (data) => {
    stdout += data.toString();
  });

  child.stderr.on('data', (data) => {
    stderr += data.toString();
  });

  const callRequest = JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "life_os_blackboard_post",
      arguments: {
        workspaceId: "tenantA",
        eventType: "TEST_EVENT",
        payload: { test: true }
      }
    }
  });

  const contentLength = Buffer.byteLength(callRequest, 'utf8');
  const message = `Content-Length: ${contentLength}\r\n\r\n${callRequest}`;

  child.stdin.write(message);

  // Wait a moment for response
  await new Promise(r => setTimeout(r, 1000));

  child.kill();

  console.log("stdout:", stdout);
  console.log("stderr:", stderr);
  assert.match(stdout, /Missing authorization header/);
  console.log('✅ MCP Server rejected write without auth');
}

testMcpServer().catch(console.error);
