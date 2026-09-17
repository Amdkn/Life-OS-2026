import { B3SkillModule, B3McpBridge, B3PluginAdapter, B3CognitiveConfig } from '../types/b3-cognitive.js';
import { JulesApiClient } from './jules/jules-api-client.js';
import { B3TaskProfile } from '../types/b3-polymorphic.js';

export class B3CognitiveDispatcher {
    private skills: Map<string, B3SkillModule> = new Map();
    private plugins: Map<string, B3PluginAdapter> = new Map();
    private mcpBridges: Map<string, B3McpBridge> = new Map();
    private config: B3CognitiveConfig;

    constructor(config: B3CognitiveConfig) {
        this.config = config;
    }

    public registerSkill(skill: B3SkillModule): void {
        this.skills.set(skill.id, skill);
    }

    public registerPlugin(plugin: B3PluginAdapter): void {
        this.plugins.set(plugin.id, plugin);
    }

    public registerMcpBridge(bridge: B3McpBridge): void {
        this.mcpBridges.set(bridge.id, bridge);
    }

    public getSkill(id: string): B3SkillModule | undefined {
        return this.skills.get(id);
    }

    public getPlugin(id: string): B3PluginAdapter | undefined {
        return this.plugins.get(id);
    }

    public getMcpBridge(id: string): B3McpBridge | undefined {
        return this.mcpBridges.get(id);
    }

    private truncateContext(context: string): string {
        if (context.length > this.config.maxContextWindow) {
            return context.substring(0, this.config.maxContextWindow);
        }
        return context;
    }

    public async dispatchTask(task: B3TaskProfile, context: string, complexityScore: number): Promise<any> {
        const truncatedContext = this.truncateContext(context);

        let targetModel = 'flash';
        if (complexityScore >= this.config.escalationThreshold || task.requiredIntelligence === 'deep_reasoning') {
            targetModel = 'pro';
        }

        const sessionOptions = {
            autoCreatePr: false,
            requirePlanApproval: false,
            prompt: `Execute task ${task.id}: ${task.description}. Model: ${targetModel}. Context: ${truncatedContext}`
        };

        const session = await JulesApiClient.createSession(sessionOptions);

        // Return a mock result or standard acknowledgment since JulesApiClient might not have a direct run-to-completion method here yet
        return {
            sessionId: session.id,
            targetModel,
            status: 'dispatched'
        };
    }
}
