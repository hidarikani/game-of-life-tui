import { Box, Text } from "ink";
import type { Props } from "./types.ts";
import { EMPTY, HEADING } from "./messages.ts";
import { Heading } from "../../../heading/heading.tsx";
import { PADDING } from "../../../app/app.const.ts";

export function PatternPreview({ grid }: Props) {
  const preview = grid === null ? EMPTY : grid.toString();

  return (
    <Box flexDirection="column">
      <Heading level={2} isFocused={false} message={HEADING} />
      <Box borderStyle="round" padding={PADDING}>
        <Text>{preview}</Text>
      </Box>
    </Box>
  );
}
