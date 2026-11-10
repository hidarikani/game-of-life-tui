import type { Pattern } from "@cell-auto/game-of-life-engine";

export type Props = {
  pattern: Pattern | null;
  generation: number | null;
};
