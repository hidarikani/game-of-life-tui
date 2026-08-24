import { PassThrough } from "node:stream";
import type { RawStdin } from "../types/terminal.ts";

/**
 * A Node-style stdin stream Ink can consume, backed by a pump that this
 * module feeds from `Deno.stdin`.
 *
 * Ink reads keyboard input through Node's `readable` event and
 * `stream.read()`, which never yields data from Deno's `process.stdin`
 * compatibility layer (reads return `null` even though the event fires). The
 * bridge sidesteps that gap: we read `Deno.stdin` directly and write the raw
 * bytes into a `PassThrough` stream that presents itself to Ink as a TTY.
 */
export type StdinBridge = {
  /** The stream to pass to Ink's `render(..., { stdin })`. */
  stdin: PassThrough;
  /** Stops the pump and restores the terminal out of raw mode. */
  stop: () => void;
};

/**
 * Fake-TTY properties Ink checks on the stream it is given. Raw mode is a
 * no-op because this module already put the real `Deno.stdin` in raw mode.
 */
type InkStdinProps = {
  isTTY: boolean;
  setRawMode: (mode: boolean) => void;
  ref: () => void;
  unref: () => void;
};

/**
 * Puts `Deno.stdin` in raw mode (ignored when no TTY is attached, matching
 * the previous renderer's behavior) and starts pumping bytes from `source`
 * (the real `Deno.stdin` by default; injectable for tests) into a stream Ink
 * can read keys from.
 */
export function createStdinBridge(
  source: ReadableStream<Uint8Array> = Deno.stdin.readable,
): StdinBridge {
  const stdin = new PassThrough() as PassThrough & InkStdinProps;
  stdin.isTTY = true;
  stdin.setRawMode = () => {};
  stdin.ref = () => {};
  stdin.unref = () => {};

  setRaw(true);

  let stopped = false;
  const reader = source.getReader();

  (async () => {
    try {
      while (!stopped) {
        const { value, done } = await reader.read();
        if (done) break;
        stdin.write(value);
        if (Deno.env.get("GOL_DEBUG")) {
          Deno.writeTextFileSync(
            "/tmp/gol-diag.log",
            "pump " + value.length + " bytes\n",
            { append: true },
          );
        }
      }
    } catch {
      // Reader was cancelled by stop(), or stdin closed underneath us.
    } finally {
      stdin.end();
    }
  })();

  return {
    stdin,
    stop: () => {
      stopped = true;
      reader.cancel().catch(() => {});
      setRaw(false);
    },
  };
}

function setRaw(mode: boolean) {
  const stdin = Deno.stdin as unknown as RawStdin;
  if (typeof stdin.setRaw === "function") {
    try {
      stdin.setRaw(mode);
    } catch {
      // No TTY attached (e.g. piped stdin); line-buffered input still works.
    }
  }
}
