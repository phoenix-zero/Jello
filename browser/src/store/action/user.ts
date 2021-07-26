import client from '../apolloClient';
import { setTheme } from '../reducer/app';
import {
  runCurrentUserQuery,
  runUpdateThemeMutation,
  ThemePreference,
} from '@/gql';

import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrent',
  async () => {
    const { data } = await runCurrentUserQuery(client);
    return data;
  },
);

export const changeUserTheme = createAsyncThunk(
  'user/changeTheme',
  async (theme: ThemePreference, { dispatch }) => {
    await runUpdateThemeMutation(client, {
      variables: { theme },
    });
    dispatch(setTheme(theme));
  },
);
