import type { View } from "../types/app.ts";

import { useCallback, useState } from "react";
import { Box, Text, useApp, useInput } from "ink";

import {
  KEY_PATTERNS_LOWER,
  KEY_PATTERNS_UPPER,
  KEY_QUIT_LOWER,
  KEY_QUIT_UPPER,
  KEY_REFRESH_LOWER,
  KEY_REFRESH_UPPER,
  ORIGIN,
  VIEWS,
} from "../constants/constants.ts";
import { genMsgPatternNotFound } from "../constants/messages.ts";
import { usePatterns } from "../pattern/pattern.tsx";
import { PatternPicker } from "./patternPicker/PatternPicker.tsx";
import { clamp, hintsFor, isEnter } from "../util/misc.ts";
import {
  makeFirstGeneration,
  useEngineSnapshot,
  useEngineTick,
} from "../engine/engine.tsx";
import { useAppDispatch, useAppSelector } from "../store/hooks.ts";
import {
  selectGridMode,
  selectPatternGeneration,
  selectPatternKey,
  setPatternKey,
  setPatternOffset,
} from "../store/firstGenerationSlice.ts";
import { selectAppHeight, selectGridSize } from "../store/terminalSlice.ts";

export function App() {
  const patternLib = usePatterns();
  const patternKey = useAppSelector(selectPatternKey);
  const patternGeneration = useAppSelector(selectPatternGeneration);
  const gridSize = useAppSelector(selectGridSize);
  const gridMode = useAppSelector(selectGridMode);

  // Placement Begin ===
  const [placementOffset, setPlacementOffset] = useState(ORIGIN);
  const [placementKey, setPlacementKey] = useState(patternKey);
  const [placementGeneration, setPlacementGeneration] = useState(
    patternGeneration,
  );
  const placementSnapshot = makeFirstGeneration(patternLib, {
    patternKey: placementKey,
    patternOffset: placementOffset,
    patternGeneration: placementGeneration,
    gridSize,
    gridMode,
  }).toString();
  // Placement End ===

  const [view, setView] = useState<View>(VIEWS.GAME);
  const dispatch = useAppDispatch();
  const patterns = patternLib.getPatterns(null);
  const appHeight = useAppSelector(selectAppHeight);
  const snapshot = useEngineSnapshot();
  const tick = useEngineTick();
  const { exit } = useApp();

  const onSelectionChange = useCallback((patternKey: string) => {
    setPlacementKey(patternKey);
    setView("placement");
  }, []);

  const movePlacement = (dx: number, dy: number) => {
    const pattern = patterns.find((p) => p.key === placementKey);

    if (pattern === null || pattern === undefined) {
      throw new Error(genMsgPatternNotFound(placementKey));
    }

    const size = pattern.generations[0].gridSize;
    // The engine rejects a pattern that would extend past the grid, and
    // silently accepts negative offsets, so clamp to the valid range here.
    const offset = {
      x: clamp(placementOffset.x + dx, 0, gridSize.w - size.w),
      y: clamp(placementOffset.y + dy, 0, gridSize.h - size.h),
    };
    if (offset.x === placementOffset.x && offset.y === placementOffset.y) {
      return;
    }

    setPlacementOffset(offset);
  };

  /** Restarts the simulation with the pattern at its current offset. */
  const confirmPlacement = () => {
    dispatch(setPatternKey(placementKey));
    dispatch(setPatternOffset(placementOffset));
    setView(VIEWS.GAME);
  };

  useInput((input, key) => {
    // Special keys arrive as their own event with an empty input string.
    if (input === "") {
      if (view === VIEWS.PATTERNS) {
        if (key.escape) {
          setView(VIEWS.GAME);
        }
      } else if (view === VIEWS.PLACEMENT) {
        if (key.upArrow) movePlacement(0, -1);
        else if (key.downArrow) movePlacement(0, 1);
        else if (key.leftArrow) movePlacement(-1, 0);
        else if (key.rightArrow) movePlacement(1, 0);
        else if (key.return) confirmPlacement();
        else if (key.escape) {
          setView(VIEWS.PATTERNS);
        }
      }
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
      if (view === VIEWS.GAME) {
        if (ch === KEY_REFRESH_LOWER || ch === KEY_REFRESH_UPPER) {
          tick();
        } else if (ch === KEY_PATTERNS_LOWER || ch === KEY_PATTERNS_UPPER) {
          setView(VIEWS.PATTERNS);
        }
      } else if (isEnter(ch)) {
        if (view === VIEWS.PLACEMENT) {
          confirmPlacement();
        }
      }
    }
  });

  return (
    <Box flexDirection="column" height={appHeight}>
      <Box flexDirection="column" flexGrow={1}>
        {view === VIEWS.GAME && <Text>{snapshot}</Text>}
        {view === VIEWS.PLACEMENT && <Text>{placementSnapshot}</Text>}
        {view === VIEWS.PATTERNS && (
          <PatternPicker onSelectionChange={onSelectionChange} />
        )}
      </Box>
      <Box height={1}>
        <Text inverse wrap="truncate">
          {hintsFor(view, placementOffset, patterns)}
        </Text>
      </Box>
    </Box>
  );
}
