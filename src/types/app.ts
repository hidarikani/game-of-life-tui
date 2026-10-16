import type { ReactNode } from "react";

import type {
  GridMode,
  GridSize,
  Pattern,
  Point,
} from "@cell-auto/game-of-life-engine";

/**
 * Props for the interactive Game of Life view.
 */
export type AppProps = {
  pattern: Pattern;
  offset: Point;
  appHeight: number;
  gridSize: GridSize;
  mode: GridMode;
  onTick: () => string;
  onRenderPlacement: (pattern: Pattern, offset: Point) => string;
};

export type View = "game" | "patterns" | "placement";

export type UiState = {
  view: View;
  pattern: Pattern;
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
