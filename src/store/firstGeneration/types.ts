import type { GridMode, Point } from "@cell-auto/game-of-life-engine";

export interface FirstGenerationState {
  patternKey: string | null;
  patternOffset: Point;
  patternGeneration: number;
  gridMode: GridMode;
}
