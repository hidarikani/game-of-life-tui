import type { GridSize } from "@cell-auto/game-of-life-engine";
import type { CLIArgs } from "../types/terminal.ts";

import { parseArgs } from "@std/cli/parse-args";
import { MIN_GRID_SIZE } from "@cell-auto/game-of-life-engine";

import {
  ALTERNATE_SCREEN_ENTER,
  ALTERNATE_SCREEN_EXIT,
  CURSOR_HIDE,
  CURSOR_SHOW,
  DEFAULT_GRID_HEIGHT as DEFAULT_GRID_HEIGHT,
  DEFAULT_GRID_WIDTH as DEFAULT_GRID_WIDTH,
  MIN_GENERATIONS,
  PATTERN_KEYS,
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

export function handleArguments(): CLIArgs {
  const {
    interactive,
    gridWidth: gridWidthRaw,
    gridHeight: gridHeightRaw,
    patternKey,
    generations: generationsRaw,
  } = parseArgs(
    Deno.args,
    {
      boolean: ["interactive"],
      string: [
        "pattern-key",
        "grid-width",
        "grid-height",
        "generations",
      ],
      default: {
        interactive: true,
        "pattern-key": PATTERN_KEYS.PULSAR,
        "grid-width": DEFAULT_GRID_WIDTH.toString(),
        "grid-height": DEFAULT_GRID_HEIGHT.toString(),
        generations: MIN_GENERATIONS.toString(),
      },
      alias: {
        "pattern-key": "patternKey",
        "grid-width": "gridWidth",
        "grid-height": "gridHeight",
      },
      negatable: ["interactive"],
    },
  );

  const gridWidthParsed = Number(gridWidthRaw);
  const gridHeightParsed = Number(gridHeightRaw);
  const generationsParsed = Number(generationsRaw);

  if (!Number.isInteger(gridWidthParsed) || gridWidthParsed < MIN_GRID_SIZE) {
    throw new Error(
      `arg grid-width must be an integer equal or larger than ${MIN_GRID_SIZE}`,
    );
  }

  if (
    !Number.isInteger(gridHeightParsed) || gridHeightParsed < MIN_GRID_SIZE
  ) {
    throw new Error(
      `arg grid-height must be an integer equal or larger than ${MIN_GRID_SIZE}`,
    );
  }

  if (
    !Number.isInteger(generationsParsed) || generationsParsed < MIN_GENERATIONS
  ) {
    throw new Error(
      `arg "generations" must be an integer equal or larger than ${MIN_GENERATIONS}`,
    );
  }

  return {
    interactive,
    gridWidth: gridWidthParsed,
    gridHeight: gridHeightParsed,
    patternKey,
    generations: generationsParsed,
  };
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

export async function enterNonInteractiveMode(args: CLIArgs) {
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
