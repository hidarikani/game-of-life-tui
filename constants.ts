// ANSI escape sequence prefix
export const ESC = "\x1b[";

// Terminal control sequences
export const ALTERNATE_SCREEN_ENTER = `${ESC}?1049h`;
export const ALTERNATE_SCREEN_EXIT = `${ESC}?1049l`;
export const CURSOR_HIDE = `${ESC}?25l`;
export const CURSOR_SHOW = `${ESC}?25h`;
export const SCREEN_CLEAR = `${ESC}2J`;
export const CURSOR_HOME = `${ESC}H`;

// Cell characters
export const CELL_ALIVE = "#";
export const CELL_DEAD = ".";
export const COL_SEPARATOR = " ";

// Keyboard commands
export const KEY_QUIT_LOWER = "q";
export const KEY_QUIT_UPPER = "Q";
export const KEY_REFRESH_LOWER = "r";
export const KEY_REFRESH_UPPER = "R";
