import { Box, Text } from "ink";
import type { Props } from "./types.ts";

export function GridView({ grid }: Props) {
  const snapshot = grid.toString();

  return (
    <Box
      flexGrow={1}
      overflow="hidden"
    >
      <Text wrap="truncate">{snapshot}</Text>
    </Box>
  );
}
