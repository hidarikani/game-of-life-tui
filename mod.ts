import type { ValidArgs } from "./src/types/terminal.ts";

import * as v from "@valibot/valibot";

import {
  enterInteractiveMode,
  enterNonInteractiveMode,
  handleArguments,
} from "./src/terminal/terminal.ts";
import { INVALID_ARGUMENTS } from "./src/constants/messages.ts";
import { LONG_ARG_PREFIX } from "./src/terminal/terminal.const.ts";

async function main() {
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

await main();
