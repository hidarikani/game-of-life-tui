import {
  type IGrid,
  type IPatternLib,
  pointToCellKey,
} from "@cell-auto/game-of-life-engine";

import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
} from "react";
import {
  genErrPatternNotFound,
  genMsgContextMissing,
  UNKNOWN,
} from "../constants/messages.ts";
import type {
  EngineProviderProps,
  EngineStoreProviderProps,
  GenerationProps,
} from "./types.ts";
import type { EmptyCallback } from "../types/general.ts";
import { EngineNext, GridNext } from "../next/next.ts";
import type { IEngineNext, IGridNext } from "../next/types.ts";
import { useAppSelector } from "../store/hooks.ts";
import {
  selectGridMode,
  selectLiveCells,
} from "../store/firstGeneration/firstGenerationSlice.ts";
import { selectGridSize } from "../store/terminal/terminalSlice.ts";
import { CONTEXT_NAME } from "./messages.ts";

export function makeGeneration(
  patternLib: IPatternLib,
  { patternKey, patternOffset, patternGeneration, gridSize, gridMode }:
    GenerationProps,
): IGridNext {
  const firstGeneration = new GridNext({
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
  firstGeneration: IGrid,
): IEngineNext {
  return new EngineNext({
    firstGeneration,
  });
}

const EngineContext = createContext<IEngineNext | null>(null);
EngineContext.displayName = CONTEXT_NAME;

function EngineStoreProvider(
  { firstGeneration, children }: EngineStoreProviderProps,
) {
  /*
   * The store is stateful: each tick appends to the generation history,
   * which must survive re-renders. `useMemo` won't do, because React may
   * discard its cache at any time, losing the history. Instead, `useState`
   * holds the store (the setter is never used). Its initial value only
   * matters on mount, so the lazy initializer form avoids calling
   * `makeEngineStore` on every render.
   */
  const [engine] = useState(() =>
    new EngineNext({
      firstGeneration,
    })
  );

  return <EngineContext value={engine}>{children}</EngineContext>;
}

export function EngineProvider(
  { children }: EngineProviderProps,
) {
  const liveCellsArr = useAppSelector(selectLiveCells);
  const liveCells = new Set(liveCellsArr.map((point) => pointToCellKey(point)));
  const gridSize = useAppSelector(selectGridSize);
  const mode = useAppSelector(selectGridMode);
  const firstGeneration = new GridNext({ gridSize, liveCells, mode });

  /*
   * Changing the key remounts `EngineStoreProvider`, which re-runs its
   * `useState` initializer and resets the engine's generation history.
   */
  return (
    <EngineStoreProvider
      key={firstGeneration.serialize()}
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
