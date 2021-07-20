import { fetchCurrentUser } from '../action/user';
import { CurrentUserQuery } from '@/graphql';

import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  currentUser?: CurrentUserQuery['currentUser'];
} = {
  currentUser: undefined,
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {},
  extraReducers: builder =>
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.currentUser = action.payload.currentUser;
    }),
});

export default userSlice.reducer;
