export type CLIArgs = {
  interactive: boolean;
  patternKey: string;
  gridWidth: number;
  gridHeight: number;
  generations: number;
};

export type RawStdin = { setRaw?: (mode: boolean) => void };
