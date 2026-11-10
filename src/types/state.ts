import type { GridMode, GridSize, Point } from "@cell-auto/game-of-life-engine";

export type TerminalState = {
  rows: number | null;
  columns: number | null;
};

export interface FirstGenerationState {
  patternKey: string | null;
  patternOffset: Point;
  patternGeneration: number;
  gridMode: GridMode;
}

export type FirstGenerationProps = {
  patternKey: string;
  patternOffset: Point;
  patternGeneration: number;
  gridSize: GridSize;
  gridMode: GridMode;
};
