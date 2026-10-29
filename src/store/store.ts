import { configureStore } from "@reduxjs/toolkit";
import { generalSlice } from "./firstGenerationSlice.ts";
import { terminalSlice } from "./terminalSlice.ts";

export const store = configureStore({
  reducer: {
    [generalSlice.reducerPath]: generalSlice.reducer,
    [terminalSlice.reducerPath]: terminalSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
