import { assertEquals, assertThrows } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { handleArguments } from "./terminal.ts";
import {
  DEFAULT_GRID_HEIGHT,
  DEFAULT_GRID_WIDTH,
  MIN_GENERATIONS,
  MIN_GRID_SIZE,
  PATTERN_KEYS,
} from "../constants.ts";

const originalArgs = Deno.args;

function withArgs<T>(args: string[], fn: () => T): T {
  Object.defineProperty(Deno, "args", { value: args, configurable: true });
  try {
    return fn();
  } finally {
    Object.defineProperty(Deno, "args", {
      value: originalArgs,
      configurable: true,
    });
  }
}

describe("handleArguments", () => {
  describe("defaults", () => {
    it("returns defaults when no args are given", () => {
      const result = withArgs([], () => handleArguments());
      assertEquals(result, {
        interactive: true,
        patternKey: PATTERN_KEYS.PULSAR,
        gridWidth: DEFAULT_GRID_WIDTH,
        gridHeight: DEFAULT_GRID_HEIGHT,
        generations: MIN_GENERATIONS,
      });
    });
  });

  describe("interactive flag", () => {
    it("--no-interactive disables interactive mode", () => {
      const result = withArgs(["--no-interactive"], () => handleArguments());
      assertEquals(result.interactive, false);
    });

    it("--interactive keeps interactive mode on", () => {
      const result = withArgs(["--interactive"], () => handleArguments());
      assertEquals(result.interactive, true);
    });
  });

  describe("pattern-key", () => {
    it("accepts --pattern-key", () => {
      const result = withArgs(
        ["--pattern-key=glider"],
        () => handleArguments(),
      );
      assertEquals(result.patternKey, "glider");
    });

    it("accepts camelCase alias --patternKey", () => {
      const result = withArgs(["--patternKey=glider"], () => handleArguments());
      assertEquals(result.patternKey, "glider");
    });
  });

  describe("grid-width", () => {
    it("accepts a valid value via --grid-width", () => {
      const result = withArgs(["--grid-width=10"], () => handleArguments());
      assertEquals(result.gridWidth, 10);
    });

    it("accepts a valid value via camelCase alias --gridWidth", () => {
      const result = withArgs(["--gridWidth=10"], () => handleArguments());
      assertEquals(result.gridWidth, 10);
    });

    it("accepts the minimum allowed value", () => {
      const result = withArgs(
        [`--grid-width=${MIN_GRID_SIZE}`],
        () => handleArguments(),
      );
      assertEquals(result.gridWidth, MIN_GRID_SIZE);
    });

    it("throws when below the minimum", () => {
      withArgs([`--grid-width=${MIN_GRID_SIZE - 1}`], () => {
        assertThrows(
          () => handleArguments(),
          Error,
          `arg grid-width must be an integer equal or larger than ${MIN_GRID_SIZE}`,
        );
      });
    });

    it("throws for a non-integer value", () => {
      withArgs(["--grid-width=10.5"], () => {
        assertThrows(
          () => handleArguments(),
          Error,
          "arg grid-width must be an integer",
        );
      });
    });

    it("throws for a non-numeric value", () => {
      withArgs(["--grid-width=abc"], () => {
        assertThrows(
          () => handleArguments(),
          Error,
          "arg grid-width must be an integer",
        );
      });
    });
  });

  describe("grid-height", () => {
    it("accepts a valid value via --grid-height", () => {
      const result = withArgs(["--grid-height=10"], () => handleArguments());
      assertEquals(result.gridHeight, 10);
    });

    it("accepts a valid value via camelCase alias --gridHeight", () => {
      const result = withArgs(["--gridHeight=10"], () => handleArguments());
      assertEquals(result.gridHeight, 10);
    });

    it("throws when below the minimum", () => {
      withArgs([`--grid-height=${MIN_GRID_SIZE - 1}`], () => {
        assertThrows(
          () => handleArguments(),
          Error,
          `arg grid-height must be an integer equal or larger than ${MIN_GRID_SIZE}`,
        );
      });
    });

    it("throws for a non-numeric value", () => {
      withArgs(["--grid-height=abc"], () => {
        assertThrows(
          () => handleArguments(),
          Error,
          "arg grid-height must be an integer",
        );
      });
    });
  });

  describe("generations", () => {
    it("accepts a valid value", () => {
      const result = withArgs(["--generations=5"], () => handleArguments());
      assertEquals(result.generations, 5);
    });

    it("accepts the minimum allowed value", () => {
      const result = withArgs(
        [`--generations=${MIN_GENERATIONS}`],
        () => handleArguments(),
      );
      assertEquals(result.generations, MIN_GENERATIONS);
    });

    it("throws when below the minimum", () => {
      withArgs([`--generations=${MIN_GENERATIONS - 1}`], () => {
        assertThrows(
          () => handleArguments(),
          Error,
          `arg "generations" must be an integer equal or larger than ${MIN_GENERATIONS}`,
        );
      });
    });

    it("throws for a non-integer value", () => {
      withArgs(["--generations=2.5"], () => {
        assertThrows(
          () => handleArguments(),
          Error,
          'arg "generations" must be an integer',
        );
      });
    });

    it("throws for a non-numeric value", () => {
      withArgs(["--generations=abc"], () => {
        assertThrows(
          () => handleArguments(),
          Error,
          'arg "generations" must be an integer',
        );
      });
    });
  });

  describe("combined args", () => {
    it("parses all flags together", () => {
      const result = withArgs(
        [
          "--no-interactive",
          "--pattern-key=glider",
          "--grid-width=20",
          "--grid-height=15",
          "--generations=3",
        ],
        () => handleArguments(),
      );
      assertEquals(result, {
        interactive: false,
        patternKey: "glider",
        gridWidth: 20,
        gridHeight: 15,
        generations: 3,
      });
    });
  });
});
