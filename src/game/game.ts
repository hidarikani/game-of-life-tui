import { Engine, Grid, PatternLib } from "@hidarikani/game-of-life-engine";
import type {
  GridSize,
  IPatternLib,
  PatternType,
  Point,
} from "@hidarikani/game-of-life-engine";

/**
 * The subset of a pattern's metadata the UI needs to render a selection list
 * and constrain placement.
 */
export type PatternInfo = {
  key: string;
  name: string;
  type: PatternType;
  period: number;
  size: GridSize;
};

const ORIGIN: Point = { x: 0, y: 0 };

let acceptedSize: GridSize | null = null;
let acceptedPatternKey: string | null = null;
let engine: Engine | null = null;
let patternLib: null | IPatternLib = null;

export function initGame(proposedSize: GridSize, patternKey: string): string {
  if (patternLib === null) {
    patternLib = PatternLib.fromBuiltInData();
  }

  const proposedPattern = patternLib.getPatternByKey(patternKey);

  const sizeChanged = acceptedSize !== null &&
    (acceptedSize.w !== proposedSize.w || acceptedSize.h !== proposedSize.h);
  const patternChanged = acceptedPatternKey !== null &&
    acceptedPatternKey !== patternKey;

  if (sizeChanged || patternChanged) {
    engine = null;
  }

  acceptedSize = proposedSize;
  acceptedPatternKey = patternKey;

  const firstGeneration = new Grid({ gridSize: acceptedSize });

  firstGeneration.writeGrid({
    inner: proposedPattern.generations[0],
  });

  if (engine === null) {
    engine = new Engine({ firstGeneration });
  }

  return engine.toString();
}

export function tick(): string {
  if (engine === null) {
    throw new Error("Engine uninitialized. Invoke initGame first.");
  }

  engine.evolveGrid();
  return engine.toString();
}

/**
 * Lists every built-in pattern, for the pattern selection view.
 */
export function listPatterns(): PatternInfo[] {
  if (patternLib === null) {
    patternLib = PatternLib.fromBuiltInData();
  }

  return patternLib.getPatterns(null).map((
    { key, name, type, period, generations },
  ) => ({
    key,
    name,
    type,
    period,
    size: generations[0].gridSize,
  }));
}

/**
 * Renders a pattern's first generation on its own, at its natural size, for
 * the preview pane of the selection view. Needs no running simulation.
 */
export function renderPatternPreview(patternKey: string): string {
  if (patternLib === null) {
    patternLib = PatternLib.fromBuiltInData();
  }

  const inner = patternLib.getPatternByKey(patternKey).generations[0];
  const preview = new Grid({ gridSize: inner.gridSize });
  preview.writeGrid({ inner });

  return preview.toString();
}

/**
 * Builds a grid the size of the running simulation holding only the given
 * pattern, placed at `offset`. Throws when the pattern does not fit there.
 */
function buildPatternGrid(patternKey: string, offset: Point): Grid {
  if (acceptedSize === null || patternLib === null) {
    throw new Error("Engine uninitialized. Invoke initGame first.");
  }

  const pattern = patternLib.getPatternByKey(patternKey);

  const grid = new Grid({ gridSize: acceptedSize });
  grid.writeGrid({ inner: pattern.generations[0], offset });

  return grid;
}

/**
 * Renders the placement preview: the full-size grid holding only the given
 * pattern at `offset`, as shown while the user positions it.
 */
export function renderPlacement(patternKey: string, offset: Point): string {
  return buildPatternGrid(patternKey, offset).toString();
}

/**
 * Restarts the simulation with the given pattern: clears the grid and places
 * the pattern's first generation at `offset`. Returns the rendered grid.
 * Throws without touching the running simulation when the pattern does not
 * fit there, since the new grid is built before the engine is replaced.
 */
export function selectPattern(
  patternKey: string,
  offset: Point = ORIGIN,
): string {
  const firstGeneration = buildPatternGrid(patternKey, offset);

  engine = new Engine({ firstGeneration });
  acceptedPatternKey = patternKey;

  return engine.toString();
}

/**
 * Exposes the module singletons for tests to assert identity (same vs.
 * recreated instance) directly, instead of inferring it from rendered output.
 */
export function getGameStateForTests(): {
  acceptedSize: GridSize | null;
  acceptedPatternKey: string | null;
  engine: Engine | null;
  patternLib: IPatternLib | null;
} {
  return { acceptedSize, acceptedPatternKey, engine, patternLib };
}

/**
 * Clears the module singletons so each test can start from a clean slate,
 * independent of what earlier tests left behind.
 */
export function resetGameStateForTests(): void {
  acceptedSize = null;
  acceptedPatternKey = null;
  engine = null;
  patternLib = null;
}
