import type { Point } from "@cell-auto/game-of-life-engine";

export const comparePoints = (a: Point, b: Point): number => {
  if (a.y !== b.y) {
    return a.y - b.y;
  }

  return a.x - b.x;
};

export const checkPointsEqual = (a: Point, b: Point) => {
  return a.x === b.x && a.y === b.y;
};

export const checkLiveCellsEqual = (a: Point[], b: Point[]): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  const aSorted = a.toSorted(comparePoints);
  const bSorted = b.toSorted(comparePoints);

  return aSorted.every((aPoint, i) => checkPointsEqual(aPoint, bSorted[i]));
};
