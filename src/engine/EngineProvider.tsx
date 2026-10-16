import {
  createContext,
  type ReactNode,
  use,
  useLayoutEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

import type {
  GridMode,
  GridSize,
  IEngine,
  Pattern,
} from "@cell-auto/game-of-life-engine";

import {
  commitEngine,
  createEngine,
  findMatchingEngine,
  getCurrentEngine,
  subscribe,
} from "./engineStore.ts";

const EngineContext = createContext<IEngine | null>(null);

type EngineProviderProps = {
  size: GridSize;
  pattern: Pattern;
  mode: GridMode;
  children: ReactNode;
};

/**
 * Owns the engine config while mounted and publishes the engine to both
 * React (via context) and the module store (for non-React callers).
 *
 * Render stays pure: the engine is derived in useMemo (reusing the stored one
 * if it already matches, e.g. when pre-warmed with getEngine() before mount)
 * and only written to the store after commit.
 */
export function EngineProvider(
  { size, pattern, mode, children }: EngineProviderProps,
) {
  const { w, h } = size;

  const engine = useMemo(
    () =>
      findMatchingEngine(size, pattern, mode) ??
        createEngine(size, pattern, mode),
    // Keyed on identity values, not object references.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [w, h, pattern.key, mode],
  );

  // Layout effect so non-React readers see the new engine before paint.
  useLayoutEffect(() => {
    commitEngine(engine, size, pattern, mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine]);

  return <EngineContext value={engine}>{children}</EngineContext>;
}

/**
 * The engine for the nearest <EngineProvider>. Throws outside a provider.
 */
export function useEngine(): IEngine {
  const engine = use(EngineContext);
  if (engine === null) {
    throw new Error("useEngine must be used within <EngineProvider>");
  }
  return engine;
}

/**
 * The current store engine, from anywhere in the tree (no provider required).
 * Re-renders when the engine is replaced, including by non-React code.
 */
export function useCurrentEngine(): IEngine | null {
  return useSyncExternalStore(subscribe, getCurrentEngine, getCurrentEngine);
}
