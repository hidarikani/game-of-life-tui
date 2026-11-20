import { useCallback, useState } from "react";
import { Box, Text, useInput } from "ink";
import { CANCEL, HEADING as WIZARD_HEADING } from "../../wizard/messages.ts";
import {
  HEADING as STEP_HEADING,
  INSTRUCTIONS,
  OFFSET_HINT,
  STEP,
  SUBMIT,
} from "./messages.ts";
import { Heading } from "../../../heading/heading.tsx";
import { GAP } from "../../../../constants/constants.ts";
import { Button } from "../../button/Button.tsx";
import type { Props } from "./types.ts";
import { GridView } from "../../../grid/GridView.tsx";
import { usePresent } from "../../../../engine/engine.tsx";
import { Description } from "../../../description/description.tsx";
import { clamp } from "../../../../util/misc.ts";
import { useAppSelector } from "../../../../store/hooks.ts";
import { selectGridSize } from "../../../../store/terminal/terminalSlice.ts";
import { Hints } from "../../../hints/hints.tsx";
import { CYCLE_FOCUS_HINT, QUIT_APP_HINT } from "../../../app/messages.ts";

export function PlacePattern(
  { inner, onCancel, onSubmit }: Props,
) {
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);

  const heading = `${WIZARD_HEADING} / ${STEP_HEADING}`;

  const gridSize = useAppSelector(selectGridSize);

  const movePlacement = (dx: number, dy: number) => {
    const size = inner.gridSize;
    // The engine rejects a pattern that would extend past the grid, and
    // silently accepts negative offsets, so clamp to the valid range here.
    const newOffsetX = clamp(offsetX + dx, 0, gridSize.w - size.w);
    const newOffsetY = clamp(offsetY + dy, 0, gridSize.h - size.h);

    if (newOffsetX !== offsetX) {
      setOffsetX(newOffsetX);
    }
    if (newOffsetY !== offsetY) {
      setOffsetY(newOffsetY);
    }
  };

  useInput((input, key) => {
    if (input === "") {
      if (key.upArrow) movePlacement(0, -1);
      else if (key.downArrow) movePlacement(0, 1);
      else if (key.leftArrow) movePlacement(-1, 0);
      else if (key.rightArrow) movePlacement(1, 0);

      return;
    }
  });

  const present = usePresent();
  const outer = present.clone();
  outer.writeGrid({
    inner,
    offset: {
      x: offsetX,
      y: offsetY,
    },
  });

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const handleSubmit = useCallback(() => {
    onSubmit(outer);
  }, [offsetX, offsetY, onSubmit]);

  return (
    <Box
      height="100%"
      flexDirection="column"
      gap={GAP}
    >
      <Box flexDirection="column">
        <Heading message={heading} />
        <Description>{INSTRUCTIONS}</Description>
      </Box>
      <GridView grid={outer} />
      <Box gap={GAP} alignItems="center">
        <Button label={CANCEL} onPress={handleCancel}></Button>
        <Button label={SUBMIT} onPress={handleSubmit}></Button>
        <Hints>
          {QUIT_APP_HINT}
          {CYCLE_FOCUS_HINT}
          {OFFSET_HINT}
        </Hints>
        <Box>
          <Text dimColor>{STEP}</Text>
        </Box>
      </Box>
    </Box>
  );
}
