export interface ToolContext {
  json?: boolean;
  brief?: boolean;
  names?: boolean;
}

export interface ToolResult {
  data: any;
  text: string;
}

export interface Tool {
  name: string;
  description: string;
  execute: (args: string[], ctx: ToolContext) => Promise<ToolResult>;
}

const tools: Tool[] = [];

export function registerTool(tool: Tool) {
  tools.push(tool);
}

export function getTool(name: string): Tool | undefined {
  return tools.find(t => t.name === name);
}

export function getAllTools(): Tool[] {
  return [...tools];
}

// ---------------------------------------------------------
// Default Registered Tools for PRD-021
// ---------------------------------------------------------

registerTool({
  name: 'tools list',
  description: 'Liste tous les outils disponibles dans le registre unifié.',
  execute: async (args, ctx) => {
    const list = tools.map(t => ({ name: t.name, description: t.description }));

    if (ctx.names) {
      const names = list.map(t => t.name);
      return { data: names, text: names.join('\n') };
    }

    if (ctx.brief) {
      const briefText = list.map(t => t.name).join(', ');
      return { data: list, text: briefText };
    }

    const text = list.map(t => `- ${t.name}: ${t.description}`).join('\n');
    return { data: list, text };
  }
});

registerTool({
  name: '12wy status',
  description: 'Renvoie le statut et le score synthétique du 12 Week Year.',
  execute: async (args, ctx) => {
    const data = {
      status: 'active',
      week: 4,
      score: 85.5,
      goal: 'Launch MVP'
    };

    if (ctx.brief) {
      return { data, text: `W${data.week} - Score: ${data.score}%` };
    }

    return {
      data,
      text: `12WY Status: ${data.status.toUpperCase()}\nCurrent Week: ${data.week}/12\nExecution Score: ${data.score}%\nActive Goal: ${data.goal}`
    };
  }
});

registerTool({
  name: 'ikigai list',
  description: 'Renvoie les horizons et visions (Ikigai).',
  execute: async (args, ctx) => {
    const data = {
      horizons: ['H90: Tech Independence', 'H365: Sustainable Revenue'],
      visions: ['Solarpunk Future', 'AI-Native Workflow']
    };

    if (ctx.names) {
      return { data, text: [...data.horizons, ...data.visions].join('\n') };
    }

    if (ctx.brief) {
      return { data, text: `${data.horizons.length} horizons, ${data.visions.length} visions` };
    }

    return {
      data,
      text: `Ikigai Horizons:\n${data.horizons.map(h => '  - ' + h).join('\n')}\n\nVisions:\n${data.visions.map(v => '  - ' + v).join('\n')}`
    };
  }
});

registerTool({
  name: 'para projects',
  description: 'Renvoie les projets actifs Picard.',
  execute: async (args, ctx) => {
    const data = [
      { id: 'PRJ-001', name: 'Life OS 2026', status: 'active' },
      { id: 'PRJ-002', name: 'Business Bridge', status: 'active' },
      { id: 'PRJ-003', name: 'Solarpunk Generator', status: 'paused' }
    ];

    const activeProjects = data.filter(p => p.status === 'active');

    if (ctx.names) {
      return { data: activeProjects, text: activeProjects.map(p => p.name).join('\n') };
    }

    if (ctx.brief) {
      return { data: activeProjects, text: `Active Projects: ${activeProjects.length}` };
    }

    return {
      data: activeProjects,
      text: `Active Picard Projects:\n${activeProjects.map(p => `  [${p.id}] ${p.name}`).join('\n')}`
    };
  }
});
