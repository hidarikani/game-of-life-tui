export const INVALID_ARGUMENTS = "Invalid arguments";

export function genMsgPatternNotFound(patternKey: string): string {
  return `Pattern with key '${patternKey} not found.`;
}
