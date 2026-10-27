import {
  Engine,
  Grid,
  type IEngine,
  type IGrid,
  type IPatternLib,
} from "@cell-auto/game-of-life-engine";
import type {
  Callback,
  EngineContext,
  EngineProviderProps,
  FirstGenerationFactoryProps,
  IEngineStore,
} from "../types/engine.ts";

import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
} from "react";
import {
  CONTEXTS,
  genMsgContextMissing,
  genMsgPatternNotFound,
  UNKNOWN,
} from "../constants/messages.ts";
import type { FirstGenerationProps } from "../types/state.ts";
import { usePatterns } from "../pattern/pattern.tsx";

export class EngineStore implements IEngineStore {
  #engine: IEngine;
  #listeners = new Set<() => void>();
  constructor(engine: IEngine) {
    this.#engine = engine;

    this.subscribe = this.subscribe.bind(this);
    this.getSnapshot = this.getSnapshot.bind(this);
    this.tick = this.tick.bind(this);
  }

  subscribe(listener: () => void): Callback {
    this.#listeners.add(listener);
    return () => void this.#listeners.delete(listener);
  }

  getSnapshot(): string {
    return this.#engine.presentGeneration.toString();
  }

  tick(): void {
    (this.#engine as Engine).evolveGrid();
    for (const listener of this.#listeners) listener();
  }
}

export function makeFirstGeneration(
  props: FirstGenerationFactoryProps,
  patternLib: IPatternLib,
  { patternKey, patternOffset }: FirstGenerationProps,
): IGrid {
  const firstGeneration = new Grid({
    gridSize: props.size,
    mode: props.mode,
  });
  const pattern = patternLib.getPatternByKey(patternKey);

  if (pattern === null) {
    throw new Error(genMsgPatternNotFound(patternKey));
  }

  firstGeneration.writeGrid({
    inner: pattern.generations[props.generation],
    offset: patternOffset,
  });

  return firstGeneration;
}

export function makeEngine(
  props: FirstGenerationFactoryProps,
  patternLib: IPatternLib,
  firstGeneration: FirstGenerationProps,
): IEngine {
  return new Engine({
    firstGeneration: makeFirstGeneration(props, patternLib, firstGeneration),
  });
}

function makeEngineStore(
  props: FirstGenerationFactoryProps,
  patternLib: IPatternLib,
  firstGeneration: FirstGenerationProps,
): IEngineStore {
  return new EngineStore(makeEngine(props, patternLib, firstGeneration));
}

const EngineContext = createContext<IEngineStore | null>(null);
EngineContext.displayName = CONTEXTS.ENGINE;

function EngineStoreProvider(
  { factoryProps, firstGeneration, children }: EngineProviderProps,
) {
  const patternLib = usePatterns();

  /*
   * The store is stateful: each tick appends to the generation history,
   * which must survive re-renders. `useMemo` won't do, because React may
   * discard its cache at any time, losing the history. Instead, `useState`
   * holds the store (the setter is never used). Its initial value only
   * matters on mount, so the lazy initializer form avoids calling
   * `makeEngineStore` on every render.
   */
  const [engineStore] = useState(() =>
    makeEngineStore(factoryProps, patternLib, firstGeneration)
  );

  return <EngineContext value={engineStore}>{children}</EngineContext>;
}

function makeKey(
  factoryProps: FirstGenerationFactoryProps,
  firstGeneration: FirstGenerationProps,
): string {
  /*
   * without separator `,` keys can collide, for example
   * w=1, h=23 and w=12, h=3 both give "123"
   */
  const key = `(${factoryProps.size.w},${factoryProps.size.h}),` +
    `${firstGeneration.patternKey},` +
    `(${firstGeneration.patternOffset.x},${firstGeneration.patternOffset.y}),` +
    `${factoryProps.generation},` +
    `${factoryProps.mode}.`;

  return key;
}

export function EngineProvider(
  { factoryProps, firstGeneration, children }: EngineProviderProps,
) {
  /*
   * Changing the key remounts `EngineStoreProvider`, which re-runs its
   * `useState` initializer and resets the engine's generation history.
   */
  return (
    <EngineStoreProvider
      key={makeKey(factoryProps, firstGeneration)}
      factoryProps={factoryProps}
      firstGeneration={firstGeneration}
    >
      {children}
    </EngineStoreProvider>
  );
}

/**
 * Subscribes to the engine and returns the current generation as a snapshot.
 * Re-renders the calling component on every generation that changes the grid.
 * To advance the simulation without subscribing, use {@link useEngineTick}.
 *
 * @throws If called outside of an `EngineProvider`.
 */
export function useEngineSnapshot(): string {
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

  return snapshot;
}

/**
 * Returns a function that advances the engine by one generation.
 * Does not subscribe to the engine, so the calling component won't re-render
 * as the simulation runs. The returned function has a stable identity and is
 * safe to use as an effect dependency.
 * To read the current generation, use {@link useEngineSnapshot}.
 *
 * @throws If called outside of an `EngineProvider`.
 */
export function useEngineTick(): Callback {
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
