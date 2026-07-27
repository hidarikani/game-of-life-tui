import type { Size } from "./terminal.ts";
import { Engine, Grid, PatternLib } from "@hidarikani/game-of-life-engine";
import type { GridSize } from "@hidarikani/game-of-life-engine";

let gridSize: GridSize | null = null;
let engine: Engine | null = null;

export function renderGrid({ columns, rows }: Size): string {
  const lib = PatternLib.fromBuiltInData();
  const pulsar = lib.getPatternByKey("pulsar");

  const proposedGridSize: GridSize = { w: columns, h: rows };

  if (gridSize === null) {
    gridSize = proposedGridSize;
  } else {
    if (
      gridSize.w !== proposedGridSize.w || gridSize.h !== proposedGridSize.h
    ) {
      gridSize = proposedGridSize;
      engine = null;
    }
  }

  const firstGeneration = new Grid({ gridSize });

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
