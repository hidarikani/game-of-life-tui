import type {
  GridMode,
  GridSize,
  Pattern,
  Point,
} from "@cell-auto/game-of-life-engine";
import type { ReactNode } from "react";

export type FirstGenerationState = {
  size: GridSize | null;
  pattern: Pattern | null;
  generation: number | null;
  offset: Point | null;
  mode: GridMode | null;
};

export type FirstGenerationFactoryProps = {
  size: GridSize;
  pattern: Pattern;
  generation: number;
  offset: Point;
  mode: GridMode;
};

export type EngineProviderProps = {
  factoryProps: FirstGenerationFactoryProps;
  children: ReactNode;
};
