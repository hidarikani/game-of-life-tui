import {
  GRID_MODES,
  type GridMode,
  type Point,
} from "@cell-auto/game-of-life-engine";
import type { FirstGenerationState } from "./types.ts";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { required } from "../../util/misc.ts";
import { checkLiveCellsEqual } from "../../next/helpers.ts";
import { ORIGIN } from "../../next/constants.ts";
import { SLICE_NAME } from "./constants.ts";

const initialState: FirstGenerationState = {
  liveCells: [],
  patternKey: null,
  patternOffset: ORIGIN,
  patternGeneration: 0,
  gridMode: GRID_MODES.FINITE,
};

export const generalSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setLiveCells: (state, { payload }: PayloadAction<Point[]>) => {
      if (!checkLiveCellsEqual(state.liveCells, payload)) {
        state.liveCells = payload;
      }
    },
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
    selectLiveCells: (state) => state.liveCells,
    selectPatternKey: (state) => required(state.patternKey, SLICE_NAME),
    selectPatternOffset: (state) => required(state.patternOffset, SLICE_NAME),
    selectPatternGeneration: (state) =>
      required(state.patternGeneration, SLICE_NAME),
    selectGridMode: (state) => required(state.gridMode, SLICE_NAME),
  },
});

export const {
  setLiveCells,
  setPatternKey,
  setPatternOffset,
  setPatternGeneration,
  setGridMode,
  reset,
} = generalSlice.actions;
export const {
  selectLiveCells,
  selectPatternKey,
  selectPatternOffset,
  selectPatternGeneration,
  selectGridMode,
} = generalSlice.selectors;
