import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execFileAsync = promisify(execFile);
const CLI_PATH = path.join(process.cwd(), 'cli', 'life-os.ts');

async function runTest() {
  console.log('Testing CLI Tooling Adapter...\n');

  try {
    // 1. Test 'tools list'
    console.log('1. Testing `tools list`...');
    const { stdout: stdoutList } = await execFileAsync('npx', ['tsx', CLI_PATH, 'tools', 'list'], { shell: true });
    const listOutput = JSON.parse(stdoutList);

    if (!Array.isArray(listOutput) || listOutput.length < 5) {
      throw new Error('Expected an array of at least 5 tools.');
    }
    const has12Wy = listOutput.some((t: any) => t.name === '12wy status');
    if (!has12Wy) throw new Error('Missing "12wy status" tool in list.');
    console.log('✅ tools list passed.\n');

    // 2. Test '12wy status --brief'
    console.log('2. Testing `12wy status --brief`...');
    const { stdout: stdoutBrief } = await execFileAsync('npx', ['tsx', CLI_PATH, '12wy', 'status', '--brief'], { shell: true });

    // Check if the output is on a single line (excluding trailing newline)
    const lines = stdoutBrief.trim().split('\n');
    if (lines.length !== 1) {
      throw new Error(`Expected exactly 1 line of output, got ${lines.length}. Output: ${stdoutBrief}`);
    }

    const statusObj = JSON.parse(lines[0]);
    if (typeof statusObj.score !== 'number' || typeof statusObj.isCrit !== 'boolean') {
      throw new Error('Malformed output for 12wy status.');
    }
    console.log('✅ 12wy status --brief passed.\n');

    console.log('All tests passed successfully!');
    process.exit(0);

  } catch (err: any) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
}

runTest();
