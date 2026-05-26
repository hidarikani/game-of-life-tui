import {
  ALTERNATE_SCREEN_ENTER,
  ALTERNATE_SCREEN_EXIT,
  CELL_ALIVE,
  CELL_DEAD,
  COL_SEPARATOR,
  CURSOR_HIDE,
  CURSOR_HOME,
  CURSOR_SHOW,
  KEY_QUIT_LOWER,
  KEY_QUIT_UPPER,
  KEY_REFRESH_LOWER,
  KEY_REFRESH_UPPER,
  SCREEN_CLEAR,
} from "./constants.ts";

const encoder = new TextEncoder();

async function write(s: string) {
  await Deno.stdout.write(encoder.encode(s));
}

async function enterAltScreen() {
  await write(ALTERNATE_SCREEN_ENTER);
  await write(CURSOR_HIDE);
}

async function leaveAltScreen() {
  await write(CURSOR_SHOW);
  await write(ALTERNATE_SCREEN_EXIT);
}

type Size = { columns: number; rows: number };

function getSize(): { columns: number; rows: number } {
  try {
    const { columns, rows } = Deno.consoleSize();
    return { columns: Math.floor(columns / 2), rows };
  } catch {
    return { columns: 40, rows: 24 };
  }
}

function renderGrid({ columns, rows }: Size): string {
  const lines: string[] = [];
  for (let r = 0; r < rows; r++) {
    let line = "";
    for (let c = 0; c < columns; c++) {
      line += Math.random() < 0.5 ? CELL_ALIVE : CELL_DEAD;
      line += COL_SEPARATOR;
    }
    lines.push(line);
  }
  return lines.join("\n");
}

async function main() {
  const once = Deno.args.includes("--once");
  try {
    await enterAltScreen();
    await write(SCREEN_CLEAR);
    await write(CURSOR_HOME);
    const size = getSize();

    await write(renderGrid(size));

    if (once) {
      await new Promise((res) => setTimeout(res, 250));
      return;
    }

    // Enable raw mode for interactive key handling (Deno 2.x)
    const anyStdin = Deno.stdin as unknown as {
      setRaw?: (mode: boolean) => void;
    };
    if (typeof anyStdin.setRaw === "function") {
      anyStdin.setRaw(true);
    }

    const buf = new Uint8Array(1);
    while (true) {
      const n = await Deno.stdin.read(buf);
      if (n === null) break;
      const ch = String.fromCharCode(buf[0]);
      if (ch === KEY_QUIT_LOWER || ch === KEY_QUIT_UPPER) break;
      if (ch === KEY_REFRESH_LOWER || ch === KEY_REFRESH_UPPER) {
        await write(CURSOR_HOME);
        await write(renderGrid(size));
      }
    }
  } finally {
    const anyStdin2 = Deno.stdin as unknown as {
      setRaw?: (mode: boolean) => void;
    };
    if (typeof anyStdin2.setRaw === "function") {
      anyStdin2.setRaw(false);
    }
    await leaveAltScreen();
  }
}

await main();
