import { registry, ToolContext } from '../registry';

export interface CliOptions {
  json?: boolean;
  brief?: boolean;
  names?: boolean;
}

export class CliAdapter {
  async execute(argv: string[]) {
    const args = argv.slice(2);

    // Parse flags
    const options: CliOptions = {
      json: args.includes('--json'),
      brief: args.includes('--brief'),
      names: args.includes('--names')
    };

    // Filter out flags to get the command and its positional args
    const commandArgs = args.filter(a => !a.startsWith('--'));

    if (commandArgs.length === 0) {
      if (!options.json && !options.brief && !options.names) {
        console.log('Available tools:');
        registry.list().forEach(t => console.log(`  - ${t.name}`));
      }
      return;
    }

    // Heuristic: commands can be single word like "tools list" -> which could be registered as "tools list"
    // Let's match the longest registered tool name
    let matchedToolName = '';
    let matchedToolArgs: string[] = [];

    // Try joining up to all words
    for (let i = commandArgs.length; i > 0; i--) {
      const potentialName = commandArgs.slice(0, i).join(' ');
      if (registry.get(potentialName)) {
        matchedToolName = potentialName;
        matchedToolArgs = commandArgs.slice(i);
        break;
      }
    }

    if (!matchedToolName) {
      if (options.json) {
        console.log(JSON.stringify({ error: `Tool not found for command: ${commandArgs.join(' ')}` }));
      } else {
        console.error(`Error: Tool not found for command: ${commandArgs.join(' ')}`);
      }
      process.exit(1);
    }

    const tool = registry.get(matchedToolName)!;
    const context: ToolContext = { source: 'cli' };

    try {
      const parsedArgs = { positional: matchedToolArgs };

      // Enforce argument validation (Rule #1)
      if (tool.validateArgs) {
        tool.validateArgs(parsedArgs);
      }

      const result = await tool.handler(parsedArgs, context);

      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else if (options.brief) {
        if (Array.isArray(result)) {
          // If array and brief, maybe print 1 line per result? The spec says:
          // "--brief (1 ligne par résultat, idéal contexte LLM)"
          result.forEach(item => console.log(JSON.stringify(item)));
        } else if (typeof result === 'object' && result !== null) {
          console.log(JSON.stringify(result));
        } else {
          console.log(result);
        }
      } else if (options.names) {
        if (Array.isArray(result)) {
          result.forEach(item => {
            const name = item.name || item.title || item.id || JSON.stringify(item);
            console.log(name);
          });
        } else {
          console.log(result.name || result.title || result.id || 'No name available');
        }
      } else {
        // Default text output
        console.log(JSON.stringify(result, null, 2));
      }

    } catch (e: any) {
      if (options.json) {
        console.log(JSON.stringify({ error: e.message }));
      } else {
        console.error(`Error executing tool: ${e.message}`);
      }
      process.exit(1);
    }
  }
}
