import { Box, Text } from "ink";
import { PADDING } from "../../../../constants/constants.ts";
import type { Props } from "./types.ts";
import { EMPTY, HEADING } from "./messages.ts";
import { FocusableHeading } from "../../../heading/focusableHeading.tsx";

export function PatternPreview({ grid }: Props) {
  const preview = grid === null ? EMPTY : grid.toString();

  return (
    <Box flexDirection="column">
      <FocusableHeading level={2} isFocused={false} message={HEADING} />
      <Box borderStyle="round" padding={PADDING}>
        <Text>{preview}</Text>
      </Box>
    </Box>
  );
}
