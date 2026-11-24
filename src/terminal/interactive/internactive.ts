import type { InteractiveArgs, ViewportSize } from "../../types/terminal.ts";

import { GRID_MODES } from "@cell-auto/game-of-life-engine";

import { renderRoot } from "../../ui/root.tsx";
import { createStdinBridge } from "../stdin/stdin-bridge.ts";
import { makeGeneration } from "../../context/engine/engine.tsx";
import {
  setLiveCells,
  setPatternKey,
  setPatternOffset,
} from "../../store/firstGeneration/firstGenerationSlice.ts";
import { store } from "../../store/store.ts";
import {
  selectGridSize,
  setColumns,
  setRows,
} from "../../store/terminal/terminalSlice.ts";
import { ORIGIN } from "../../next/constants.ts";
import { CLI_ARGS } from "../terminal.const.ts";
import { makePatternLib } from "../../context/pattern/pattern.tsx";

const encoder = new TextEncoder();

export async function write(s: string) {
  await Deno.stdout.write(encoder.encode(s));
}

export function getSize(): ViewportSize {
  return Deno.consoleSize();
}

export async function enterInteractiveMode(args: InteractiveArgs) {
  const terminalSize = getSize();
  const bridge = createStdinBridge();
  try {
    const pattern = args[CLI_ARGS.PATTERN];
    const patternOffset = ORIGIN;
    store.dispatch(setRows(terminalSize.rows));
    store.dispatch(setColumns(terminalSize.columns));
    store.dispatch(setPatternKey(pattern.key));
    store.dispatch(setPatternOffset(patternOffset));
    const gridSize = selectGridSize(store.getState());
    const patternLib = makePatternLib();
    const firstGeneration = makeGeneration(
      patternLib,
      {
        patternKey: pattern.key,
        patternOffset,
        gridSize,
        patternGeneration: 0,
        gridMode: GRID_MODES.TOROIDAL,
      },
    );
    const liveCells = firstGeneration.liveCells;
    store.dispatch(setLiveCells([...liveCells]));

    const app = renderRoot(
      bridge.stdin,
    );
    await app.waitUntilExit();
  } finally {
    bridge.stop();
  }

  // Ink's stdin handling keeps the Deno event loop alive after unmount, so
  // the process must exit explicitly.
  process.exit(0);
}
