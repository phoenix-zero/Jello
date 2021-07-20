import client from '../apolloClient';
import { runCurrentUserQuery } from '@/gql';

import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrent',
  async () => {
    const { data } = await runCurrentUserQuery(client);
    return data;
  },
);
