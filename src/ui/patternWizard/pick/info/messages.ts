export const EMPTY = "Select a pattern to see its info.";

export const HEADING = "Pattern Info";

export const genMsgPatternName = (name: string): string => `Name: ${name};`;
export const genMsgGenerationSize = (w: number, h: number): string =>
  `Generation size: ${w}x${h};`;
export const genMsgPeriod = (period: string): string => `Period: ${period};`;
