// store/slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
const API_BASE_URL = 'http://itroadusersservice-production.up.railway.app/api/users';

// Async thunk to fetch current user profile
export const fetchCurrentUserProfile = createAsyncThunk(
  'user/fetchCurrentUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authToken');
      
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await axios.get(`${API_BASE_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch user profile';
      return rejectWithValue(message);
    }
  }
);

// Async thunk to update user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authToken');
      
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await axios.put(`${API_BASE_URL}/${userId}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update user profile';
      return rejectWithValue(message);
    }
  }
);

// Async thunk to fetch user by ID (for admin purposes)
export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authToken');
      
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await axios.get(`${API_BASE_URL}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch user';
      return rejectWithValue(message);
    }
  }
);

// Async thunk to fetch all users (for admin purposes)
export const fetchAllUsers = createAsyncThunk(
  'user/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authToken');
      
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await axios.get(`${API_BASE_URL}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch users';
      return rejectWithValue(message);
    }
  }
);

// Async thunk to search users with filters
export const searchUsers = createAsyncThunk(
  'user/searchUsers',
  async ({ name = 'all', role = 'all', status = 'all' }, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authToken');
      
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await axios.get(`${API_BASE_URL}/search`, {
        params: { name, role, status },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to search users';
      return rejectWithValue(message);
    }
  }
);

// Initial state
const initialState = {
  // Current user profile data
  currentUser: null,
  // All users data (for admin purposes)
  users: [],
  // Search results
  searchResults: [],
  // Loading states
  loading: false,
  fetchLoading: false,
  updateLoading: false,
  searchLoading: false,
  // Error states
  error: null,
  fetchError: null,
  updateError: null,
  searchError: null,
  // Success states
  updateSuccess: false,
};

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Clear all errors
    clearErrors: (state) => {
      state.error = null;
      state.fetchError = null;
      state.updateError = null;
      state.searchError = null;
    },
    // Clear specific error
    clearError: (state, action) => {
      const errorType = action.payload;
      state[errorType] = null;
    },
    // Clear update success state
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
    // Reset user state (useful for logout)
    resetUserState: (state) => {
      return { ...initialState };
    },
    // Set current user (useful for initial auth state)
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch current user profile
      .addCase(fetchCurrentUserProfile.pending, (state) => {
        state.fetchLoading = true;
        state.fetchError = null;
      })
      .addCase(fetchCurrentUserProfile.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.currentUser = action.payload;
        state.fetchError = null;
      })
      .addCase(fetchCurrentUserProfile.rejected, (state, action) => {
        state.fetchLoading = false;
        state.currentUser = null;
        state.fetchError = action.payload;
      })

      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.currentUser = action.payload;
        state.updateError = null;
        state.updateSuccess = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
        state.updateSuccess = false;
      })

      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.fetchLoading = true;
        state.fetchError = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.currentUser = action.payload;
        state.fetchError = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.fetchLoading = false;
        state.fetchError = action.payload;
      })

      // Fetch all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search users
      .addCase(searchUsers.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
        state.searchError = null;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload;
      });
  },
});

// Export actions
export const { 
  clearErrors, 
  clearError, 
  clearUpdateSuccess, 
  resetUserState, 
  setCurrentUser 
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;