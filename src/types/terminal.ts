import { MIN_GRID_SIZE } from "@cell-auto/game-of-life-engine";
import * as v from "@valibot/valibot";

import { getPatternLib } from "../pattern/pattern.ts";
import { genMsgPatternNotFound } from "../constants/messages.ts";
import { CLI_ARGS, MIN_GENERATIONS, PATTERN_KEYS } from "../constants/constants.ts";

const NonEmptyString = v.pipe(v.string(), v.trim(), v.nonEmpty());

const PatternPipe = v.optional(
  v.pipe(
    NonEmptyString,
    v.rawTransform(({ dataset, addIssue, NEVER }) => {
      const pattern = getPatternLib().getPatternByKey(dataset.value);
      if (pattern === null) {
        addIssue({ message: genMsgPatternNotFound(dataset.value) });
        return NEVER;
      }
      return pattern;
    }),
  ),
  PATTERN_KEYS.PULSAR,
);

const GridSizePipe = v.pipe(
  NonEmptyString,
  v.toNumber(),
  v.integer(),
  v.minValue(MIN_GRID_SIZE),
);

const GenerationsPipe = v.optional(
  v.pipe(
    NonEmptyString,
    v.toNumber(),
    v.integer(),
    v.minValue(MIN_GENERATIONS),
  ),
  MIN_GENERATIONS.toString(),
);

export const ArgSchema = v.variant("interactive", [
  v.strictObject({
    [CLI_ARGS.INTERACTIVE]: v.pipe(
      v.literal("true"),
      v.transform(() => true as const),
    ),
    [CLI_ARGS.PATTERN]: PatternPipe,
  }),
  v.strictObject({
    [CLI_ARGS.INTERACTIVE]: v.pipe(
      v.literal("false"),
      v.transform(() => false as const),
    ),
    [CLI_ARGS.PATTERN]: PatternPipe,
    [CLI_ARGS.GRID_WIDTH]: GridSizePipe,
    [CLI_ARGS.GRID_HEIGHT]: GridSizePipe,
    [CLI_ARGS.GENERATIONS]: GenerationsPipe,
  }),
]);

export type ValidArgs = v.InferOutput<typeof ArgSchema>;

export type InteractiveArgs = Extract<ValidArgs, { interactive: true }>;
export type NonInteractiveArgs = Extract<ValidArgs, { interactive: false }>;

export type RawStdin = { setRaw?: (mode: boolean) => void };
