import type { AppProps, UiState } from "../types/app.ts";

import { useRef, useState } from "react";
import { Box, type Instance, render, Text, useApp, useInput } from "ink";
import type { PassThrough } from "node:stream";
import {
  KEY_PATTERNS_LOWER,
  KEY_PATTERNS_UPPER,
  KEY_QUIT_LOWER,
  KEY_QUIT_UPPER,
  KEY_REFRESH_LOWER,
  KEY_REFRESH_UPPER,
} from "../constants.ts";
import { genMsgPatternNotFound } from "../constants/messages.ts";
import { getPatternLib } from "../pattern/pattern.ts";
import { PatternPicker } from "./PatternPicker.tsx";
import { clamp, hintsFor, isEnter, messageOf } from "../util/misc.ts";

/**
 * Interactive Game of Life app.
 *
 * The game view shows one rendered generation at a time (R advances, P opens
 * pattern selection, Q quits). Choosing a pattern is a two-step wizard: the
 * selection view lists patterns on the left with a preview of the highlighted
 * one on the right, and Enter moves to the placement step, where the pattern
 * is drawn on a full-size grid that the arrow keys reposition. Enter there
 * restarts the simulation with the pattern at the chosen offset. A one-row
 * toolbar at the bottom lists the controls for the active view.
 */
export function App(
  {
    initialFrame,
    pattern,
    appHeight,
    gridSize,
    patterns,
    onTick,
    onRenderPreview,
    onRenderPlacement,
    onSelectPattern,
  }: AppProps,
) {
  const [ui, setUiState] = useState<UiState>({
    view: "game",
    frame: initialFrame,
    pattern,
    selected: 0,
    scrollOffset: 0,
    placingKey: null,
    offset: { x: 0, y: 0 },
    placementFrame: "",
    error: null,
  });
  // Key events can be handled back-to-back before React commits the state
  // update from the previous event (batched startup input, pasted key
  // sequences). Decisions therefore read the ref, which is always current,
  // while `ui` drives rendering.
  const uiRef = useRef(ui);
  const setUi = (next: UiState) => {
    uiRef.current = next;
    setUiState(next);
  };
  const { exit } = useApp();

  // One row is reserved for the toolbar; the rest is the content area, which
  // also caps how many list entries are visible at once.
  const contentHeight = Math.max(1, appHeight - 1);

  const openPatterns = (s: UiState): UiState => {
    const current = patterns.findIndex((p) => p.key === s.pattern.key);
    const selected = current === -1 ? 0 : current;
    return {
      ...s,
      view: "patterns",
      selected,
      scrollOffset: Math.min(
        Math.max(0, selected - contentHeight + 1),
        Math.max(0, patterns.length - contentHeight),
      ),
    };
  };

  const moveSelection = (s: UiState, delta: number): UiState => {
    const selected = Math.min(
      Math.max(0, s.selected + delta),
      patterns.length - 1,
    );
    let scrollOffset = s.scrollOffset;
    if (selected < scrollOffset) {
      scrollOffset = selected;
    } else if (selected >= scrollOffset + contentHeight) {
      scrollOffset = selected - contentHeight + 1;
    }
    return { ...s, selected, scrollOffset };
  };

  /** Enters the placement step with the highlighted pattern at the origin. */
  const beginPlacement = (s: UiState): UiState => {
    const pattern = patterns[s.selected];
    if (!pattern) return s;
    const offset = { x: 0, y: 0 };
    try {
      return {
        ...s,
        view: "placement",
        placingKey: pattern.key,
        offset,
        placementFrame: onRenderPlacement(pattern, offset),
      };
    } catch (cause) {
      return { ...s, error: messageOf(cause) };
    }
  };

  const movePlacement = (s: UiState, dx: number, dy: number): UiState => {
    const pattern = patterns.find((p) => p.key === s.placingKey);

    if (pattern === null || pattern === undefined) {
      throw new Error(genMsgPatternNotFound(s.placingKey ?? ""));
    }

    const size = pattern.generations[0].gridSize;
    if (!pattern) return s;
    // The engine rejects a pattern that would extend past the grid, and
    // silently accepts negative offsets, so clamp to the valid range here.
    const offset = {
      x: clamp(s.offset.x + dx, 0, gridSize.w - size.w),
      y: clamp(s.offset.y + dy, 0, gridSize.h - size.h),
    };
    if (offset.x === s.offset.x && offset.y === s.offset.y) return s;
    try {
      return {
        ...s,
        offset,
        placementFrame: onRenderPlacement(pattern, offset),
      };
    } catch (cause) {
      return { ...s, error: messageOf(cause) };
    }
  };

  /** Restarts the simulation with the pattern at its current offset. */
  const confirmPlacement = (s: UiState): UiState => {
    if (s.placingKey === null) return s;
    try {
      return {
        ...s,
        view: "game",
        frame: onSelectPattern(s.pattern, s.offset),
        pattern: getPatternLib().getPatternByKey(s.placingKey)!,
        placingKey: null,
      };
    } catch (cause) {
      return { ...s, error: messageOf(cause) };
    }
  };

  useInput((input, key) => {
    let s: UiState = { ...uiRef.current, error: null };

    // Special keys arrive as their own event with an empty input string.
    if (input === "") {
      if (s.view === "patterns") {
        if (key.upArrow) s = moveSelection(s, -1);
        else if (key.downArrow) s = moveSelection(s, 1);
        else if (key.return) s = beginPlacement(s);
        else if (key.escape) s = { ...s, view: "game" };
      } else if (s.view === "placement") {
        if (key.upArrow) s = movePlacement(s, 0, -1);
        else if (key.downArrow) s = movePlacement(s, 0, 1);
        else if (key.leftArrow) s = movePlacement(s, -1, 0);
        else if (key.rightArrow) s = movePlacement(s, 1, 0);
        else if (key.return) s = confirmPlacement(s);
        else if (key.escape) s = { ...s, view: "patterns", placingKey: null };
      }
      setUi(s);
      return;
    }

    // Printable keys can arrive batched in one chunk (typed during startup,
    // or pasted), with Enter embedded as a literal newline, so handle each
    // character against the state the previous character produced — the way
    // the old one-byte read loop did.
    for (const ch of input) {
      if (ch === KEY_QUIT_LOWER || ch === KEY_QUIT_UPPER) {
        exit();
        return;
      }
      if (s.view === "game") {
        if (ch === KEY_REFRESH_LOWER || ch === KEY_REFRESH_UPPER) {
          s = { ...s, frame: onTick() };
        } else if (ch === KEY_PATTERNS_LOWER || ch === KEY_PATTERNS_UPPER) {
          s = openPatterns(s);
        }
      } else if (isEnter(ch)) {
        s = s.view === "patterns" ? beginPlacement(s) : confirmPlacement(s);
      }
    }
    setUi(s);
  });

  return (
    <Box flexDirection="column" height={appHeight}>
      <Box flexDirection="column" flexGrow={1}>
        {ui.view === "game" && <Text>{ui.frame}</Text>}
        {ui.view === "placement" && <Text>{ui.placementFrame}</Text>}
        {ui.view === "patterns" && (
          <PatternPicker
            patterns={patterns}
            selected={ui.selected}
            scrollOffset={ui.scrollOffset}
            contentHeight={contentHeight}
            onRenderPreview={onRenderPreview}
          />
        )}
      </Box>
      <Box height={1}>
        {ui.error === null
          ? <Text dimColor wrap="truncate">{hintsFor(ui, patterns)}</Text>
          : <Text color="red" wrap="truncate">{ui.error}</Text>}
      </Box>
    </Box>
  );
}

/**
 * Mounts the interactive view, reading keys from the given bridged stdin
 * stream. Await the returned instance's `waitUntilExit()` to block until the
 * user quits.
 */
export function renderApp(props: AppProps, stdin: PassThrough): Instance {
  return render(<App {...props} />, {
    stdin: stdin as unknown as NodeJS.ReadStream,
  });
}
