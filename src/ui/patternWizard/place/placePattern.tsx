import { Box, Text } from "ink";
import { HEADING as WIZARD_HEADING } from "../wizard/messages.ts";

export function PlacePattern() {
  const heading = `${WIZARD_HEADING}`;

  return (
    <Box width="100%" backgroundColor="white">
      <Text color="black">
        {heading}
      </Text>
    </Box>
  );
}
