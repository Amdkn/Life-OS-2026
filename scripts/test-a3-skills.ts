import assert from 'node:assert';
import { a3SkillsRegistry } from '../src/config/a3-skills-registry';
import { vesselConfigs } from '../src/config/vessels.config';

function validateRegistry() {
  console.log('Testing A3 Skills Registry...');
  const manifests = Object.values(a3SkillsRegistry);

  // Validating Canonical A3 Agents
  const canonicalA3Agents = vesselConfigs
    .flatMap((fw) => fw.crew)
    .filter((agent) => agent.layer === 'A3')
    .map((agent) => agent.id);

  for (const agentId of canonicalA3Agents) {
    const hasAgent = manifests.some((m) => m.agentId === agentId);
    assert.ok(hasAgent, `Registry missing manifest for canonical A3 agent: ${agentId}`);
  }

  // Validating Business OS Squads
  const businessOsSquads = [
    'Guardians', 'Illuminati', 'Avengers', 'Fantastic4',
    'Kang', 'Thunderbolts', 'X-Men', 'Eternals'
  ];

  for (const squad of businessOsSquads) {
    const hasSquad = manifests.some((m) => m.agentId === squad);
    assert.ok(hasSquad, `Registry missing manifest for Business OS squad: ${squad}`);
  }

  for (const manifest of manifests) {
    for (const tool of manifest.tools) {
      assert.ok(
        tool.capability === 'verified' || tool.capability === 'unverified',
        `Tool capability must be 'verified' or 'unverified'.`
      );
    }
  }

  // Validating Dependencies Resolution
  for (const manifest of manifests) {
    if (manifest.dependencies) {
      for (const depId of manifest.dependencies) {
        const depExists = manifests.some((m) => m.id === depId);
        assert.ok(
          depExists,
          `Dependency resolution failed: manifest '${manifest.id}' depends on '${depId}' which is missing.`
        );
      }
    }
  }

  console.log('✅ A3 Skills Registry tests passed.');
}

try {
  validateRegistry();
} catch (err) {
  console.error('❌ Test failed:', err);
  process.exit(1);
}
