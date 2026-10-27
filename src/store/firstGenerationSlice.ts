import type { Point } from "@cell-auto/game-of-life-engine";
import type { FirstGenerationState } from "../types/state.ts";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { SLICES } from "../constants/messages.ts";
import { required } from "../util/misc.ts";

const initialState: FirstGenerationState = {
  patternKey: null,
  patternOffset: null,
};

export const generalSlice = createSlice({
  name: SLICES.FIRST_GENERATION,
  initialState,
  reducers: {
    setPatternKey: (state, action: PayloadAction<string>) => {
      state.patternKey = action.payload;
    },

    setPatternOffset: (state, action: PayloadAction<Point>) => {
      state.patternOffset = action.payload;
    },
    reset: () => initialState,
  },
  selectors: {
    selectPatternKey: (state) =>
      required(state.patternKey, SLICES.FIRST_GENERATION),
    selectPatternOffset: (state) =>
      required(state.patternOffset, SLICES.FIRST_GENERATION),
  },
});

export const { setPatternKey, setPatternOffset, reset } = generalSlice.actions;
export const { selectPatternKey, selectPatternOffset } = generalSlice.selectors;
