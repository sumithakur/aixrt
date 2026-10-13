import { configureStore } from '@reduxjs/toolkit';
import partnershipReducer from './partnership/partnershipSlice';
import contactReducer from './contact/contactSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      partnership: partnershipReducer,
      contact: contactReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
