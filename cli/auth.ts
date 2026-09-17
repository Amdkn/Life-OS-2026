export const checkCliAuth = (requiredScopes: string[] = []): boolean => {
    // In a real CLI, we might read from ~/.config/life-os/auth.json or process.env
    const token = process.env.CLI_AUTH_TOKEN;
    if (!token) return false;

    try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const [principalId, , scopesStr] = decoded.split(':');

        if (!principalId) return false;

        const scopes = scopesStr ? scopesStr.split(',') : [];

        for (const scope of requiredScopes) {
            if (!scopes.includes(scope)) return false;
        }

        return true;
    } catch (e) {
        return false;
    }
}
