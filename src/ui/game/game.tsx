import { Box } from "ink";
import { usePresent } from "../../engine/engine.tsx";
import { GridView } from "../grid/GridView.tsx";
import { Heading } from "../heading/heading.tsx";
import { DESCRIPTION, HEADING } from "./messages.ts";
import { GAP } from "../../constants/constants.ts";
import { Description } from "../description/description.tsx";
import { Hints } from "../hints/hints.tsx";
import { QUIT_APP_HINT } from "../app/messages.ts";

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
        <Hints>{QUIT_APP_HINT}</Hints>
      </Box>
      <GridView grid={present} />
    </Box>
  );
}
