import type { GridSize, Pattern, Point } from "@cell-auto/game-of-life-engine";

import { Engine, Grid } from "@cell-auto/game-of-life-engine";
import { ORIGIN } from "../constants.ts";

let acceptedSize: GridSize | null = null;
let engine: Engine | null = null;

export function initGame(proposedSize: GridSize, pattern: Pattern): string {
  const sizeChanged = acceptedSize !== null &&
    (acceptedSize.w !== proposedSize.w || acceptedSize.h !== proposedSize.h);

  if (sizeChanged) {
    engine = null;
  }

  acceptedSize = proposedSize;

  const firstGeneration = new Grid({ gridSize: acceptedSize });

  firstGeneration.writeGrid({
    inner: pattern.generations[0],
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
 * Builds a grid the size of the running simulation holding only the given
 * pattern, placed at `offset`. Throws when the pattern does not fit there.
 */
function buildPatternGrid(pattern: Pattern, offset: Point): Grid {
  if (acceptedSize === null) {
    throw new Error("Engine uninitialized. Invoke initGame first.");
  }

  const grid = new Grid({ gridSize: acceptedSize });
  grid.writeGrid({ inner: pattern.generations[0], offset });

  return grid;
}

/**
 * Renders the placement preview: the full-size grid holding only the given
 * pattern at `offset`, as shown while the user positions it.
 */
export function renderPlacement(pattern: Pattern, offset: Point): string {
  return buildPatternGrid(pattern, offset).toString();
}

/**
 * Restarts the simulation with the given pattern: clears the grid and places
 * the pattern's first generation at `offset`. Returns the rendered grid.
 * Throws without touching the running simulation when the pattern does not
 * fit there, since the new grid is built before the engine is replaced.
 */
export function selectPattern(
  pattern: Pattern,
  offset: Point = ORIGIN,
): string {
  const firstGeneration = buildPatternGrid(pattern, offset);

  engine = new Engine({ firstGeneration });

  return engine.toString();
}

/**
 * Exposes the module singletons for tests to assert identity (same vs.
 * recreated instance) directly, instead of inferring it from rendered output.
 */
export function getGameStateForTests(): {
  acceptedSize: GridSize | null;
  engine: Engine | null;
} {
  return { acceptedSize, engine };
}

/**
 * Clears the module singletons so each test can start from a clean slate,
 * independent of what earlier tests left behind.
 */
export function resetGameStateForTests(): void {
  acceptedSize = null;
  engine = null;
}
