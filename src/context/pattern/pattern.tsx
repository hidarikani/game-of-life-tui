import type { IPatternLib } from "@cell-auto/game-of-life-engine";

import { createContext, useContext } from "react";
import { PatternLib } from "@cell-auto/game-of-life-engine";
import { CONTEXT_NAME } from "./messages.ts";
import type { PatternProviderProps } from "./types.ts";
import { genMsgContextMissing, UNKNOWN } from "../messages.ts";

let patternLib: null | IPatternLib = null;

export function makePatternLib(): IPatternLib {
  return (patternLib ??= PatternLib.fromBuiltInData());
}

const PatternContext = createContext<IPatternLib | null>(null);
PatternContext.displayName = CONTEXT_NAME;

export function PatternProvider({ children }: PatternProviderProps) {
  const patternLib = makePatternLib();

  return <PatternContext value={patternLib}>{children}</PatternContext>;
}

export function usePatternLib(): IPatternLib {
  const patternLib = useContext(PatternContext);
  if (patternLib === null) {
    throw new Error(
      genMsgContextMissing(
        "usePatterns",
        PatternContext.displayName ?? UNKNOWN,
      ),
    );
  }

  return patternLib;
}
