import { A3SkillManifest } from '../types/a3-skills';
import { vesselConfigs } from './vessels.config';

// 1. Extract A3 agents from PRD-041 canonical roster dynamically
const canonicalA3Agents = vesselConfigs
  .flatMap(v => v.crew)
  .filter(c => c.layer === 'A3')
  .map(a => a.id);

// 2. Business OS Squads as documented in PRD-053
const businessOsSquads = [
  'Guardians', 'Illuminati', 'Avengers', 'Fantastic4',
  'Kang', 'Thunderbolts', 'X-Men', 'Eternals'
];

const registry: Record<string, A3SkillManifest> = {};

// Initialize manifests for canonical A3 agents
canonicalA3Agents.forEach((agentId, index) => {
  registry[agentId] = {
    id: `skill-${agentId}`,
    agentId,
    skills: ['Logic Synthesis', 'Diplomacy Protocol', 'Tactical Routing'],
    tools: [
      { name: 'Blackboard Scanner', capability: 'verified' },
      { name: 'Core Engine Integrator', capability: index % 2 === 0 ? 'verified' : 'unverified' }
    ],
    dependencies: index > 0 ? [`skill-${canonicalA3Agents[0]}`] : []
  };
});

// Initialize manifests for Business OS Squads
businessOsSquads.forEach((squadName, index) => {
  const squadId = squadName.toLowerCase();
  registry[squadId] = {
    id: `skill-${squadId}`,
    agentId: squadName,
    skills: ['Market Analysis', 'Resource Distribution', 'Execution Strategy'],
    tools: [
      { name: 'Financial Pipeline', capability: 'verified' },
      { name: 'Growth Modeler', capability: index % 2 === 0 ? 'verified' : 'unverified' }
    ],
    dependencies: index > 0 ? [`skill-${businessOsSquads[0].toLowerCase()}`] : []
  };
});

export const a3SkillsRegistry = registry;
