import { Box, Text } from "ink";

import {
  EMPTY,
  genMsgGenerationSize,
  genMsgPatternName,
  genMsgPeriod,
  HEADING,
  NONE,
} from "./messages.ts";
import type { Props } from "./types.ts";
import { Heading } from "../../../heading/heading.tsx";
import { PADDING } from "../../../app/constants.ts";

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
      <Heading level={2} isFocused={false} message={HEADING} />
      <Box borderStyle="single" flexDirection="column" padding={PADDING}>
        {final}
      </Box>
    </Box>
  );
}
