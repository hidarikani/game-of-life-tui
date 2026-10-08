import type { NonInteractiveArgs } from "./terminal.ts";

import * as v from "@valibot/valibot";
import { assertEquals, assertObjectMatch, assertThrows } from "@std/assert";
import { describe, it } from "@std/testing/bdd";

import { ArgSchema } from "./terminal.ts";
import { genMsgPatternNotFound } from "../constants/messages.ts";
import {
  CLI_ARGS,
  LONG_ARG_PREFIX,
  MIN_GENERATIONS,
  MIN_GRID_SIZE,
  PATTERN_KEYS,
} from "../constants/constants.ts";

describe("argSchema", () => {
  describe(`${LONG_ARG_PREFIX}${CLI_ARGS.INTERACTIVE} is "true"`, () => {
    describe(`${LONG_ARG_PREFIX}${CLI_ARGS.PATTERN}`, () => {
      it(`accepts an explicit ${LONG_ARG_PREFIX}${CLI_ARGS.PATTERN}`, () => {
        const result = v.parse(ArgSchema, {
          [CLI_ARGS.INTERACTIVE]: "true",
          [CLI_ARGS.PATTERN]: PATTERN_KEYS.PULSAR,
        });
        assertEquals(result[CLI_ARGS.PATTERN].key, PATTERN_KEYS.PULSAR);
      });

      it(`rejects an unknown ${CLI_ARGS.PATTERN}`, () => {
        assertThrows(
          () =>
            v.parse(ArgSchema, {
              [CLI_ARGS.INTERACTIVE]: "true",
              [CLI_ARGS.PATTERN]: "no-such",
            }),
          v.ValiError,
          genMsgPatternNotFound("no-such"),
        );
      });
    });

    it(`rejects ${CLI_ARGS.GRID_WIDTH}`, () => {
      assertThrows(
        () =>
          v.parse(ArgSchema, {
            [CLI_ARGS.INTERACTIVE]: "true",
            [CLI_ARGS.GRID_WIDTH]: MIN_GRID_SIZE + 1,
          }),
        v.ValiError,
        `Invalid key: Expected never but received "${CLI_ARGS.GRID_WIDTH}"`,
      );
    });

    it(`rejects ${CLI_ARGS.GRID_HEIGHT}`, () => {
      assertThrows(
        () =>
          v.parse(ArgSchema, {
            [CLI_ARGS.INTERACTIVE]: "true",
            [CLI_ARGS.GRID_HEIGHT]: MIN_GRID_SIZE + 1,
          }),
        v.ValiError,
        `Invalid key: Expected never but received "${CLI_ARGS.GRID_HEIGHT}"`,
      );
    });

    it(`rejects ${CLI_ARGS.GENERATIONS}`, () => {
      assertThrows(
        () =>
          v.parse(ArgSchema, {
            [CLI_ARGS.INTERACTIVE]: "true",
            [CLI_ARGS.GENERATIONS]: MIN_GENERATIONS + 1,
          }),
        v.ValiError,
        `Invalid key: Expected never but received "${CLI_ARGS.GENERATIONS}"`,
      );
    });
  });

  describe(`${LONG_ARG_PREFIX}${CLI_ARGS.INTERACTIVE} is "false"`, () => {
    describe("grid size", () => {
      it(`accepts the minimum values`, () => {
        const result = v.parse(ArgSchema, {
          [CLI_ARGS.INTERACTIVE]: "false",
          [CLI_ARGS.GRID_WIDTH]: `${MIN_GRID_SIZE}`,
          [CLI_ARGS.GRID_HEIGHT]: `${MIN_GRID_SIZE}`,
        }) as NonInteractiveArgs;
        assertEquals(result[CLI_ARGS.GRID_WIDTH], MIN_GRID_SIZE);
        assertEquals(result[CLI_ARGS.GRID_HEIGHT], MIN_GRID_SIZE);
      });

      it(`accepts valid values`, () => {
        const result = v.parse(ArgSchema, {
          [CLI_ARGS.INTERACTIVE]: "false",
          [CLI_ARGS.GRID_WIDTH]: "10",
          [CLI_ARGS.GRID_HEIGHT]: "20",
        });
        assertObjectMatch(result, {
          [CLI_ARGS.INTERACTIVE]: false,
          [CLI_ARGS.GRID_WIDTH]: 10,
          [CLI_ARGS.GRID_HEIGHT]: 20,
          [CLI_ARGS.GENERATIONS]: MIN_GENERATIONS,
        });
        assertEquals(result[CLI_ARGS.PATTERN].key, PATTERN_KEYS.PULSAR);
      });

      it("trims surrounding whitespace before coercing to a number", () => {
        const result = v.parse(ArgSchema, {
          [CLI_ARGS.INTERACTIVE]: "false",
          [CLI_ARGS.GRID_WIDTH]: ` ${MIN_GRID_SIZE} `,
          [CLI_ARGS.GRID_HEIGHT]: ` ${MIN_GRID_SIZE} `,
        }) as NonInteractiveArgs;
        assertEquals(result[CLI_ARGS.GRID_WIDTH], MIN_GRID_SIZE);
        assertEquals(result[CLI_ARGS.GRID_HEIGHT], MIN_GRID_SIZE);
      });

      describe(`${LONG_ARG_PREFIX}${CLI_ARGS.GRID_WIDTH}`, () => {
        it(`rejects missing`, () => {
          assertThrows(
            () =>
              v.parse(ArgSchema, {
                [CLI_ARGS.INTERACTIVE]: "false",
                [CLI_ARGS.GRID_HEIGHT]: "10",
              }),
            v.ValiError,
            `Invalid key: Expected "${CLI_ARGS.GRID_WIDTH}" but received undefined`,
          );
        });

        it("rejects below the minimum", () => {
          assertThrows(
            () =>
              v.parse(ArgSchema, {
                [CLI_ARGS.INTERACTIVE]: "false",
                [CLI_ARGS.GRID_WIDTH]: `${MIN_GRID_SIZE - 1}`,
                [CLI_ARGS.GRID_HEIGHT]: "10",
              }),
            v.ValiError,
            `Invalid value: Expected >=${MIN_GRID_SIZE} but received ${
              MIN_GRID_SIZE - 1
            }`,
          );
        });

        it("rejects non-integer", () => {
          assertThrows(
            () =>
              v.parse(ArgSchema, {
                [CLI_ARGS.INTERACTIVE]: "false",
                [CLI_ARGS.GRID_WIDTH]: "10.5",
                [CLI_ARGS.GRID_HEIGHT]: "10",
              }),
            v.ValiError,
            "Invalid integer: Received 10.5",
          );
        });
      });

      describe(`${LONG_ARG_PREFIX}${CLI_ARGS.GRID_HEIGHT}`, () => {
        it("rejects a missing", () => {
          assertThrows(
            () =>
              v.parse(ArgSchema, {
                [CLI_ARGS.INTERACTIVE]: "false",
                [CLI_ARGS.GRID_WIDTH]: "10",
              }),
            v.ValiError,
            `Invalid key: Expected "${CLI_ARGS.GRID_HEIGHT}" but received undefined`,
          );
        });
        it("rejects below the minimum", () => {
          assertThrows(
            () =>
              v.parse(ArgSchema, {
                [CLI_ARGS.INTERACTIVE]: "false",
                [CLI_ARGS.GRID_WIDTH]: "10",
                [CLI_ARGS.GRID_HEIGHT]: `${MIN_GRID_SIZE - 1}`,
              }),
            v.ValiError,
            `Invalid value: Expected >=${MIN_GRID_SIZE} but received ${
              MIN_GRID_SIZE - 1
            }`,
          );
        });

        it("rejects a non-numeric", () => {
          assertThrows(
            () =>
              v.parse(ArgSchema, {
                [CLI_ARGS.INTERACTIVE]: "false",
                [CLI_ARGS.GRID_WIDTH]: "10",
                [CLI_ARGS.GRID_HEIGHT]: "abc",
              }),
            v.ValiError,
            "Invalid number: Received NaN",
          );
        });
      });
    });

    describe(`${LONG_ARG_PREFIX}${CLI_ARGS.PATTERN}`, () => {
      it(`accepts an explicit ${LONG_ARG_PREFIX}${CLI_ARGS.PATTERN}`, () => {
        const result = v.parse(ArgSchema, {
          [CLI_ARGS.INTERACTIVE]: "false",
          [CLI_ARGS.GRID_WIDTH]: "10",
          [CLI_ARGS.GRID_HEIGHT]: "10",
          [CLI_ARGS.PATTERN]: PATTERN_KEYS.PULSAR,
        });
        assertEquals(result[CLI_ARGS.PATTERN].key, PATTERN_KEYS.PULSAR);
      });

      it(`rejects an unknown ${CLI_ARGS.PATTERN}`, () => {
        assertThrows(
          () =>
            v.parse(ArgSchema, {
              [CLI_ARGS.INTERACTIVE]: "false",
              [CLI_ARGS.GRID_WIDTH]: "10",
              [CLI_ARGS.GRID_HEIGHT]: "10",
              [CLI_ARGS.PATTERN]: "no-such",
            }),
          v.ValiError,
          genMsgPatternNotFound("no-such"),
        );
      });
    });
  });

  describe(`${LONG_ARG_PREFIX}${CLI_ARGS.INTERACTIVE} discriminator`, () => {
    it(`rejects a missing ${CLI_ARGS.INTERACTIVE} key`, () => {
      assertThrows(
        () =>
          v.parse(ArgSchema, {
            [CLI_ARGS.PATTERN]: PATTERN_KEYS.PULSAR,
          }),
        v.ValiError,
        `Invalid type: Expected ("true" | "false") but received undefined`,
      );
    });

    it(`rejects an unknown ${CLI_ARGS.INTERACTIVE} value`, () => {
      assertThrows(
        () => v.parse(ArgSchema, { [CLI_ARGS.INTERACTIVE]: "buz" }),
        v.ValiError,
        `Invalid type: Expected ("true" | "false") but received "buz"`,
      );
    });
  });

  describe("unknown keys", () => {
    it("rejects keys not defined on the interactive variant", () => {
      assertThrows(
        () =>
          v.parse(ArgSchema, {
            [CLI_ARGS.INTERACTIVE]: "true",
            extra: "nope",
          }),
        v.ValiError,
        'Invalid key: Expected never but received "extra"',
      );
    });

    it("rejects keys not defined on the non-interactive variant", () => {
      assertThrows(
        () =>
          v.parse(ArgSchema, {
            [CLI_ARGS.INTERACTIVE]: "false",
            [CLI_ARGS.GRID_WIDTH]: "10",
            [CLI_ARGS.GRID_HEIGHT]: "10",
            extra: "nope",
          }),
        v.ValiError,
        'Invalid key: Expected never but received "extra"',
      );
    });
  });
});
