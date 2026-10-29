import type { ReactNode } from "react";

import type { Pattern } from "@cell-auto/game-of-life-engine";
import type { VIEWS } from "../constants/constants.ts";

export type View = (typeof VIEWS)[keyof typeof VIEWS];

export type PatternProviderProps = {
  children: ReactNode;
};

export type PatternHeaderProps = {
  pattern: Pattern;
  currentGeneration: number;
};

export type PatternPickerProps = {
  onSelectionChange: (patternKey: string) => void;
};
