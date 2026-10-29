import type { Instance } from "ink";
import type { PassThrough } from "node:stream";

import { StrictMode } from "react";
import { Provider } from "react-redux";
import { render } from "ink";

import { store } from "../store/store.ts";
import { PatternProvider } from "../pattern/pattern.tsx";
import { EngineProvider } from "../engine/engine.tsx";
import { App } from "./App.tsx";
import { useAppSelector } from "../store/hooks.ts";
import {
  selectPatternKey,
  selectPatternOffset,
} from "../store/firstGenerationSlice.ts";
import { GRID_MODES } from "@cell-auto/game-of-life-engine";
import { selectGridHeight, selectGridWidth } from "../store/terminalSlice.ts";
import type { FirstGenerationProps } from "../types/state.ts";

export function Root() {
  const patternKey = useAppSelector(selectPatternKey);
  const patternOffset = useAppSelector(selectPatternOffset);
  const gameGridHeight = useAppSelector(selectGridHeight);
  const gameGridWidth = useAppSelector(selectGridWidth);

  const firstGeneration: FirstGenerationProps = {
    patternKey,
    patternOffset,
    gridSize: { w: gameGridWidth, h: gameGridHeight },
    patternGeneration: 0,
    gridMode: GRID_MODES.FINITE,
  };

  return (
    <PatternProvider>
      <EngineProvider
        firstGeneration={firstGeneration}
      >
        <App />
      </EngineProvider>
    </PatternProvider>
  );
}

/**
 * Warning! this is NOT a React component
 */
export function renderRoot(
  stdin: PassThrough,
): Instance {
  return render(
    (<StrictMode>
      <Provider store={store}>
        <Root />
      </Provider>
    </StrictMode>),
    {
      stdin: stdin as unknown as NodeJS.ReadStream,
    },
  );
}
