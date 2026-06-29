import { CELL_ALIVE, CELL_DEAD, COL_SEPARATOR } from "./constants.ts";
import type { Size } from "./terminal.ts";

export function renderGrid({ columns, rows }: Size): string {
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
