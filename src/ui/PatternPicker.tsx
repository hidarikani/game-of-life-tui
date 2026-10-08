import type { PatternPickerProps } from "../types/app.ts";

import { Box, Text } from "ink";
import { LIST_GAP, MAX_LIST_WIDTH, MIN_LIST_WIDTH } from "../constants.ts";
import { clamp, messageOf } from "../util/misc.ts";

/**
 * The selection step: pattern names on the left, a preview of the highlighted
 * pattern on the right.
 */
export function PatternPicker(
  { patterns, selected, scrollOffset, contentHeight, onRenderPreview }:
    PatternPickerProps,
) {
  const listWidth = clamp(
    Math.max(...patterns.map((p) => p.name.length)) + 1,
    MIN_LIST_WIDTH,
    MAX_LIST_WIDTH,
  );
  const current = patterns[selected];

  let preview = "";
  let previewError: string | null = null;
  if (current) {
    try {
      preview = onRenderPreview(current);
    } catch (cause) {
      previewError = messageOf(cause);
    }
  }

  // Two rows of the preview pane are the pattern's name and metadata.
  const previewRows = preview === "" ? [] : preview.split("\n");
  const visibleRows = previewRows.slice(0, Math.max(0, contentHeight - 2));

  return (
    <Box flexDirection="row" flexGrow={1}>
      <Box flexDirection="column" width={listWidth} marginRight={LIST_GAP}>
        {patterns
          .slice(scrollOffset, scrollOffset + contentHeight)
          .map((pattern, i) => (
            <Text
              key={pattern.key}
              inverse={scrollOffset + i === selected}
              wrap="truncate"
            >
              {pattern.name}
            </Text>
          ))}
      </Box>
      <Box flexDirection="column" flexGrow={1} overflow="hidden">
        {current && (
          <>
            <Text bold wrap="truncate">{current.name}</Text>
            <Text dimColor wrap="truncate">
              {current.type} · period {current.period} ·{" "}
              {current.generations[0].gridSize.w}×
              {current.generations[0].gridSize.h}
            </Text>
            {previewError === null
              ? visibleRows.map((row, i) => (
                <Text key={i} wrap="truncate">{row}</Text>
              ))
              : <Text color="red" wrap="truncate">{previewError}</Text>}
          </>
        )}
      </Box>
    </Box>
  );
}
