import type { EmptyCallback } from "../../../../constants.ts";

export type SubmitCallback = (
  patternKey: string,
  patternGeneration: number,
) => void;

export type Props = {
  onCancel: EmptyCallback;
  onSubmit: SubmitCallback;
};
