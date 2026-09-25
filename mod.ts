import {
  doInteractive,
  doNonInteractive,
  handleArguments,
} from "./src/terminal/terminal.ts";

async function main() {
  const args = handleArguments();
  if (args.interactive) {
    try {
      await doInteractive(args.patternKey);
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
      Deno.exit(1);
    }
  } else {
    await doNonInteractive(args);
  }
}

await main();
