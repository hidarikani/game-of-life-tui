import type { PatternHeaderProps } from "../../types/app.ts";

import { Text } from "ink";

import {
  genMsgGeneration,
  genMsgPatternName,
  genMsgPatternSize,
  genMsgPeriod,
  NONE,
} from "../../constants/messages.ts";

export function Header(
  { pattern, currentGeneration }: PatternHeaderProps,
) {
  let acc = "";
  acc += genMsgPatternName(pattern.name);
  const firstGeneration = pattern.generations[0];
  const size = firstGeneration.gridSize;
  acc += " ";
  acc += genMsgPatternSize(size.w, size.h);
  acc += " ";
  const isPeriodDefined = pattern.period !== null;
  acc += genMsgPeriod(pattern.period?.toString() ?? NONE);
  if (isPeriodDefined) {
    acc += " ";
    acc += genMsgGeneration(currentGeneration, pattern.generations.length);
  }
  return <Text wrap="truncate">{acc}</Text>;
}
