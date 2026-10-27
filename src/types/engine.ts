import type { GridMode, GridSize } from "@cell-auto/game-of-life-engine";
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

export type FirstGenerationFactoryProps = {
  size: GridSize;
  generation: number;
  mode: GridMode;
};

export type EngineProviderProps = {
  factoryProps: FirstGenerationFactoryProps;
  firstGeneration: FirstGenerationProps;
  children: ReactNode;
};
