import type { Point } from "@cell-auto/game-of-life-engine";

// Terminal control sequences ===
export const ESC = "\x1b["; // ANSI escape sequence prefix
export const ALTERNATE_SCREEN_ENTER = `${ESC}?1049h`;
export const ALTERNATE_SCREEN_EXIT = `${ESC}?1049l`;
export const CURSOR_HIDE = `${ESC}?25l`;
export const CURSOR_SHOW = `${ESC}?25h`;

// Keyboard commands ===
export const KEY_QUIT_LOWER = "q";
export const KEY_QUIT_UPPER = "Q";
export const KEY_REFRESH_LOWER = "r";
export const KEY_REFRESH_UPPER = "R";
export const KEY_PATTERNS_LOWER = "p";
export const KEY_PATTERNS_UPPER = "P";

// args ===
export const CLI_ARGS = {
  INTERACTIVE: "interactive",
  PATTERN: "pattern",
  GRID_WIDTH: "grid-width",
  GRID_HEIGHT: "grid-height",
  GENERATIONS: "generations",
} as const;

export const LONG_ARG_PREFIX = "--";

// Game ===
/**
 * @deprecated use PatternLib API
 */
export const PATTERN_KEYS = {
  PULSAR: "pulsar",
};

/**
 * @deprecated @cell-auto/game-of-life-engine
 */
export const MIN_GENERATIONS = 1 as const;
/**
 * @deprecated @cell-auto/game-of-life-engine
 */
export const ORIGIN: Point = { x: 0, y: 0 };

// tui
export const SEPARATOR_WIDTH = {
  MIN: 1,
  MAX: 80,
} as const;

export const MIN_LIST_WIDTH = 10;
export const MAX_LIST_WIDTH = 24;
export const LIST_GAP = 2;
