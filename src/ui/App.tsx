import { useState } from "react";
import { type Instance, render, Text, useApp, useInput } from "ink";
import type { PassThrough } from "node:stream";
import {
  KEY_QUIT_LOWER,
  KEY_QUIT_UPPER,
  KEY_REFRESH_LOWER,
  KEY_REFRESH_UPPER,
} from "../constants.ts";

/**
 * Props for the interactive Game of Life view.
 */
export type AppProps = {
  /** The already-rendered first generation to display on mount. */
  initialFrame: string;
  /** Advances the simulation one generation and returns the rendered grid. */
  onTick: () => string;
};

/**
 * Interactive Game of Life view. Shows one rendered generation at a time;
 * R advances the simulation one generation and Q quits.
 */
export function App({ initialFrame, onTick }: AppProps) {
  const [frame, setFrame] = useState(initialFrame);
  const { exit } = useApp();

  useInput((input) => {
    // Keys can arrive batched in one chunk (typed during startup, or pasted),
    // so handle each character the way the old one-byte read loop did.
    for (const key of input) {
      if (key === KEY_QUIT_LOWER || key === KEY_QUIT_UPPER) {
        exit();
        return;
      }
      if (key === KEY_REFRESH_LOWER || key === KEY_REFRESH_UPPER) {
        setFrame(onTick());
      }
    }
  });

  return <Text>{frame}</Text>;
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
