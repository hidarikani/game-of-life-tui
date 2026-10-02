import * as v from "@valibot/valibot";
import { assertEquals, assertThrows } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { ArgSchema } from "./terminal.ts";
import {
  genMsgPatternNotFound,
  GRID_SIZE_CONFLICTS_WITH_INTERACTIVE,
} from "../constants/messages.ts";
import { MIN_GENERATIONS, MIN_GRID_SIZE, PATTERN_KEYS } from "../constants.ts";

describe("argSchema", () => {
  describe("interactive variant", () => {
    it("leaves gridWidth and gridHeight undefined when omitted", () => {
      const result = v.parse(ArgSchema, { interactive: true });
      assertEquals(result.gridWidth, undefined);
      assertEquals(result.gridHeight, undefined);
    });

    it("accepts an explicit patternKey and generations", () => {
      const result = v.parse(ArgSchema, {
        interactive: true,
        patternKey: PATTERN_KEYS.PULSAR,
        generations: "5",
      });
      assertEquals(result.patternKey, PATTERN_KEYS.PULSAR);
      assertEquals(result.generations, 5);
    });

    it("rejects an unknown patternKey", () => {
      assertThrows(
        () =>
          v.parse(ArgSchema, { interactive: true, patternKey: "no-such" }),
        v.ValiError,
        genMsgPatternNotFound("no-such"),
      );
    });

    it("rejects gridWidth being present", () => {
      assertThrows(
        () =>
          v.parse(ArgSchema, {
            interactive: true,
            gridWidth: "10",
          }),
        v.ValiError,
        GRID_SIZE_CONFLICTS_WITH_INTERACTIVE,
      );
    });

    it("rejects gridHeight being present", () => {
      assertThrows(
        () =>
          v.parse(ArgSchema, {
            interactive: true,
            gridHeight: "10",
          }),
        v.ValiError,
        GRID_SIZE_CONFLICTS_WITH_INTERACTIVE,
      );
    });

    it("rejects generations below the minimum", () => {
      const result = v.safeParse(ArgSchema, {
        interactive: true,
        generations: `${MIN_GENERATIONS - 1}`,
      });
      assertEquals(result.success, false);
    });

    it("rejects a non-numeric generations value", () => {
      const result = v.safeParse(ArgSchema, {
        interactive: true,
        generations: "abc",
      });
      assertEquals(result.success, false);
    });
  });

  describe("non-interactive variant", () => {
    it("accepts valid gridWidth and gridHeight", () => {
      const result = v.parse(ArgSchema, {
        interactive: false,
        gridWidth: "10",
        gridHeight: "20",
      });
      assertEquals(result, {
        interactive: false,
        patternKey: PATTERN_KEYS.PULSAR,
        gridWidth: 10,
        gridHeight: 20,
        generations: MIN_GENERATIONS,
      });
    });

    it("trims surrounding whitespace before coercing to a number", () => {
      const result = v.parse(ArgSchema, {
        interactive: false,
        gridWidth: ` ${MIN_GRID_SIZE} `,
        gridHeight: ` ${MIN_GRID_SIZE} `,
      });
      assertEquals(result.gridWidth, MIN_GRID_SIZE);
      assertEquals(result.gridHeight, MIN_GRID_SIZE);
    });

    it("accepts the minimum allowed gridWidth and gridHeight", () => {
      const result = v.parse(ArgSchema, {
        interactive: false,
        gridWidth: `${MIN_GRID_SIZE}`,
        gridHeight: `${MIN_GRID_SIZE}`,
      });
      assertEquals(result.gridWidth, MIN_GRID_SIZE);
      assertEquals(result.gridHeight, MIN_GRID_SIZE);
    });

    it("rejects a missing gridWidth", () => {
      const result = v.safeParse(ArgSchema, {
        interactive: false,
        gridHeight: "10",
      });
      assertEquals(result.success, false);
    });

    it("rejects a missing gridHeight", () => {
      const result = v.safeParse(ArgSchema, {
        interactive: false,
        gridWidth: "10",
      });
      assertEquals(result.success, false);
    });

    it("rejects a gridWidth below the minimum", () => {
      const result = v.safeParse(ArgSchema, {
        interactive: false,
        gridWidth: `${MIN_GRID_SIZE - 1}`,
        gridHeight: "10",
      });
      assertEquals(result.success, false);
    });

    it("rejects a gridHeight below the minimum", () => {
      const result = v.safeParse(ArgSchema, {
        interactive: false,
        gridWidth: "10",
        gridHeight: `${MIN_GRID_SIZE - 1}`,
      });
      assertEquals(result.success, false);
    });

    it("rejects a non-integer gridWidth", () => {
      const result = v.safeParse(ArgSchema, {
        interactive: false,
        gridWidth: "10.5",
        gridHeight: "10",
      });
      assertEquals(result.success, false);
    });

    it("rejects a non-numeric gridHeight", () => {
      const result = v.safeParse(ArgSchema, {
        interactive: false,
        gridWidth: "10",
        gridHeight: "abc",
      });
      assertEquals(result.success, false);
    });

    it("rejects an unknown patternKey", () => {
      const result = v.safeParse(ArgSchema, {
        interactive: false,
        gridWidth: "10",
        gridHeight: "10",
        patternKey: "no-such",
      });
      assertEquals(result.success, false);
    });
  });

  describe("interactive discriminator", () => {
    it("rejects a missing interactive key", () => {
      const result = v.safeParse(ArgSchema, {
        gridWidth: "10",
        gridHeight: "10",
      });
      assertEquals(result.success, false);
    });

    it("rejects a non-boolean interactive value", () => {
      const result = v.safeParse(ArgSchema, { interactive: "true" });
      assertEquals(result.success, false);
    });
  });

  describe("unknown keys", () => {
    it("rejects keys not defined on the interactive variant", () => {
      const result = v.safeParse(ArgSchema, {
        interactive: true,
        extra: "nope",
      });
      assertEquals(result.success, false);
    });

    it("rejects keys not defined on the non-interactive variant", () => {
      const result = v.safeParse(ArgSchema, {
        interactive: false,
        gridWidth: "10",
        gridHeight: "10",
        extra: "nope",
      });
      assertEquals(result.success, false);
    });
  });
});
