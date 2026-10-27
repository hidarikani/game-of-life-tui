import type { Point } from "@cell-auto/game-of-life-engine";

export interface FirstGenerationState {
  patternKey: string | null;
  patternOffset: Point | null;
}

export type FirstGenerationProps = {
  patternKey: string;
  patternOffset: Point;
};
