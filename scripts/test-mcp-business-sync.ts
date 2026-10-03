import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import * as assert from 'assert';
import http from 'http';
import { app } from '../server/api/harness.js';

async function testMcpServer() {
  console.log('Testing MCP Server life_os_business_sync...');

  const server = http.createServer(app);
  await new Promise<void>((resolve) => {
    server.listen(3001, '127.0.0.1', () => {
      console.log(`[Test] Harness Server started`);
      resolve();
    });
  });

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

  const testToken = Buffer.from('test-principal:test-tenant:read,write,dispatch').toString('base64');

  const callRequest = JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "life_os_business_sync",
      arguments: {
        blocks: 10
      }
    }
  });

  // Need to inject the auth token into MCP meta, although standard MCP doesn't natively have it in this simple format, the mcp.ts adapter extracts it from `request.meta?.authorization`
  // Wait, standard JSON-RPC request for MCP
  const reqObj = JSON.parse(callRequest);
  reqObj.meta = { authorization: `Bearer ${testToken}` };

  const finalReq = JSON.stringify(reqObj);
  const contentLength = Buffer.byteLength(finalReq, 'utf8');
  const message = `Content-Length: ${contentLength}\r\n\r\n${finalReq}`;

  child.stdin.write(message);

  // Wait for response
  await new Promise(r => setTimeout(r, 1500));

  child.kill();
  server.close();

  console.log("stdout:", stdout);
  if (stderr) console.log("stderr:", stderr);

  assert.match(stdout, /"status":"SUCCESS"/);
  assert.match(stdout, /"adapter":"river-business-adapter"/);
  console.log('✅ MCP Server executed life_os_business_sync correctly');
}

testMcpServer().catch(console.error);
