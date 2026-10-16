import type { GreetingState } from "../types/state.ts";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: GreetingState = {
  name: "World",
  clicks: 0,
};

export const generalSlice = createSlice({
  name: "greeting",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    wave: (state) => {
      state.clicks += 1;
    },
    reset: () => initialState,
  },
  selectors: {
    selectName: (state) => state.name,
    selectClicks: (state) => state.clicks,
  },
});

export const { setName, wave, reset } = generalSlice.actions;
export const { selectName, selectClicks } = generalSlice.selectors;
