import { Request, Response } from 'express';
import { decodeToken, requireAuth, enforceTenant, sanitizePath } from './middleware.js';
import * as assert from 'assert';

async function testAuthMiddleware() {
  console.log('Testing Auth Middleware...');

  // Test: Decode valid token
  {
    const token = Buffer.from('user1:tenantA:read,write').toString('base64');
    const context = decodeToken(token);
    assert.deepStrictEqual(context, {
      principalId: 'user1',
      tenantId: 'tenantA',
      scopes: ['read', 'write']
    });
    console.log('✅ Decode valid token passed');
  }

  // Test: Deny directory traversal
  {
    const req = { url: '/api/../../secrets' } as Request;
    let statusCalled = 0;
    const res = {
        status: (code: number) => { statusCalled = code; return res; },
        json: () => {}
    } as unknown as Response;
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    sanitizePath(req, res, next);

    assert.strictEqual(statusCalled, 403);
    assert.strictEqual(nextCalled, false);
    console.log('✅ Deny directory traversal passed');
  }

  // Test: Deny tenant mismatch
  {
    const req = {
      params: { tenantId: 'tenantB' },
      body: {},
      query: {}
    } as unknown as Request;
    (req as any).auth = { principalId: 'user1', tenantId: 'tenantA', scopes: ['read'] };

    let statusCalled = 0;
    const res = {
        status: (code: number) => { statusCalled = code; return res; },
        json: () => {}
    } as unknown as Response;
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    enforceTenant(req, res, next);

    assert.strictEqual(statusCalled, 403);
    assert.strictEqual(nextCalled, false);
    console.log('✅ Deny tenant mismatch passed');
  }

  console.log('All tests passed!');
}

if (import.meta.url === import.meta.resolve(process.argv[1]) || process.argv[1]?.endsWith('middleware.test.ts')) {
  testAuthMiddleware().catch(console.error);
}
