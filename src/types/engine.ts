import type { ReactNode } from "react";
import type { FirstGenerationProps } from "./state.ts";
import type { EmptyCallback } from "./general.ts";

export type EngineContext = {
  currentGeneration: string;
  tick: EmptyCallback;
};

export type EngineProviderProps = {
  firstGeneration: FirstGenerationProps;
  children: ReactNode;
};
