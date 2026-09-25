import { CLI_ARGS } from "../constants.ts";

export function genMsgPatternNotFound(patternKey: string): string {
  return `Pattern with key '${patternKey} not found.`;
}

export const GRID_SIZE_CONFLICTS_WITH_INTERACTIVE =
  `'--${CLI_ARGS.GRID_WIDTH}' and '--${CLI_ARGS.GRID_HEIGHT}' cannot be used with '--${CLI_ARGS.INTERACTIVE}'.` +
  ` In interactive mode the application runs full-screen and sizes the grid to fit the current terminal.`;
