export const INVALID_ARGUMENTS = "Invalid arguments.";
export const UNKNOWN_CONSOLE_SIZE = "Unknown console size.";

export const GAME_HINTS = "R next generation · P patterns · Q quit";
export const PATTERNS_HINTS = "↑↓ move · Enter place · Esc back · Q quit";
export const PLACEMENT_HINTS = "↑↓←→ move · Enter confirm · Esc back · Q quit";

export const CONTEXTS = {
  PATTERN_LIB: "Pattern Library Context",
  ENGINE: "Game Engine",
} as const;

export function genMsgContextMissing(
  hookName: string,
  providerName: string,
): string {
  return `${hookName} must be called within <${providerName}>; add it as an ancestor.`;
}

export function genMsgPatternNotFound(patternKey: string): string {
  return `Pattern with key '${patternKey} not found.`;
}

export const genMsgPatternName = (name: string): string => `Name: ${name};`;
export const genMsgPatternSize = (w: number, h: number): string =>
  `Size: ${w}x${h};`;
export const genMsgPeriod = (period: string): string => `Period: ${period};`;
export const genMsgGeneration = (current: number, generations: number) =>
  `Generation: ${current} of ${generations};`;

export const NONE = "none";
export const UNKNOWN = "unknown";
