import { configureStore } from "@reduxjs/toolkit";
import { generalSlice } from "./general.ts";

export const store = configureStore({
  reducer: {
    [generalSlice.reducerPath]: generalSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
