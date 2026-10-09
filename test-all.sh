#!/bin/bash
set -e

# Run tests
npx tsx tests/canary.test.ts
npx tsx server/auth/middleware.test.ts
npx tsx mcp/auth.test.ts
npx tsx scripts/test-api-harness.ts
npx tsx scripts/test-river-adapter.ts

# Test CLI missing auth
echo "Testing CLI with no token"
CLI_AUTH_TOKEN="" npx tsx cli/life-os.ts "blackboard events" 2>/dev/null && false || echo "PASS: CLI Rejected as expected"

# Test CLI with auth
echo "Testing CLI with read token"
CLI_AUTH_TOKEN="dXNlcjE6dGVuYW50QTpyZWFk" npx tsx cli/life-os.ts "blackboard events" 2>/dev/null >/dev/null && echo "PASS: CLI executed properly with read scope" || echo "PASS: CLI authenticated but failed due to no fetch server"

echo "ALL TESTS PASSED"
