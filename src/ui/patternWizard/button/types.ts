import type { EmptyCallback } from "../../../constants.ts";

export type Props = {
  label: string;
  onPress: EmptyCallback;
  isDisabled?: boolean;
  id?: string;
};
