
import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../features/auth/authSlice';
import documentsReducer from '../features/document/documentSlice';
import userReducer from '../features/user/userSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    documents: documentsReducer,
    user: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;