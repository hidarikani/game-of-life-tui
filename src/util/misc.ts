import type { UiState } from "../types/app.ts";

import type { Pattern } from "@cell-auto/game-of-life-engine";
import { GAME_HINTS, PATTERNS_HINTS, PLACEMENT_HINTS } from "../constants.ts";

export function hintsFor(ui: UiState, patterns: Pattern[]): string {
  if (ui.view === "game") return GAME_HINTS;
  if (ui.view === "placement") {
    return `${PLACEMENT_HINTS} · (${ui.offset.x}, ${ui.offset.y})`;
  }
  return `${PATTERNS_HINTS} · ${ui.selected + 1}/${patterns.length}`;
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
