import process from "node:process";
import type { GridSize } from "@hidarikani/game-of-life-engine";
import {
  initGame,
  listPatterns,
  selectPattern,
  tick,
} from "./src/game/game.ts";
import {
  enterAltScreen,
  getSize,
  handleArguments,
  leaveAltScreen,
  write,
} from "./src/terminal/terminal.ts";
import { renderApp } from "./src/ui/App.tsx";
import { createStdinBridge } from "./src/ui/stdin-bridge.ts";
import type { CLIArgs } from "./src/types/terminal.ts";

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
  const size = getSize();
  // Ink terminates every frame with a newline, so a frame as tall as the
  // terminal would scroll the alternate screen by one row on each render.
  // The app may therefore occupy rows - 1 lines, one of which is the
  // toolbar; the grid gets the rest.
  const appHeight = Math.max(2, size.h - 1);
  size.h = appHeight - 1;

  const initialFrame = initGame(size, patternKey);

  await enterAltScreen();
  const bridge = createStdinBridge();
  try {
    const app = renderApp(
      {
        initialFrame,
        initialPatternKey: patternKey,
        appHeight,
        patterns: listPatterns(),
        onTick: tick,
        onSelectPattern: selectPattern,
      },
      bridge.stdin,
    );
    await app.waitUntilExit();
  } finally {
    bridge.stop();
    await leaveAltScreen();
  }

  // Ink's stdin handling keeps the Deno event loop alive after unmount, so
  // the process must exit explicitly.
  process.exit(0);
}

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
