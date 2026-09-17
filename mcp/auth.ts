// MCP Auth Context (simplified for demonstration, typically tokens would be passed via environment or connection string)
export interface AuthContext {
    principalId: string;
    scopes: string[]; // 'read', 'write', 'dispatch'
    tenantId: string | null; // null for local/demo mode
}

export const checkMcpAuth = (token: string, requiredScopes: string[], requiredTenantId?: string): boolean => {
    // Basic verification mimicking backend middleware
    try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const [principalId, tenantIdStr, scopesStr] = decoded.split(':');

        if (!principalId) return false;

        const tenantId = tenantIdStr === 'null' || !tenantIdStr ? null : tenantIdStr;
        const scopes = scopesStr ? scopesStr.split(',') : [];

        // Check scopes
        for (const scope of requiredScopes) {
            if (!scopes.includes(scope)) return false;
        }

        // Check tenant
        if (requiredTenantId && requiredTenantId !== tenantId) return false;

        if (!tenantId && requiredTenantId) return false; // Local/demo mode cannot access cloud tenants

        return true;
    } catch (e) {
        return false;
    }
};

export const getAuthToken = (): string => {
    return process.env.MCP_AUTH_TOKEN || '';
};
