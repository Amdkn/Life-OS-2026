import { checkMcpAuth } from './auth';
import * as assert from 'assert';

async function testMcpAuth() {
    console.log('Testing MCP Auth...');

    const validToken = Buffer.from('user1:tenantA:read,write').toString('base64');

    assert.strictEqual(checkMcpAuth(validToken, ['read']), true);
    assert.strictEqual(checkMcpAuth(validToken, ['read', 'write']), true);
    assert.strictEqual(checkMcpAuth(validToken, ['read'], 'tenantA'), true);

    assert.strictEqual(checkMcpAuth(validToken, ['dispatch']), false, 'Should fail missing scope');
    assert.strictEqual(checkMcpAuth(validToken, ['read'], 'tenantB'), false, 'Should fail wrong tenant');

    console.log('✅ All MCP Auth tests passed');
}

if (import.meta.url === import.meta.resolve(process.argv[1]) || process.argv[1]?.endsWith('auth.test.ts')) {
    testMcpAuth().catch(console.error);
}
