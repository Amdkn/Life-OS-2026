/**
 * test-assistant-overlay.ts
 * Executable runner to verify the assistant store logic.
 * Usage: npx tsx scripts/test-assistant-overlay.ts
 */

import { useAssistantStore } from '../src/stores/assistant.store';

async function main() {
  console.log('--- Initial State ---');
  let state = useAssistantStore.getState();
  console.log('activeFrameworkId:', state.activeFrameworkId);
  console.log('activeAgentId:', state.activeAgentId);
  console.log('chatOpen:', state.chatOpen);

  console.log('\n--- Setting Active Framework ---');
  state.setActiveFramework('FW01');
  state = useAssistantStore.getState();
  console.log('activeFrameworkId:', state.activeFrameworkId);
  if (state.activeFrameworkId !== 'FW01') throw new Error('Failed to set framework');

  console.log('\n--- Setting Active Agent ---');
  state.setActiveAgent('a1-beth');
  state = useAssistantStore.getState();
  console.log('activeAgentId:', state.activeAgentId);
  if (state.activeAgentId !== 'a1-beth') throw new Error('Failed to set agent');

  console.log('\n--- Toggling Chat ---');
  state.toggleChat(true);
  state = useAssistantStore.getState();
  console.log('chatOpen:', state.chatOpen);
  if (!state.chatOpen) throw new Error('Failed to open chat');

  console.log('\n--- Changing Framework (should reset agent and chat) ---');
  state.setActiveFramework('FW02');
  state = useAssistantStore.getState();
  console.log('activeFrameworkId:', state.activeFrameworkId);
  console.log('activeAgentId:', state.activeAgentId);
  console.log('chatOpen:', state.chatOpen);

  if (state.activeFrameworkId !== 'FW02') throw new Error('Failed to update framework');
  if (state.activeAgentId !== null) throw new Error('Agent should be reset on framework change');
  if (state.chatOpen !== false) throw new Error('Chat should be closed on framework change');

  console.log('\n✅ All tests passed.');
}

main().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
