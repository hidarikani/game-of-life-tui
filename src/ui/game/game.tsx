import { Box, Text } from "ink";
import { usePresent } from "../../engine/engine.tsx";
import { GridView } from "../grid/GridView.tsx";
import { FocusableHeading } from "../heading/focusableHeading.tsx";
import { DESCRIPTION, HEADING } from "./messages.ts";
import { GAP } from "../../constants/constants.ts";

export function Game() {
  const present = usePresent();
  return (
    <Box
      height="100%"
      flexDirection="column"
      gap={GAP}
    >
      <Box flexDirection="column">
        <Box>
          <FocusableHeading message={HEADING} />
        </Box>
        <Box>
          <Text wrap="truncate">{DESCRIPTION}</Text>
        </Box>
      </Box>
      <GridView grid={present} />
    </Box>
  );
}
