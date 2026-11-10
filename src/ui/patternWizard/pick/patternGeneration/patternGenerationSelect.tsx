import { Box, Text, useFocus } from "ink";
import { Select } from "@inkjs/ui";
import type { Props } from "./types.ts";
import { usePatternLib } from "../../../../pattern/pattern.tsx";
import { EMPTY, SELECT_HEADING } from "./messages.ts";
import { FocusableHeading } from "../../../heading/focusableHeading.tsx";
import { useCallback } from "react";
import { MAX_SELECT_WIDTH } from "../../../../constants/constants.ts";

export function PatternGenerationSelect({ patternKey, onChange }: Props) {
  const { isFocused } = useFocus();
  const isSelectDisabled = !isFocused;

  const patternGenerationOptions = [];
  if (patternKey !== null) {
    const patternLib = usePatternLib();
    const pattern = patternLib.getPatternByKey(patternKey);

    if (pattern !== null) {
      for (let i = 0; i < pattern.generations.length; i++) {
        patternGenerationOptions.push({ label: `${i + 1}`, value: `${i}` });
      }
    }
  }

  const handleChange = useCallback(
    (patternGeneration: string) => onChange(Number.parseInt(patternGeneration)),
    [],
  );

  const emptyState = <Text>{EMPTY}</Text>;
  const select = (
    <Select
      options={patternGenerationOptions}
      onChange={handleChange}
      isDisabled={isSelectDisabled}
    />
  );

  const isEmpty = patternKey === null;
  const final = isEmpty ? emptyState : select;

  return (
    <Box flexDirection="column">
      <FocusableHeading
        level={2}
        isFocused={isFocused}
        message={SELECT_HEADING}
      />
      <Box maxWidth={MAX_SELECT_WIDTH} borderStyle="round">
        {final}
      </Box>
    </Box>
  );
}
