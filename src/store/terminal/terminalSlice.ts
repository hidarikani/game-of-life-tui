import {
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { TerminalState } from "./types.ts";
import type { GridSize } from "@cell-auto/game-of-life-engine";
import { FOOTER_HEIGHT, HEADER_HEIGHT } from "../../ui/app/constants.ts";
import { SLICE_NAME } from "./messages.ts";
import { required } from "../shared.ts";

const initialState: TerminalState = {
  rows: null,
  columns: null,
};

export const terminalSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setRows: (state, action: PayloadAction<number>) => {
      state.rows = action.payload;
    },
    setColumns: (state, action: PayloadAction<number>) => {
      state.columns = action.payload;
    },
    reset: () => initialState,
  },
  selectors: {
    selectRows: (state): number => required(state.rows, SLICE_NAME),
    selectColumns: (state): number => required(state.columns, SLICE_NAME),
  },
});

export const selectGridSize = createSelector([
  terminalSlice.selectors.selectRows,
  terminalSlice.selectors.selectColumns,
], (rows, columns): GridSize => {
  const spacedColumns = Math.floor(columns / 2);
  const appRows = rows - HEADER_HEIGHT - FOOTER_HEIGHT;

  return { w: spacedColumns, h: appRows };
});

export const { setRows, setColumns, reset } = terminalSlice.actions;
export const {
  selectRows,
  selectColumns,
} = terminalSlice.selectors;
