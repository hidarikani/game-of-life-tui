import type { NonInteractiveArgs } from "./terminal.ts";

import * as v from "@valibot/valibot";
import { assertEquals, assertThrows } from "@std/assert";
import { describe, it } from "@std/testing/bdd";

import { ArgSchema } from "./terminal.ts";
import { genMsgPatternNotFound } from "../constants/messages.ts";
import {
  CLI_ARGS,
  LONG_ARG_PREFIX,
  MIN_GENERATIONS,
  MIN_GRID_SIZE,
  PATTERN_KEYS,
} from "../constants.ts";

describe("argSchema", () => {
  describe(`${LONG_ARG_PREFIX}${CLI_ARGS.INTERACTIVE} is "true"`, () => {
    it(`accepts an explicit ${LONG_ARG_PREFIX}${CLI_ARGS.PATTERN_KEY}`, () => {
      const result = v.parse(ArgSchema, {
        [CLI_ARGS.INTERACTIVE]: "true",
        [CLI_ARGS.PATTERN_KEY]: PATTERN_KEYS.PULSAR,
      });
      assertEquals(result[CLI_ARGS.PATTERN_KEY], PATTERN_KEYS.PULSAR);
    });

    it("rejects an unknown patternKey", () => {
      assertThrows(
        () =>
          v.parse(ArgSchema, {
            [CLI_ARGS.INTERACTIVE]: "true",
            [CLI_ARGS.PATTERN_KEY]: "no-such",
          }),
        v.ValiError,
        genMsgPatternNotFound("no-such"),
      );
    });

    it("rejects grid-width", () => {
      const result = v.safeParse(ArgSchema, {
        [CLI_ARGS.INTERACTIVE]: "true",
        [CLI_ARGS.GRID_WIDTH]: MIN_GRID_SIZE + 1,
      });
      assertEquals(result.success, false);
    });

    it("rejects grid-height", () => {
      const result = v.safeParse(ArgSchema, {
        [CLI_ARGS.INTERACTIVE]: "true",
        [CLI_ARGS.GRID_HEIGHT]: MIN_GRID_SIZE + 1,
      });
      assertEquals(result.success, false);
    });

    it("rejects generations", () => {
      const result = v.safeParse(ArgSchema, {
        [CLI_ARGS.INTERACTIVE]: "true",
        [CLI_ARGS.GENERATIONS]: MIN_GENERATIONS + 1,
      });
      assertEquals(result.success, false);
    });
  });

  describe("non-interactive variant", () => {
    it(`accepts valid ${LONG_ARG_PREFIX}${CLI_ARGS.GRID_WIDTH} and ${LONG_ARG_PREFIX}${CLI_ARGS.GRID_HEIGHT}`, () => {
      const result = v.parse(ArgSchema, {
        [CLI_ARGS.INTERACTIVE]: "false",
        [CLI_ARGS.GRID_WIDTH]: "10",
        [CLI_ARGS.GRID_HEIGHT]: "20",
      });
      assertEquals(result, {
        [CLI_ARGS.INTERACTIVE]: false,
        [CLI_ARGS.PATTERN_KEY]: PATTERN_KEYS.PULSAR,
        [CLI_ARGS.GRID_WIDTH]: 10,
        [CLI_ARGS.GRID_HEIGHT]: 20,
        [CLI_ARGS.GENERATIONS]: MIN_GENERATIONS,
      });
    });

    // it("trims surrounding whitespace before coercing to a number", () => {
    //   const result = v.parse(ArgSchema, {
    //     [CLI_ARGS.INTERACTIVE]: "false",
    //     [CLI_ARGS.GRID_WIDTH]: ` ${MIN_GRID_SIZE} `,
    //     [CLI_ARGS.GRID_HEIGHT]: ` ${MIN_GRID_SIZE} `,
    //   }) as NonInteractiveArgs;
    //   assertEquals(result[CLI_ARGS.GRID_WIDTH], MIN_GRID_SIZE);
    //   assertEquals(result[CLI_ARGS.GRID_HEIGHT], MIN_GRID_SIZE);
    // });

    // it("accepts the minimum allowed [CLI_ARGS.GRID_WIDTH] and [CLI_ARGS.GRID_HEIGHT]", () => {
    //   const result = v.parse(ArgSchema, {
    //     [CLI_ARGS.INTERACTIVE]: "false",
    //     [CLI_ARGS.GRID_WIDTH]: `${MIN_GRID_SIZE}`,
    //     [CLI_ARGS.GRID_HEIGHT]: `${MIN_GRID_SIZE}`,
    //   }) as NonInteractiveArgs;
    //   assertEquals(result[CLI_ARGS.GRID_WIDTH], MIN_GRID_SIZE);
    //   assertEquals(result[CLI_ARGS.GRID_HEIGHT], MIN_GRID_SIZE);
    // });

    // it("rejects a missing [CLI_ARGS.GRID_WIDTH]", () => {
    //   const result = v.safeParse(ArgSchema, {
    //     [CLI_ARGS.INTERACTIVE]: "false",
    //     [CLI_ARGS.GRID_HEIGHT]: "10",
    //   });
    //   assertEquals(result.success, false);
    // });

    // it("rejects a missing [CLI_ARGS.GRID_HEIGHT]", () => {
    //   const result = v.safeParse(ArgSchema, {
    //     [CLI_ARGS.INTERACTIVE]: "false",
    //     [CLI_ARGS.GRID_WIDTH]: "10",
    //   });
    //   assertEquals(result.success, false);
    // });

    // it("rejects a [CLI_ARGS.GRID_WIDTH] below the minimum", () => {
    //   const result = v.safeParse(ArgSchema, {
    //     [CLI_ARGS.INTERACTIVE]: "false",
    //     [CLI_ARGS.GRID_WIDTH]: `${MIN_GRID_SIZE - 1}`,
    //     [CLI_ARGS.GRID_HEIGHT]: "10",
    //   });
    //   assertEquals(result.success, false);
    // });

    // it("rejects a [CLI_ARGS.GRID_HEIGHT] below the minimum", () => {
    //   const result = v.safeParse(ArgSchema, {
    //     [CLI_ARGS.INTERACTIVE]: "false",
    //     [CLI_ARGS.GRID_WIDTH]: "10",
    //     [CLI_ARGS.GRID_HEIGHT]: `${MIN_GRID_SIZE - 1}`,
    //   });
    //   assertEquals(result.success, false);
    // });

    // it("rejects a non-integer [CLI_ARGS.GRID_WIDTH]", () => {
    //   const result = v.safeParse(ArgSchema, {
    //     [CLI_ARGS.INTERACTIVE]: "false",
    //     [CLI_ARGS.GRID_WIDTH]: "10.5",
    //     [CLI_ARGS.GRID_HEIGHT]: "10",
    //   });
    //   assertEquals(result.success, false);
    // });

    // it("rejects a non-numeric [CLI_ARGS.GRID_HEIGHT]", () => {
    //   const result = v.safeParse(ArgSchema, {
    //     [CLI_ARGS.INTERACTIVE]: "false",
    //     [CLI_ARGS.GRID_WIDTH]: "10",
    //     [CLI_ARGS.GRID_HEIGHT]: "abc",
    //   });
    //   assertEquals(result.success, false);
    // });

    // it("rejects an unknown patternKey", () => {
    //   const result = v.safeParse(ArgSchema, {
    //     [CLI_ARGS.INTERACTIVE]: "false",
    //     [CLI_ARGS.GRID_WIDTH]: "10",
    //     [CLI_ARGS.GRID_HEIGHT]: "10",
    //     patternKey: "no-such",
    //   });
    //   assertEquals(result.success, false);
    // });
  });

  // describe("interactive discriminator", () => {
  //   it("rejects a missing interactive key", () => {
  //     const result = v.safeParse(ArgSchema, {
  //       [CLI_ARGS.GRID_WIDTH]: "10",
  //       [CLI_ARGS.GRID_HEIGHT]: "10",
  //     });
  //     assertEquals(result.success, false);
  //   });

  //   it("rejects an unknown interactive value", () => {
  //     const result = v.safeParse(ArgSchema, { [CLI_ARGS.INTERACTIVE]: "buz" });
  //     assertEquals(result.success, false);
  //   });
  // });

  // describe("unknown keys", () => {
  //   it("rejects keys not defined on the interactive variant", () => {
  //     const result = v.safeParse(ArgSchema, {
  //       [CLI_ARGS.INTERACTIVE]: "true",
  //       extra: "nope",
  //     });
  //     assertEquals(result.success, false);
  //   });

  //   it("rejects keys not defined on the non-interactive variant", () => {
  //     const result = v.safeParse(ArgSchema, {
  //       [CLI_ARGS.INTERACTIVE]: "false",
  //       [CLI_ARGS.GRID_WIDTH]: "10",
  //       [CLI_ARGS.GRID_HEIGHT]: "10",
  //       extra: "nope",
  //     });
  //     assertEquals(result.success, false);
  //   });
  // });
});
