import type { GridSize, Point } from "@cell-auto/game-of-life-engine";

export type TerminalState = {
  rows: number | null;
  columns: number | null;
};

export interface FirstGenerationState {
  patternKey: string | null;
  patternOffset: Point | null;
}

export type FirstGenerationProps = {
  patternKey: string;
  patternOffset: Point;
  gridSize: GridSize;
};
