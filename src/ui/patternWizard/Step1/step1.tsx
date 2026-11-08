import { useCallback, useState } from "react";
import { Box, Text } from "ink";
import { Select } from "@inkjs/ui";
import {
  genMsgPatternNotFound,
  genMsgPatternWizardHeading,
  PATTERN_WIZARD_STEP_1,
  PATTERNS_BY_NAME_HEADING,
  PATTERNS_GENERATIONS as PATTERNS_GENERATIONS_HEADING,
} from "../../../constants/messages.ts";
import { usePatternLib } from "../../../pattern/pattern.tsx";
import type { Step1Props } from "../../../types/app.ts";

export function Step1({ onChange }: Step1Props) {
  const heading = genMsgPatternWizardHeading(
    1,
    PATTERN_WIZARD_STEP_1,
  );
  const patternLib = usePatternLib();
  const allPatterns = patternLib.getPatterns(null);
  const patternOptions = allPatterns.map((pattern) => ({
    label: pattern.name,
    value: pattern.key,
  }));

  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedGeneration, setSelectedGeneration] = useState<number | null>(
    null,
  );

  const handlePatternChange = useCallback((newKey: string) => {
    setSelectedKey(newKey);
  }, []);

  const handleGenerationChange = useCallback((newGeneration: string) => {
    setSelectedGeneration(Number.parseInt(newGeneration));
  }, []);

  let pattern = null;

  if (selectedKey !== null) {
    pattern = patternLib.getPatternByKey(selectedKey);
    if (pattern === null) {
      throw new Error(genMsgPatternNotFound(selectedKey));
    }
  }

  const patternGenerationOptions = [];
  if (pattern !== null) {
    for (let i = 0; i < pattern.generations.length; i++) {
      patternGenerationOptions.push({ label: `${i + 1}`, value: `${i}` });
    }
  }

  const checkIsPatternSelectDisabled = () => selectedKey !== null;
  const checkIsGenerationSelectDisabled = () => selectedKey === null;

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
      <Box width="100%" padding={1} flexDirection="row">
        <Box flexDirection="column">
          <Box flexDirection="column">
            <Text>{PATTERNS_BY_NAME_HEADING}</Text>
            <Box borderStyle="round">
              <Select
                options={patternOptions}
                onChange={handlePatternChange}
                isDisabled={checkIsPatternSelectDisabled()}
              />
            </Box>
          </Box>
          <Box flexDirection="column">
            <Text>{PATTERNS_GENERATIONS_HEADING}</Text>
            <Box borderStyle="round">
              <Select
                options={patternGenerationOptions}
                onChange={handleGenerationChange}
                isDisabled={checkIsGenerationSelectDisabled()}
              />
            </Box>
          </Box>
        </Box>
        <Box borderStyle="round" flexGrow={1}>
          <Text>{getPreview()}</Text>
        </Box>
      </Box>
      <Box>
      </Box>
    </>
  );
}
