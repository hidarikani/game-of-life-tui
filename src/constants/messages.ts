export const INVALID_ARGUMENTS = "Invalid arguments.";
export const UNKNOWN_CONSOLE_SIZE = "Unknown console size.";

export const GAME_HINTS = "R next generation · P patterns · Q quit";
export const PATTERNS_HINTS = "↑↓ move · Enter place · Esc back · Q quit";
export const PLACEMENT_HINTS = "↑↓←→ move · Enter confirm · Esc back · Q quit";

export const SLICES = {
  TERMINAL: "Terminal Slice",
  FIRST_GENERATION: "First Generation Slice",
} as const;

export const CONTEXTS = {
  PATTERN_LIB: "Pattern Library Context",
  ENGINE: "Game Engine",
} as const;

export function genMsgUninitializedSlice(slice: string): string {
  return `Redux slice "${slice}" MUST be initialized before use. Set values before selecting.`;
}

export function genMsgContextMissing(
  hookName: string,
  providerName: string,
): string {
  return `${hookName} must be called within <${providerName}>; add it as an ancestor.`;
}

export function genMsgPatternNotFound(patternKey: string): string {
  return `Pattern with key '${patternKey} not found.`;
}

export const PATTERN_WIZARD_STEP_1 = "Select pattern.";
export const PATTERN_WIZARD_STEP_2 = "Place pattern.";

export const PATTERNS_BY_NAME_HEADING = "Pattern Names";
export const PATTERNS_GENERATIONS = "Pattern Generations";

export const genMsgPatternWizardHeading = (
  step: number,
  stepInstructions: string,
) => {
  return `Pattern Wizard step ${step} of 2. ${stepInstructions}`;
};

export const genMsgPatternName = (name: string): string => `Name: ${name};`;
export const genMsgPatternSize = (w: number, h: number): string =>
  `Size: ${w}x${h};`;
export const genMsgPeriod = (period: string): string => `Period: ${period};`;
export const genMsgGeneration = (current: number, generations: number) =>
  `Generation: ${current} of ${generations};`;

export const NONE = "none";
export const UNKNOWN = "unknown";
