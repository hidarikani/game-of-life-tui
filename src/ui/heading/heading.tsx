import { Box, Text } from "ink";
import type { Props } from "./types.ts";

export function Heading(
  { level = 1, isFocused = false, message }: Props,
) {
  let prefix = "";
  for (let i = 0; i < level; i++) {
    prefix += "#";
  }
  const headingText = `${prefix} ${message}`;
  return (
    <Box>
      <Text bold underline={isFocused} wrap="truncate">{headingText}</Text>
    </Box>
  );
}
