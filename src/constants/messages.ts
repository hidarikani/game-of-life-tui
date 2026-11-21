export const INVALID_ARGUMENTS = "Invalid arguments.";

export function genMsgUninitializedSlice(slice: string): string {
  return `Redux slice "${slice}" MUST be initialized before use. Set values before selecting.`;
}

export function genMsgContextMissing(
  hookName: string,
  providerName: string,
): string {
  return `${hookName} must be called within <${providerName}>; add it as an ancestor.`;
}

export function genErrPatternNotFound(patternKey: string): string {
  return `Pattern with key '${patternKey} not found.`;
}

export const NONE = "none";
export const UNKNOWN = "unknown";
