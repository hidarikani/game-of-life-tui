import { Box, useFocus } from "ink";
import { Select } from "@inkjs/ui";
import type { Props } from "./types.ts";
import { usePatternLib } from "../../../../pattern/pattern.tsx";
import { PATTERNS_BY_NAME_HEADING } from "./messages.ts";
import { FocusableHeading } from "../../../heading/focusableHeading.tsx";
import { MAX_SELECT_WIDTH } from "../../../../constants/constants.ts";

export function PatternNameSelect({ onChange }: Props) {
  const { isFocused } = useFocus();
  const isSelectDisabled = !isFocused;
  const patternLib = usePatternLib();
  const allPatterns = patternLib.getPatterns(null);
  const patternOptions = allPatterns.map((pattern) => ({
    label: pattern.name,
    value: pattern.key,
  }));

  return (
    <Box flexDirection="column">
      <FocusableHeading
        level={2}
        isFocused={isFocused}
        message={PATTERNS_BY_NAME_HEADING}
      />
      <Box maxWidth={MAX_SELECT_WIDTH} borderStyle="round">
        <Select
          options={patternOptions}
          onChange={onChange}
          isDisabled={isSelectDisabled}
        />
      </Box>
    </Box>
  );
}
