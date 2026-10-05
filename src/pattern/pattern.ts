import type { IPatternLib, Pattern } from "@cell-auto/game-of-life-engine";

import { Grid, PatternLib } from "@cell-auto/game-of-life-engine";

let patternLib: null | IPatternLib = null;

export function getPatternLib(): IPatternLib {
  if (patternLib === null) {
    patternLib = PatternLib.fromBuiltInData();
  }

  return patternLib;
}

/**
 * Renders a pattern's first generation on its own, at its natural size, for
 * the preview pane of the selection view. Needs no running simulation.
 */
export function renderPatternPreview(pattern: Pattern): string {
  const inner = pattern.generations[0];
  const preview = new Grid({ gridSize: inner.gridSize });
  preview.writeGrid({ inner });

  return preview.toString();
}
