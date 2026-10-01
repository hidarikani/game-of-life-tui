import { MIN_GRID_SIZE } from "@cell-auto/game-of-life-engine";
import * as v from "@valibot/valibot";

import { getPatternLib } from "../pattern/pattern.ts";
import {
  genMsgPatternNotFound,
  GRID_SIZE_CONFLICTS_WITH_INTERACTIVE,
} from "../constants/messages.ts";
import { MIN_GENERATIONS, PATTERN_KEYS } from "../constants.ts";

function validatePatternKey(key: string): boolean {
  const pattern = getPatternLib().getPatternByKey(key);
  return pattern !== null;
}

const patternKeyPipe = v.optional(
  v.pipe(
    v.string(),
    v.nonEmpty(),
    v.check(
      validatePatternKey,
      (issue) => genMsgPatternNotFound(issue.input),
    ),
  ),
  PATTERN_KEYS.PULSAR,
);

const gridSizePipe = v.pipe(
  v.string(),
  v.trim(),
  v.nonEmpty(),
  v.toNumber(),
  v.integer(),
  v.minValue(MIN_GRID_SIZE),
);

const generationsPipe = v.optional(
  v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty(),
    v.toNumber(),
    v.integer(),
    v.minValue(MIN_GENERATIONS),
  ),
  MIN_GENERATIONS.toString(),
);

export const argSchema = v.variant("interactive", [
  v.strictObject({
    interactive: v.literal(true),
    patternKey: patternKeyPipe,
    gridWidth: v.optional(v.never(GRID_SIZE_CONFLICTS_WITH_INTERACTIVE)),
    gridHeight: v.optional(v.never(GRID_SIZE_CONFLICTS_WITH_INTERACTIVE)),
    generations: generationsPipe,
  }),
  v.strictObject({
    interactive: v.literal(false),
    patternKey: patternKeyPipe,
    gridWidth: gridSizePipe,
    gridHeight: gridSizePipe,
    generations: generationsPipe,
  }),
]);

export type argsIn = v.InferInput<typeof argSchema>;
export type ArgsOut = v.InferOutput<typeof argSchema>;

export type CLIArgs = {
  interactive: boolean;
  patternKey: string;
  gridWidth: number;
  gridHeight: number;
  generations: number;
};

export type RawStdin = { setRaw?: (mode: boolean) => void };
