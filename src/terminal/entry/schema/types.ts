import type * as v from "@valibot/valibot";
import type { ArgSchema } from "./args.ts";

export type ValidArgs = v.InferOutput<typeof ArgSchema>;

export type InteractiveArgs = Extract<ValidArgs, { interactive: true }>;
export type NonInteractiveArgs = Extract<ValidArgs, { interactive: false }>;
