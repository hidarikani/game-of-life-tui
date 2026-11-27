import type { IGrid } from "@cell-auto/game-of-life-engine";
import type { EmptyCallback } from "../../../constants.ts";

export type PatternWizardCallback = (
  grid: IGrid,
) => void;

export type Props = {
  onCancel: EmptyCallback;
  onSubmit: PatternWizardCallback;
};
