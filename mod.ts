import { GridSize } from "@hidarikani/game-of-life-engine";
import {
  KEY_QUIT_LOWER,
  KEY_QUIT_UPPER,
  KEY_REFRESH_LOWER,
  KEY_REFRESH_UPPER,
} from "./src/constants.ts";
import { initGame, tick } from "./src/game/game.ts";
import {
  clearScreen,
  disableRawMode,
  enableRawMode,
  enterAltScreen,
  getSize,
  handleArguments,
  leaveAltScreen,
  readKey,
  write,
} from "./src/terminal/terminal.ts";
import { CLIArgs } from "./src/types/terminal.ts";

async function doNonInteractive(args: CLIArgs) {
  const size: GridSize = {
    w: args.gridWidth,
    h: args.gridHeight,
  };

  try {
    await write("\nInitial Seed ===\n\n");
    await write(initGame(size, args.patternKey));

    if (args.generations > 1) {
      for (let i = 1; i < args.generations; i++) {
        await write(`\nGeneration ${i} ===\n\n`);
        await write(tick());
      }
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    Deno.exit(1);
  }
}

async function doInteractive(patternKey: string) {
  await enterAltScreen();
  try {
    await clearScreen();
    const size = getSize();

    await write(initGame(size, patternKey));

    enableRawMode();

    while (true) {
      const ch = await readKey();
      if (ch === null) break;
      if (ch === KEY_QUIT_LOWER || ch === KEY_QUIT_UPPER) break;
      if (ch === KEY_REFRESH_LOWER || ch === KEY_REFRESH_UPPER) {
        await clearScreen();
        await write(tick());
      }
    }
  } finally {
    disableRawMode();
    await leaveAltScreen();
  }
}

async function main() {
  const args = handleArguments();
  if (args.interactive) {
    await doInteractive(args.patternKey);
  } else {
    await doNonInteractive(args);
  }
}

await main();
