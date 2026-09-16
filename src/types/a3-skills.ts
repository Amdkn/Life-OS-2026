export type ExecutionCapability = 'verified' | 'unverified';

export interface ToolRequirement {
  name: string;
  capability: ExecutionCapability;
}

export interface A3SkillManifest {
  id: string;
  agentId: string;
  skills: string[];
  tools: ToolRequirement[];
  dependencies?: string[];
}
