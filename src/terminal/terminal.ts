import type { GridSize } from "@cell-auto/game-of-life-engine";
import type { NonInteractiveArgs, ValidArgs } from "../types/terminal.ts";
import { ArgSchema } from "../types/terminal.ts";

import { parseArgs } from "@std/cli/parse-args";
import * as v from "@valibot/valibot";

import {
  ALTERNATE_SCREEN_ENTER,
  ALTERNATE_SCREEN_EXIT,
  CLI_ARGS,
  CURSOR_HIDE,
  CURSOR_SHOW,
  DEFAULT_GRID_HEIGHT as DEFAULT_GRID_HEIGHT,
  DEFAULT_GRID_WIDTH as DEFAULT_GRID_WIDTH,
} from "../constants.ts";

import {
  initGame,
  listPatterns,
  renderPatternPreview,
  renderPlacement,
  selectPattern,
  tick,
} from "../game/game.ts";
import { renderApp } from "../ui/App.tsx";
import { createStdinBridge } from "../ui/stdin-bridge.ts";

export function handleArguments(): ValidArgs {
  /*
   * parseArgs coerces numeric-looking args to numbers unless they're listed in
   * options.string or options.boolean. All args are deliberately listed in
   * options.string so valibot handles conversion (with more control), and
   * options.default is omitted because valibot handles defaults too.
   */
  const args = parseArgs(
    Deno.args,
    {
      string: [
        CLI_ARGS.INTERACTIVE,
        CLI_ARGS.PATTERN_KEY,
        CLI_ARGS.GRID_WIDTH,
        CLI_ARGS.GRID_HEIGHT,
        CLI_ARGS.GENERATIONS,
      ],
    },
  );

  const { _, ...onlyKnown } = args;
  return v.parse(ArgSchema, onlyKnown);
}

const encoder = new TextEncoder();

export async function write(s: string) {
  await Deno.stdout.write(encoder.encode(s));
}

export function getSize(): GridSize {
  try {
    const { columns, rows } = Deno.consoleSize();
    return { w: Math.floor(columns / 2), h: rows };
  } catch {
    return { w: DEFAULT_GRID_WIDTH, h: DEFAULT_GRID_HEIGHT };
  }
}

export async function enterAltScreen() {
  await write(ALTERNATE_SCREEN_ENTER);
  await write(CURSOR_HIDE);
}

export async function leaveAltScreen() {
  await write(CURSOR_SHOW);
  await write(ALTERNATE_SCREEN_EXIT);
}

export async function enterNonInteractiveMode(args: NonInteractiveArgs) {
  const size: GridSize = {
    w: args[CLI_ARGS.GRID_WIDTH],
    h: args[CLI_ARGS.GRID_HEIGHT],
  };

  try {
    await write("\nInitial Seed ===\n\n");
    await write(initGame(size, args[CLI_ARGS.PATTERN_KEY]));

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

export async function enterInteractiveMode(patternKey: string) {
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
        gridSize: size,
        patterns: listPatterns(),
        onTick: tick,
        onRenderPreview: renderPatternPreview,
        onRenderPlacement: renderPlacement,
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
