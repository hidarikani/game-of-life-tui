export const UNKNOWN = "unknown";

export function genMsgContextMissing(
  hookName: string,
  providerName: string,
): string {
  return `${hookName} must be called within <${providerName}>; add it as an ancestor.`;
}
