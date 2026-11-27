import type { VIEWS } from "./constants.ts";

export type View = (typeof VIEWS)[keyof typeof VIEWS];
