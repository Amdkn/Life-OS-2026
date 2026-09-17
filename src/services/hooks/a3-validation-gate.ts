import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

function runGate() {
  console.log('--- A3 Validation Gate ---');
  let passed = true;

  // 1. Zero placeholder
  console.log('[1/4] Checking for placeholders (TODO, FIXME, mock)...');
  try {
    const diffFiles = execSync('git diff HEAD --name-only', { encoding: 'utf-8' })
      .split('\n')
      .filter(f => f.trim().length > 0);

    let hasPlaceholders = false;
    for (const file of diffFiles) {
      if (fs.existsSync(file) && !file.endsWith('a3-validation-gate.ts')) {
        const content = fs.readFileSync(file, 'utf-8');
        // Match T O D O, F I X M E, or m o c k
        if (/TODO|FIXME|mock/i.test(content)) {
          console.error(`❌ Placeholder found in ${file}`);
          hasPlaceholders = true;
        }
      }
    }

    if (hasPlaceholders) {
      passed = false;
    } else {
      console.log('✅ No placeholders found.');
    }
  } catch (e: any) {
    console.error('❌ Failed to check git diff:', e.message);
    passed = false;
  }

  // 2. Strict typing
  console.log('[2/4] Checking strict typing (tsc --noEmit)...');
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    console.log('✅ Strict typing passed.');
  } catch (e: any) {
    console.error('❌ Strict typing failed:');
    if (e.stdout) console.error(e.stdout.toString());
    passed = false;
  }

  // 3. Execution proof
  console.log('[3/4] Checking execution proof (action_receipts)...');
  const dbPath = path.join(process.cwd(), 'data', 'blackboard.sqlite');
  if (!fs.existsSync(dbPath)) {
    console.error('❌ Database not found at', dbPath);
    passed = false;
  } else {
    try {
      const db = new Database(dbPath, { readonly: true });
      const row = db.prepare("SELECT COUNT(*) as count FROM events WHERE event_type = 'action_receipt'").get() as { count: number };
      if (row && row.count > 0) {
        console.log(`✅ Execution proof found (${row.count} receipts).`);
      } else {
        console.error('❌ No execution proof (action_receipt) found in the database.');
        passed = false;
      }
      db.close();
    } catch (e: any) {
      console.error('❌ Failed to read database:', e.message);
      passed = false;
    }
  }

  // 4. Strict timestamping
  console.log('[4/4] Checking timezone (America/New_York)...');
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (tz === 'America/New_York') {
    console.log('✅ Timezone is America/New_York.');
  } else {
    console.error(`❌ Invalid timezone. Expected America/New_York, got ${tz}`);
    passed = false;
  }

  if (!passed) {
    console.error('\n❌ A3 Validation Gate FAILED. Changes blocked.');
    process.exit(1);
  } else {
    console.log('\n✅ A3 Validation Gate PASSED.');
  }
}

runGate();
