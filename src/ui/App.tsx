import { useRef, useState } from "react";
import { Box, type Instance, render, Text, useApp, useInput } from "ink";
import type { PassThrough } from "node:stream";
import type { PatternInfo } from "../game/game.ts";
import {
  KEY_PATTERNS_LOWER,
  KEY_PATTERNS_UPPER,
  KEY_QUIT_LOWER,
  KEY_QUIT_UPPER,
  KEY_REFRESH_LOWER,
  KEY_REFRESH_UPPER,
} from "../constants.ts";

/**
 * Props for the interactive Game of Life view.
 */
export type AppProps = {
  /** The already-rendered first generation to display on mount. */
  initialFrame: string;
  /** Key of the pattern the simulation started with. */
  initialPatternKey: string;
  /** Total rows the app may occupy, toolbar included. */
  appHeight: number;
  /** Every pattern available in the selection view. */
  patterns: PatternInfo[];
  /** Advances the simulation one generation and returns the rendered grid. */
  onTick: () => string;
  /**
   * Restarts the simulation with the given pattern and returns the rendered
   * grid. May throw (e.g. pattern larger than the grid); the thrown message
   * is shown in the toolbar.
   */
  onSelectPattern: (patternKey: string) => string;
};

type View = "game" | "patterns";

type UiState = {
  view: View;
  frame: string;
  patternKey: string;
  selected: number;
  scrollOffset: number;
  error: string | null;
};

const GAME_HINTS = "R next generation · P patterns · Q quit";
const PATTERNS_HINTS = "↑↓ move · Enter select · Esc back · Q quit";

/**
 * Interactive Game of Life app. The game view shows one rendered generation
 * at a time (R advances, P opens pattern selection, Q quits). The patterns
 * view lists every built-in pattern in a scrollable list; Enter clears the
 * grid and restarts the simulation with the chosen pattern. A one-row
 * toolbar at the bottom lists the controls for the active view.
 */
export function App(
  {
    initialFrame,
    initialPatternKey,
    appHeight,
    patterns,
    onTick,
    onSelectPattern,
  }: AppProps,
) {
  const [ui, setUiState] = useState<UiState>({
    view: "game",
    frame: initialFrame,
    patternKey: initialPatternKey,
    selected: 0,
    scrollOffset: 0,
    error: null,
  });
  // Key events can be handled back-to-back before React commits the state
  // update from the previous event (batched startup input, pasted key
  // sequences). Decisions therefore read the ref, which is always current,
  // while `ui` drives rendering.
  const uiRef = useRef(ui);
  const setUi = (next: UiState) => {
    uiRef.current = next;
    setUiState(next);
  };
  const { exit } = useApp();

  // One row is reserved for the toolbar; the rest is the content area, which
  // also caps how many list entries are visible at once.
  const contentHeight = Math.max(1, appHeight - 1);

  const openPatterns = (s: UiState): UiState => {
    const current = patterns.findIndex((p) => p.key === s.patternKey);
    const selected = current === -1 ? 0 : current;
    return {
      ...s,
      view: "patterns",
      selected,
      scrollOffset: Math.min(
        Math.max(0, selected - contentHeight + 1),
        Math.max(0, patterns.length - contentHeight),
      ),
    };
  };

  const moveSelection = (s: UiState, delta: number): UiState => {
    const selected = Math.min(
      Math.max(0, s.selected + delta),
      patterns.length - 1,
    );
    let scrollOffset = s.scrollOffset;
    if (selected < scrollOffset) {
      scrollOffset = selected;
    } else if (selected >= scrollOffset + contentHeight) {
      scrollOffset = selected - contentHeight + 1;
    }
    return { ...s, selected, scrollOffset };
  };

  const choosePattern = (s: UiState): UiState => {
    const pattern = patterns[s.selected];
    if (!pattern) return s;
    try {
      return {
        ...s,
        view: "game",
        frame: onSelectPattern(pattern.key),
        patternKey: pattern.key,
      };
    } catch (cause) {
      return {
        ...s,
        error: cause instanceof Error ? cause.message : String(cause),
      };
    }
  };

  useInput((input, key) => {
    let s: UiState = { ...uiRef.current, error: null };

    // Special keys arrive as their own event with an empty input string.
    if (input === "") {
      if (s.view === "patterns") {
        if (key.upArrow) s = moveSelection(s, -1);
        else if (key.downArrow) s = moveSelection(s, 1);
        else if (key.return) s = choosePattern(s);
        else if (key.escape) s = { ...s, view: "game" };
      }
      setUi(s);
      return;
    }

    // Printable keys can arrive batched in one chunk (typed during startup,
    // or pasted), with Enter embedded as a literal newline, so handle each
    // character against the state the previous character produced — the way
    // the old one-byte read loop did.
    for (const ch of input) {
      if (ch === KEY_QUIT_LOWER || ch === KEY_QUIT_UPPER) {
        exit();
        return;
      }
      if (s.view === "game") {
        if (ch === KEY_REFRESH_LOWER || ch === KEY_REFRESH_UPPER) {
          s = { ...s, frame: onTick() };
        } else if (ch === KEY_PATTERNS_LOWER || ch === KEY_PATTERNS_UPPER) {
          s = openPatterns(s);
        }
      } else {
        if (ch === "\r" || ch === "\n") {
          s = choosePattern(s);
        }
      }
    }
    setUi(s);
  });

  const hints = ui.view === "game"
    ? GAME_HINTS
    : `${PATTERNS_HINTS} · ${ui.selected + 1}/${patterns.length}`;

  return (
    <Box flexDirection="column" height={appHeight}>
      <Box flexDirection="column" flexGrow={1}>
        {ui.view === "game" ? <Text>{ui.frame}</Text> : (
          patterns
            .slice(ui.scrollOffset, ui.scrollOffset + contentHeight)
            .map((pattern, i) => (
              <Text
                key={pattern.key}
                inverse={ui.scrollOffset + i === ui.selected}
                wrap="truncate"
              >
                {pattern.name} — {pattern.type}, period {pattern.period}
              </Text>
            ))
        )}
      </Box>
      <Box height={1}>
        {ui.error === null
          ? <Text dimColor wrap="truncate">{hints}</Text>
          : <Text color="red" wrap="truncate">{ui.error}</Text>}
      </Box>
    </Box>
  );
}

/**
 * Mounts the interactive view, reading keys from the given bridged stdin
 * stream. Await the returned instance's `waitUntilExit()` to block until the
 * user quits.
 */
export function renderApp(props: AppProps, stdin: PassThrough): Instance {
  return render(<App {...props} />, {
    stdin: stdin as unknown as NodeJS.ReadStream,
  });
}
