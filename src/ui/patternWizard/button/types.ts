import type { EmptyCallback } from "../../../general.ts";

export type Props = {
  label: string;
  onPress: EmptyCallback;
  isDisabled?: boolean;
  id?: string;
};
