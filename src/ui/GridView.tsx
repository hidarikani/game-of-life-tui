import type { IGrid } from "@cell-auto/game-of-life-engine";

import { Text } from "ink";

export function GridView({ grid }: { grid: IGrid }) {
  const text = grid.toString();
  return <Text wrap="truncate">{text}</Text>;
}
