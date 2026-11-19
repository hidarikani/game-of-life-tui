import type { IGrid } from "@cell-auto/game-of-life-engine";
import type { EmptyCallback } from "../types/general.ts";

/**
 * @deprecated use implementation from @cell-auto/game-of-life-engine
 */
export interface IEngineStore {
  subscribe(listener: EmptyCallback): EmptyCallback;
  getSnapshot(): IGrid;
  tick(): void;
}

/**
 * @deprecated use implementation from @cell-auto/game-of-life-engine
 */
export interface IEngineNext {
  subscribe(listener: EmptyCallback): EmptyCallback;
  getSnapshot(): IGrid;
  tick(): void;
}

/**
 * @deprecated use implementation from @cell-auto/game-of-life-engine
 */
export interface IGridNext {
  clone(): IGridNext;
}
