import { parseArgs } from "@std/cli/parse-args";
import {
  ALTERNATE_SCREEN_ENTER,
  ALTERNATE_SCREEN_EXIT,
  CURSOR_HIDE,
  CURSOR_HOME,
  CURSOR_SHOW,
  DEFAULT_NON_INTERACTIVE_GRID_HEIGHT,
  DEFAULT_NON_INTERACTIVE_GRID_WIDTH,
  MIN_GENERATIONS,
  PATTERN_KEYS,
  SCREEN_CLEAR,
} from "./constants.ts";
import type { GridSize } from "@hidarikani/game-of-life-engine";
import { MIN_GRID_SIZE } from "./constants.ts";
import { CLIArgs } from "./types/terminal.ts";

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
        "grid-width": DEFAULT_NON_INTERACTIVE_GRID_WIDTH.toString(),
        "grid-height": DEFAULT_NON_INTERACTIVE_GRID_HEIGHT.toString(),
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

  if (!Number.isInteger(gridWidthParsed) && gridWidthParsed >= MIN_GRID_SIZE) {
    throw new Error(
      `arg grid-width must be an integer equal or larger than ${MIN_GRID_SIZE}`,
    );
  }

  if (
    !Number.isInteger(gridHeightParsed) && gridHeightParsed >= MIN_GRID_SIZE
  ) {
    throw new Error(
      `arg grid-width must be an integer equal or larger than ${MIN_GRID_SIZE}`,
    );
  }

  if (
    !Number.isInteger(generationsParsed) && generationsParsed >= MIN_GENERATIONS
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
    return { w: 40, h: 24 };
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

export async function clearScreen() {
  await write(SCREEN_CLEAR);
  await write(CURSOR_HOME);
}

type RawStdin = { setRaw?: (mode: boolean) => void };

export function enableRawMode() {
  const stdin = Deno.stdin as unknown as RawStdin;
  if (typeof stdin.setRaw === "function") {
    try {
      stdin.setRaw(true);
    } catch { /* no TTY */ }
  }
}

export function disableRawMode() {
  const stdin = Deno.stdin as unknown as RawStdin;
  if (typeof stdin.setRaw === "function") {
    try {
      stdin.setRaw(false);
    } catch { /* no TTY */ }
  }
}

const buf = new Uint8Array(1);

export async function readKey(): Promise<string | null> {
  const n = await Deno.stdin.read(buf);
  if (n === null) return null;
  return String.fromCharCode(buf[0]);
}
