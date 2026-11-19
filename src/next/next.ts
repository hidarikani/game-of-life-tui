/**
 * @file
 * Improvements to @cell-auto/game-of-life-engine
 * Remove after backporting
 */

import {
  type CellKey,
  Engine,
  Grid,
  type IEngine,
  type IGrid,
  type LiveCells,
} from "@cell-auto/game-of-life-engine";
import type { IEngineNext, IEngineStore, IGridNext } from "./types.ts";
import type { EmptyCallback } from "../types/general.ts";

/**
 * @deprecated use implementation from @cell-auto/game-of-life-engine
 */
export class EngineNext extends Engine implements IEngineNext {
  #listeners = new Set<EmptyCallback>();

  subscribe = (listener: EmptyCallback): EmptyCallback => {
    this.#listeners.add(listener);
    return () => void this.#listeners.delete(listener);
  };

  getSnapshot = (): IGrid => {
    return this.presentGeneration;
  };

  tick = (): void => {
    this.evolveGrid();
    for (const listener of this.#listeners) listener();
  };
}

/**
 * @deprecated use implementation from @cell-auto/game-of-life-engine
 */
export class EngineStore implements IEngineStore {
  #engine: IEngine;
  #listeners = new Set<EmptyCallback>();
  constructor(engine: IEngine) {
    this.#engine = engine;

    this.subscribe = this.subscribe.bind(this);
    this.getSnapshot = this.getSnapshot.bind(this);
    this.tick = this.tick.bind(this);
  }

  subscribe(listener: EmptyCallback): EmptyCallback {
    this.#listeners.add(listener);
    return () => void this.#listeners.delete(listener);
  }

  getSnapshot(): IGrid {
    return this.#engine.presentGeneration;
  }

  tick(): void {
    (this.#engine as Engine).evolveGrid();
    for (const listener of this.#listeners) listener();
  }
}

export class GridNext extends Grid implements IGridNext {
  static fromGrid(grid: IGrid): GridNext {
    const cellKeys: CellKey[] = grid.liveCells.map((cell) =>
      `${cell.x},${cell.y}` as const
    );
    const liveCells: LiveCells = new Set(
      cellKeys,
    );
    return new GridNext({
      gridSize: grid.gridSize,
      liveCells,
      mode: grid.mode,
    });
  }

  clone(): IGridNext {
    const cellKeys: CellKey[] = this.liveCells.map((cell) =>
      `${cell.x},${cell.y}` as const
    );
    const liveCells: LiveCells = new Set(
      cellKeys,
    );

    return new GridNext({
      gridSize: this.gridSize,
      liveCells,
      mode: this.mode,
    });
  }
}
