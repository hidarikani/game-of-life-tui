import type { IGrid, Point } from "@cell-auto/game-of-life-engine";
import type { EmptyCallback } from "../../../../types/general.ts";

export type SubmitCallback = (
  offset: Point,
) => void;

export type Props = {
  inner: IGrid;
  onCancel: EmptyCallback;
  onSubmit: SubmitCallback;
};
