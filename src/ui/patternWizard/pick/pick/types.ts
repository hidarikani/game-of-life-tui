export type SubmitCallback = (
  patternKey: string,
  patternGeneration: number,
) => void;

export type Props = {
  onCancel: () => void;
  onSubmit: SubmitCallback;
};
