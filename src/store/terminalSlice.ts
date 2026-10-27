import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { SLICES } from "../constants/messages.ts";
import type { TerminalState } from "../types/state.ts";
import { required } from "../util/misc.ts";
import { INK_NEW_LINE, LEGEND_HEIGHT } from "../constants/constants.ts";

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
    /**
     * Ink terminates every frame with a newline, so a frame as tall as the
     * terminal would scroll the alternate screen by one row on each render.
     * The app may therefore occupy rows - 1 lines.
     */
    selectAppHeight: (state): number =>
      required(state.rows, SLICES.TERMINAL) - INK_NEW_LINE,
    selectColumns: (state): number => required(state.columns, SLICES.TERMINAL),
    selectGridWidth: (state): number => {
      const columns = required(state.columns, SLICES.TERMINAL);
      const spacedColumns = Math.floor(columns / 2);
      return spacedColumns;
    },
    selectGridHeight: (state): number =>
      required(state.rows, SLICES.TERMINAL) - INK_NEW_LINE - LEGEND_HEIGHT,
  },
});

export const { setRows, setColumns, reset } = terminalSlice.actions;
export const {
  selectRows,
  selectAppHeight,
  selectColumns,
  selectGridWidth,
  selectGridHeight,
} = terminalSlice.selectors;
