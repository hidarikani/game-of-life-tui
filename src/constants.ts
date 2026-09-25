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

export const CLI_ARGS = {
  INTERACTIVE: "interactive",
  GRID_WIDTH: "grid-width",
  GRID_HEIGHT: "grid-height",
};

// Game ===
export const PATTERN_KEYS = {
  PULSAR: "pulsar",
};

export const MIN_GRID_SIZE = 3 as const;
export const DEFAULT_GRID_WIDTH = 100;
export const DEFAULT_GRID_HEIGHT = 100;
export const MIN_GENERATIONS = 1 as const;
export const ORIGIN: Point = { x: 0, y: 0 };
