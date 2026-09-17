export interface B3SkillModule {
    id: string;
    description: string;
    frontmatter: Record<string, any>;
    protocols: string[];
}

export interface B3McpTool {
    name: string;
    description: string;
    inputSchema: Record<string, any>;
}

export interface B3McpBridge {
    id: string;
    serverUrl: string;
    tools: B3McpTool[];
    connect(): Promise<void>;
    executeTool(toolName: string, args: Record<string, any>): Promise<any>;
}

export interface B3PluginAdapter {
    id: string;
    name: string;
    version: string;
    initialize(): Promise<void>;
    shutdown(): Promise<void>;
}

export interface B3CognitiveConfig {
    maxTokens: number;
    maxContextWindow: number;
    escalationThreshold: number; // Threshold to escalate from flash to pro
}
