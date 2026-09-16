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
canonicalA3Agents.forEach((agentId) => {
  registry[agentId] = {
    id: `skill-${agentId}`,
    agentId,
    skills: [],
    tools: []
  };
});

// Initialize manifests for Business OS Squads
businessOsSquads.forEach((squadName) => {
  const squadId = squadName.toLowerCase();
  registry[squadId] = {
    id: `skill-${squadId}`,
    agentId: squadName,
    skills: [],
    tools: []
  };
});

export const a3SkillsRegistry = registry;
