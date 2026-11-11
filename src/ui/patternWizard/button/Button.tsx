import { Box, Text, useFocus, useInput } from "ink";
import type { Props } from "./types.ts";

export const Button = ({ label, onPress, id }: Props) => {
  const { isFocused } = useFocus({ id });

  useInput(
    (input, key) => {
      if (key.return || input === " ") onPress();
    },
    { isActive: isFocused },
  );

  return (
    <Box
      borderStyle="round"
      paddingX={1}
    >
      <Text bold underline={isFocused}>
        {label}
      </Text>
    </Box>
  );
};
