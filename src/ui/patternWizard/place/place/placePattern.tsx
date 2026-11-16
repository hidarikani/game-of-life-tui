import { useCallback, useState } from "react";
import { Box, Text, useInput } from "ink";
import { CANCEL, HEADING as WIZARD_HEADING } from "../../wizard/messages.ts";
import {
  HEADING as STEP_HEADING,
  INSTRUCTIONS,
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

export function PlacePattern(
  { inner, onCancel, onSubmit }: Props,
) {
  const [offsetX, setPatternOffsetX] = useState<number>(0);
  const [offsetY, setPatternOffsetY] = useState<number>(0);

  const heading = `${WIZARD_HEADING} / ${STEP_HEADING}`;

  const movePlacement = (dx: number, dy: number) => {
    // const pattern = patterns.find((p) => p.key === placementKey);

    // if (pattern === null || pattern === undefined) {
    //   throw new Error(genErrPatternNotFound(placementKey));
    // }

    // const size = pattern.generations[0].gridSize;
    // // The engine rejects a pattern that would extend past the grid, and
    // // silently accepts negative offsets, so clamp to the valid range here.
    // const offset = {
    //   x: clamp(placementOffset.x + dx, 0, gridSize.w - size.w),
    //   y: clamp(placementOffset.y + dy, 0, gridSize.h - size.h),
    // };
    // if (offset.x === placementOffset.x && offset.y === placementOffset.y) {
    //   return;
    // }

    // setPlacementOffset(offset);
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
    onSubmit({
      x: offsetX,
      y: offsetY,
    });
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
        <Box>
          <Text dimColor>{STEP}</Text>
        </Box>
      </Box>
    </Box>
  );
}
