import type { IGrid } from "@cell-auto/game-of-life-engine";
import type { EmptyCallback } from "../../../../types/general.ts";

export type SubmitCallback = (
  grid: IGrid,
) => void;

export type Props = {
  patternKey: string;
  patternGeneration: number;
  grid: IGrid;
  onCancel: EmptyCallback;
  onSubmit: SubmitCallback;
  onFinish: SubmitCallback;
};
