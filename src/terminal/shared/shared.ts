import type { ViewportSize } from "./types.ts";

export function getSize(): ViewportSize {
  return Deno.consoleSize();
}
