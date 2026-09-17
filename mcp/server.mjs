import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import os from 'node:os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isWindows = os.platform() === 'win32';
const tsxCmd = isWindows ? 'tsx.cmd' : 'tsx';
const tsxPath = resolve(__dirname, `../node_modules/.bin/${tsxCmd}`);
const tsFilePath = resolve(__dirname, '../src/lib/tooling/adapters/mcp.ts');

const child = spawn(tsxPath, [tsFilePath], {
  stdio: ['inherit', 'inherit', 'inherit']
});

child.on('exit', (code) => {
  process.exit(code || 0);
});

// Forward termination signals to the child process to prevent orphaned processes
['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) => {
  process.on(signal, () => {
    child.kill(signal);
  });
});
