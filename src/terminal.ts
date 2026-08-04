import {
  ALTERNATE_SCREEN_ENTER,
  ALTERNATE_SCREEN_EXIT,
  CURSOR_HIDE,
  CURSOR_HOME,
  CURSOR_SHOW,
  SCREEN_CLEAR,
} from "./constants.ts";
import type { GridSize } from "@hidarikani/game-of-life-engine";

const encoder = new TextEncoder();

export async function write(s: string) {
  await Deno.stdout.write(encoder.encode(s));
}

export function getSize(): GridSize {
  try {
    const { columns, rows } = Deno.consoleSize();
    return { w: Math.floor(columns / 2), h: rows };
  } catch {
    return { w: 40, h: 24 };
  }
}

export async function enterAltScreen() {
  await write(ALTERNATE_SCREEN_ENTER);
  await write(CURSOR_HIDE);
}

export async function leaveAltScreen() {
  await write(CURSOR_SHOW);
  await write(ALTERNATE_SCREEN_EXIT);
}

export async function clearScreen() {
  await write(SCREEN_CLEAR);
  await write(CURSOR_HOME);
}

type RawStdin = { setRaw?: (mode: boolean) => void };

export function enableRawMode() {
  const stdin = Deno.stdin as unknown as RawStdin;
  if (typeof stdin.setRaw === "function") {
    try {
      stdin.setRaw(true);
    } catch { /* no TTY */ }
  }
}

export function disableRawMode() {
  const stdin = Deno.stdin as unknown as RawStdin;
  if (typeof stdin.setRaw === "function") {
    try {
      stdin.setRaw(false);
    } catch { /* no TTY */ }
  }
}

const buf = new Uint8Array(1);

export async function readKey(): Promise<string | null> {
  const n = await Deno.stdin.read(buf);
  if (n === null) return null;
  return String.fromCharCode(buf[0]);
}
