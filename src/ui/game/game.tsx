import { Box, Text } from "ink";
import { usePresent } from "../../engine/engine.tsx";
import { GridView } from "../grid/GridView.tsx";
import { FocusableHeading } from "../heading/focusableHeading.tsx";
import { DESCRIPTION, HEADING } from "./messages.ts";
import { GAP } from "../../constants/constants.ts";
import { Description } from "../description/description.tsx";

export function Game() {
  const present = usePresent();
  return (
    <Box
      height="100%"
      flexDirection="column"
      gap={GAP}
    >
      <Box flexDirection="column">
        <FocusableHeading message={HEADING} />
        <Description>{DESCRIPTION}</Description>
      </Box>
      <GridView grid={present} />
    </Box>
  );
}
