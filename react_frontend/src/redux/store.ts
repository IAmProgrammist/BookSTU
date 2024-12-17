import {autoBatchEnhancer, configureStore} from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';

const {reducers, middlewares} = [
  baseApi
].reduce((acc, api) => ({
  reducers: {...acc.reducers, [api.reducerPath]: api.reducer},
  middlewares: [...acc.middlewares, api.middleware]
}), {reducers: {}, middlewares: []});

export const store = configureStore({
  reducer: {
    ...reducers
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(
    {serializableCheck: false}
  ).concat(...middlewares)
});

