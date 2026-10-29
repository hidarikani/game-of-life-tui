import { Box, Text, useInput } from "ink";
import {
  LIST_GAP,
  MAX_LIST_WIDTH,
  MIN_LIST_WIDTH,
} from "../../constants/constants.ts";
import { clamp, isEnter } from "../../util/misc.ts";
import { GridView } from "../GridView.tsx";
import { Header } from "./Header.tsx";
import { usePatterns } from "../../pattern/pattern.tsx";
import { useState } from "react";
import type { PatternPickerProps } from "../../types/app.ts";

function moveUp(prev: number, len: number) {
  if (prev === 0) {
    return len - 1;
  }

  return prev - 1;
}

function moveDown(prev: number, len: number) {
  if (prev + 1 === len) {
    return 0;
  }

  return prev + 1;
}

export function PatternPicker({ onSelectionChange }: PatternPickerProps) {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const patternLib = usePatterns();
  const allPatterns = patternLib.getPatterns(null);
  useInput((input, key) => {
    if (input === "") {
      if (key.upArrow) {
        setSelectedIndex(moveUp(selectedIndex, allPatterns.length));
      }
      if (key.downArrow) {
        setSelectedIndex(moveDown(selectedIndex, allPatterns.length));
      }
    }

    for (const ch of input) {
      if (isEnter(ch)) {
        onSelectionChange(allPatterns[selectedIndex].key);
      }
    }
  });
  const listWidth = clamp(
    Math.max(...allPatterns.map((p) => p.name.length)) + 1,
    MIN_LIST_WIDTH,
    MAX_LIST_WIDTH,
  );
  const selectedPattern = allPatterns[selectedIndex];
  const preview = selectedPattern.generations[0];

  return (
    <Box flexDirection="row" flexGrow={1}>
      <Box flexDirection="column" width={listWidth} marginRight={LIST_GAP}>
        {allPatterns
          .map((pattern, i) => (
            <Text
              key={pattern.key}
              inverse={i === selectedIndex}
              wrap="truncate"
            >
              {pattern.name}
            </Text>
          ))}
      </Box>
      <Box flexDirection="column" flexGrow={1} overflow="hidden">
        {selectedPattern && (
          <>
            <Header pattern={selectedPattern} currentGeneration={1} />
            <GridView grid={preview} />
          </>
        )}
      </Box>
    </Box>
  );
}
