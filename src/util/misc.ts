import type { Pattern, Point } from "@cell-auto/game-of-life-engine";

import {
  GAME_HINTS,
  genMsgUninitializedSlice,
  PATTERNS_HINTS,
  PLACEMENT_HINTS,
} from "../constants/messages.ts";
import type { View } from "../types/app.ts";

export const required = <T>(value: T | null, slice: string): T => {
  if (value === null) {
    throw new Error(genMsgUninitializedSlice(slice));
  }
  return value;
};

export function hintsFor(
  view: View,
  offset: Point,
  patterns: Pattern[],
): string {
  if (view === "game") return GAME_HINTS;
  if (view === "placement") {
    return `${PLACEMENT_HINTS} · (${offset.x}, ${offset.y})`;
  }
  return `${PATTERNS_HINTS} · Total: ${patterns.length}`;
}

export function isEnter(ch: string): boolean {
  return ch === "\r" || ch === "\n";
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

export function messageOf(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}
