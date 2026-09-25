import type { IPatternLib } from "@cell-auto/game-of-life-engine";

import { PatternLib } from "@cell-auto/game-of-life-engine";

let patternLib: null | IPatternLib = null;

export function getPatternLib(): IPatternLib {
  if (patternLib === null) {
    patternLib = PatternLib.fromBuiltInData();
  }

  return patternLib;
}
