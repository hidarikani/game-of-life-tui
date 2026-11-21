import type { Point } from "@cell-auto/game-of-life-engine";

export const KEY_SEPARATOR = ";";

/**
 * @deprecated use PatternLib API
 */
export const PATTERN_KEYS = {
  PULSAR: "pulsar",
} as const;

/**
 * @deprecated @cell-auto/game-of-life-engine
 */
export const MIN_GENERATIONS = 1 as const;

/**
 * @deprecated @cell-auto/game-of-life-engine
 */
export const ORIGIN: Point = { x: 0, y: 0 };
