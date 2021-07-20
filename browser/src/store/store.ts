import app from './reducer/app';
import user from './reducer/user';

import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';

const store = configureStore({
  reducer: {
    app,
    user,
    // board,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(createLogger()),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
