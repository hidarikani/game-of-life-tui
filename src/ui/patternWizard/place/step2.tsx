import { Box, Text } from "ink";
import {
  genMsgPatternWizardHeading,
  PATTERN_WIZARD_STEP_2,
} from "../../../constants/messages.ts";

export function Step2() {
  const heading = genMsgPatternWizardHeading(
    2,
    PATTERN_WIZARD_STEP_2,
  );

  return (
    <Box width="100%" backgroundColor="white">
      <Text color="black">
        {heading}
      </Text>
    </Box>
  );
}
