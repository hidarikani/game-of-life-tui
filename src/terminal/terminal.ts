import type {
  InteractiveArgs,
  NonInteractiveArgs,
  ValidArgs,
  ViewportSize,
} from "../types/terminal.ts";
import { ArgSchema } from "../types/terminal.ts";

import { parseArgs } from "@std/cli/parse-args";
import * as v from "@valibot/valibot";
import {
  type Engine,
  GRID_MODES,
  type GridSize,
} from "@cell-auto/game-of-life-engine";

import {
  ALTERNATE_SCREEN_ENTER,
  ALTERNATE_SCREEN_EXIT,
  CLI_ARGS,
  CURSOR_HIDE,
  CURSOR_SHOW,
  ORIGIN,
  SEPARATOR_WIDTH,
} from "../constants/constants.ts";

import { renderRoot } from "../ui/GRoot.tsx";
import { createStdinBridge } from "./stdin/stdin-bridge.ts";
import { UNKNOWN_CONSOLE_SIZE } from "../constants/messages.ts";
import { makeEngine } from "../engine/engine.tsx";
import {
  setPatternKey,
  setPatternOffset,
} from "../store/firstGenerationSlice.ts";
import { makePatternLib } from "../pattern/pattern.tsx";
import type { FirstGenerationProps } from "../types/state.ts";
import { store } from "../store/store.ts";
import { setColumns, setRows } from "../store/terminalSlice.ts";

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
        CLI_ARGS.PATTERN,
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

export function getSize(): ViewportSize {
  try {
    return Deno.consoleSize();
  } catch {
    throw new Error(UNKNOWN_CONSOLE_SIZE);
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

function genSeparatorLine(len: number = SEPARATOR_WIDTH.MAX): string {
  let acc = "";

  for (let i = 0; i < len; i++) {
    acc += "=";
  }

  return acc;
}

async function writeHeading(msg: string) {
  const separatorLen = SEPARATOR_WIDTH.MAX - msg.length - 1;
  const separator = genSeparatorLine(separatorLen);
  await write(`\n${msg} ${separator}\n\n`);
}

export async function enterNonInteractiveMode(args: NonInteractiveArgs) {
  const gridSize: GridSize = {
    w: args[CLI_ARGS.GRID_WIDTH],
    h: args[CLI_ARGS.GRID_HEIGHT],
  };

  try {
    await writeHeading("InitialSeed");
    const patternLib = makePatternLib();
    const firstGeneration: FirstGenerationProps = {
      patternKey: args[CLI_ARGS.PATTERN].key,
      patternOffset: ORIGIN,
      patternGeneration: 0,
      gridSize,
      gridMode: GRID_MODES.FINITE,
    };

    const engine = makeEngine(
      patternLib,
      firstGeneration,
    );
    await write((engine as Engine).toString());

    if (args.generations > 1) {
      for (let i = 1; i < args.generations; i++) {
        await writeHeading(`Generation ${i}`);
        (engine as Engine).evolveGrid();
        await write((engine as Engine).toString());
      }
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    Deno.exit(1);
  }
}

export async function enterInteractiveMode(args: InteractiveArgs) {
  const terminalSize = getSize();
  await enterAltScreen();
  const bridge = createStdinBridge();
  try {
    const pattern = args[CLI_ARGS.PATTERN];
    const patternOffset = ORIGIN;
    store.dispatch(setRows(terminalSize.rows));
    store.dispatch(setColumns(terminalSize.columns));
    store.dispatch(setPatternKey(pattern.key));
    store.dispatch(setPatternOffset(patternOffset));
    const app = renderRoot(
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
