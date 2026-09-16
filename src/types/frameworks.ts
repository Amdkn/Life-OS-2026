export type FrameworkId = 'FW01' | 'FW02' | 'FW03' | 'FW04' | 'FW05' | 'FW06';

export type AgentLayer = 'A1' | 'A2' | 'A3';

export interface AgentCrewMember {
  id: string;
  name: string;
  role: string;
  layer?: AgentLayer;
}

export interface VesselConfig {
  id: FrameworkId;
  frameworkName: string;
  vesselName: string;
  crew: AgentCrewMember[];
}
