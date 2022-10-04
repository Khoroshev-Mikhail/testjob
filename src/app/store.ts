import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import {dataSlice, indexSlice } from '../Components/RoundSlider/roundSlice';
import { myMW } from './mw';

export const store = configureStore({
  reducer: {
    data: dataSlice.reducer,
    index: indexSlice.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(myMW),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
