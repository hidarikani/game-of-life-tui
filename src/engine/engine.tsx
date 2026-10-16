import {
  Engine,
  Grid,
  type IEngine,
  type IGrid,
} from "@cell-auto/game-of-life-engine";
import type {
  EngineProviderProps,
  FirstGenerationFactoryProps,
  FirstGenerationState,
} from "../types/engine.ts";

import { createContext, useContext } from "react";
import {
  CONTEXTS,
  genMsgContextMissing,
  UNKNOWN,
} from "../constants/messages.ts";

let engine: IEngine | null = null;

let prevDeps: FirstGenerationState = {
  size: null,
  pattern: null,
  generation: null,
  offset: null,
  mode: null,
};

function didDepsChange(
  prev: FirstGenerationState,
  next: FirstGenerationFactoryProps,
): boolean {
  const sizeChanged = prev.size?.w !== next.size.w ||
    prev.size?.h !== next.size.h;

  const patternChanged = prevDeps.pattern?.key !== next.pattern.key;
  const generationChanged = prevDeps.generation !== next.generation;
  const offsetChanged = prevDeps.offset?.x !== next.offset.x ||
    prevDeps.offset?.y !== next.offset.y;

  const modeChanged = prevDeps.mode !== next.mode;

  return sizeChanged || patternChanged || generationChanged || offsetChanged ||
    modeChanged;
}

export function makeFirstGeneration(props: FirstGenerationFactoryProps): IGrid {
  const firstGeneration = new Grid({
    gridSize: props.size,
    mode: props.mode,
  });
  firstGeneration.writeGrid({
    inner: props.pattern.generations[props.generation],
    offset: props.offset,
  });

  return firstGeneration;
}

export function makeEngine(
  next: FirstGenerationFactoryProps,
): IEngine {
  if (didDepsChange(prevDeps, next)) {
    engine == null;
  }

  prevDeps = next;

  if (engine === null) {
    const firstGeneration = makeFirstGeneration(next);
    engine = new Engine({ firstGeneration });
  }

  return engine;
}

const EngineContext = createContext<IEngine | null>(null);
EngineContext.displayName = CONTEXTS.ENGINE;

export function EngineProvider(
  { factoryProps, children }: EngineProviderProps,
) {
  return (
    <EngineContext value={makeEngine(factoryProps)}>{children}</EngineContext>
  );
}

export function useEngine(): IEngine {
  const engine = useContext(EngineContext);
  if (engine === null) {
    throw new Error(
      genMsgContextMissing(
        "useEngine",
        EngineContext.displayName ?? UNKNOWN,
      ),
    );
  }

  return engine;
}
