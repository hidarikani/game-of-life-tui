import type { IPatternLib } from "@cell-auto/game-of-life-engine";
import type { PatternProviderProps } from "../types/app.ts";

import { createContext, useContext } from "react";
import { PatternLib } from "@cell-auto/game-of-life-engine";
import {
  CONTEXTS,
  genMsgContextMissing,
  UNKNOWN,
} from "../constants/messages.ts";

let patternLib: null | IPatternLib = null;

export function makePatternLib(): IPatternLib {
  return (patternLib ??= PatternLib.fromBuiltInData());
}

const PatternContext = createContext<IPatternLib | null>(null);
PatternContext.displayName = CONTEXTS.PATTERN_LIB;

export function PatternProvider({ children }: PatternProviderProps) {
  const patternLib = makePatternLib();

  return <PatternContext value={patternLib}>{children}</PatternContext>;
}

export function usePatterns(): IPatternLib {
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
