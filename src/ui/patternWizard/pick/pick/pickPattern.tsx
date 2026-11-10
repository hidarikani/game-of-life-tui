import { useCallback, useState } from "react";
import { Box, Text } from "ink";
import {
  CANCEL,
  genErrPatternNotFound,
  NEXT,
} from "../../../../constants/messages.ts";
import { usePatternLib } from "../../../../pattern/pattern.tsx";
import { PatternNameSelect } from "../patternName/patternNameSelect.tsx";
import { PatternGenerationSelect } from "../patternGeneration/patternGenerationSelect.tsx";
import { PatternInfo } from "../info/patternInfo.tsx";
import { PatternPreview } from "../preview/patternPreview.tsx";
import { Button } from "../../button/Button.tsx";
import { HEADING as STEP_HEADING, INSTRUCTIONS, STEP } from "./messages.ts";
import { FocusableHeading } from "../../../heading/focusableHeading.tsx";
import { HEADING as WIZARD_HEADING } from "../../wizard/messages.ts";
import { GAP } from "../../../../constants/constants.ts";
import type { Props } from "./types.ts";

export function PickPattern({ onCancel, onSubmit }: Props) {
  const heading = `${WIZARD_HEADING} / ${STEP_HEADING}`;
  const patternLib = usePatternLib();

  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedGeneration, setSelectedGeneration] = useState<number | null>(
    null,
  );

  const handleKeyChange = useCallback((newKey: string) => {
    setSelectedKey(newKey);
  }, []);

  const handleGenerationChange = useCallback((newGeneration: number) => {
    setSelectedGeneration(newGeneration);
  }, []);

  let pattern = null;

  if (selectedKey !== null) {
    pattern = patternLib.getPatternByKey(selectedKey);
    if (pattern === null) {
      throw new Error(genErrPatternNotFound(selectedKey));
    }
  }

  let previewGrid = null;

  if (pattern !== null && selectedGeneration !== null) {
    previewGrid = pattern.generations[selectedGeneration];
  }

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const handleNext = useCallback(() => {
    if (selectedKey === null || selectedGeneration === null) {
      return;
    }

    onSubmit(selectedKey, selectedGeneration);
  }, [selectedKey, selectedGeneration, onSubmit]);

  return (
    <>
      <Box flexDirection="column" marginBottom={1}>
        <FocusableHeading message={heading} />
        <Text dimColor>{INSTRUCTIONS}</Text>
      </Box>
      <Box width="100%" flexDirection="row">
        <Box flexDirection="column">
          <PatternNameSelect onChange={handleKeyChange} />
          <PatternGenerationSelect
            patternKey={selectedKey}
            onChange={handleGenerationChange}
          />
        </Box>
        <PatternInfo pattern={pattern} generation={selectedGeneration} />
        <PatternPreview grid={previewGrid} />
      </Box>
      <Box>
      </Box>
      <Box width="100%" gap={GAP} alignItems="center">
        <Button label={CANCEL} onPress={handleCancel}></Button>
        <Button label={NEXT} onPress={handleNext}></Button>
        <Text dimColor>{STEP}</Text>
      </Box>
    </>
  );
}
