export interface ToolContext {
  userId?: string;
  tenantId?: string;
  source?: string;
}

export interface ToolDefinition<TArgs = any, TResult = any> {
  name: string;
  description: string;
  validateArgs?: (args: any) => void;
  handler: (args: TArgs, context: ToolContext) => Promise<TResult> | TResult;
}

class ToolRegistry {
  private tools: Map<string, ToolDefinition> = new Map();

  register(def: ToolDefinition) {
    if (this.tools.has(def.name)) {
      throw new Error(`Tool already registered: ${def.name}`);
    }
    this.tools.set(def.name, def);
  }

  get(name: string): ToolDefinition | undefined {
    return this.tools.get(name);
  }

  list(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }
}

export const registry = new ToolRegistry();
