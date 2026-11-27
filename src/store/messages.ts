export function genMsgUninitializedSlice(slice: string): string {
  return `Redux slice "${slice}" MUST be initialized before use. Set values before selecting.`;
}
