import {
  GRID_MODES,
  type GridMode,
  type Point,
} from "@cell-auto/game-of-life-engine";
import type { FirstGenerationState } from "../types/state.ts";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { SLICES } from "../constants/messages.ts";
import { required } from "../util/misc.ts";
import { ORIGIN } from "../constants/constants.ts";

const initialState: FirstGenerationState = {
  patternKey: null,
  patternOffset: ORIGIN,
  patternGeneration: 0,
  gridMode: GRID_MODES.FINITE,
};

export const generalSlice = createSlice({
  name: SLICES.FIRST_GENERATION,
  initialState,
  reducers: {
    setPatternKey: (state, { payload }: PayloadAction<string>) => {
      state.patternKey = payload;
    },

    setPatternOffset: (state, { payload }: PayloadAction<Point>) => {
      if (
        state.patternOffset.x !== payload.x ||
        state.patternOffset.y !== payload.y
      ) {
        state.patternOffset = payload;
      }
    },
    setPatternGeneration: (state, { payload }: PayloadAction<number>) => {
      state.patternGeneration = payload;
    },
    setGridMode: (state, { payload }: PayloadAction<GridMode>) => {
      state.gridMode = payload;
    },
    reset: () => initialState,
  },
  selectors: {
    selectPatternKey: (state) =>
      required(state.patternKey, SLICES.FIRST_GENERATION),
    selectPatternOffset: (state) =>
      required(state.patternOffset, SLICES.FIRST_GENERATION),
    selectPatternGeneration: (state) =>
      required(state.patternGeneration, SLICES.FIRST_GENERATION),
    selectGridMode: (state) =>
      required(state.gridMode, SLICES.FIRST_GENERATION),
  },
});

export const {
  setPatternKey,
  setPatternOffset,
  setPatternGeneration,
  setGridMode,
  reset,
} = generalSlice.actions;
export const {
  selectPatternKey,
  selectPatternOffset,
  selectPatternGeneration,
  selectGridMode,
} = generalSlice.selectors;
