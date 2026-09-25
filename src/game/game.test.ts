import {
  assertEquals,
  assertNotStrictEquals,
  assertStrictEquals,
  assertThrows,
} from "@std/assert";
import { beforeEach, describe, it } from "@std/testing/bdd";
import type { GridSize } from "@cell-auto/game-of-life-engine";
import {
  getGameStateForTests,
  initGame,
  listPatterns,
  renderPatternPreview,
  renderPlacement,
  resetGameStateForTests,
  selectPattern,
  tick,
} from "./game.ts";

const BASE_SIZE: GridSize = { w: 6, h: 6 };
const RESIZED_SIZE: GridSize = { w: 7, h: 7 };
const HEIGHT_ONLY_SIZE: GridSize = { w: 6, h: 7 };

describe("game", () => {
  // game.ts keeps module-level singletons (`engine`, `acceptedSize`,
  // `acceptedPatternKey`, `patternLib`) that would otherwise leak between
  // tests. Each test resets them first, so tests are independent of run order.
  beforeEach(() => {
    resetGameStateForTests();
  });

  it("tick throws before initGame has been called", () => {
    assertEquals(getGameStateForTests().engine, null);
    assertThrows(
      () => tick(),
      Error,
      "Engine uninitialized. Invoke initGame first.",
    );
  });

  it("initGame creates the engine and pattern library", () => {
    initGame(BASE_SIZE, "blinker");
    const state = getGameStateForTests();

    assertNotStrictEquals(state.engine, null);
    assertNotStrictEquals(state.patternLib, null);
    assertEquals(state.acceptedSize, BASE_SIZE);
  });

  it("initGame with an unchanged grid size reuses the same engine and pattern library", () => {
    initGame(BASE_SIZE, "blinker");
    const firstState = getGameStateForTests();

    initGame(BASE_SIZE, "blinker");
    const secondState = getGameStateForTests();

    assertStrictEquals(secondState.engine, firstState.engine);
    assertStrictEquals(secondState.patternLib, firstState.patternLib);
  });

  it("initGame with a changed pattern key recreates the engine, even with an unchanged grid size", () => {
    initGame(BASE_SIZE, "blinker");
    const firstState = getGameStateForTests();

    initGame(BASE_SIZE, "toad");
    const secondState = getGameStateForTests();

    assertNotStrictEquals(secondState.engine, firstState.engine);
    assertStrictEquals(secondState.patternLib, firstState.patternLib);
    assertEquals(secondState.acceptedPatternKey, "toad");
  });

  it("initGame with a changed grid size recreates the engine but keeps the pattern library", () => {
    initGame(BASE_SIZE, "blinker");
    const firstState = getGameStateForTests();

    initGame(RESIZED_SIZE, "blinker");
    const secondState = getGameStateForTests();

    assertNotStrictEquals(secondState.engine, firstState.engine);
    assertStrictEquals(secondState.patternLib, firstState.patternLib);
    assertEquals(secondState.acceptedSize, RESIZED_SIZE);
  });

  it("initGame with only the height changed still counts as a resize", () => {
    initGame(BASE_SIZE, "blinker");
    const { engine } = getGameStateForTests();

    initGame(HEIGHT_ONLY_SIZE, "blinker");

    assertNotStrictEquals(getGameStateForTests().engine, engine);
    assertEquals(getGameStateForTests().acceptedSize, HEIGHT_ONLY_SIZE);
  });

  it("the engine created after a resize is itself reused as a singleton", () => {
    initGame(BASE_SIZE, "blinker");
    initGame(RESIZED_SIZE, "blinker");
    const { engine } = getGameStateForTests();

    initGame(RESIZED_SIZE, "blinker");

    assertStrictEquals(getGameStateForTests().engine, engine);
  });

  it("tick evolves the current engine in place", () => {
    initGame(BASE_SIZE, "blinker");
    const { engine } = getGameStateForTests();

    tick();

    assertStrictEquals(getGameStateForTests().engine, engine);
  });

  it("listPatterns returns every built-in pattern without a full init", () => {
    const patterns = listPatterns();

    assertNotStrictEquals(getGameStateForTests().patternLib, null);
    assertEquals(patterns.length > 0, true);
    assertEquals(patterns.some((p) => p.key === "pulsar"), true);
    for (const pattern of patterns) {
      assertEquals(typeof pattern.key, "string");
      assertEquals(typeof pattern.name, "string");
    }
  });

  it("selectPattern throws before initGame has been called", () => {
    assertThrows(
      () => selectPattern("blinker"),
      Error,
      "Engine uninitialized. Invoke initGame first.",
    );
  });

  it("selectPattern replaces the engine and remembers the pattern", () => {
    initGame(BASE_SIZE, "blinker");
    const { engine: firstEngine } = getGameStateForTests();

    const frame = selectPattern("toad");
    const state = getGameStateForTests();

    assertNotStrictEquals(state.engine, firstEngine);
    assertEquals(state.acceptedPatternKey, "toad");
    assertEquals(state.acceptedSize, BASE_SIZE);
    assertEquals(typeof frame, "string");
  });

  it("selectPattern starts from a cleared grid, not the evolved one", () => {
    initGame(BASE_SIZE, "blinker");
    const firstFrame = getGameStateForTests().engine!.toString();
    tick();

    const frame = selectPattern("blinker");

    assertEquals(frame, firstFrame);
  });

  it("selectPattern with a pattern too large for the grid throws and leaves the simulation running", () => {
    initGame(BASE_SIZE, "blinker");
    const { engine } = getGameStateForTests();

    assertThrows(() => selectPattern("pulsar"));

    const state = getGameStateForTests();
    assertStrictEquals(state.engine, engine);
    assertEquals(state.acceptedPatternKey, "blinker");
    tick();
  });

  it("renderPatternPreview renders at the pattern's natural size", () => {
    const preview = renderPatternPreview("blinker");
    const rows = preview.split("\n");

    assertEquals(rows.length, 5);
    assertEquals(preview.includes("#"), true);
  });

  it("renderPatternPreview needs no running simulation", () => {
    assertEquals(getGameStateForTests().engine, null);

    const preview = renderPatternPreview("toad");

    assertEquals(preview.split("\n").length, 6);
    assertEquals(getGameStateForTests().engine, null);
  });

  it("renderPlacement draws on a full-size grid", () => {
    initGame(BASE_SIZE, "blinker");

    const placement = renderPlacement("blinker", { x: 0, y: 0 });

    assertEquals(placement.split("\n").length, BASE_SIZE.h);
  });

  it("renderPlacement shifts the pattern by the offset", () => {
    initGame(BASE_SIZE, "blinker");

    const atOrigin = renderPlacement("blinker", { x: 0, y: 0 });
    const shifted = renderPlacement("blinker", { x: 1, y: 0 });

    assertNotStrictEquals(atOrigin, shifted);
    assertEquals(atOrigin === shifted, false);
  });

  it("renderPlacement leaves the running simulation untouched", () => {
    initGame(BASE_SIZE, "blinker");
    const { engine } = getGameStateForTests();
    const before = engine!.toString();

    renderPlacement("blinker", { x: 1, y: 1 });

    assertStrictEquals(getGameStateForTests().engine, engine);
    assertEquals(engine!.toString(), before);
  });

  it("renderPlacement throws when the pattern would overflow", () => {
    initGame(BASE_SIZE, "blinker");

    assertThrows(() => renderPlacement("blinker", { x: 99, y: 0 }));
  });

  it("selectPattern places the pattern at the given offset", () => {
    initGame(BASE_SIZE, "blinker");

    const frame = selectPattern("blinker", { x: 1, y: 1 });

    assertEquals(frame, renderPlacement("blinker", { x: 1, y: 1 }));
  });

  it("selectPattern defaults to the origin", () => {
    initGame(BASE_SIZE, "blinker");

    const frame = selectPattern("blinker");

    assertEquals(frame, renderPlacement("blinker", { x: 0, y: 0 }));
  });

  it("selectPattern with an overflowing offset throws and leaves the simulation running", () => {
    initGame(BASE_SIZE, "blinker");
    const { engine } = getGameStateForTests();

    assertThrows(() => selectPattern("blinker", { x: 99, y: 99 }));

    assertStrictEquals(getGameStateForTests().engine, engine);
    tick();
  });
});
