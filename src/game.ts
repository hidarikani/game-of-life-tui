import { Engine, Grid } from "@hidarikani/game-of-life-engine";
import type { GridSize } from "@hidarikani/game-of-life-engine";

import { CELL_ALIVE, CELL_DEAD, COL_SEPARATOR } from "./constants.ts";

let gridSize: GridSize | null = null;

let engine: Engine | null = null;

export function generateRandomSeed(size: GridSize): string {
  const lines: string[] = [];
  for (let r = 0; r < size.h; r++) {
    let line = "";
    for (let c = 0; c < size.w; c++) {
      line += Math.random() < 0.5 ? CELL_ALIVE : CELL_DEAD;
      line += COL_SEPARATOR;
    }
    lines.push(line);
  }
  return lines.join("\n");
}

export function renderGrid(incomingSize: GridSize): string {
  if (gridSize === null) {
    gridSize = incomingSize;
  } else {
    if (gridSize.w !== incomingSize.w || gridSize.h !== incomingSize.h) {
      gridSize = incomingSize;
      engine = null;
    }
  }

  if (engine === null) {
    const firstGeneration = Grid.fromString({
      gridSize,
      seed: generateRandomSeed(incomingSize),
    });
    engine = new Engine({ firstGeneration });
  }

  engine.evolveGrid();
  return engine.toString();
}
