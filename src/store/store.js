
import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../features/auth/authSlice';
import documentsReducer from '../features/document/documentSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    documents: documentsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;