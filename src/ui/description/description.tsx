import { Box, Text } from "ink";
import type { Props } from "./types.ts";

export function Description({ children }: Props) {
  return (
    <Box>
      <Text wrap="truncate" dimColor>{children}</Text>
    </Box>
  );
}
