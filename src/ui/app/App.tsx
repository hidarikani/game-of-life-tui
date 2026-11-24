import { useCallback, useState } from "react";
import { Box, useApp, useInput } from "ink";

import { useTick } from "../../context/engine/engine.tsx";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import {
  setLiveCells,
} from "../../store/firstGeneration/firstGenerationSlice.ts";
import { PatternWizard } from "../patternWizard/wizard/patternWizard.tsx";
import type { IGrid } from "@cell-auto/game-of-life-engine";
import { selectRows } from "../../store/terminal/terminalSlice.ts";
import { Game } from "../game/game.tsx";
import { KEY_QUIT, KEY_TICK, KEY_WIZARD, VIEWS } from "./app.const.ts";
import type { View } from "./types.ts";

export function App() {
  const [view, setView] = useState<View>(VIEWS.GAME);
  const terminalRows = useAppSelector(selectRows);

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
      if (ch === KEY_QUIT.LOWER || ch === KEY_QUIT.UPPER) {
        exit();
        return;
      }
      if (view === VIEWS.GAME) {
        if (ch === KEY_TICK.LOWER || ch === KEY_TICK.UPPER) {
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
    (grid: IGrid) => {
      const liveCells = grid.liveCells;
      dispatch(setLiveCells([...liveCells]));
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
