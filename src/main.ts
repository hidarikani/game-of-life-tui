import { GridSize } from "@hidarikani/game-of-life-engine";
import {
  KEY_QUIT_LOWER,
  KEY_QUIT_UPPER,
  KEY_REFRESH_LOWER,
  KEY_REFRESH_UPPER,
} from "./constants.ts";
import { initGame, tick } from "./game/game.ts";
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
} from "./terminal/terminal.ts";

async function doNonInteractive(
  gridWidth: number,
  gridHeight: number,
  patternKey: string,
  generations: number,
) {
  const size: GridSize = {
    w: gridWidth,
    h: gridHeight,
  };

  await write("\nInitial Seed ===\n\n");
  await write(initGame(size, patternKey));

  if (generations > 1) {
    for (let i = 0; i < generations - 1; i++) {
      await write(`\nGeneration ${i} ===\n\n`);
      await write(tick());
    }
  }
}

async function doInteractive(patternKey: string) {
  try {
    await enterAltScreen();
    await clearScreen();
    const size = getSize();

    await write(initGame(size, patternKey));
    await write(tick());

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
    doNonInteractive(
      args.gridWidth,
      args.gridHeight,
      args.patternKey,
      args.generations,
    );
  }
}

await main();
