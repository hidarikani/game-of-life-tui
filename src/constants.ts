// Terminal control sequences ===
export const ESC = "\x1b["; // ANSI escape sequence prefix
export const ALTERNATE_SCREEN_ENTER = `${ESC}?1049h`;
export const ALTERNATE_SCREEN_EXIT = `${ESC}?1049l`;
export const CURSOR_HIDE = `${ESC}?25l`;
export const CURSOR_SHOW = `${ESC}?25h`;
export const SCREEN_CLEAR = `${ESC}2J`;
export const CURSOR_HOME = `${ESC}H`;

// Keyboard commands ===
export const KEY_QUIT_LOWER = "q";
export const KEY_QUIT_UPPER = "Q";
export const KEY_REFRESH_LOWER = "r";
export const KEY_REFRESH_UPPER = "R";

// Game ===
export const PATTERN_KEYS = {
  PULSAR: "pulsar",
};

export const MIN_GRID_SIZE = 3 as const;
export const DEFAULT_NON_INTERACTIVE_GRID_WIDTH = 100;
export const DEFAULT_NON_INTERACTIVE_GRID_HEIGHT = 100;
export const MIN_GENERATIONS = 1 as const;
