import { assertEquals } from "@std/assert";
import { createStdinBridge } from "./stdin-bridge.ts";

function sourceFromController(): {
  source: ReadableStream<Uint8Array>;
  push: (s: string) => void;
  close: () => void;
} {
  let controller!: ReadableStreamDefaultController<Uint8Array>;
  const source = new ReadableStream<Uint8Array>({
    start(c) {
      controller = c;
    },
  });
  const encoder = new TextEncoder();
  return {
    source,
    push: (s) => controller.enqueue(encoder.encode(s)),
    close: () => controller.close(),
  };
}

function nextChunk(bridge: { stdin: NodeJS.ReadableStream }): Promise<string> {
  return new Promise((resolve) => {
    bridge.stdin.once("data", (chunk) => resolve(String(chunk)));
  });
}

Deno.test("stdin bridge", async (t) => {
  await t.step("presents itself as a raw-mode-capable TTY", () => {
    const { source } = sourceFromController();
    const bridge = createStdinBridge(source);
    const stdin = bridge.stdin as unknown as {
      isTTY: boolean;
      setRawMode: unknown;
    };
    assertEquals(stdin.isTTY, true);
    assertEquals(typeof stdin.setRawMode, "function");
    bridge.stop();
  });

  await t.step("forwards source bytes to the bridged stream", async () => {
    const { source, push } = sourceFromController();
    const bridge = createStdinBridge(source);
    const received = nextChunk(bridge);
    push("r");
    assertEquals(await received, "r");
    bridge.stop();
  });

  await t.step("ends the bridged stream when the source closes", async () => {
    const { source, close } = sourceFromController();
    const bridge = createStdinBridge(source);
    const ended = new Promise<void>((resolve) => {
      bridge.stdin.once("end", () => resolve());
    });
    bridge.stdin.resume();
    close();
    await ended;
    bridge.stop();
  });

  await t.step("stop cancels a pending source read", async () => {
    const { source } = sourceFromController();
    const bridge = createStdinBridge(source);
    const ended = new Promise<void>((resolve) => {
      bridge.stdin.once("end", () => resolve());
    });
    bridge.stdin.resume();
    bridge.stop();
    await ended;
  });
});
