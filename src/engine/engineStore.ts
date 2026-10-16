import type {
  GridMode,
  GridSize,
  IEngine,
  Pattern,
} from "@cell-auto/game-of-life-engine";

import { Engine, Grid } from "@cell-auto/game-of-life-engine";

/**
 * Framework-agnostic store for the app-wide engine singleton.
 *
 * This module is the single source of truth. React reaches it through
 * <EngineProvider> and the hooks; anything outside React (bootstrap code,
 * workers bridges, debug consoles, tests) uses the plain functions below.
 */

type EngineState = {
  acceptedSize: GridSize | null;
  acceptedPattern: Pattern | null;
  acceptedMode: GridMode | null;
  engine: Engine | null;
};

const initialState = (): EngineState => ({
  acceptedSize: null,
  acceptedPattern: null,
  acceptedMode: null,
  engine: null,
});

let state = initialState();
const listeners = new Set<() => void>();

const notify = (): void => {
  for (const listener of listeners) listener();
};

const isSameConfig = (
  size: GridSize,
  pattern: Pattern,
  mode: GridMode,
): boolean =>
  state.acceptedSize?.w === size.w &&
  state.acceptedSize?.h === size.h &&
  state.acceptedPattern?.key === pattern.key &&
  state.acceptedMode === mode;

// ---------------------------------------------------------------------------
// Public API (usable with or without React)
// ---------------------------------------------------------------------------

/**
 * Returns the singleton engine for the given config, replacing it only when
 * size, pattern or mode actually change. Same semantics as the original
 * implementation; subscribers are notified when the engine is replaced.
 *
 * While <EngineProvider> is mounted it owns the config, so prefer
 * getCurrentEngine() for read-only access from non-React code.
 */
export function getEngine(
  proposedSize: GridSize,
  proposedPattern: Pattern,
  proposedMode: GridMode,
): IEngine {
  const existing = findMatchingEngine(proposedSize, proposedPattern, proposedMode);
  if (existing) return existing;

  const engine = createEngine(proposedSize, proposedPattern, proposedMode);
  commitEngine(engine, proposedSize, proposedPattern, proposedMode);
  return engine;
}

/**
 * Read-only access to the current engine. Null until something configures it.
 */
export function getCurrentEngine(): IEngine | null {
  return state.engine;
}

/**
 * Subscribe to engine replacement. Returns an unsubscribe function.
 * Compatible with React's useSyncExternalStore.
 */
export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// ---------------------------------------------------------------------------
// Internal API (used by EngineProvider)
// ---------------------------------------------------------------------------

/** @internal Builds a new engine without touching the store. */
export function createEngine(
  gridSize: GridSize,
  pattern: Pattern,
  mode: GridMode,
): Engine {
  const firstGeneration = new Grid({ gridSize, mode });
  firstGeneration.writeGrid({ inner: pattern.generations[0] });
  return new Engine({ firstGeneration });
}

/** @internal Returns the stored engine if it matches the config. Pure read. */
export function findMatchingEngine(
  size: GridSize,
  pattern: Pattern,
  mode: GridMode,
): Engine | null {
  return state.engine !== null && isSameConfig(size, pattern, mode)
    ? state.engine
    : null;
}

/** @internal Stores the engine and notifies subscribers if it changed. */
export function commitEngine(
  engine: Engine,
  size: GridSize,
  pattern: Pattern,
  mode: GridMode,
): void {
  if (state.engine === engine) return;

  state = {
    acceptedSize: size,
    acceptedPattern: pattern,
    acceptedMode: mode,
    engine,
  };
  notify();
}

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

/**
 * Fetches state for testing purposes
 */
export function getState(): Readonly<EngineState> {
  return { ...state };
}

/**
 * Clears state for testing purposes
 */
export function reset(): void {
  state = initialState();
  notify();
}
