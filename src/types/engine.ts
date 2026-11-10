import type { ReactNode } from "react";
import type { FirstGenerationProps } from "./state.ts";

export type Callback = () => void;

export interface IEngineStore {
  subscribe(listener: Callback): Callback;
  getSnapshot(): string;
  tick(): void;
}

export type EngineContext = {
  currentGeneration: string;
  tick: () => void;
};

export type EngineProviderProps = {
  firstGeneration: FirstGenerationProps;
  children: ReactNode;
};
