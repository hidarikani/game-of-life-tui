import type { ReactNode } from "react";

import type {
  GridMode,
  GridSize,
  Pattern,
  Point,
} from "@cell-auto/game-of-life-engine";

export type AppProps = {
  offset: Point;
  appHeight: number;
  gridSize: GridSize;
  mode: GridMode;
};

export type View = "game" | "patterns" | "placement";

export type UiState = {
  view: View;
  selected: number;
  scrollOffset: number;
  placingKey: string | null;
  offset: Point;
  placementFrame: string;
  error: string | null;
};

export type PatternProviderProps = {
  children: ReactNode;
};

export type PatternPickerProps = {
  patterns: Pattern[];
  selected: number;
  scrollOffset: number;
  contentHeight: number;
};

export type PatternHeaderProps = {
  pattern: Pattern;
  currentGeneration: number;
};
