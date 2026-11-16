import { genMsgUninitializedSlice } from "../constants/messages.ts";

export const required = <T>(value: T | null, slice: string): T => {
  if (value === null) {
    throw new Error(genMsgUninitializedSlice(slice));
  }
  return value;
};

export function isEnter(ch: string): boolean {
  return ch === "\r" || ch === "\n";
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

export function messageOf(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}
