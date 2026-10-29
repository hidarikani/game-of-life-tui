import type { UiState } from "../types/app.ts";

import { useRef, useState } from "react";
import { Box, Text, useApp, useInput } from "ink";

import {
  KEY_PATTERNS_LOWER,
  KEY_PATTERNS_UPPER,
  KEY_QUIT_LOWER,
  KEY_QUIT_UPPER,
  KEY_REFRESH_LOWER,
  KEY_REFRESH_UPPER,
} from "../constants/constants.ts";
import { genMsgPatternNotFound } from "../constants/messages.ts";
import { usePatterns } from "../pattern/pattern.tsx";
import { PatternPicker } from "./patternPicker/PatternPicker.tsx";
import {
  buildPreviewSnapshot,
  clamp,
  hintsFor,
  isEnter,
  messageOf,
} from "../util/misc.ts";
import { useEngineSnapshot, useEngineTick } from "../engine/engine.tsx";
import { useAppDispatch, useAppSelector } from "../store/hooks.ts";
import {
  selectPatternKey,
  setPatternKey,
  setPatternOffset,
} from "../store/firstGenerationSlice.ts";
import {
  selectAppHeight,
  selectGridHeight,
  selectGridWidth,
} from "../store/terminalSlice.ts";

export function App() {
  const [ui, setUiState] = useState<UiState>({
    view: "game",
    selected: 0,
    scrollOffset: 0,
    placingKey: null,
    offset: { x: 0, y: 0 },
    placementFrame: "",
  });

  const dispatch = useAppDispatch();
  const patternKey = useAppSelector(selectPatternKey);
  const patternLib = usePatterns();
  const patterns = patternLib.getPatterns(null);
  const appHeight = useAppSelector(selectAppHeight);
  const gameGridHeight = useAppSelector(selectGridHeight);
  const gameGridWidth = useAppSelector(selectGridWidth);
  const snapshot = useEngineSnapshot();
  const tick = useEngineTick();

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

  const openPatterns = (s: UiState): UiState => {
    const current = patterns.findIndex((p) => p.key === patternKey);
    const selected = current === -1 ? 0 : current;
    return {
      ...s,
      view: "patterns",
      selected,
      scrollOffset: Math.min(
        Math.max(0, selected - gameGridHeight + 1),
        Math.max(0, patterns.length - gameGridHeight),
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
    } else if (selected >= scrollOffset + gameGridHeight) {
      scrollOffset = selected - gameGridHeight + 1;
    }
    return { ...s, selected, scrollOffset };
  };

  /** Enters the placement step with the highlighted pattern at the origin. */
  const beginPlacement = (s: UiState): UiState => {
    const pattern = patterns[s.selected];
    if (!pattern) return s;
    const offset = { x: 0, y: 0 };
    return {
      ...s,
      view: "placement",
      placingKey: pattern.key,
      offset,
      placementFrame: buildPreviewSnapshot(
        { w: gameGridWidth, h: gameGridHeight },
        pattern,
        offset,
      ),
    };
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
      x: clamp(s.offset.x + dx, 0, gameGridWidth - size.w),
      y: clamp(s.offset.y + dy, 0, gameGridHeight - size.h),
    };
    if (offset.x === s.offset.x && offset.y === s.offset.y) return s;
    return {
      ...s,
      offset,
      placementFrame: buildPreviewSnapshot(
        { w: gameGridWidth, h: gameGridHeight },
        pattern,
        offset,
      ),
    };
  };

  /** Restarts the simulation with the pattern at its current offset. */
  const confirmPlacement = (s: UiState): UiState => {
    if (s.placingKey === null) {
      return s;
    }
    dispatch(setPatternKey(s.placingKey));
    dispatch(setPatternOffset(s.offset));

    return {
      ...s,
      view: "game",
      placingKey: null,
    };
  };

  useInput((input, key) => {
    let s: UiState = { ...uiRef.current };

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
          s = { ...s };
          tick();
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
        {ui.view === "game" && <Text>{snapshot}</Text>}
        {ui.view === "placement" && <Text>{ui.placementFrame}</Text>}
        {ui.view === "patterns" && (
          <PatternPicker
            selected={ui.selected}
            scrollOffset={ui.scrollOffset}
          />
        )}
      </Box>
      <Box height={1}>
        <Text inverse wrap="truncate">{hintsFor(ui, patterns)}</Text>
      </Box>
    </Box>
  );
}
