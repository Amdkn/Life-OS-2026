import { execSync } from 'child_process';

console.log('--- STARTING CLI TOOLING TESTS ---');

function runCommand(args: string) {
  try {
    const output = execSync(`npx tsx cli/life-os.ts ${args}`, { encoding: 'utf-8' });
    return output.trim();
  } catch (error: any) {
    console.error(`Error running command 'life-os ${args}':`);
    console.error(error.stdout);
    console.error(error.stderr);
    process.exit(1);
  }
}

// 1. Test "tools list"
console.log('\nTesting "tools list"');
const toolsListOutput = runCommand('tools list');
if (!toolsListOutput.includes('- tools list:')) throw new Error('tools list output invalid');
console.log('✅ tools list is functional');

// 2. Test "12wy status --brief"
console.log('\nTesting "12wy status --brief"');
const statusBriefOutput = runCommand('12wy status --brief');
if (!statusBriefOutput.match(/W4 - Score: 85.5%/)) throw new Error('12wy status --brief output invalid');
console.log('✅ 12wy status --brief is functional');

// 3. Test "para projects --json"
console.log('\nTesting "para projects --json"');
const paraProjectsJsonOutput = runCommand('para projects --json');
try {
  const parsed = JSON.parse(paraProjectsJsonOutput);
  if (!Array.isArray(parsed) || parsed.length !== 2) throw new Error('Expected 2 active projects');
  if (parsed[0].id !== 'PRJ-001') throw new Error('Unexpected JSON data');
  console.log('✅ para projects --json is functional');
} catch (err: any) {
  throw new Error(`para projects --json output is invalid JSON or mismatched schema: ${err.message}`);
}

console.log('\n--- ALL CLI TOOLING TESTS PASSED ---');
process.exit(0);
