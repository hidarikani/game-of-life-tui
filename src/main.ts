import {
  CELL_ALIVE,
  CELL_DEAD,
  COL_SEPARATOR,
  KEY_QUIT_LOWER,
  KEY_QUIT_UPPER,
  KEY_REFRESH_LOWER,
  KEY_REFRESH_UPPER,
} from "./constants.ts";
import {
  clearScreen,
  disableRawMode,
  enableRawMode,
  enterAltScreen,
  getSize,
  leaveAltScreen,
  readKey,
  write,
} from "./terminal.ts";
import type { Size } from "./terminal.ts";

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
    await clearScreen();
    const size = getSize();

    await write(renderGrid(size));

    if (once) {
      await new Promise((res) => setTimeout(res, 250));
      return;
    }

    enableRawMode();

    while (true) {
      const ch = await readKey();
      if (ch === null) break;
      if (ch === KEY_QUIT_LOWER || ch === KEY_QUIT_UPPER) break;
      if (ch === KEY_REFRESH_LOWER || ch === KEY_REFRESH_UPPER) {
        await clearScreen();
        await write(renderGrid(size));
      }
    }
  } finally {
    disableRawMode();
    await leaveAltScreen();
  }
}

await main();
