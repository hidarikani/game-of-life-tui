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
  initialFrame: string;
  pattern: Pattern;
  appHeight: number;
  gridSize: GridSize;
  mode: GridMode;
  onTick: () => string;
  onRenderPlacement: (pattern: Pattern, offset: Point) => string;
  onSelectPattern: (pattern: Pattern, offset: Point) => string;
};

export type View = "game" | "patterns" | "placement";

export type UiState = {
  view: View;
  /** Rendered grid shown in the game view. */
  frame: string;
  /** Pattern the running simulation was started from. */
  pattern: Pattern;
  /** Index of the highlighted entry in the selection list. */
  selected: number;
  /** First list entry visible, so long lists can scroll. */
  scrollOffset: number;
  /** Pattern being positioned in the placement step. */
  placingKey: string | null;
  /** Offset the pattern is currently positioned at. */
  offset: Point;
  /** Rendered grid shown in the placement step. */
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
