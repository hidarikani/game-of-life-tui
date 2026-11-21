import { Box, Text } from "ink";
import type { Props } from "./types.ts";
import { CONTROLS } from "./messages.ts";
import { HINT_SEPARATOR } from "./hints.const.ts";

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
