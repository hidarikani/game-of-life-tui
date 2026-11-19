import type { Point } from "@cell-auto/game-of-life-engine";

export const comparePoints = (a: Point, b: Point): number => {
  if (a.y !== b.y) {
    return a.y - b.y;
  }

  return a.x - b.x;
};
