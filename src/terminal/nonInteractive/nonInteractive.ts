import type {
  NonInteractiveArgs,
  ViewportSize,
} from "../../types/terminal.ts";

import { GRID_MODES, type GridSize } from "@cell-auto/game-of-life-engine";

import { makeEngine, makeGeneration } from "../../context/engine/engine.tsx";
import { ORIGIN } from "../../next/constants.ts";
import { CLI_ARGS, SEPARATOR_WIDTH } from "../terminal.const.ts";
import { makePatternLib } from "../../context/pattern/pattern.tsx";



const encoder = new TextEncoder();

export async function write(s: string) {
  await Deno.stdout.write(encoder.encode(s));
}

export function getSize(): ViewportSize {
  return Deno.consoleSize();
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

  await writeHeading("InitialSeed");
  const patternLib = makePatternLib();

  const firstGeneration = makeGeneration(
    patternLib,
    {
      patternKey: args[CLI_ARGS.PATTERN].key,
      patternOffset: ORIGIN,
      patternGeneration: 0,
      gridSize,
      gridMode: GRID_MODES.FINITE,
    },
  );

  const engine = makeEngine(
    firstGeneration,
  );
  await write(engine.toString());

  if (args.generations > 1) {
    for (let i = 1; i < args.generations; i++) {
      await writeHeading(`Generation ${i}`);
      engine.evolveGrid();
      await write(engine.toString());
    }
  }
}
