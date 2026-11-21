import { Box, Text, useFocus, useInput } from "ink";
import type { Props } from "./types.ts";

export const Button = ({ label, onPress, isDisabled = false }: Props) => {
  const { isFocused } = useFocus({
    isActive: !isDisabled,
  });

  useInput(
    (input, key) => {
      if (key.return || input === " ") onPress();
    },
    { isActive: isFocused },
  );

  return (
    <Box
      borderStyle="round"
      borderDimColor={isDisabled}
      paddingX={1}
    >
      <Text bold underline={isFocused} dimColor={isDisabled}>
        {label}
      </Text>
    </Box>
  );
};
