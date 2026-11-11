import { useCallback, useState } from "react";
import { Box, Text } from "ink";
import {
  CANCEL,
  FINISH,
  HEADING as WIZARD_HEADING,
  NEXT,
  PREV,
} from "../../wizard/messages.ts";
import { HEADING as STEP_HEADING, INSTRUCTIONS, STEP } from "./messages.ts";
import { FocusableHeading } from "../../../heading/focusableHeading.tsx";
import { GAP } from "../../../../constants/constants.ts";
import { Button } from "../../button/Button.tsx";
import type { Props } from "./types.ts";

export function PlacePattern(
  { patternKey, patternGeneration, grid, onCancel, onSubmit, onFinish }: Props,
) {
  const [patternOffsetX, setPatternOffsetX] = useState<number>(0);
  const [patternOffsetY, setPatternOffsetY] = useState<number>(0);

  const heading = `${WIZARD_HEADING} / ${STEP_HEADING}`;

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const handlePrevious = useCallback(() => {
  }, []);

  const handleNext = useCallback(() => {
    onSubmit(grid);
  }, [grid, onSubmit]);

  const handleFinish = useCallback(() => {
    onFinish(grid);
  }, [grid, onFinish]);

  return (
    <Box flexDirection="column" gap={GAP}>
      <Box flexDirection="column">
        <FocusableHeading message={heading} />
        <Text dimColor>{INSTRUCTIONS}</Text>
      </Box>
      <Text>Preview Placeholder</Text>
      <Box gap={GAP} alignItems="center">
        <Button label={CANCEL} onPress={handleCancel}></Button>
        <Button label={PREV} onPress={handlePrevious}></Button>
        <Button label={NEXT} onPress={handleNext}></Button>
        <Button label={FINISH} onPress={handleFinish}></Button>
        <Text dimColor>{STEP}</Text>
      </Box>
    </Box>
  );
}
