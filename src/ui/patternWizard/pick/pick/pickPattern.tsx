import { useCallback, useState } from "react";
import { Box, Text } from "ink";
import { genErrPatternNotFound } from "../../../../constants/messages.ts";
import { usePatternLib } from "../../../../pattern/pattern.tsx";
import { PatternNameSelect } from "../patternName/patternNameSelect.tsx";
import { PatternGenerationSelect } from "../patternGeneration/patternGenerationSelect.tsx";
import { PatternInfo } from "../info/patternInfo.tsx";
import { PatternPreview } from "../preview/patternPreview.tsx";
import { Button } from "../../button/Button.tsx";
import {
  CONFIRM_SELECTION,
  HEADING as STEP_HEADING,
  INSTRUCTIONS,
  NEXT,
  STEP,
  TRAVERSE_LIST,
} from "./messages.ts";
import { Heading } from "../../../heading/heading.tsx";
import { CANCEL, HEADING as WIZARD_HEADING } from "../../wizard/messages.ts";
import type { Props } from "./types.ts";
import { Description } from "../../../description/description.tsx";
import { Hints } from "../../../hints/hints.tsx";
import { CYCLE_FOCUS_HINT, QUIT_APP_HINT } from "../../../app/messages.ts";
import { GAP } from "../../../app/app.const.ts";

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

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const handleNext = useCallback(() => {
    if (selectedKey === null || selectedGeneration === null) {
      return;
    }

    onSubmit(selectedKey, selectedGeneration);
  }, [selectedKey, selectedGeneration, onSubmit]);

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

  const isNextDisabled = selectedKey === null || selectedGeneration === null;

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
      <Box gap={GAP} flexDirection="column">
        <Box gap={GAP} alignItems="center">
          <Button label={CANCEL} onPress={handleCancel}></Button>
          <Button label={NEXT} isDisabled={isNextDisabled} onPress={handleNext}>
          </Button>
        </Box>
        <Hints>
          {QUIT_APP_HINT}
          {CYCLE_FOCUS_HINT}
          {TRAVERSE_LIST}
          {CONFIRM_SELECTION}
        </Hints>
        <Text dimColor>{STEP}</Text>
      </Box>
    </Box>
  );
}
