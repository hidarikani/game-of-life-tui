import type { ReactNode } from "react";

import type { Pattern, Point } from "@cell-auto/game-of-life-engine";

export type View = "game" | "patterns" | "placement";

export type UiState = {
  view: View;
  selected: number;
  scrollOffset: number;
  placingKey: string | null;
  offset: Point;
  placementFrame: string;
};

export type PatternProviderProps = {
  children: ReactNode;
};

export type PatternPickerProps = {
  selected: number;
  scrollOffset: number;
};

export type PatternHeaderProps = {
  pattern: Pattern;
  currentGeneration: number;
};
