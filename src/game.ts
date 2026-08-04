import { Engine, Grid, PatternLib } from "@hidarikani/game-of-life-engine";
import type { GridSize } from "@hidarikani/game-of-life-engine";

let acceptedSize: GridSize | null = null;
let engine: Engine | null = null;

export function renderGrid(proposedSize: GridSize): string {
  const lib = PatternLib.fromBuiltInData();
  const pulsar = lib.getPatternByKey("pulsar");

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
    inner: pulsar.generations[0],
    offset: { x: 1, y: 2 },
  });

  if (engine === null) {
    engine = new Engine({ firstGeneration });
  }

  engine.evolveGrid();
  return engine.toString();
}
