export const CLI_ARGS = {
  INTERACTIVE: "interactive",
  PATTERN: "pattern",
  GRID_WIDTH: "grid-width",
  GRID_HEIGHT: "grid-height",
  GENERATIONS: "generations",
} as const;

export const LONG_ARG_PREFIX = "--";

export const SEPARATOR_WIDTH = {
  MIN: 1,
  MAX: 80,
} as const;
