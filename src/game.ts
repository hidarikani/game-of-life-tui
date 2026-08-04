import { Engine, Grid, PatternLib } from "@hidarikani/game-of-life-engine";
import type { GridSize, IPatternLib } from "@hidarikani/game-of-life-engine";

let acceptedSize: GridSize | null = null;
let engine: Engine | null = null;
let patternLib: null | IPatternLib = null;

export function initGame(proposedSize: GridSize, patternKey: string): string {
  if (patternLib === null) {
    patternLib = PatternLib.fromBuiltInData();
  }

  const proposedPattern = patternLib.getPatternByKey(patternKey);

  if (acceptedSize === null) {
    acceptedSize = proposedSize;
  } else {
    if (
      acceptedSize.w !== proposedSize.w ||
      acceptedSize.h !== proposedSize.h
    ) {
      acceptedSize = proposedSize;
      engine = null;
    }
  }

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
