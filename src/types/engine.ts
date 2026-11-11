import type { ReactNode } from "react";
import type { FirstGenerationProps } from "./state.ts";
import type { EmptyCallback } from "./general.ts";

export interface IEngineStore {
  subscribe(listener: EmptyCallback): EmptyCallback;
  getSnapshot(): string;
  tick(): void;
}

export type EngineContext = {
  currentGeneration: string;
  tick: EmptyCallback;
};

export type EngineProviderProps = {
  firstGeneration: FirstGenerationProps;
  children: ReactNode;
};
