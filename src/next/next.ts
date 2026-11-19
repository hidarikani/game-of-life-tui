/**
 * @file
 * Improvements to @cell-auto/game-of-life-engine
 * Remove after backporting
 */

import {
  type CellKey,
  Engine,
  Grid,
  type IGrid,
  type LiveCells,
  pointToCellKey,
} from "@cell-auto/game-of-life-engine";
import type { IEngineNext, IGridNext } from "./types.ts";
import type { EmptyCallback } from "../types/general.ts";
import { KEY_SEPARATOR } from "./constants.ts";
import { comparePoints } from "./helpers.ts";

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

export class GridNext extends Grid implements IGridNext {
  static fromGrid = (grid: IGrid): GridNext => {
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
  };

  clone = (): IGridNext => {
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
  };

  /**
   * @todo Implement caching to have a stable reference and avoid generating and sorting an array every call
   * @todo At the moment the grid mode is omitted from the serialization
   */
  serialize = (): string => {
    // TODO consider caching
    return this.liveCells.toSorted(comparePoints).map((point) =>
      pointToCellKey(point)
    )
      .join(KEY_SEPARATOR);
  };
}
