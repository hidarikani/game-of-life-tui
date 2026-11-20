// Keyboard commands ===
export const KEY_QUIT = {
  UPPER: "Q",
  LOWER: "q",
} as const;
export const KEY_TICK = {
  UPPER: "T",
  LOWER: "t",
} as const;
export const KEY_WIZARD = {
  UPPER: "P",
  LOWER: "p",
} as const;

// args ===
export const CLI_ARGS = {
  INTERACTIVE: "interactive",
  PATTERN: "pattern",
  GRID_WIDTH: "grid-width",
  GRID_HEIGHT: "grid-height",
  GENERATIONS: "generations",
} as const;

export const LONG_ARG_PREFIX = "--";


// tui
export const VIEWS = {
  GAME: "game",
  PATTERN_WIZARD: "wizard",
} as const;

export const SEPARATOR_WIDTH = {
  MIN: 1,
  MAX: 80,
} as const;

export const HINT_SEPARATOR = " · ";

export const PADDING = 1;
export const GAP = 1;

export const MAX_SELECT_WIDTH = 20;

export const HEADER_HEIGHT = 3;
export const FOOTER_HEIGHT = 3;
