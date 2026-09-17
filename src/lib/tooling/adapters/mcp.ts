import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { useTwelveWeekStore } from '../../../stores/fw-12wy.store.js';
import { useLifeWheelStore } from '../../../stores/fw-wheel.store.js';
import { appendEvent, BlackboardEvent } from '../../blackboard/client.js';
import 'fake-indexeddb/auto'; // Mock indexeddb for the frontend stores since it runs in node

export const life_os_get_tactics = async (week: number, cycleId?: string) => {
  const state = useTwelveWeekStore.getState();
  if (!state.isHydrated) {
    await state.hydrate();
  }
  let tactics = useTwelveWeekStore.getState().tactics;
  if (week) {
    tactics = tactics.filter(t => t.week === week);
  }
  return tactics;
};

export const life_os_update_tactic = async (tacticId: string, status: 'pending' | 'completed' | 'failed'): Promise<void> => {
  const state = useTwelveWeekStore.getState();
  if (!state.isHydrated) {
    await state.hydrate();
  }
  await state.updateTacticStatus(tacticId, status);
};

export const life_os_get_wheel_domains = async () => {
  const state = useLifeWheelStore.getState();
  if (!state.isHydrated) {
    await state.hydrate();
  }
  return useLifeWheelStore.getState().domains;
};

export const life_os_blackboard_post = async (workspaceId: string | null, eventType: string, payload: any): Promise<BlackboardEvent> => {
  const event: BlackboardEvent = {
    id: crypto.randomUUID(),
    workspace_id: workspaceId,
    actor_id: 'mcp-server',
    actor_layer: 'mcp',
    event_type: eventType,
    payload_json: JSON.stringify(payload),
    timestamp: Date.now()
  };
  return appendEvent(event);
};

// Ensure all console.log output goes to stderr to keep stdout clean for JSON-RPC
const originalConsoleLog = console.log;
console.log = (...args) => {
    console.error(...args);
};

export function createMCPServer() {
  const server = new Server(
    {
      name: "life-os-mcp",
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "life_os_get_tactics",
          description: "Retrieve 12WY tactics",
          inputSchema: {
            type: "object",
            properties: {
              week: {
                type: "number",
                description: "The week number (1-12)",
              },
              cycleId: {
                type: "string",
                description: "The 12WY cycle ID",
              },
            },
            required: ["week"],
          },
        },
        {
          name: "life_os_update_tactic",
          description: "Update the status of a 12WY tactic",
          inputSchema: {
            type: "object",
            properties: {
              tacticId: {
                type: "string",
                description: "The ID of the tactic to update",
              },
              status: {
                type: "string",
                enum: ["pending", "completed", "failed"],
                description: "The new status",
              },
            },
            required: ["tacticId", "status"],
          },
        },
        {
          name: "life_os_get_wheel_domains",
          description: "Retrieve the state of the Life Wheel domains (LD01-LD08)",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "life_os_blackboard_post",
          description: "Direct injection of events into the Blackboard",
          inputSchema: {
            type: "object",
            properties: {
              workspaceId: {
                type: "string",
                description: "The workspace ID",
              },
              eventType: {
                type: "string",
                description: "The type of the event",
              },
              payload: {
                type: "object",
                description: "The event payload",
              },
            },
            required: ["eventType", "payload"],
          },
        },
      ],
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      if (request.params.name === "life_os_get_tactics") {
        const args = request.params.arguments as { week: number, cycleId?: string };
        const tactics = await life_os_get_tactics(args.week, args.cycleId);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(tactics),
            },
          ],
        };
      } else if (request.params.name === "life_os_update_tactic") {
        const args = request.params.arguments as { tacticId: string, status: 'pending' | 'completed' | 'failed' };
        await life_os_update_tactic(args.tacticId, args.status);
        return {
          content: [
            {
              type: "text",
              text: "Success",
            },
          ],
        };
      } else if (request.params.name === "life_os_get_wheel_domains") {
        const domains = await life_os_get_wheel_domains();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(domains),
            },
          ],
        };
      } else if (request.params.name === "life_os_blackboard_post") {
        const args = request.params.arguments as { workspaceId: string | null, eventType: string, payload: any };
        const event = await life_os_blackboard_post(args.workspaceId, args.eventType, args.payload);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(event),
            },
          ],
        };
      } else {
        throw new Error(`Unknown tool: ${request.params.name}`);
      }
    } catch (error: any) {
      console.error(`Error executing tool ${request.params.name}:`, error);
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: error.message || String(error),
          },
        ],
      };
    }
  });

  return server;
}

export async function runServer() {
  const server = createMCPServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

runServer().catch((error) => {
  console.error("Fatal error running MCP server:", error);
  process.exit(1);
});
