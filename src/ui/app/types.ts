import type { VIEWS } from "./app.const.ts";

export type View = (typeof VIEWS)[keyof typeof VIEWS];
