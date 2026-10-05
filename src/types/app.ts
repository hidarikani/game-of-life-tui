import type { GridSize, Pattern, Point } from "@cell-auto/game-of-life-engine";

/**
 * Props for the interactive Game of Life view.
 */
export type AppProps = {
  /** The already-rendered first generation to display on mount. */
  initialFrame: string;
  /** Key of the pattern the simulation started with. */
  pattern: Pattern;
  /** Total rows the app may occupy, toolbar included. */
  appHeight: number;
  /** Size of the simulation grid, used to constrain placement offsets. */
  gridSize: GridSize;
  /** Every pattern available in the selection view. */
  patterns: Pattern[];
  /** Advances the simulation one generation and returns the rendered grid. */
  onTick: () => string;
  /** Renders a pattern on its own, at its natural size, for the preview. */
  onRenderPreview: (pattern: Pattern) => string;
  /**
   * Renders the full-size grid holding only the given pattern at `offset`,
   * for the placement step. May throw when the pattern does not fit.
   */
  onRenderPlacement: (pattern: Pattern, offset: Point) => string;
  /**
   * Restarts the simulation with the given pattern at `offset` and returns
   * the rendered grid. May throw; the message is shown in the toolbar.
   */
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

export type PatternPickerProps = {
  patterns: Pattern[];
  selected: number;
  scrollOffset: number;
  contentHeight: number;
  onRenderPreview: (pattern: Pattern) => string;
};
