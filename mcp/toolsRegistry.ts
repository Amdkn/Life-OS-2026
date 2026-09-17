export const mcpToolsRegistry: Record<string, { requiredScopes: string[] }> = {
    'life_os_get_tactics': { requiredScopes: ['read'] },
    'life_os_update_tactic': { requiredScopes: ['write'] },
    'life_os_get_wheel_domains': { requiredScopes: ['read'] },
    'life_os_blackboard_post': { requiredScopes: ['write'] },
    'life_os_holding_stripe': { requiredScopes: ['write'] },
    'life_os_web_audit_playwright': { requiredScopes: ['read', 'write'] },
    'life_os_document_parser': { requiredScopes: ['read'] },
    'life_os_linear_sync': { requiredScopes: ['read', 'write'] }
};
