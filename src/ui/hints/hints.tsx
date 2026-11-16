import { Box, Text } from "ink";
import { HINT_SEPARATOR } from "../../constants/constants.ts";
import type { Props } from "./types.ts";
import { CONTROLS } from "./messages.ts";

export function Hints({ children }: Props) {
  const items = Array.isArray(children) ? children : [children];
  return (
    <Box>
      <Text wrap="truncate" dimColor>
        {CONTROLS}
        {items.join(HINT_SEPARATOR)}
      </Text>
    </Box>
  );
}
