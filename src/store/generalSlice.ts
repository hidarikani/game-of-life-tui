import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface GreetingState {
  name: string;
  clicks: number;
}

const initialState: GreetingState = {
  name: 'World',
  clicks: 0,
};

export const greetingSlice = createSlice({
  name: 'greeting',
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

export const { setName, wave, reset } = greetingSlice.actions;
export const { selectName, selectClicks } = greetingSlice.selectors;
