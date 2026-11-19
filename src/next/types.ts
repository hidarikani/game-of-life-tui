import type { IEngine, IGrid } from "@cell-auto/game-of-life-engine";
import type { EmptyCallback } from "../types/general.ts";

/**
 * @deprecated use implementation from @cell-auto/game-of-life-engine
 */
export interface IEngineNext extends IEngine {
  subscribe(listener: EmptyCallback): EmptyCallback;
  getSnapshot(): IGrid;
  tick(): void;
  evolveGrid(): void;
}

/**
 * @deprecated use implementation from @cell-auto/game-of-life-engine
 */
export interface IGridNext extends IGrid {
  clone(): IGridNext;
}
