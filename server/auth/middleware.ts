import { Request, Response, NextFunction } from 'express';

// Simple mock for token payload
export interface AuthContext {
  principalId: string;
  scopes: string[]; // 'read', 'write', 'dispatch'
  tenantId: string | null; // null for local/demo mode
}

export function decodeToken(token: string): AuthContext | null {
  // For the sake of this PRD, we'll simulate a token registry or simple decoding
  // Format: base64(principalId:tenantId:scopes)
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [principalId, tenantIdStr, scopesStr] = decoded.split(':');
    if (!principalId) return null;
    return {
      principalId,
      tenantId: tenantIdStr === 'null' || !tenantIdStr ? null : tenantIdStr,
      scopes: scopesStr ? scopesStr.split(',') : []
    };
  } catch (e) {
    return null;
  }
}

export const requireAuth = (requiredScopes: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.substring(7);
    const context = decodeToken(token);

    if (!context) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Check scopes
    for (const scope of requiredScopes) {
      if (!context.scopes.includes(scope)) {
        return res.status(403).json({ error: `Missing required scope: ${scope}` });
      }
    }

    // Attach context to request
    (req as any).auth = context;
    next();
  };
};

// Rate limiting (simple memory based with cleanup)
const rateLimits = new Map<string, { count: number, resetAt: number }>();
export const rateLimiter = (limit: number, windowMs: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    let record = rateLimits.get(ip);

    if (!record || record.resetAt < now) {
      record = { count: 0, resetAt: now + windowMs };

      // Cleanup old entries sporadically (basic garbage collection for memory leak prevention)
      if (Math.random() < 0.1) {
          for (const [key, value] of rateLimits.entries()) {
              if (value.resetAt < now) {
                  rateLimits.delete(key);
              }
          }
      }
    }

    record.count++;
    rateLimits.set(ip, record);

    if (record.count > limit) {
      return res.status(429).json({ error: 'Too many requests' });
    }

    next();
  };
};

export const auditLog = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const auth = (req as any).auth;
    // Note: Do not log any secrets/tokens
    console.log(`[AUDIT] ${req.method} ${req.path} - Status: ${res.statusCode} - Principal: ${auth?.principalId || 'anonymous'} - Tenant: ${auth?.tenantId || 'none'} - Duration: ${duration}ms`);
  });
  next();
};

export const sanitizePath = (req: Request, res: Response, next: NextFunction) => {
  // Prevent directory traversal
  const rawUrl = req.url;
  if (rawUrl.includes('../') || rawUrl.includes('..%2F')) {
    return res.status(403).json({ error: 'Directory traversal detected' });
  }
  next();
};

// Tenant enforcement
export const enforceTenant = (req: Request, res: Response, next: NextFunction) => {
  const auth = (req as any).auth as AuthContext;
  if (!auth) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }

  // If the route has a tenantId param or body field, it must match the authenticated tenant
  const requestedTenantId = req.params.tenantId || req.body.tenantId || req.query.tenantId;

  if (requestedTenantId && requestedTenantId !== auth.tenantId) {
    return res.status(403).json({ error: 'Tenant mismatch. You cannot access resources of another tenant.' });
  }

  // If action requires tenant but user is in demo/local mode (tenantId is null)
  if (!auth.tenantId && requestedTenantId) {
    return res.status(403).json({ error: 'Local/Demo mode cannot access cloud tenants.' });
  }

  next();
};
