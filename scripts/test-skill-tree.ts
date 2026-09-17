import { JSDOM } from 'jsdom';
const jsdom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost' });
(global as any).window = jsdom.window;
(global as any).document = jsdom.window.document;
Object.defineProperty(global, 'navigator', {
  value: jsdom.window.navigator,
  configurable: true,
  writable: true
});

import React from 'react';
import { renderToString } from 'react-dom/server';
import SkillTreeNexus from '../src/apps/agent-portal/components/SkillTreeNexus';
import { vesselConfigs } from '../src/config/vessels.config';

async function runTests() {
  console.log('--- TEST PRD-015: SKILL TREE NEXUS RENDER ---');

  console.log('1. Rendering SkillTreeNexus component...');
  let html = '';
  try {
      html = renderToString(React.createElement(SkillTreeNexus));
  } catch (e) {
      console.error('Failed to render SkillTreeNexus');
      throw e;
  }

  if (!html) {
      throw new Error('Component rendered empty HTML');
  }

  console.log('2. Verifying Framework nodes are present...');
  for (const fw of vesselConfigs) {
      if (!html.includes(fw.frameworkName)) {
         throw new Error(`Missing framework name in output: ${fw.frameworkName}`);
      }
      if (!html.includes(fw.vesselName)) {
         throw new Error(`Missing vessel name in output: ${fw.vesselName}`);
      }
  }

  console.log('3. Verifying Crew members are present...');
  for (const fw of vesselConfigs) {
      for (const member of fw.crew) {
          if (!html.includes(member.name)) {
              throw new Error(`Missing crew member name in output: ${member.name}`);
          }
      }
  }

  console.log('   [SUCCESS] SkillTreeNexus renders correctly with mapped data.');
  console.log('--- ALL TESTS PASSED ---');
}

runTests().catch(e => {
  console.error('--- TEST FAILED ---');
  console.error(e);
  process.exit(1);
});
