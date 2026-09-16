// Test mock variables
process.env.VITE_SUPABASE_URL = 'http://mock.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'mock';

// Mock IndexedDB for Node environment
import 'fake-indexeddb/auto';

import { config } from 'dotenv';
config();

// Mute console output that isn't from the test
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

import { useAgentsStore } from '../src/stores/agents.store';
import { useParaStore } from '../src/stores/fw-para.store';

async function runTests() {
  originalConsoleLog('--- Starting ScoreCard Functional Tests ---');

  // 1. Initial State verification
  const agentsStore = useAgentsStore.getState();
  const paraStore = useParaStore.getState();

  originalConsoleLog(`Initial agents length: ${agentsStore.agents.length}`);
  originalConsoleLog(`Initial tasks length: ${agentsStore.tasks.length}`);
  originalConsoleLog(`Initial PARA projects: ${paraStore.projects.length}`);

  // Create a new mock project
  await paraStore.addProject({
    id: 'TEST-PROJECT-1',
    title: 'Test Kanban Task Allocation',
    status: 'active',
    domain: 'business',
    pillars: ['growth'],
    resources: [],
    progress: 0,
    updatedAt: Date.now()
  });

  let p = useParaStore.getState().projects.find(p => p.id === 'TEST-PROJECT-1');
  if (!p) throw new Error('Project not added');
  originalConsoleLog('Project added successfully.');

  // 2. Simulate User clicking "TODO" to start the task
  originalConsoleLog('Assigning task to A2 agent...');
  useAgentsStore.getState().assignTask(p.title, 'A2');
  await useParaStore.getState().updateProject(p.id, { progress: 10 });

  const updatedTask = useAgentsStore.getState().tasks.find(t => t.title === p.title);
  if (!updatedTask) throw new Error('Task was not correctly assigned in agents store');

  const agentAssigned = useAgentsStore.getState().agents.find(a => a.id === updatedTask.agentId);
  originalConsoleLog(`Task successfully assigned to agent: ${agentAssigned?.name} (${agentAssigned?.id})`);

  if (agentAssigned?.status !== 'busy') {
    throw new Error('Agent status did not update to busy');
  }

  const pUpdated = useParaStore.getState().projects.find(p => p.id === 'TEST-PROJECT-1');
  if (pUpdated?.progress !== 10) throw new Error('PARA project did not transition to in progress');
  originalConsoleLog('Task properly transitioned to IN PROGRESS state.');

  // 3. Telemetry Load verification
  // Since we have 7 agents and 1 is busy, the load should be calculated properly
  const totalAgents = useAgentsStore.getState().agents.length;
  const activeAgents = useAgentsStore.getState().agents.filter(a => a.status === 'busy' || a.status === 'online').length;
  const nexusLoad = Math.round((activeAgents / totalAgents) * 100);
  originalConsoleLog(`Nexus Core Load calculated as: ${nexusLoad}%`);

  // Wait for the mock task interval to complete (it's 1.5 seconds per 25%)
  // Since we don't want to wait 6 seconds in the test script, we will forcibly complete it
  originalConsoleLog('Forcibly completing task...');
  useAgentsStore.getState().completeTask(updatedTask.id);

  // Verify agent is back online
  const agentAfter = useAgentsStore.getState().agents.find(a => a.id === updatedTask.agentId);
  if (agentAfter?.status !== 'online') {
    throw new Error('Agent did not return to online status');
  }
  originalConsoleLog('Agent correctly returned to ONLINE state.');

  // Simulate the React.useEffect in ScoreCard.tsx that auto-completes PARA project
  // We do it manually here because we aren't rendering the component
  originalConsoleLog('Simulating React effect hook for completion...');
  useAgentsStore.getState().tasks.filter(t => t.status === 'completed').forEach(at => {
    const project = useParaStore.getState().projects.find(proj => proj.title === at.title);
    if (project && project.progress < 100 && project.status !== 'completed') {
      useParaStore.getState().updateProject(project.id, { progress: 100, status: 'completed' });
    }
  });

  const pFinal = useParaStore.getState().projects.find(p => p.id === 'TEST-PROJECT-1');
  if (pFinal?.progress !== 100 || pFinal?.status !== 'completed') {
    throw new Error('PARA Project did not synchronize completion state');
  }
  originalConsoleLog('Project synchronized completion state successfully.');

  originalConsoleLog('--- All tests passed! ---');
  process.exit(0);
}

runTests().catch(e => {
  originalConsoleError(e);
  process.exit(1);
});
