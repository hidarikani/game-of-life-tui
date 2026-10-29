import type { PatternPickerProps } from "../../types/app.ts";

import { Box, Text } from "ink";
import {
  LIST_GAP,
  MAX_LIST_WIDTH,
  MIN_LIST_WIDTH,
} from "../../constants/constants.ts";
import { clamp } from "../../util/misc.ts";
import { GridView } from "../GridView.tsx";
import { Header } from "./Header.tsx";
import { usePatterns } from "../../pattern/pattern.tsx";
import { useAppSelector } from "../../store/hooks.ts";
import { selectGridHeight } from "../../store/terminalSlice.ts";

/**
 * The selection step: pattern names on the left, a preview of the highlighted
 * pattern on the right.
 */
export function PatternPicker(
  { selected, scrollOffset }: PatternPickerProps,
) {
  const gridHeight = useAppSelector(selectGridHeight);
  const patternLib = usePatterns();
  const allPatterns = patternLib.getPatterns(null);
  const listWidth = clamp(
    Math.max(...allPatterns.map((p) => p.name.length)) + 1,
    MIN_LIST_WIDTH,
    MAX_LIST_WIDTH,
  );
  const current = allPatterns[selected];
  const preview = current.generations[0];

  return (
    <Box flexDirection="row" flexGrow={1}>
      <Box flexDirection="column" width={listWidth} marginRight={LIST_GAP}>
        {allPatterns
          .slice(scrollOffset, scrollOffset + gridHeight)
          .map((pattern, i) => (
            <Text
              key={pattern.key}
              inverse={scrollOffset + i === selected}
              wrap="truncate"
            >
              {pattern.name}
            </Text>
          ))}
      </Box>
      <Box flexDirection="column" flexGrow={1} overflow="hidden">
        {current && (
          <>
            <Header pattern={current} currentGeneration={1} />
            <GridView grid={preview} />
          </>
        )}
      </Box>
    </Box>
  );
}
