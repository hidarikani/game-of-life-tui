import { Box, Text } from "ink";

import {
  EMPTY,
  genMsgGenerationSize,
  genMsgPatternName,
  genMsgPeriod,
  HEADING as HEADING,
} from "./messages.ts";
import type { Props } from "./types.ts";
import { NONE } from "../../../../constants/messages.ts";
import { FocusableHeading } from "../../../heading/focusableHeading.tsx";
import { PADDING } from "../../../../constants/constants.ts";

export function PatternInfo(
  { pattern, generation }: Props,
) {
  let info = null;
  if (pattern !== null && generation !== null) {
    const patternName = genMsgPatternName(pattern.name);
    const firstGeneration = pattern.generations[generation];
    const size = firstGeneration.gridSize;

    const generationSize = genMsgGenerationSize(size.w, size.h);
    const period = genMsgPeriod(pattern.period?.toString() ?? NONE);

    info = (
      <>
        <Text>{patternName}</Text>
        <Text>{generationSize}</Text>
        <Text>{period}</Text>
      </>
    );
  }

  const emptyState = <Text>{EMPTY}</Text>;

  const isEmpty = pattern === null || generation === null;
  const final = isEmpty ? emptyState : info;

  return (
    <Box flexDirection="column">
      <FocusableHeading isFocused={false} message={HEADING} />
      <Box borderStyle="round" flexDirection="column" padding={PADDING}>
        {final}
      </Box>
    </Box>
  );
}
