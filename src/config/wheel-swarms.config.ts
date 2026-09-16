export interface WheelSwarmMapping {
  ldId: string;
  domainName: string;
  discoveryAgent: string;
  swarmName: string;
  deliverableSource: string;
}

export const WHEEL_SWARM_CONFIG: Record<string, WheelSwarmMapping> = {
  ld01: { ldId: 'ld01', domainName: 'Business', discoveryAgent: 'Zora', swarmName: 'Guardians', deliverableSource: 'JaaS Landing & OMK Mobile' },
  ld02: { ldId: 'ld02', domainName: 'Finance', discoveryAgent: 'Saru', swarmName: 'Illuminati', deliverableSource: 'Spacedock MRR & Budget' },
  ld03: { ldId: 'ld03', domainName: 'Health', discoveryAgent: 'Culber', swarmName: 'Avengers', deliverableSource: 'Health Metrics' },
  ld04: { ldId: 'ld04', domainName: 'Cognition', discoveryAgent: 'Tilly', swarmName: 'Fantastic4', deliverableSource: 'Knowledge Base' },
  ld05: { ldId: 'ld05', domainName: 'Relations', discoveryAgent: 'Stamets', swarmName: 'Kang', deliverableSource: 'Network Graph' },
  ld06: { ldId: 'ld06', domainName: 'Habitat', discoveryAgent: 'Burnham', swarmName: 'Thunderbolts', deliverableSource: 'Base Operations' },
  ld07: { ldId: 'ld07', domainName: 'Creativity', discoveryAgent: 'Reno', swarmName: 'X-Men', deliverableSource: 'Creative Output' },
  ld08: { ldId: 'ld08', domainName: 'Impact', discoveryAgent: 'Georgiou', swarmName: 'Eternals', deliverableSource: 'Legacy Assets' },
};

export const getSwarmMapping = (ldId: string): WheelSwarmMapping | undefined => {
  return WHEEL_SWARM_CONFIG[ldId];
};
