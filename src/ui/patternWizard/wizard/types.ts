import type { IGrid } from "@cell-auto/game-of-life-engine";
import type { EmptyCallback } from "../../../types/general.ts";

export type PatternWizardCallback = (
  grid: IGrid,
) => void;

export type Props = {
  onCancel: EmptyCallback;
  onSubmit: PatternWizardCallback;
};
