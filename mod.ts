import {
  enterInteractiveMode,
  enterNonInteractiveMode,
  handleArguments,
} from "./src/terminal/terminal.ts";

async function main() {
  const args = handleArguments();
  if (args.interactive) {
    try {
      await enterInteractiveMode(args.patternKey);
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
      Deno.exit(1);
    }
  } else {
    await enterNonInteractiveMode(args);
  }
}

await main();
