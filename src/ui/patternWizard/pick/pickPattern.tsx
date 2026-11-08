import { useCallback, useState } from "react";
import { Box, Text } from "ink";
import {
  genMsgPatternNotFound,
  genMsgPatternWizardHeading,
  PATTERN_WIZARD_STEP_1,
} from "../../../constants/messages.ts";
import { usePatternLib } from "../../../pattern/pattern.tsx";
import type { Step1Props } from "../../../types/app.ts";
import { PatternNameSelect } from "./patternName/patternNameSelect.tsx";
import { PatternGenerationSelect } from "./patternGeneration/patternGenerationSelect.tsx";
import { PatternInfo } from "./info/patternInfo.tsx";

export function PickPattern({ onChange }: Step1Props) {
  const heading = genMsgPatternWizardHeading(
    1,
    PATTERN_WIZARD_STEP_1,
  );
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
      throw new Error(genMsgPatternNotFound(selectedKey));
    }
  }

  const getPreview = () => {
    if (pattern === null || selectedGeneration === null) {
      return "Select a pattern generation to preview.";
    }

    return pattern.generations[selectedGeneration].toString();
  };

  return (
    <>
      <Box width="100%" backgroundColor="white">
        <Text color="black">
          {heading}
        </Text>
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
        <Box borderStyle="round" flexGrow={1}>
          <Text>{getPreview()}</Text>
        </Box>
      </Box>
      <Box>
      </Box>
    </>
  );
}
