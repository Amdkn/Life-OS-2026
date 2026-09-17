#!/usr/bin/env node

// 1. Setup Global Mocks for Zustand and IDB
import 'fake-indexeddb/auto';

// Setup React mock to bypass hook limitations in Node
// We mock React properties using defineProperty in case they are read-only module exports in Node

// 2. Setup env fallbacks (avoid mocking import.meta.env globally, just use process.env where needed)
if (typeof process.env.VITE_BLACKBOARD_API_URL === 'undefined') {
  process.env.VITE_BLACKBOARD_API_URL = 'http://localhost:3001/api/bridge/events';
}

// 3. Imports
import { registry } from '../src/lib/tooling/registry';
import { CliAdapter } from '../src/lib/tooling/adapters/cli';

import { useTwelveWeekStore } from '../src/stores/fw-12wy.store';
import { useIkigaiStore } from '../src/stores/fw-ikigai.store';
import { useParaStore } from '../src/stores/fw-para.store';
import { getEvents } from '../src/lib/blackboard/client';

// 4. Register Tools

registry.register({
  name: 'tools list',
  description: 'List available tools in the registry',
  validateArgs: (args: any) => {
    if (args.positional && args.positional.length > 0) {
      throw new Error(`Command 'tools list' takes no arguments, got: ${args.positional.join(' ')}`);
    }
  },
  handler: () => {
    return registry.list().map(t => ({ name: t.name, description: t.description }));
  }
});

registry.register({
  name: '12wy status',
  description: 'Get current cycle status and weekly score',
  validateArgs: (args: any) => {
    if (args.positional && args.positional.length > 0) {
      throw new Error(`Command '12wy status' takes no arguments, got: ${args.positional.join(' ')}`);
    }
  },
  handler: async () => {
    await useTwelveWeekStore.getState().hydrate();
    const activeWeek = useTwelveWeekStore.getState().activeWeek;
    const weekNumber = activeWeek === 'all' ? 1 : activeWeek;

    // Extract score manually because mocking React ES modules in Node 22 is restrictive.
    // The PRD requires using 'useWeeklyScore' definition but it can't be mounted without JSDOM.
    // Thus we compute it directly based on the exact same logic.
    const tactics = useTwelveWeekStore.getState().tactics;
    const weekTactics = tactics.filter(t => t.week === weekNumber);
    const totalCount = weekTactics.length;
    let scoreData;

    if (totalCount === 0) {
      scoreData = { score: 0, isCrit: true, hasTactics: false };
    } else {
      const completedCount = weekTactics.filter(t => t.status === 'completed').length;
      const percentage = Math.round((completedCount / totalCount) * 100);
      scoreData = { score: percentage, isCrit: percentage < 85, hasTactics: true };
    }

    return {
      activeWeek: weekNumber,
      score: scoreData?.score || 0,
      isCrit: scoreData?.isCrit || false,
      hasTactics: scoreData?.hasTactics || false
    };
  }
});

registry.register({
  name: 'ikigai list',
  description: 'List ikigai visions',
  validateArgs: (args: any) => {
    if (args.positional && args.positional.length > 0) {
      throw new Error(`Command 'ikigai list' takes no arguments, got: ${args.positional.join(' ')}`);
    }
  },
  handler: async () => {
    await useIkigaiStore.getState().hydrate();
    return useIkigaiStore.getState().visions;
  }
});

registry.register({
  name: 'para projects',
  description: 'List PARA projects',
  validateArgs: (args: any) => {
    if (args.positional && args.positional.length > 0) {
      throw new Error(`Command 'para projects' takes no arguments, got: ${args.positional.join(' ')}`);
    }
  },
  handler: async () => {
    // Zustand persists projects or initializes them
    const projects = useParaStore.getState().projects;
    return projects;
  }
});

registry.register({
  name: 'blackboard events',
  requiredScopes: ['read'],
  description: 'Fetch flux of recent blackboard events',
  validateArgs: (args: any) => {
    if (args.positional && args.positional.length > 0) {
      throw new Error(`Command 'blackboard events' takes no arguments, got: ${args.positional.join(' ')}`);
    }
  },
  handler: async () => {
    try {
      const events = await getEvents();
      return events;
    } catch (e: any) {
      // Return a simulated structured error or just throw
      throw new Error(`Failed to fetch events: ${e.message}`);
    }
  }
});

// 5. Execute CLI Adapter
const adapter = new CliAdapter();
adapter.execute(process.argv).catch(console.error);
