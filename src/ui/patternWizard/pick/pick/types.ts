import type { EmptyCallback } from "../../../../general.ts";

export type SubmitCallback = (
  patternKey: string,
  patternGeneration: number,
) => void;

export type Props = {
  onCancel: EmptyCallback;
  onSubmit: SubmitCallback;
};
