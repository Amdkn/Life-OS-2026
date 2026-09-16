import { getTool, ToolContext } from '../registry';

export async function runCli(argv: string[]) {
  // Parsing args and flags
  const args: string[] = [];
  const ctx: ToolContext = {
    json: false,
    brief: false,
    names: false,
  };

  for (const arg of argv) {
    if (arg === '--json') {
      ctx.json = true;
    } else if (arg === '--brief') {
      ctx.brief = true;
    } else if (arg === '--names') {
      ctx.names = true;
    } else {
      args.push(arg);
    }
  }

  if (args.length === 0) {
    console.error('Usage: life-os <command> [subcommand] [args...] [--json] [--brief] [--names]');
    process.exit(1);
  }

  // Determine the command name (it can be multi-word like "tools list" or "12wy status")
  // We'll try to match up to 2 words.
  let commandName = args[0];
  let commandArgs = args.slice(1);

  if (args.length >= 2) {
    const twoWordCommand = `${args[0]} ${args[1]}`;
    if (getTool(twoWordCommand)) {
      commandName = twoWordCommand;
      commandArgs = args.slice(2);
    }
  }

  const tool = getTool(commandName);

  if (!tool) {
    console.error(`Unknown command: ${commandName}`);
    process.exit(1);
  }

  try {
    const result = await tool.execute(commandArgs, ctx);

    if (ctx.json) {
      console.log(JSON.stringify(result.data, null, 2));
    } else {
      console.log(result.text);
    }
  } catch (error: any) {
    if (ctx.json) {
      console.error(JSON.stringify({ error: error.message || String(error) }));
    } else {
      console.error(`Error executing ${commandName}:`, error.message || String(error));
    }
    process.exit(1);
  }
}
