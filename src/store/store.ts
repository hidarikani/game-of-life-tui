import { configureStore } from "@reduxjs/toolkit";
import { greetingSlice } from "./GeneralSlice.ts";

export const store = configureStore({
  reducer: {
    [greetingSlice.reducerPath]: greetingSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
