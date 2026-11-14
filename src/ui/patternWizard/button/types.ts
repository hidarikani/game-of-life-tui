import type { EmptyCallback } from "../../../types/general.ts";

export type Props = {
  label: string;
  onPress: EmptyCallback;
  isDisabled?: boolean;
  id?: string;
};
