import { Box, Text, useFocus, useInput } from "ink";

type ButtonProps = {
  label: string;
  onPress: () => void;
  id?: string;
};

export const Button = ({ label, onPress, id }: ButtonProps) => {
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
