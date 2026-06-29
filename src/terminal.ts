import {
  ALTERNATE_SCREEN_ENTER,
  ALTERNATE_SCREEN_EXIT,
  CURSOR_HIDE,
  CURSOR_SHOW,
} from "./constants.ts";

const encoder = new TextEncoder();

export async function write(s: string) {
  await Deno.stdout.write(encoder.encode(s));
}

export type Size = { columns: number; rows: number };

export function getSize(): Size {
  try {
    const { columns, rows } = Deno.consoleSize();
    return { columns: Math.floor(columns / 2), rows };
  } catch {
    return { columns: 40, rows: 24 };
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
