import type { ReactNode } from "react";
import type { GridMode, GridSize, Point } from "@cell-auto/game-of-life-engine";
import type { EmptyCallback } from "../types/general.ts";

export type FirstGenerationProps = {
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

export type EngineProviderProps = {
  firstGeneration: FirstGenerationProps;
  children: ReactNode;
};
