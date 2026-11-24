import type { Instance } from "ink";
import type { PassThrough } from "node:stream";

import { StrictMode } from "react";
import { Provider } from "react-redux";
import { render } from "ink";

import { store } from "../store/store.ts";
import { EngineProvider } from "../context/engine/engine.tsx";
import { App } from "./app/App.tsx";
import { PatternProvider } from "../context/pattern/pattern.tsx";

export function Root() {
  return (
    <EngineProvider>
      <App />
    </EngineProvider>
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
        <PatternProvider>
          <Root />
        </PatternProvider>
      </Provider>
    </StrictMode>),
    {
      stdin: stdin as unknown as NodeJS.ReadStream,
      alternateScreen: true,
    },
  );
}
