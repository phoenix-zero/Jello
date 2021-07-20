import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: {
  theme: 'light' | 'dark' | 'system';
} = {
  theme: 'system',
};

const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<typeof initialState['theme']>) => {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = appSlice.actions;

export default appSlice.reducer;
