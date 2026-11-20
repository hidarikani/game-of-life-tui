import {
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { SLICES } from "../../constants/messages.ts";
import type { TerminalState } from "./types.ts";
import { required } from "../../util/misc.ts";
import type { GridSize } from "@cell-auto/game-of-life-engine";
import { FOOTER_HEIGHT, HEADER_HEIGHT } from "../../ui/app/app.const.ts";

const initialState: TerminalState = {
  rows: null,
  columns: null,
};

export const terminalSlice = createSlice({
  name: SLICES.TERMINAL,
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
    selectRows: (state): number => required(state.rows, SLICES.TERMINAL),
    selectColumns: (state): number => required(state.columns, SLICES.TERMINAL),
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
