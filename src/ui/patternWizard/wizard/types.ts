import type { Point } from "@cell-auto/game-of-life-engine";
import type { EmptyCallback } from "../../../types/general.ts";

export type PatternWizardCallback = (
  key: string,
  generationIndex: number,
  offset: Point,
) => void;

export type Props = {
  onCancel: EmptyCallback;
  onSubmit: PatternWizardCallback;
};
