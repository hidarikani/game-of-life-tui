import type { ReactNode } from "react";
import type { GridMode, GridSize, Point } from "@cell-auto/game-of-life-engine";
import type { EmptyCallback } from "../types/general.ts";
import type { IGridNext } from "../next/types.ts";

export type GenerationProps = {
  patternKey: string;
  patternOffset: Point;
  patternGeneration: number;
  gridSize: GridSize;
  gridMode: GridMode;
};

export type EngineContext = {
  currentGeneration: string;
  tick: EmptyCallback;
};

export type EngineStoreProviderProps = {
  firstGeneration: IGridNext;
  children: ReactNode;
};

export type EngineProviderProps = {
  children: ReactNode;
};
