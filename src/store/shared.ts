import { genMsgUninitializedSlice } from "./messages.ts";

export const required = <T>(value: T | null, slice: string): T => {
  if (value === null) {
    throw new Error(genMsgUninitializedSlice(slice));
  }
  return value;
};
