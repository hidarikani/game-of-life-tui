import { Box } from "ink";
import { usePresent } from "../../context/engine/engine.tsx";
import { GridView } from "../grid/GridView.tsx";
import { Heading } from "../heading/heading.tsx";
import {
  ADD_PATTERN_HINT,
  DESCRIPTION,
  HEADING,
  TICK_HINT,
} from "./messages.ts";
import { Description } from "../description/description.tsx";
import { Hints } from "../hints/hints.tsx";
import { CYCLE_FOCUS_HINT, QUIT_APP_HINT } from "../app/messages.ts";
import { GAP, PADDING } from "../app/app.const.ts";

export function Game() {
  const present = usePresent();
  return (
    <Box
      height="100%"
      flexDirection="column"
      gap={GAP}
    >
      <Box flexDirection="column">
        <Heading message={HEADING} />
        <Description>{DESCRIPTION}</Description>
      </Box>
      <GridView grid={present} />
      <Box padding={PADDING}>
        <Hints>
          {QUIT_APP_HINT}
          {CYCLE_FOCUS_HINT}
          {TICK_HINT}
          {ADD_PATTERN_HINT}
        </Hints>
      </Box>
    </Box>
  );
}
