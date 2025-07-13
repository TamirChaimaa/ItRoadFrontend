import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = "https://itroaddocumentsservice-production.up.railway.app/api/documents";


// Fetch all documents for the logged-in user by userId from cookies
export const fetchUserDocuments = createAsyncThunk(
  "documents/fetchUserDocuments",
  async (_, { rejectWithValue }) => {
    try {
      const userId = Cookies.get("userId");
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch documents"
      );
    }
  }
);

// Delete a document by its ID
export const deleteDocument = createAsyncThunk(
  "documents/deleteDocument",
  async (documentId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/by-id/${documentId}`);
      return documentId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete document"
      );
    }
  }
);

// Search documents by user and term (keyword)
export const searchDocumentsByUser = createAsyncThunk(
  "documents/searchDocumentsByUser",
  async (term, { rejectWithValue }) => {
    try {
      const userId = Cookies.get("userId");
      const response = await axios.get(
        `${API_BASE_URL}/user/${userId}/search`,
        {
          params: { term },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search documents"
      );
    }
  }
);

// Count how many documents a user has
export const countDocumentsByUser = createAsyncThunk(
  "documents/countDocumentsByUser",
  async (_, { rejectWithValue }) => {
    try {
      const userId = Cookies.get("userId");
      const response = await axios.get(`${API_BASE_URL}/user/${userId}/count`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to count documents"
      );
    }
  }
);

export const createDocument = createAsyncThunk(
  "documents/createDocument",
  async (formData, { rejectWithValue }) => {
    try {
      // Ajoute userId dans formData si besoin (ou dans un header)
      const userId = Cookies.get("userId");
      formData.append("userId", userId);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.post(API_BASE_URL, formData, config);
      
      // Maintenant la réponse est wrappée dans ApiResponse
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create document"
      );
    }
  }
);

// Document slice
const documentSlice = createSlice({
  name: "documents",
  initialState: {
    list: [],
    loading: false,
    error: null,
    count: 0,
    searchResults: [],
    createStatus: null, // To track create success/failure
  },
  reducers: {
    clearDocumentError: (state) => {
      state.error = null;
    },
    clearCreateStatus: (state) => {
      state.createStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user documents
      .addCase(fetchUserDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUserDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete document
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.list = state.list.filter((doc) => doc.id !== action.payload);
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Search documents by user
      .addCase(searchDocumentsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.searchResults = [];
      })
      .addCase(searchDocumentsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchDocumentsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Count documents by user
      .addCase(countDocumentsByUser.fulfilled, (state, action) => {
        state.count = action.payload;
      })
      .addCase(countDocumentsByUser.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Create document
      .addCase(createDocument.pending, (state) => {
        state.createStatus = null;
        state.error = null;
      })
      .addCase(createDocument.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.createStatus = "success";
      })
      .addCase(createDocument.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearDocumentError, clearCreateStatus } = documentSlice.actions;

export default documentSlice.reducer;