import { Text } from "ink";
import { FOCUS_INDICATOR } from "../../constants/constants.ts";
import type { Props } from "./types.ts";

export function FocusableHeading({ isFocused, message }: Props) {
  const headingText = `${
    isFocused ? FOCUS_INDICATOR.YES : FOCUS_INDICATOR.NO
  } ${message}`;
  return <Text>{headingText}</Text>;
}
