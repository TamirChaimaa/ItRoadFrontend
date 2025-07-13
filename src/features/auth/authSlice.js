// store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'https://itroadsigninservice-production.up.railway.app/api/auth';

// Thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        username,
        password,
      });

      const { token, role, username: userName, id } = response.data;

      // Store authentication data in cookies (expires in 1 day)
      Cookies.set('authToken', token, { expires: 1 });
      Cookies.set('userRole', role, { expires: 1 });
      Cookies.set('username', userName, { expires: 1 });
      Cookies.set('userId', id, { expires: 1 });

      return {
        token,
        role,
        username: userName,
        userId: id,
      };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

// Thunk for token validation
export const validateToken = createAsyncThunk(
  'auth/validateToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authToken');

      // ✅ If no token exists, don't treat this as an error
      if (!token) {
        return rejectWithValue({ silent: true, message: 'No token found' });
      }

      const response = await axios.post(`${API_BASE_URL}/validate`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return {
        token,
        userId: response.data.userId || Cookies.get('userId'),
        username: response.data.username || Cookies.get('username'),
        role: response.data.role || Cookies.get('userRole'),
        valid: response.data.valid,
      };
    } catch (error) {
      // Clear cookies if token is invalid or request fails
      Cookies.remove('authToken');
      Cookies.remove('userRole');
      Cookies.remove('username');
      Cookies.remove('userId');

      const message = error.response?.data?.message || 'Token validation failed';
      // ✅ Mark as silent to avoid displaying the error
      return rejectWithValue({ silent: true, message });
    }
  }
);

// Thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    // Remove all authentication-related cookies
    Cookies.remove('authToken');
    Cookies.remove('userRole');
    Cookies.remove('username');
    Cookies.remove('userId');

    return true;
  }
);

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isInitialized: false,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear error messages
    clearError: (state) => {
      state.error = null;
    },
    // Mark app as initialized (used for token validation on app load)
    setInitialized: (state) => {
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = {
          id: action.payload.userId,
          username: action.payload.username,
          role: action.payload.role,
        };
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })

      // Token validation
      .addCase(validateToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = {
          id: action.payload.userId,
          username: action.payload.username,
          role: action.payload.role,
        };
        state.error = null;
        state.isInitialized = true;
      })
      .addCase(validateToken.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        // Don't display the error if it's marked as silent
        state.error = action.payload?.silent ? null : action.payload?.message || action.payload;
        state.isInitialized = true;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
        state.loading = false;
      });
  },
});

export const { clearError, setInitialized } = authSlice.actions;
export default authSlice.reducer;