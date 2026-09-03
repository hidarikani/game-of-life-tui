import { parseArgs } from "@std/cli/parse-args";
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
import type { GridSize } from "@hidarikani/game-of-life-engine";
import { MIN_GRID_SIZE } from "../constants.ts";
import type { CLIArgs } from "../types/terminal.ts";

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
