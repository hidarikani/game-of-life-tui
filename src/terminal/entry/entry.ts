import { parseArgs } from "@std/cli/parse-args";
import * as v from "@valibot/valibot";
import { ArgSchema, type ValidArgs } from "../../types/terminal.ts";
import { CLI_ARGS, LONG_ARG_PREFIX } from "../terminal.const.ts";
import { INVALID_ARGUMENTS } from "../../constants/messages.ts";
import { enterInteractiveMode } from "../interactive/internactive.ts";
import { enterNonInteractiveMode } from "../nonInteractive/nonInteractive.ts";

export function handleArguments(): ValidArgs {
  /*
   * parseArgs coerces numeric-looking args to numbers unless they're listed in
   * options.string or options.boolean. All args are deliberately listed in
   * options.string so valibot handles conversion (with more control), and
   * options.default is omitted because valibot handles defaults too.
   */
  const args = parseArgs(
    Deno.args,
    {
      string: [
        CLI_ARGS.INTERACTIVE,
        CLI_ARGS.PATTERN,
        CLI_ARGS.GRID_WIDTH,
        CLI_ARGS.GRID_HEIGHT,
        CLI_ARGS.GENERATIONS,
      ],
    },
  );

  const { _, ...onlyKnown } = args;
  return v.parse(ArgSchema, onlyKnown);
}

export async function main() {
  let args: ValidArgs;

  try {
    args = handleArguments();
  } catch (e) {
    if (v.isValiError(e)) {
      console.error(INVALID_ARGUMENTS);
      e.issues.forEach((issue) => {
        if (issue.path === null) {
          console.error(issue.message);
        } else {
          console.error(
            `${LONG_ARG_PREFIX}${v.getDotPath(issue)}: ${issue.message}`,
          );
        }
      });
      Deno.exit(1);
    }
    throw e;
  }

  if (args.interactive) {
    await enterInteractiveMode(args);
  } else {
    await enterNonInteractiveMode(args);
  }
}
