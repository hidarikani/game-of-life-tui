import type { View } from "../../types/app.ts";

import { useCallback, useState } from "react";
import { Box, useApp, useInput } from "ink";

import {
  KEY_QUIT_LOWER,
  KEY_QUIT_UPPER,
  KEY_REFRESH_LOWER,
  KEY_REFRESH_UPPER,
  KEY_WIZARD,
  VIEWS,
} from "../../constants/constants.ts";
import { useTick } from "../../engine/engine.tsx";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import {
  setPatternGeneration,
  setPatternKey,
  setPatternOffset,
} from "../../store/firstGeneration/firstGenerationSlice.ts";
import { PatternWizard } from "../patternWizard/wizard/patternWizard.tsx";
import type { Point } from "@cell-auto/game-of-life-engine";
import { selectColumns, selectRows } from "../../store/terminal/terminalSlice.ts";
import { Game } from "../game/game.tsx";

export function App() {
  const [view, setView] = useState<View>(VIEWS.GAME);
  const terminalRows = useAppSelector(selectRows);
  const terminalCols = useAppSelector(selectColumns);
  const dispatch = useAppDispatch();
  const tick = useTick();
  const { exit } = useApp();

  useInput((input, key) => {
    // Special keys arrive as their own event with an empty input string.
    if (input === "") {
      // do nothing
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
        } else if (ch === KEY_WIZARD.LOWER || ch === KEY_WIZARD.UPPER) {
          setView(VIEWS.PATTERN_WIZARD);
        }
      }
    }
  });

  const handlePatternWizardCancel = useCallback(() => {
    setView(VIEWS.GAME);
  }, []);

  const handlePatternWizardSubmit = useCallback(
    (key: string, generationIndex: number, offset: Point) => {
      dispatch(setPatternKey(key));
      dispatch(setPatternGeneration(generationIndex));
      dispatch(setPatternOffset(offset));
      setView(VIEWS.GAME);
    },
    [dispatch],
  );

  return (
    <>
      <Box
        height={terminalRows}
        overflow="hidden"
      >
        {view === VIEWS.GAME && <Game />}
        {view === VIEWS.PATTERN_WIZARD && (
          <PatternWizard
            onCancel={handlePatternWizardCancel}
            onSubmit={handlePatternWizardSubmit}
          />
        )}
      </Box>
    </>
  );
}
