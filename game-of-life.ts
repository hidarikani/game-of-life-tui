const ESC = "\x1b[";
const encoder = new TextEncoder();

async function write(s: string) {
  await Deno.stdout.write(encoder.encode(s));
}

async function enterAltScreen() {
  await write(`${ESC}?1049h`); // alternate screen buffer
  await write(`${ESC}?25l`); // hide cursor
}

async function leaveAltScreen() {
  await write(`${ESC}?25h`); // show cursor
  await write(`${ESC}?1049l`); // return to normal buffer
}

function renderGrid(): string {
  const { columns, rows } = Deno.consoleSize();
  const lines: string[] = [];
  for (let r = 0; r < rows; r++) {
    let line = "";
    for (let c = 0; c < columns; c++) {
      line += Math.random() < 0.5 ? "#" : ".";
    }
    lines.push(line);
  }
  return lines.join("\n");
}

async function main() {
  const once = Deno.args.includes("--once");
  try {
    await enterAltScreen();
    await write(`${ESC}2J`); // clear screen
    await write(`${ESC}H`); // move to 0,0
    await write(renderGrid());

    if (once) {
      await new Promise((res) => setTimeout(res, 250));
      return;
    }

    // Enable raw mode for interactive key handling (Deno 2.x)
    const anyStdin = Deno.stdin as unknown as { setRaw?: (mode: boolean) => void };
    if (typeof anyStdin.setRaw === "function") {
      anyStdin.setRaw(true);
    }

    const buf = new Uint8Array(1);
    while (true) {
      const n = await Deno.stdin.read(buf);
      if (n === null) break;
      const ch = String.fromCharCode(buf[0]);
      if (ch === "q" || ch === "Q") break;
      if (ch === "r" || ch === "R") {
        await write(`${ESC}H`);
        await write(renderGrid());
      }
    }
  } finally {
    const anyStdin2 = Deno.stdin as unknown as { setRaw?: (mode: boolean) => void };
    if (typeof anyStdin2.setRaw === "function") {
      anyStdin2.setRaw(false);
    }
    await leaveAltScreen();
  }
}

await main();
