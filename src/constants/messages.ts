export const INVALID_ARGUMENTS = "Invalid arguments";

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
