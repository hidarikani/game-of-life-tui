import {
  Engine,
  Grid,
  type IEngine,
  type IGrid,
  type IPatternLib,
} from "@cell-auto/game-of-life-engine";
import type { EngineContext, EngineProviderProps } from "../types/engine.ts";

import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
} from "react";
import {
  CONTEXTS,
  genErrPatternNotFound,
  genMsgContextMissing,
  UNKNOWN,
} from "../constants/messages.ts";
import type { FirstGenerationProps } from "../types/state.ts";
import { usePatternLib } from "../pattern/pattern.tsx";
import type { EmptyCallback } from "../types/general.ts";
import { EngineStore, GridNext } from "../next/next.ts";
import type { IEngineStore, IGridNext } from "../next/types.ts";

export function makeFirstGeneration(
  patternLib: IPatternLib,
  { patternKey, patternOffset, patternGeneration, gridSize, gridMode }:
    FirstGenerationProps,
): IGrid {
  const firstGeneration = new Grid({
    gridSize,
    mode: gridMode,
  });
  const pattern = patternLib.getPatternByKey(patternKey);

  if (pattern === null) {
    throw new Error(genErrPatternNotFound(patternKey));
  }

  firstGeneration.writeGrid({
    inner: pattern.generations[patternGeneration],
    offset: patternOffset,
  });

  return firstGeneration;
}

export function makeEngine(
  patternLib: IPatternLib,
  firstGeneration: FirstGenerationProps,
): IEngine {
  return new Engine({
    firstGeneration: makeFirstGeneration(patternLib, firstGeneration),
  });
}

function makeEngineStore(
  patternLib: IPatternLib,
  firstGeneration: FirstGenerationProps,
): IEngineStore {
  return new EngineStore(makeEngine(patternLib, firstGeneration));
}

const EngineContext = createContext<IEngineStore | null>(null);
EngineContext.displayName = CONTEXTS.ENGINE;

function EngineStoreProvider(
  { firstGeneration, children }: EngineProviderProps,
) {
  const patternLib = usePatternLib();

  /*
   * The store is stateful: each tick appends to the generation history,
   * which must survive re-renders. `useMemo` won't do, because React may
   * discard its cache at any time, losing the history. Instead, `useState`
   * holds the store (the setter is never used). Its initial value only
   * matters on mount, so the lazy initializer form avoids calling
   * `makeEngineStore` on every render.
   */
  const [engineStore] = useState(() =>
    makeEngineStore(patternLib, firstGeneration)
  );

  return <EngineContext value={engineStore}>{children}</EngineContext>;
}

function makeKey(
  firstGeneration: FirstGenerationProps,
): string {
  /*
   * without separator `,` keys can collide, for example
   * w=1, h=23 and w=12, h=3 both give "123"
   */
  const key = `(${firstGeneration.gridSize.w},${firstGeneration.gridSize.h}),` +
    `${firstGeneration.patternKey},` +
    `(${firstGeneration.patternOffset.x},${firstGeneration.patternOffset.y}),` +
    `${firstGeneration.patternGeneration},` +
    `${firstGeneration.gridMode}.`;

  return key;
}

export function EngineProvider(
  { firstGeneration, children }: EngineProviderProps,
) {
  /*
   * Changing the key remounts `EngineStoreProvider`, which re-runs its
   * `useState` initializer and resets the engine's generation history.
   */
  return (
    <EngineStoreProvider
      key={makeKey(firstGeneration)}
      firstGeneration={firstGeneration}
    >
      {children}
    </EngineStoreProvider>
  );
}

/**
 * Subscribes to the engine and returns the present generation.
 * Re-renders the calling component on every tick.
 * To advance the simulation without subscribing, use {@link useTick}.
 *
 * @throws If called outside of an `EngineProvider`.
 */
export function usePresent(): IGridNext {
  const engineStore = useContext(EngineContext);
  if (engineStore === null) {
    throw new Error(
      genMsgContextMissing(
        "useEngineSnapshot",
        EngineContext.displayName ?? UNKNOWN,
      ),
    );
  }

  const snapshot = useSyncExternalStore(
    engineStore.subscribe,
    engineStore.getSnapshot,
  );

  return GridNext.fromGrid(snapshot);
}

/**
 * Returns a function that advances the engine by one generation.
 * Does not subscribe to the engine, so the calling component won't re-render
 * as the simulation runs. The returned function has a stable identity and is
 * safe to use as an effect dependency.
 * To read the current generation, use {@link usePresent}.
 *
 * @throws If called outside of an `EngineProvider`.
 */
export function useTick(): EmptyCallback {
  const engineStore = useContext(EngineContext);
  if (engineStore === null) {
    throw new Error(
      genMsgContextMissing(
        "useEngineTick",
        EngineContext.displayName ?? UNKNOWN,
      ),
    );
  }

  return engineStore.tick;
}
