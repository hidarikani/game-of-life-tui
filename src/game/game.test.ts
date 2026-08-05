import {
  assertEquals,
  assertNotStrictEquals,
  assertStrictEquals,
  assertThrows,
} from "@std/assert";
import type { GridSize } from "@hidarikani/game-of-life-engine";
import {
  getGameStateForTests,
  initGame,
  resetGameStateForTests,
  tick,
} from "./game.ts";

// game.ts keeps module-level singletons (`engine`, `acceptedSize`,
// `acceptedPatternKey`, `patternLib`) that would otherwise leak between
// tests. Each test resets them first, so tests are independent of run order.
function gameTest(name: string, fn: () => void) {
  Deno.test(name, () => {
    resetGameStateForTests();
    fn();
  });
}

const BASE_SIZE: GridSize = { w: 6, h: 6 };
const RESIZED_SIZE: GridSize = { w: 7, h: 7 };
const HEIGHT_ONLY_SIZE: GridSize = { w: 6, h: 7 };

gameTest("tick throws before initGame has been called", () => {
  assertEquals(getGameStateForTests().engine, null);
  assertThrows(
    () => tick(),
    Error,
    "Engine uninitialized. Invoke initGame first.",
  );
});

gameTest("initGame creates the engine and pattern library", () => {
  initGame(BASE_SIZE, "blinker");
  const state = getGameStateForTests();

  assertNotStrictEquals(state.engine, null);
  assertNotStrictEquals(state.patternLib, null);
  assertEquals(state.acceptedSize, BASE_SIZE);
});

gameTest(
  "initGame with an unchanged grid size reuses the same engine and pattern library",
  () => {
    initGame(BASE_SIZE, "blinker");
    const firstState = getGameStateForTests();

    initGame(BASE_SIZE, "blinker");
    const secondState = getGameStateForTests();

    assertStrictEquals(secondState.engine, firstState.engine);
    assertStrictEquals(secondState.patternLib, firstState.patternLib);
  },
);

gameTest(
  "initGame with a changed pattern key recreates the engine, even with an unchanged grid size",
  () => {
    initGame(BASE_SIZE, "blinker");
    const firstState = getGameStateForTests();

    initGame(BASE_SIZE, "toad");
    const secondState = getGameStateForTests();

    assertNotStrictEquals(secondState.engine, firstState.engine);
    assertStrictEquals(secondState.patternLib, firstState.patternLib);
    assertEquals(secondState.acceptedPatternKey, "toad");
  },
);

gameTest(
  "initGame with a changed grid size recreates the engine but keeps the pattern library",
  () => {
    initGame(BASE_SIZE, "blinker");
    const firstState = getGameStateForTests();

    initGame(RESIZED_SIZE, "blinker");
    const secondState = getGameStateForTests();

    assertNotStrictEquals(secondState.engine, firstState.engine);
    assertStrictEquals(secondState.patternLib, firstState.patternLib);
    assertEquals(secondState.acceptedSize, RESIZED_SIZE);
  },
);

gameTest(
  "initGame with only the height changed still counts as a resize",
  () => {
    initGame(BASE_SIZE, "blinker");
    const { engine } = getGameStateForTests();

    initGame(HEIGHT_ONLY_SIZE, "blinker");

    assertNotStrictEquals(getGameStateForTests().engine, engine);
    assertEquals(getGameStateForTests().acceptedSize, HEIGHT_ONLY_SIZE);
  },
);

gameTest(
  "the engine created after a resize is itself reused as a singleton",
  () => {
    initGame(BASE_SIZE, "blinker");
    initGame(RESIZED_SIZE, "blinker");
    const { engine } = getGameStateForTests();

    initGame(RESIZED_SIZE, "blinker");

    assertStrictEquals(getGameStateForTests().engine, engine);
  },
);

gameTest("tick evolves the current engine in place", () => {
  initGame(BASE_SIZE, "blinker");
  const { engine } = getGameStateForTests();

  tick();

  assertStrictEquals(getGameStateForTests().engine, engine);
});
