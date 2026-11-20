import {
  GRID_MODES,
  type GridMode,
  type Point,
} from "@cell-auto/game-of-life-engine";
import type { FirstGenerationState } from "./types.ts";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { SLICES } from "../../constants/messages.ts";
import { required } from "../../util/misc.ts";
import { ORIGIN } from "../../constants/constants.ts";
import { checkLiveCellsEqual } from "../../next/helpers.ts";

const initialState: FirstGenerationState = {
  liveCells: [],
  patternKey: null,
  patternOffset: ORIGIN,
  patternGeneration: 0,
  gridMode: GRID_MODES.FINITE,
};

export const generalSlice = createSlice({
  name: SLICES.FIRST_GENERATION,
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
