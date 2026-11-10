import { Text } from "ink";
import type { Props } from "./types.ts";

export function FocusableHeading(
  { level = 1, isFocused = false, message }: Props,
) {
  let prefix = "";
  for (let i = 0; i < level; i++) {
    prefix += "#";
  }
  const headingText = `${prefix} ${message}`;
  return <Text bold underline={isFocused}>{headingText}</Text>;
}
