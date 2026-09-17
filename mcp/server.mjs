import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import os from 'node:os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tsxCliPath = resolve(__dirname, '../node_modules/tsx/dist/cli.mjs');
const tsFilePath = resolve(__dirname, '../src/lib/tooling/adapters/mcp.ts');

const child = spawn(process.execPath, [tsxCliPath, tsFilePath], {
  stdio: ['pipe', 'pipe', 'inherit'],
  env: process.env
});

process.stdin.pipe(child.stdin);
child.stdout.pipe(process.stdout);

child.on('exit', (code) => {
  process.exit(code || 0);
});

// Forward termination signals to the child process to prevent orphaned processes
['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) => {
  process.on(signal, () => {
    child.kill(signal);
  });
});
