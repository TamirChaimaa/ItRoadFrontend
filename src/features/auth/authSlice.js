// store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/auth';

//Thunk for login
// Note: rememberMe is not used here, as per your request
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => { 
    try {
      // Vérification des champs requis
      const response = await axios.post(`${API_BASE_URL}/login`, {
        username,
        password,
      });

      const { token, role, username: userName } = response.data;

      // Stockage fixe dans localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('username', userName);

      return {
        token,
        role,
        username: userName,
        userId: response.data.userId,
      };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);


// Thunk pour valider le token
export const validateToken = createAsyncThunk(
  'auth/validateToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.post(`${API_BASE_URL}/validate`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return {
        token,
        userId: response.data.userId,
        username: response.data.username,
        role: response.data.role,
        valid: response.data.valid
      };
    } catch (error) {
      // Nettoyer le stockage en cas d'erreur
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('username');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('userRole');
      sessionStorage.removeItem('username');
      
      const message = error.response?.data?.message || 'Token validation failed';
      return rejectWithValue(message);
    }
  }
);

// Thunk pour la déconnexion
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    // Nettoyer le stockage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('username');

    return true;
  }
);

// État initial
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isInitialized: false,
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("✅ Token reçu :", action.payload.token); // 🔍 Ajoute ceci
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
      
      // Validate token cases
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
        state.error = action.payload;
        state.isInitialized = true;
      })
      
      // Logout cases
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