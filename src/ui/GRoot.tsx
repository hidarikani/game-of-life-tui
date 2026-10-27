import type { Instance } from "ink";
import type { AppProps } from "../types/app.ts";
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

export function Root({ appProps }: { appProps: AppProps }) {
  const patternKey = useAppSelector(selectPatternKey);
  const patternOffset = useAppSelector(selectPatternOffset);
  const engineProps = {
    size: appProps.gridSize,
    generation: 0,
    mode: GRID_MODES.FINITE,
  };
  const firstGeneration = {
    patternKey,
    patternOffset,
  };

  return (
    <PatternProvider>
      <EngineProvider
        factoryProps={engineProps}
        firstGeneration={firstGeneration}
      >
        <App {...appProps} />
      </EngineProvider>
    </PatternProvider>
  );
}

export function renderRoot(
  appProps: AppProps,
  stdin: PassThrough,
): Instance {
  return render(
    (<StrictMode>
      <Provider store={store}>
        <Root appProps={appProps} />
      </Provider>
    </StrictMode>),
    {
      stdin: stdin as unknown as NodeJS.ReadStream,
    },
  );
}
